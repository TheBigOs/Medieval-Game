import {
  GameState, GameMessage, MessageType, Item, EnemyInstance,
  Direction, GamePhase, BodyPart, BODY_PART_LABELS, ALL_BODY_PARTS, DEFAULT_BODY_STATUS,
} from '../types';
import { getItems } from '../data/items';
import { statMod } from './dice';
import { playerAttack, enemyAttack, attemptFlee, applyBodyHit, getEnemyPenalties } from './combat';
import { buildRooms } from '../data/rooms';
import { getT, Locale, BODY_LABELS } from '../i18n';

// ── Helpers ────────────────────────────────────────────────────────────────

let msgId = 0;
function msg(text: string, type: MessageType = 'narrative'): GameMessage {
  return { id: String(++msgId), text, type };
}

function computeAC(player: GameState['player']): number {
  const base = 10 + statMod(player.dex);
  return base + (player.equipped.body?.acBonus ?? 0) + (player.equipped.offhand?.acBonus ?? 0);
}

function fuzzyMatch(query: string, name: string, id: string): boolean {
  const q = query.toLowerCase();
  const n = name.toLowerCase();
  const normalId = id.toLowerCase().replace(/-/g, ' ');
  if (n.includes(q) || normalId.includes(q)) return true;
  const words = q.split(/\s+/).filter(Boolean);
  const haystack = `${n} ${normalId}`;
  return words.length > 0 && words.every(w => haystack.includes(w));
}

function findItemInRoom(state: GameState, query: string): string | null {
  const ITEMS = getItems(state.language);
  const room = state.rooms[state.player.currentRoomId];
  return room.items.find(id => {
    const item = ITEMS[id];
    return item && fuzzyMatch(query, item.name, id);
  }) ?? null;
}

function findItemInInventory(state: GameState, query: string): Item | null {
  return state.player.inventory.find(item => fuzzyMatch(query, item.name, item.id)) ?? null;
}

function findEnemyInRoom(state: GameState, query: string): EnemyInstance | null {
  const room = state.rooms[state.player.currentRoomId];
  return room.enemies.find(e => e.isAlive && fuzzyMatch(query, e.name, e.templateId)) ?? null;
}

function currentCombatEnemy(state: GameState): EnemyInstance | null {
  if (!state.combat) return null;
  return state.rooms[state.player.currentRoomId].enemies.find(
    e => e.instanceId === state.combat!.enemyInstanceId
  ) ?? null;
}

function addMessages(state: GameState, msgs: GameMessage[]): GameState {
  return { ...state, messages: [...state.messages, ...msgs] };
}

// ── Body status helpers ────────────────────────────────────────────────────

function isBodyIntact(enemy: EnemyInstance): boolean {
  const bs = enemy.bodyStatus ?? DEFAULT_BODY_STATUS;
  return ALL_BODY_PARTS.every(p => bs[p] === 'intact');
}

function bodyStatusSummary(enemy: EnemyInstance, locale: Locale = 'en'): string {
  const wounds: string[] = [];
  const bs = enemy.bodyStatus ?? DEFAULT_BODY_STATUS;
  const lbl = BODY_LABELS[locale];
  if (bs.head !== 'intact')     wounds.push(`${lbl.head} ${bs.head}`);
  if (bs.rightArm !== 'intact') wounds.push(`${lbl.rightArm} ${bs.rightArm}`);
  if (bs.leftArm !== 'intact')  wounds.push(`${lbl.leftArm} ${bs.leftArm}`);
  if (bs.rightLeg !== 'intact') wounds.push(`${lbl.rightLeg} ${bs.rightLeg}`);
  if (bs.leftLeg !== 'intact')  wounds.push(`${lbl.leftLeg} ${bs.leftLeg}`);
  return wounds.join(', ');
}

function hpBar(hp: number, maxHp: number, width = 12): string {
  const filled = Math.min(width, Math.max(0, Math.round((hp / maxHp) * width)));
  return '█'.repeat(filled) + '░'.repeat(width - filled);
}

function enemyHpLine(enemy: EnemyInstance, locale: Locale = 'en'): GameMessage {
  const T = getT(locale);
  const pct = enemy.hp / enemy.maxHp;
  const bar = hpBar(enemy.hp, enemy.maxHp);
  const label = pct > 0.75 ? T.hp.healthy : pct > 0.5 ? T.hp.hurt : pct > 0.25 ? T.hp.badly : T.hp.nearDeath;
  const wounds = bodyStatusSummary(enemy, locale);
  const woundStr = wounds ? `  [${wounds}]` : '';
  return msg(`${enemy.name}  ${bar}  HP ${enemy.hp}/${enemy.maxHp}  (${label})${woundStr}`, 'roll');
}

// ── Room description ───────────────────────────────────────────────────────

function describeRoom(state: GameState): GameMessage[] {
  const T = getT(state.language);
  const ITEMS = getItems(state.language);
  const room = state.rooms[state.player.currentRoomId];
  const msgs: GameMessage[] = [];

  msgs.push(msg(`\n▶ ${room.name.toUpperCase()}`, 'system'));
  msgs.push(msg(room.visited ? room.shortDescription : room.description));

  const liveEnemies = room.enemies.filter(e => e.isAlive);
  for (const e of liveEnemies) {
    const firstTime = e.hp === e.maxHp && isBodyIntact(e);
    if (firstTime) {
      msgs.push(msg(e.description, 'combat'));
    } else {
      const wounds = bodyStatusSummary(e, state.language);
      const woundStr = wounds ? `, ${T.examine.injuries.toLowerCase()}: ${wounds}` : '';
      msgs.push(msg(`${e.name}${state.language === 'fr' ? ' est encore là' : ' is still here'}${woundStr}.`, 'combat'));
      msgs.push(enemyHpLine(e, state.language));
    }
  }

  if (room.items.length > 0) {
    const names = room.items.map(id => ITEMS[id]?.name ?? id).join(', ');
    msgs.push(msg(T.room.itemsNotice(names), 'loot'));
  }

  if (room.searchable && !room.searched) {
    msgs.push(msg(T.room.searchHint, 'system'));
  }

  const exitLines = Object.entries(room.exits).map(([dir, destId]) => {
    if (destId === 'exit') return `${dir}: ${T.room.exitLabel}`;
    const dest = state.rooms[destId];
    return `${dir}: ${dest?.name ?? destId}`;
  }).join('  |  ');
  msgs.push(msg(`${T.room.exits} — ${exitLines}`, 'system'));

  return msgs;
}

