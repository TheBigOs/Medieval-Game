import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { GameState, Direction, BodyPart, BODY_PART_LABELS, ALL_BODY_PARTS, DEFAULT_BODY_STATUS } from '../game/types';
import { getItems } from '../game/data/items';
import { getT } from '../game/i18n';

interface Props {
  gameState: GameState;
  onCommand: (cmd: string) => void;
}

interface Chip {
  label: string;
  command: string;
  variant?: 'default' | 'combat' | 'body' | 'nav' | 'danger' | 'disabled-part' | 'lang';
}

const PART_ICONS: Record<BodyPart, string> = {
  head: '🎯', chest: '⚔', rightArm: '💪', leftArm: '🛡',
  rightLeg: '🦵', leftLeg: '🦵',
};

function buildBodyPartLabel(part: BodyPart, status: string): string {
  const icon = PART_ICONS[part];
  const name = BODY_PART_LABELS[part];
  if (status === 'disabled') return `${icon} ${name} ✗`;
  if (status === 'wounded') return `${icon} ${name} ~`;
  return `${icon} ${name}`;
}

function buildChips(state: GameState): Chip[] {
  const chips: Chip[] = [];
  const { phase, player, rooms, combat } = state;
  const T = getT(state.language);
  const ITEMS = getItems(state.language);

  // Language selection
  if (phase === 'language-select') {
    chips.push({ label: '🇬🇧 English', command: 'english', variant: 'lang' });
    chips.push({ label: '🇫🇷 Français', command: 'french', variant: 'lang' });
    return chips;
  }

  // Post-escape choice
  if (phase === 'post-escape') {
    chips.push({ label: T.postEscape.escapeChip, command: 'escape', variant: 'nav' });
    chips.push({ label: T.postEscape.continueChip, command: 'continue', variant: 'combat' });
    return chips;
  }

  if (phase === 'game_over' || phase === 'victory') return chips;

  const room = rooms[player.currentRoomId];

  if (phase === 'combat') {
    const enemy = combat
      ? room.enemies.find(e => e.instanceId === combat.enemyInstanceId && e.isAlive)
      : null;

    if (enemy) {
      for (const part of ALL_BODY_PARTS) {
        const status = (enemy.bodyStatus ?? DEFAULT_BODY_STATUS)[part];
        const isDisabled = status === 'disabled';
        chips.push({
          label: buildBodyPartLabel(part, status),
          command: `attack ${BODY_PART_LABELS[part].toLowerCase()}`,
          variant: isDisabled ? 'disabled-part' : 'body',
        });
      }
    }

    chips.push({ label: T.ui.flee, command: 'flee', variant: 'danger' });

    const consumables = player.inventory.filter(i => i.type === 'consumable');
    for (const item of consumables.slice(0, 2)) {
      chips.push({ label: `${T.ui.use} ${item.name}`, command: `use ${item.name}`, variant: 'combat' });
    }

    chips.push({ label: T.ui.stats, command: 'stats' });
    return chips;
  }

  // Exploring phase
  chips.push({ label: T.ui.look, command: 'look' });

  const dirs: Direction[] = ['north', 'south', 'east', 'west'];
  for (const dir of dirs) {
    const destId = room.exits[dir];
    if (!destId) continue;
    const destName = destId === 'exit' ? T.ui.theExit : (rooms[destId]?.name ?? dir);
    chips.push({ label: `→ ${destName}`, command: `go ${dir}`, variant: 'nav' });
    if (destId !== 'exit' && rooms[destId]?.enemies.some(e => e.isAlive)) {
      chips.push({ label: `${T.ui.sneak} → ${destName}`, command: `sneak ${dir}`, variant: 'default' });
    }
  }

  const liveEnemies = room.enemies.filter(e => e.isAlive);
  for (const e of liveEnemies.slice(0, 2)) {
    chips.push({ label: `${T.ui.attack} ${e.name}`, command: `attack ${e.name}`, variant: 'combat' });
  }

  for (const id of room.items.slice(0, 3)) {
    const item = ITEMS[id];
    if (item) chips.push({ label: `${T.ui.take} ${item.name}`, command: `take ${item.name}` });
  }

  if (room.searchable && !room.searched) {
    chips.push({ label: T.ui.search, command: 'search' });
  }

  chips.push({ label: T.ui.inventory, command: 'inventory' });

  for (const item of player.inventory.filter(i => i.type === 'weapon' || i.type === 'armor').slice(0, 2)) {
    chips.push({ label: `${T.ui.equip} ${item.name}`, command: `equip ${item.name}` });
  }

  for (const item of player.inventory.filter(i => i.type === 'consumable').slice(0, 2)) {
    chips.push({ label: `${T.ui.use} ${item.name}`, command: `use ${item.name}` });
  }

  chips.push({ label: T.ui.stats, command: 'stats' });
  chips.push({ label: T.ui.help, command: 'help' });

  return chips;
}

const CommandInput: React.FC<Props> = ({ gameState, onCommand }) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const T = getT(gameState.language);

  const chips = buildChips(gameState);
  const isEnded = gameState.phase === 'game_over' || gameState.phase === 'victory';

  useEffect(() => {
    if (!isEnded) inputRef.current?.focus();
  }, [gameState, isEnded]);

  function submit(cmd: string) {
    const trimmed = cmd.trim();
    if (!trimmed) return;
    setHistory(prev => [trimmed, ...prev.slice(0, 49)]);
    setHistoryIdx(-1);
    setInput('');
    onCommand(trimmed);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      submit(input);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const idx = Math.min(historyIdx + 1, history.length - 1);
      setHistoryIdx(idx);
      if (history[idx]) setInput(history[idx]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const idx = Math.max(historyIdx - 1, -1);
      setHistoryIdx(idx);
      setInput(idx === -1 ? '' : history[idx]);
    }
  }

  const variantClass: Record<string, string> = {
    default: 'chip',
    nav: 'chip chip-nav',
    combat: 'chip chip-combat',
    body: 'chip chip-body',
    danger: 'chip chip-danger',
    'disabled-part': 'chip chip-disabled-part',
    lang: 'chip chip-lang',
  };

  return (
    <div className="command-area">
      <div className="chips">
        {chips.map((chip, i) => (
          <button
            key={i}
            className={variantClass[chip.variant ?? 'default']}
            onClick={() => submit(chip.command)}
            disabled={isEnded}
          >
            {chip.label}
          </button>
        ))}
      </div>
      <div className="input-row">
        <span className="prompt">&gt;</span>
        <input
          ref={inputRef}
          type="text"
          className="command-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isEnded}
          placeholder={isEnded ? '' : T.ui.placeholder}
          autoComplete="off"
          spellCheck={false}
        />
      </div>
    </div>
  );
};

export default CommandInput;