// ── Aggressive enemy trigger ───────────────────────────────────────────────

function checkAggressiveEnemies(state: GameState): GameState {
  if (state.sneaking) return state;
  const T = getT(state.language);
  const room = state.rooms[state.player.currentRoomId];
  const aggressor = room.enemies.find(e => e.isAlive && e.aggressive);
  if (!aggressor) return state;

  const firstTime = aggressor.hp === aggressor.maxHp && isBodyIntact(aggressor);
  const combatMsg = firstTime ? T.agg.first(aggressor.name) : T.agg.resume(aggressor.name);

  return {
    ...state,
    phase: 'combat',
    combat: { enemyInstanceId: aggressor.instanceId, round: 1 },
    messages: [...state.messages, msg(combatMsg, 'combat')],
  };
}

// ── Enemy death resolution ─────────────────────────────────────────────────

function resolveEnemyDeath(state: GameState, enemy: EnemyInstance): GameState {
  const T = getT(state.language);
  const ITEMS = getItems(state.language);
  const roomId = state.player.currentRoomId;
  const room = state.rooms[roomId];
  const newMsgs: GameMessage[] = [];

  newMsgs.push(msg(T.combat.enemyFalls(enemy.name), 'success'));
  newMsgs.push(msg(T.combat.xpGain(enemy.xp), 'system'));

  const updatedRoomItems = [...room.items, ...enemy.loot];
  if (enemy.loot.length > 0) {
    newMsgs.push(msg(T.combat.drops(enemy.loot.map(id => ITEMS[id]?.name ?? id).join(', ')), 'loot'));
  }

  const updatedEnemies = room.enemies.map(e =>
    e.instanceId === enemy.instanceId ? { ...e, isAlive: false } : e
  );
  const updatedRoom = { ...room, items: updatedRoomItems, enemies: updatedEnemies };

  const oldXP = state.player.xp;
  const newXP = oldXP + enemy.xp;
  const levelsGained = Math.floor(newXP / 50) - Math.floor(oldXP / 50);
  const hpGain = levelsGained * 5;
  const newMaxHp = state.player.maxHp + hpGain;
  if (levelsGained > 0) {
    newMsgs.push(msg(T.combat.levelUp(hpGain, newMaxHp), 'success'));
  }
  const updatedPlayer = { ...state.player, xp: newXP, maxHp: newMaxHp };

  // Arch-Lich death = true final victory
  if (enemy.templateId === 'arch_lich') {
    return {
      ...state,
      player: updatedPlayer,
      rooms: { ...state.rooms, [roomId]: updatedRoom },
      phase: 'victory',
      combat: null,
      messages: [
        ...state.messages, ...newMsgs,
        msg('\n──────────────────────────────────────────', 'system'),
        msg(T.finalVictory.lichFalls, 'success'),
        msg(T.finalVictory.curseLifted, 'success'),
        msg(T.finalVictory.gratitude, 'narrative'),
        msg(T.finalVictory.title, 'success'),
        msg(T.finalVictory.xp(newXP), 'system'),
        msg('──────────────────────────────────────────', 'system'),
      ],
    };
  }

  const nextAgg = updatedRoom.enemies.find(e => e.isAlive && e.aggressive);
  let phase: GamePhase = 'exploring';
  let nextCombat = null;
  if (nextAgg) {
    nextCombat = { enemyInstanceId: nextAgg.instanceId, round: 1 };
    phase = 'combat';
    newMsgs.push(msg(T.combat.nextAgg(nextAgg.name), 'combat'));
  }

  let newState: GameState = {
    ...state,
    player: updatedPlayer,
    rooms: { ...state.rooms, [roomId]: updatedRoom },
    messages: [...state.messages, ...newMsgs],
    phase,
    combat: nextCombat,
  };

  // Remaining enemies retaliate after a kill
  if (phase === 'combat') {
    newState = enemyTurn(newState);
  }

  return newState;
}

// ── Commands ───────────────────────────────────────────────────────────────

function handleLook(state: GameState): GameState {
  const room = state.rooms[state.player.currentRoomId];
  const s = { ...state, rooms: { ...state.rooms, [room.id]: { ...room, visited: true } } };
  return addMessages(s, describeRoom(s));
}

function handleGo(state: GameState, target: string): GameState {
  const T = getT(state.language);
  if (state.phase === 'combat') {
    return addMessages(state, [msg(T.nav.inCombat, 'error')]);
  }

  const clean = target.toLowerCase().replace(/^to\s+/, '');

  const dirMap: Record<string, Direction> = {
    n: 'north', north: 'north',
    s: 'south', south: 'south',
    e: 'east',  east: 'east',
    w: 'west',  west: 'west',
    nord: 'north', sud: 'south', est: 'east', ouest: 'west',
  };

  const room = state.rooms[state.player.currentRoomId];
  let dir: Direction | undefined = dirMap[clean];

  if (!dir) {
    for (const [d, destId] of Object.entries(room.exits) as [Direction, string][]) {
      const destRoom = state.rooms[destId];
      const destName = destId === 'exit' ? 'exit' : (destRoom?.name ?? '');
      if (fuzzyMatch(clean, destName, destId)) {
        dir = d as Direction;
        break;
      }
    }
  }

  if (!dir) return addMessages(state, [msg(T.nav.unknown(target), 'error')]);
  if (!room.exits[dir]) return addMessages(state, [msg(T.nav.noExit(dir), 'error')]);

  const lock = room.lockedExits?.[dir];
  if (lock) {
    const hasKey = state.player.inventory.some(i => i.id === lock.keyId);
    if (!hasKey) return addMessages(state, [msg(lock.description, 'error')]);
    const updatedLocked = { ...room.lockedExits };
    delete updatedLocked[dir];
    state = {
      ...state,
      player: { ...state.player, inventory: state.player.inventory.filter(i => i.id !== lock.keyId) },
      rooms: { ...state.rooms, [room.id]: { ...room, lockedExits: updatedLocked } },
      messages: [...state.messages, msg(T.nav.unlock, 'system')],
    };
  }

  const targetId = room.exits[dir]!;

  // Reaching the castle exit → post-escape choice
  if (targetId === 'exit') {
    return {
      ...state,
      phase: 'post-escape',
      messages: [
        ...state.messages,
        msg('\n──────────────────────────────────────────', 'system'),
        msg(T.postEscape.burst, 'success'),
        msg(T.postEscape.free, 'success'),
        msg(T.postEscape.encounter, 'narrative'),
        msg(T.postEscape.quest, 'narrative'),
        msg('──────────────────────────────────────────', 'system'),
        msg(T.postEscape.choice, 'system'),
      ],
    };
  }

  if (!state.rooms[targetId]) return addMessages(state, [msg(T.nav.nowhere, 'error')]);

  let newState: GameState = {
    ...state,
    sneaking: false,
    player: {
      ...state.player,
      currentRoomId: targetId,
      previousRoomId: state.player.currentRoomId,
    },
    rooms: { ...state.rooms, [targetId]: { ...state.rooms[targetId], visited: true } },
  };

  newState = addMessages(newState, describeRoom(newState));
  newState = checkAggressiveEnemies(newState);
  return newState;
}

// ── Stealth movement ───────────────────────────────────────────────────────

function handleSneak(state: GameState, target: string): GameState {
  const T = getT(state.language);
  if (state.phase === 'combat') {
    return addMessages(state, [msg(T.sneak.inCombat, 'error')]);
  }
  if (!target) return addMessages(state, [msg(T.sneak.noTarget, 'error')]);

  const clean = target.toLowerCase().replace(/^(?:to|into|vers)\s+/, '');
  const dirMap: Record<string, Direction> = {
    n: 'north', north: 'north',
    s: 'south', south: 'south',
    e: 'east',  east: 'east',
    w: 'west',  west: 'west',
    nord: 'north', sud: 'south', est: 'east', ouest: 'west',
  };
  const room = state.rooms[state.player.currentRoomId];
  let dir: Direction | undefined = dirMap[clean];

  if (!dir) {
    for (const [d, destId] of Object.entries(room.exits) as [Direction, string][]) {
      const destRoom = state.rooms[destId];
      const destName = destId === 'exit' ? 'exit' : (destRoom?.name ?? '');
      if (fuzzyMatch(clean, destName, destId)) { dir = d as Direction; break; }
    }
  }

  if (!dir || !room.exits[dir]) {
    return addMessages(state, [msg(T.sneak.unknown(target), 'error')]);
  }

  const targetId = room.exits[dir]!;
  if (targetId === 'exit') {
    return addMessages(state, [msg(T.sneak.exitHint, 'system')]);
  }

  const dexMod = statMod(state.player.dex);
  const roll = Math.floor(Math.random() * 20) + 1;
  const total = roll + dexMod;
  const dc = 13;
  const success = total >= dc;

  const targetRoom = state.rooms[targetId];
  const hasEnemies = targetRoom.enemies.some(e => e.isAlive);

  let newState: GameState = {
    ...state,
    sneaking: success,
    player: {
      ...state.player,
      currentRoomId: targetId,
      previousRoomId: state.player.currentRoomId,
    },
    rooms: { ...state.rooms, [targetId]: { ...state.rooms[targetId], visited: true } },
    messages: [
      ...state.messages,
      msg(T.sneak.roll(roll, dexMod, total, dc), 'system'),
    ],
  };

  if (success) {
    if (hasEnemies) {
      newState = addMessages(newState, [msg(T.sneak.successEnemy(targetRoom.name), 'success')]);
    } else {
      newState = addMessages(newState, [msg(T.sneak.successEmpty(targetRoom.name), 'success')]);
    }
    newState = addMessages(newState, describeRoom(newState));
  } else {
    const aggressor = targetRoom.enemies.find(e => e.isAlive);
    newState = addMessages(newState, describeRoom(newState));

    if (aggressor) {
      newState = addMessages(newState, [
        msg(T.sneak.failSpotted, 'combat'),
        msg(T.sneak.failSurprise(aggressor.name), 'combat'),
        msg(T.sneak.failReact(aggressor.name), 'combat'),
      ]);
      newState = {
        ...newState,
        phase: 'combat',
        combat: { enemyInstanceId: aggressor.instanceId, round: 1 },
      };
      newState = enemyTurn(newState);
      if (newState.phase !== 'game_over') {
        newState = addMessages(newState, [msg(T.sneak.failRecover, 'combat')]);
      }
    } else {
      newState = addMessages(newState, [msg(T.sneak.failNoOne, 'system')]);
    }
  }

  return newState;
}

function handleExamine(state: GameState, query: string): GameState {
  const T = getT(state.language);
  const ITEMS = getItems(state.language);
  if (!query) return addMessages(state, [msg(T.examine.what, 'error')]);

  const invItem = findItemInInventory(state, query);
  if (invItem) return addMessages(state, [msg(`${invItem.name}: ${invItem.description}`)]);

  const roomId = findItemInRoom(state, query);
  if (roomId) {
    const it = ITEMS[roomId];
    return addMessages(state, [msg(`${it.name}: ${it.description}`)]);
  }

  const enemy = findEnemyInRoom(state, query);
  if (enemy) {
    const wounds = bodyStatusSummary(enemy, state.language);
    const woundStr = wounds ? `  ${T.examine.injuries}: ${wounds}` : '';
    return addMessages(state, [
      enemyHpLine(enemy, state.language),
      msg(`${enemy.description}${woundStr}`),
    ]);
  }

  for (const it of Object.values(state.player.equipped)) {
    if (it && fuzzyMatch(query, it.name, it.id)) {
      return addMessages(state, [msg(`${it.name}: ${it.description}`)]);
    }
  }

  // Check room NPC
  const room = state.rooms[state.player.currentRoomId];
  if (room.npcName && fuzzyMatch(query, room.npcName, 'npc')) {
    return addMessages(state, [msg(room.npcDialogue ?? room.npcName)]);
  }

  return addMessages(state, [msg(T.examine.notFound(query), 'error')]);
}

function handleTake(state: GameState, query: string): GameState {
  const T = getT(state.language);
  const ITEMS = getItems(state.language);
  if (!query) return addMessages(state, [msg(T.take.what, 'error')]);
  const itemId = findItemInRoom(state, query);
  if (!itemId) return addMessages(state, [msg(T.take.notHere(query), 'error')]);

  const item = ITEMS[itemId];
  const roomId = state.player.currentRoomId;
  const room = state.rooms[roomId];
  const idx = room.items.indexOf(itemId);
  const updatedItems = [...room.items.slice(0, idx), ...room.items.slice(idx + 1)];

  return {
    ...state,
    player: { ...state.player, inventory: [...state.player.inventory, item] },
    rooms: { ...state.rooms, [roomId]: { ...room, items: updatedItems } },
    messages: [...state.messages, msg(T.take.pickup(item.name), 'loot')],
  };
}

function handleDrop(state: GameState, query: string): GameState {
  const T = getT(state.language);
  if (!query) return addMessages(state, [msg(T.drop.what, 'error')]);
  const item = findItemInInventory(state, query);
  if (!item) return addMessages(state, [msg(T.drop.notCarrying(query), 'error')]);

  const roomId = state.player.currentRoomId;
  const room = state.rooms[roomId];
  return {
    ...state,
    player: { ...state.player, inventory: removeOneFromInventory(state.player.inventory, item) },
    rooms: { ...state.rooms, [roomId]: { ...room, items: [...room.items, item.id] } },
    messages: [...state.messages, msg(T.drop.drop(item.name), 'system')],
  };
}

function handleInventory(state: GameState): GameState {
  const T = getT(state.language);
  const { inventory, equipped } = state.player;
  const msgs: GameMessage[] = [
    msg(T.inv.equippedHeader, 'system'),
    msg(`${T.inv.weapon}: ${equipped.weapon?.name ?? T.inv.none}`, 'loot'),
    msg(`${T.inv.offhand}: ${equipped.offhand?.name ?? T.inv.none}`, 'loot'),
    msg(`${T.inv.armor}: ${equipped.body?.name ?? T.inv.none}`, 'loot'),
  ];

  msgs.push(msg(T.inv.carriedHeader, 'system'));
  if (inventory.length === 0) {
    msgs.push(msg(T.inv.empty));
  } else {
    for (const item of inventory) {
      let detail = '';
      if (item.damageDice) detail = ` [dmg ${item.damageDice}, atk ${item.attackBonus! >= 0 ? '+' : ''}${item.attackBonus}]`;
      else if (item.acBonus) detail = ` [AC +${item.acBonus}]`;
      else if (item.healAmount) detail = ` [heal ${item.healAmount}]`;
      msgs.push(msg(`  ${item.name}${detail}`, 'loot'));
    }
  }
  return addMessages(state, msgs);
}

function handleEquip(state: GameState, query: string): GameState {
  const T = getT(state.language);
  if (!query) return addMessages(state, [msg(T.equip.what, 'error')]);
  const item = findItemInInventory(state, query);
  if (!item) return addMessages(state, [msg(T.equip.notCarrying(query), 'error')]);
  if ((item.type !== 'weapon' && item.type !== 'armor') || !item.slot) {
    return addMessages(state, [msg(T.equip.cant(item.name), 'error')]);
  }

  const equipped = { ...state.player.equipped };
  let inventory = [...state.player.inventory];
  if (equipped[item.slot]) inventory.push(equipped[item.slot]!);
  equipped[item.slot] = item;
  inventory = removeOneFromInventory(inventory, item);

  // Holy relic bonus: +10 max HP, +10 current HP
  let newMaxHp = state.player.maxHp;
  let newHp = state.player.hp;
  const extraMsgs: GameMessage[] = [];
  if (item.onEquipMaxHpBonus) {
    newMaxHp = state.player.maxHp + item.onEquipMaxHpBonus;
    newHp = Math.min(newMaxHp, state.player.hp + (item.onEquipHeal ?? 0));
    extraMsgs.push(msg(T.equip.relic(item.onEquipHeal ?? 0, newMaxHp), 'success'));
  }

  const newAC = computeAC({ ...state.player, equipped });

  let detail = '';
  if (item.type === 'weapon' && item.damageDice) {
    const atkSign = (item.attackBonus ?? 0) >= 0 ? '+' : '';
    detail = ` [${item.damageDice} ${T.equip.damageLabel}, ${atkSign}${item.attackBonus ?? 0} to hit]`;
  } else if (item.lifeStealPct) {
    detail = T.equip.lifeStealDetail(item.lifeStealPct);
  }

  return {
    ...state,
    player: { ...state.player, inventory, equipped, ac: newAC, hp: newHp, maxHp: newMaxHp },
    messages: [...state.messages, msg(T.equip.done(item.name, detail), 'system'), ...extraMsgs],
  };
}

function handleUnequip(state: GameState, query: string): GameState {
  const T = getT(state.language);
  const slots = ['weapon', 'offhand', 'body', 'necklace'] as const;
  const slot = slots.find(s => {
    const it = state.player.equipped[s];
    return it && fuzzyMatch(query, it.name, it.id);
  }) ?? (slots.find(s => s.includes(query.toLowerCase())) as typeof slots[number] | undefined);

  if (!slot || !state.player.equipped[slot]) {
    return addMessages(state, [msg(T.unequip.notFound(query), 'error')]);
  }
  const item = state.player.equipped[slot]!;
  const equipped = { ...state.player.equipped, [slot]: null };
  const newAC = computeAC({ ...state.player, equipped });
  return {
    ...state,
    player: { ...state.player, inventory: [...state.player.inventory, item], equipped, ac: newAC },
    messages: [...state.messages, msg(T.unequip.done(item.name), 'system')],
  };
}

function removeOneFromInventory(inventory: Item[], item: Item): Item[] {
  const idx = inventory.indexOf(item);
  if (idx === -1) return inventory;
  return [...inventory.slice(0, idx), ...inventory.slice(idx + 1)];
}

function handleUse(state: GameState, query: string): GameState {
  const T = getT(state.language);
  if (!query) return addMessages(state, [msg(T.use.what, 'error')]);
  const item = findItemInInventory(state, query);
  if (!item) return addMessages(state, [msg(T.use.notCarrying(query), 'error')]);

  // Grimoire: fixed-damage fire spell, bypasses AC
  if (item.spellDamage) {
    if (state.phase !== 'combat') {
      return addMessages(state, [msg(T.use.spellNoTarget, 'error')]);
    }
    const enemy = currentCombatEnemy(state);
    if (!enemy) return addMessages(state, [msg(T.combat.noTarget, 'error')]);
    const dmg = item.spellDamage;
    const newEnemyHp = enemy.hp - dmg;
    const updatedEnemy: EnemyInstance = { ...enemy, hp: newEnemyHp };
    const roomId = state.player.currentRoomId;
    const room = state.rooms[roomId];
    const updatedEnemies = room.enemies.map(e => e.instanceId === enemy.instanceId ? updatedEnemy : e);
    let newState: GameState = {
      ...state,
      player: { ...state.player, inventory: removeOneFromInventory(state.player.inventory, item) },
      rooms: { ...state.rooms, [roomId]: { ...room, enemies: updatedEnemies } },
      messages: [...state.messages, msg(T.use.spell(enemy.name, dmg, Math.max(0, newEnemyHp), enemy.maxHp), 'combat')],
    };
    if (newEnemyHp <= 0) return resolveEnemyDeath(newState, updatedEnemy);
    return enemyTurn(newState);
  }

  if (item.type !== 'consumable' || !item.healAmount) {
    return addMessages(state, [msg(T.use.cant(item.name), 'error')]);
  }

  const healed = item.healAmount;
  const newHp = Math.min(state.player.maxHp, state.player.hp + healed);
  let newState: GameState = {
    ...state,
    player: { ...state.player, hp: newHp, inventory: removeOneFromInventory(state.player.inventory, item) },
    messages: [
      ...state.messages,
      msg(T.use.heal(item.name, healed, newHp, state.player.maxHp), 'success'),
    ],
  };

  if (newState.phase === 'combat') newState = enemyTurn(newState);
  return newState;
}

function handleSearch(state: GameState): GameState {
  const T = getT(state.language);
  const ITEMS = getItems(state.language);
  const roomId = state.player.currentRoomId;
  const room = state.rooms[roomId];

  // Well trap — triggers once, then room is marked searched
  if (room.wellTrap && !room.searched) {
    const damage = Math.floor(Math.random() * 8) + 1;
    const newHp = Math.max(1, state.player.hp - damage);
    const updatedRoom = { ...room, searched: true };
    let newState: GameState = {
      ...state,
      player: { ...state.player, hp: newHp },
      rooms: { ...state.rooms, [roomId]: updatedRoom },
      messages: [
        ...state.messages,
        msg(T.well.search, 'error'),
        msg(T.well.fall(damage, newHp, state.player.maxHp), 'error'),
      ],
    };
    if (state.phase === 'combat') newState = enemyTurn(newState);
    return newState;
  }

  if (!room.searchable) return addMessages(state, [msg(T.search.nothing)]);
  if (room.searched) return addMessages(state, [msg(T.search.already)]);

  // Key-locked search (blacksmith chest)
  if (room.searchKeyId) {
    const keyIdx = state.player.inventory.findIndex(i => i.id === room.searchKeyId);
    if (keyIdx === -1) return addMessages(state, [msg(T.search.needKey, 'system')]);
    // Consume the key
    const newInventory = [
      ...state.player.inventory.slice(0, keyIdx),
      ...state.player.inventory.slice(keyIdx + 1),
    ];
    state = { ...state, player: { ...state.player, inventory: newInventory } };
  }

  const hidden = room.hiddenItems ?? [];
  const updatedRoom = { ...room, items: [...room.items, ...hidden], searched: true };
  const msgs: GameMessage[] = [msg(T.search.searching)];
  if (hidden.length > 0) {
    msgs.push(msg(T.search.found(hidden.map(id => ITEMS[id]?.name ?? id).join(', ')), 'loot'));
  } else {
    msgs.push(msg(T.search.nothingElse));
  }
  return { ...state, rooms: { ...state.rooms, [roomId]: updatedRoom }, messages: [...state.messages, ...msgs] };
}

function handleTalk(state: GameState, query: string): GameState {
  const T = getT(state.language);
  const room = state.rooms[state.player.currentRoomId];
  if (!room.npcName) return addMessages(state, [msg(T.talk.noOne, 'system')]);

  // Match "villager", "man", "person", the NPC name, or just empty "talk"
  const matches = !query || fuzzyMatch(query, room.npcName, 'npc') ||
    ['man', 'person', 'woman', 'villager', 'homme', 'femme', 'villageois', 'npc'].includes(query.toLowerCase());

  if (!matches) return addMessages(state, [msg(T.talk.noOne, 'system')]);

  return addMessages(state, [msg(room.npcDialogue ?? room.npcName, 'narrative')]);
}

function handleStats(state: GameState): GameState {
  const T = getT(state.language);
  const p = state.player;
  const strMod = statMod(p.str);
  const dexMod = statMod(p.dex);
  const weapon = p.equipped.weapon;
  const atkBonus = 2 + strMod + (weapon?.attackBonus ?? -2);
  const atkStr = `${atkBonus >= 0 ? '+' : ''}${atkBonus}`;
  const dmgStr = `${weapon?.damageDice ?? '1d2'}${strMod >= 0 ? '+' : ''}${strMod}`;
  const msgs: GameMessage[] = [
    msg(T.stats.header, 'system'),
    msg(T.stats.hp(p.hp, p.maxHp), p.hp < p.maxHp * 0.4 ? 'combat' : 'loot'),
    msg(T.stats.acxp(p.ac, p.xp), 'loot'),
    msg(T.stats.attr(p.str, strMod, p.dex, dexMod), 'loot'),
    msg(T.stats.atk(atkStr, dmgStr), 'loot'),
    msg(T.stats.hint, 'system'),
    msg(T.stats.divider, 'system'),
  ];
  return addMessages(state, msgs);
}

function handleHelp(state: GameState): GameState {
  const T = getT(state.language);
  return addMessages(state, T.help.map(line => msg(line, 'system')));
}

// ── Combat commands ────────────────────────────────────────────────────────

function parseBodyPart(text: string): BodyPart | null {
  const t = text.toLowerCase();
  if (t.includes('tête') || t.includes('tete') || t.includes('head')) return 'head';
  if (t.includes('poitrine') || t.includes('chest') || t.includes('torso') || t.includes('body')) return 'chest';
  if (t.includes('bras droit') || t.includes('right arm') || t.includes('rarm') || t.includes('sword arm')) return 'rightArm';
  if (t.includes('bras gauche') || t.includes('left arm') || t.includes('larm') || t.includes('shield arm')) return 'leftArm';
  if (t.includes('jambe droite') || t.includes('right leg') || t.includes('rleg')) return 'rightLeg';
  if (t.includes('jambe gauche') || t.includes('left leg') || t.includes('lleg')) return 'leftLeg';
  return null;
}

// ALL alive enemies attack the player every round
function enemyTurn(state: GameState): GameState {
  const T = getT(state.language);
  const roomId = state.player.currentRoomId;
  const room = state.rooms[roomId];
  const aliveEnemies = room.enemies.filter(e => e.isAlive);

  if (aliveEnemies.length === 0) {
    return { ...state, phase: 'exploring', combat: null };
  }

  const msgs: GameMessage[] = [];
  let updatedEnemies = [...room.enemies];
  let playerHp = state.player.hp;

  for (const enemy of aliveEnemies) {
    const eIdx = updatedEnemies.findIndex(e => e.instanceId === enemy.instanceId);
    const cur = updatedEnemies[eIdx];

    if (cur.stunned) {
      updatedEnemies[eIdx] = { ...cur, stunned: false };
      msgs.push(msg(T.combat.stun(cur.name), 'combat'));
      continue;
    }

    const penalties = getEnemyPenalties(cur);
    if (!penalties.canAttack) {
      msgs.push(msg(T.combat.cantAttack(cur.name), 'combat'));
      continue;
    }

    const result = enemyAttack(cur, { ...state.player, hp: playerHp });

    if (result.miss) {
      msgs.push(msg(T.combat.enemyFumble(cur.name), 'combat'));
    } else if (result.hit) {
      const pre = result.critical ? T.combat.critical : '';
      msgs.push(msg(T.combat.enemyHit(pre, cur.name, result.damage, result.d20Roll), 'combat'));
      playerHp -= result.damage;
    } else {
      msgs.push(msg(T.combat.enemyMiss(cur.name, result.d20Roll, result.targetAC), 'combat'));
    }

    if (playerHp <= 0) {
      const deathMsgs = [
        msg(T.combat.playerDeath, 'combat'),
        msg(T.combat.gameOver, 'error'),
        msg(T.combat.gameOverHint, 'system'),
      ];
      if (state.checkpoint) deathMsgs.push(msg(T.combat.checkpointHint, 'system'));
      return {
        ...state,
        player: { ...state.player, hp: 0 },
        rooms: { ...state.rooms, [roomId]: { ...room, enemies: updatedEnemies } },
        phase: 'game_over',
        combat: null,
        messages: [...state.messages, ...msgs, ...deathMsgs],
      };
    }
  }

  return {
    ...state,
    player: { ...state.player, hp: playerHp },
    rooms: { ...state.rooms, [roomId]: { ...room, enemies: updatedEnemies } },
    messages: [...state.messages, ...msgs],
  };
}

function handleAttack(state: GameState, rawTarget: string): GameState {
  const T = getT(state.language);
  const bodyPart = parseBodyPart(rawTarget) ?? 'chest';

  if (state.phase !== 'combat') {
    const enemyQuery = rawTarget ? rawTarget.replace(/head|chest|torso|body|right arm|left arm|right leg|left leg|rarm|larm|rleg|lleg|sword arm|shield arm|tête|tete|poitrine|bras droit|bras gauche|jambe droite|jambe gauche/gi, '').trim() : '';
    const target = enemyQuery
      ? findEnemyInRoom(state, enemyQuery)
      : state.rooms[state.player.currentRoomId].enemies.find(e => e.isAlive) ?? null;

    if (!target) {
      return addMessages(state, [msg(T.combat.noTarget, 'error')]);
    }
    const partLabel = BODY_PART_LABELS[bodyPart];
    const startMsg = state.sneaking
      ? T.combat.startSneak(target.name, partLabel.toLowerCase())
      : T.combat.startNormal(target.name, partLabel.toLowerCase());
    let newState: GameState = {
      ...state,
      phase: 'combat',
      combat: { enemyInstanceId: target.instanceId, round: 1 },
      messages: [...state.messages, msg(startMsg, 'combat')],
    };
    return handleAttack(newState, rawTarget);
  }

  const enemy = currentCombatEnemy(state);
  if (!enemy) return addMessages(state, [msg(T.combat.noTarget, 'error')]);

  const partLabel = BODY_PART_LABELS[bodyPart];
  const wasSneaking = state.sneaking;
  const sneakBonus = wasSneaking ? 4 : 0;
  const result = playerAttack(state.player, enemy, bodyPart, sneakBonus);
  const msgs: GameMessage[] = [];
  let newState: GameState = { ...state, sneaking: false };

  const snkStr = sneakBonus ? `+${sneakBonus}(sneak)` : '';
  if (result.miss) {
    msgs.push(msg(T.combat.playerMiss(partLabel.toLowerCase()), 'combat'));
  } else if (result.hit) {
    const pre = result.critical ? T.combat.critical : wasSneaking ? T.combat.surprise : '';
    msgs.push(msg(T.combat.playerHit(pre, enemy.name, partLabel.toLowerCase(), result.damage, result.d20Roll, snkStr, enemy.ac), 'combat'));
  } else {
    msgs.push(msg(T.combat.playerNearMiss(partLabel.toLowerCase(), result.d20Roll, snkStr, enemy.ac), 'combat'));
  }

  const newEnemyHp = enemy.hp - result.damage;
  let updatedEnemy: EnemyInstance = { ...enemy, hp: newEnemyHp };

  if (result.hit && bodyPart !== 'chest') {
    const { updatedEnemy: withBodyHit, effectMsg } = applyBodyHit(updatedEnemy, bodyPart, state.language);
    updatedEnemy = withBodyHit;
    if (effectMsg) msgs.push(msg(effectMsg, 'combat'));
  }

  msgs.push(enemyHpLine({ ...updatedEnemy }, state.language));

  // Lifesteal from trinket necklace (only on a hit that dealt damage)
  let lifeStealHp = newState.player.hp;
  if (result.hit && result.damage > 0) {
    const necklace = newState.player.equipped.necklace;
    if (necklace?.lifeStealPct) {
      const steal = Math.floor(result.damage * necklace.lifeStealPct / 100);
      if (steal > 0) {
        lifeStealHp = Math.min(newState.player.maxHp, lifeStealHp + steal);
        msgs.push(msg(T.combat.lifesteal(steal, lifeStealHp, newState.player.maxHp), 'success'));
      }
    }
  }

  const roomId = state.player.currentRoomId;
  const room = state.rooms[roomId];
  const updatedEnemies = room.enemies.map(e => e.instanceId === enemy.instanceId ? updatedEnemy : e);
  newState = {
    ...newState,
    player: { ...newState.player, hp: lifeStealHp },
    rooms: { ...newState.rooms, [roomId]: { ...room, enemies: updatedEnemies } },
    messages: [...newState.messages, ...msgs],
    combat: newState.combat ? { ...newState.combat, round: newState.combat.round + 1 } : null,
  };

  if (newEnemyHp <= 0) return resolveEnemyDeath(newState, updatedEnemy);

  if (wasSneaking) {
    newState = addMessages(newState, [msg(T.combat.doubleStrike, 'combat')]);
    return handleAttack(newState, rawTarget);
  }

  return enemyTurn(newState);
}

function handleFlee(state: GameState): GameState {
  const T = getT(state.language);
  if (state.phase !== 'combat') return addMessages(state, [msg(T.flee.notIn, 'error')]);

  if (!attemptFlee(state.player)) {
    return enemyTurn(addMessages(state, [msg(T.flee.fail, 'error')]));
  }

  const prevRoom = state.player.previousRoomId;
  if (!prevRoom) return addMessages(state, [msg(T.flee.nowhere, 'error')]);

  let newState: GameState = {
    ...state,
    player: { ...state.player, currentRoomId: prevRoom, previousRoomId: state.player.currentRoomId },
    phase: 'exploring',
    combat: null,
    messages: [...state.messages, msg(T.flee.success, 'success')],
  };
  return addMessages(newState, describeRoom(newState));
}

// ── Command dispatcher ─────────────────────────────────────────────────────

export function processCommand(state: GameState, raw: string): GameState {
  // Language selection
  if (state.phase === 'language-select') {
    const T = getT('en');
    const input = raw.trim().toLowerCase();
    if (input === 'english' || input === 'en') return startGame(state, 'en');
    if (input === 'french' || input === 'français' || input === 'francais' || input === 'fr') return startGame(state, 'fr');
    return addMessages(state, [msg(T.langSelect.invalid, 'error')]);
  }

  // Post-escape choice
  if (state.phase === 'post-escape') {
    const input = raw.trim().toLowerCase();
    if (['escape', 'leave', 'retire', 'run', 'fuir', 'partir', 'quitter'].includes(input)) {
      const T = getT(state.language);
      return {
        ...state,
        phase: 'victory',
        messages: [...state.messages, msg(T.postEscape.escaped, 'success')],
      };
    }
    if (['continue', 'help', 'village', 'north', 'n', 'aider', 'continuer', 'nord'].includes(input)) {
      return travelToVillage(state);
    }
    const T = getT(state.language);
    return addMessages(state, [msg(T.postEscape.choice, 'system')]);
  }

  const input = raw.trim();
  if (!input) return state;

  const T = getT(state.language);
  const lower = input.toLowerCase();
  const [verb, ...rest] = lower.split(/\s+/);
  const target = rest.join(' ');

  switch (verb) {
    case 'look': case 'l': case 'regarder': case 'r':
      return handleLook(state);

    case 'go': case 'aller':
      return handleGo(state, target);
    case 'north': case 'n': case 'nord':
      return handleGo(state, 'north');
    case 'south': case 's': case 'sud':
      return handleGo(state, 'south');
    case 'east': case 'e': case 'est':
      return handleGo(state, 'east');
    case 'west': case 'w': case 'ouest':
      return handleGo(state, 'west');

    case 'examine': case 'x': case 'examiner':
      return handleExamine(state, target);

    case 'take': case 'get': case 'pick': case 'prendre': case 'ramasser':
      return handleTake(state, target.replace(/^up\s*/, ''));

    case 'drop': case 'deposer': case 'déposer':
      return handleDrop(state, target);

    case 'inventory': case 'i': case 'inv': case 'inventaire':
      return handleInventory(state);

    case 'equip': case 'wear': case 'wield': case 'equiper': case 'équiper':
      return handleEquip(state, target);

    case 'unequip': case 'remove': case 'retirer': case 'enlever':
      return handleUnequip(state, target);

    case 'use': case 'drink': case 'eat': case 'utiliser': case 'boire': case 'manger':
      return handleUse(state, target);

    case 'search': case 'fouiller':
      return handleSearch(state);

    case 'talk': case 'speak': case 'parler': case 'discuter':
      return handleTalk(state, target);

    case 'stats': case 'status': case 'statistiques':
      return handleStats(state);

    case 'help': case 'h': case '?': case 'aide':
      return handleHelp(state);

    case 'attack': case 'fight': case 'hit': case 'strike': case 'a':
    case 'attaquer': case 'frapper': case 'attaque':
      return handleAttack(state, target);

    case 'sneak': case 'creep': case 'steal': case 'tiptoe': case 'faufiler':
      return handleSneak(state, target);
    case 'se':
      if (rest[0] === 'faufiler') return handleSneak(state, rest.slice(1).join(' '));
      return addMessages(state, [msg(T.unknownCmd(raw), 'error')]);

    case 'flee': case 'run': case 'escape': case 'retreat':
    case 'fuir': case 'fuite':
      return handleFlee(state);

    case 'head': case 'chest': case 'torso':
    case 'tête': case 'tete': case 'poitrine':
      return state.phase === 'combat'
        ? handleAttack(state, verb)
        : addMessages(state, [msg(T.unknownCmd(raw), 'error')]);

    default: {
      if (state.phase !== 'combat') {
        const savedState = state;
        const attempted = handleGo(state, lower);
        if (attempted.player.currentRoomId !== savedState.player.currentRoomId) return attempted;
      }
      return addMessages(state, [msg(T.unknownCmd(raw), 'error')]);
    }
  }
}

// ── Village transition ─────────────────────────────────────────────────────

function travelToVillage(state: GameState): GameState {
  const T = getT(state.language);
  const targetId = 'village-road';

  // Save checkpoint when the player first arrives at the village
  const checkpoint = { player: { ...state.player } };

  let newState: GameState = {
    ...state,
    phase: 'exploring',
    checkpoint,
    player: {
      ...state.player,
      currentRoomId: targetId,
      previousRoomId: null,
    },
    rooms: { ...state.rooms, [targetId]: { ...state.rooms[targetId], visited: true } },
    messages: [
      ...state.messages,
      msg(T.checkpoint.saved, 'system'),
    ],
  };
  newState = addMessages(newState, describeRoom(newState));
  return newState;
}

// ── Checkpoint restore ─────────────────────────────────────────────────────

export function returnToCheckpoint(state: GameState): GameState {
  const { checkpoint, language } = state;
  if (!checkpoint) return state;
  const T = getT(language);

  // Rebuild all rooms fresh so village enemies are alive again
  const freshRooms = buildRooms(language);

  const restoredPlayer = {
    ...checkpoint.player,
    hp: checkpoint.player.maxHp,  // restore to full HP
    currentRoomId: 'village-road',
    previousRoomId: null,
  };

  const targetRoom = freshRooms['village-road'];
  const freshRoomsWithVisited = {
    ...freshRooms,
    'village-road': { ...targetRoom, visited: true },
  };

  const baseState: GameState = {
    ...state,
    player: restoredPlayer,
    rooms: freshRoomsWithVisited,
    phase: 'exploring',
    combat: null,
    sneaking: false,
    checkpoint,  // keep checkpoint so player can die and retry again
    messages: [
      msg('\n──────────────────────────────────────────', 'system'),
      msg(T.checkpoint.returnTitle, 'system'),
      msg(T.checkpoint.returnMsg, 'narrative'),
      msg('──────────────────────────────────────────', 'system'),
    ],
  };

  return addMessages(baseState, describeRoom(baseState));
}

// ── Game start helper ──────────────────────────────────────────────────────

function startGame(state: GameState, locale: Locale): GameState {
  const T = getT(locale);
  const rooms = buildRooms(locale);
  return {
    ...state,
    language: locale,
    phase: 'exploring',
    rooms,
    messages: [
      msg(T.intro.banner, 'system'),
      msg(T.intro.title, 'success'),
      msg(T.intro.banner, 'system'),
      msg(T.intro.flavor[0], 'narrative'),
      msg(T.intro.flavor[1], 'narrative'),
      msg(T.intro.flavor[2], 'narrative'),
      msg('───────────────────────────────────────────────────────────', 'system'),
      msg(T.intro.hint, 'system'),
    ],
  };
}

// ── Initial State ──────────────────────────────────────────────────────────

export function createInitialState(): GameState {
  const T = getT('en');
  return {
    player: {
      hp: 20, maxHp: 20,
      str: 12, dex: 13, con: 10,
      ac: 11,
      inventory: [],
      equipped: { weapon: null, offhand: null, body: null, necklace: null },
      xp: 0,
      currentRoomId: 'dungeon-cell',
      previousRoomId: null,
    },
    rooms: buildRooms('en'),
    messages: [
      msg(T.langSelect.prompt, 'system'),
    ],
    phase: 'language-select',
    combat: null,
    sneaking: false,
    language: 'en',
  };
}
