import { Item } from '../types';
import { Locale, ITEM_TEXT } from '../i18n';

const BASE_ITEMS: Record<string, Item> = {
  // ── Weapons ──────────────────────────────────────────────
  'rusty-shiv': {
    id: 'rusty-shiv',
    name: 'Rusty Shiv',
    type: 'weapon',
    description: 'A crude blade fashioned from a broken nail. Dangerous up close if nothing else is available.',
    slot: 'weapon',
    damageDice: '1d3',
    attackBonus: -1,
  },
  'dagger': {
    id: 'dagger',
    name: 'Dagger',
    type: 'weapon',
    description: "A standard guard's dagger. Well-balanced and sharp.",
    slot: 'weapon',
    damageDice: '1d4',
    attackBonus: 0,
  },
  'kitchen-knife': {
    id: 'kitchen-knife',
    name: "Cook's Knife",
    type: 'weapon',
    description: 'A heavy cleaver meant for butchering, repurposed for butchering.',
    slot: 'weapon',
    damageDice: '1d4',
    attackBonus: 0,
  },
  'short-sword': {
    id: 'short-sword',
    name: 'Short Sword',
    type: 'weapon',
    description: 'A compact blade, perfectly balanced for close-quarters work.',
    slot: 'weapon',
    damageDice: '1d6',
    attackBonus: 0,
  },
  'hand-axe': {
    id: 'hand-axe',
    name: 'Hand Axe',
    type: 'weapon',
    description: 'A sturdy hatchet, weighted for both throwing and melee.',
    slot: 'weapon',
    damageDice: '1d6',
    attackBonus: 0,
  },
  'longsword': {
    id: 'longsword',
    name: 'Longsword',
    type: 'weapon',
    description: 'A finely forged blade. Heavy but lethal in practiced hands.',
    slot: 'weapon',
    damageDice: '1d8',
    attackBonus: 1,
  },
  'greatsword': {
    id: 'greatsword',
    name: "Dark Knight's Greatsword",
    type: 'weapon',
    description: 'A massive two-handed sword, black as midnight. Engraved with fell runes that seem to drink in the light.',
    slot: 'weapon',
    damageDice: '2d6',
    attackBonus: 1,
  },

  // ── Armor ─────────────────────────────────────────────────
  'leather-armor': {
    id: 'leather-armor',
    name: 'Leather Armor',
    type: 'armor',
    description: 'Supple boiled leather. Offers protection without slowing you down.',
    slot: 'body',
    acBonus: 2,
  },
  'chainmail': {
    id: 'chainmail',
    name: 'Chainmail Hauberk',
    type: 'armor',
    description: 'Interlocking iron rings. Heavy, but it has stopped many blades before.',
    slot: 'body',
    acBonus: 4,
  },
  'plate-armor': {
    id: 'plate-armor',
    name: "Dark Knight's Plate",
    type: 'armor',
    description: 'Blackened full plate etched with cursed runes. Imposing and nearly impenetrable.',
    slot: 'body',
    acBonus: 6,
  },
  'wooden-shield': {
    id: 'wooden-shield',
    name: 'Wooden Shield',
    type: 'armor',
    description: 'A round shield banded with iron strips. Battered but solid.',
    slot: 'offhand',
    acBonus: 2,
  },

  // ── Consumables ───────────────────────────────────────────
  'health-potion': {
    id: 'health-potion',
    name: 'Health Potion',
    type: 'consumable',
    description: 'A small vial of ruby-red liquid. Warm to the touch. Restores 10 HP.',
    healAmount: 10,
  },
  'healing-herbs': {
    id: 'healing-herbs',
    name: 'Healing Herbs',
    type: 'consumable',
    description: 'A bundle of dried medicinal herbs. Chewing them slows bleeding and eases pain. Restores 4 HP.',
    healAmount: 4,
  },
  'bread-loaf': {
    id: 'bread-loaf',
    name: 'Stale Bread',
    type: 'consumable',
    description: 'Hard as a cobblestone and tasteless. Still, it is food. Restores 2 HP.',
    healAmount: 2,
  },

  // ── Stronger Weapons ──────────────────────────────────────────────────────
  'warhammer': {
    id: 'warhammer',
    name: 'Warhammer',
    type: 'weapon',
    description: 'A heavy hammer designed to crush through armor. Devastating against undead bones.',
    slot: 'weapon',
    damageDice: '1d8',
    attackBonus: 1,
  },
  'silver-sword': {
    id: 'silver-sword',
    name: 'Silver Longsword',
    type: 'weapon',
    description: 'A longsword with a silvered blade and holy sigils etched along the fuller. Bane of the undead.',
    slot: 'weapon',
    damageDice: '1d8',
    attackBonus: 2,
  },
  'enchanted-staff': {
    id: 'enchanted-staff',
    name: 'Enchanted Staff',
    type: 'weapon',
    description: 'A gnarled wooden staff crackling with barely contained arcane energy. Strikes with surprising force.',
    slot: 'weapon',
    damageDice: '1d6',
    attackBonus: 3,
  },
  'battle-axe': {
    id: 'battle-axe',
    name: 'Battle Axe',
    type: 'weapon',
    description: 'A broad-bladed axe built for war. Heavy but punishing on every impact.',
    slot: 'weapon',
    damageDice: '1d10',
    attackBonus: 0,
  },
  'morning-star': {
    id: 'morning-star',
    name: 'Morning Star',
    type: 'weapon',
    description: 'A spiked iron ball on a wooden handle. Brutal and effective against armored foes.',
    slot: 'weapon',
    damageDice: '1d8',
    attackBonus: 1,
  },
  'iron-mace': {
    id: 'iron-mace',
    name: 'Iron Mace',
    type: 'weapon',
    description: "A priest's mace — heavy and blunt, well-suited to smashing bone.",
    slot: 'weapon',
    damageDice: '1d6',
    attackBonus: 1,
  },
  'halberd': {
    id: 'halberd',
    name: 'Halberd',
    type: 'weapon',
    description: 'A long polearm with a broad axe-head and spike. Reach and power in one brutal package.',
    slot: 'weapon',
    damageDice: '1d10',
    attackBonus: 1,
  },

  // ── Stronger Armor ─────────────────────────────────────────────────────────
  'scale-armor': {
    id: 'scale-armor',
    name: 'Scale Armor',
    type: 'armor',
    description: 'Overlapping metal scales stitched to a leather backing. Better protection than chainmail, less weight than plate.',
    slot: 'body',
    acBonus: 3,
  },
  'half-plate': {
    id: 'half-plate',
    name: 'Half-Plate Armor',
    type: 'armor',
    description: 'Heavy plate protecting the torso and arms, with chainmail below. Outstanding defense at the cost of speed.',
    slot: 'body',
    acBonus: 5,
  },
  'blessed-shield': {
    id: 'blessed-shield',
    name: 'Blessed Shield',
    type: 'armor',
    description: 'An iron-bossed shield marked with holy symbols. It seems to gleam faintly in the dark.',
    slot: 'offhand',
    acBonus: 3,
  },
  'iron-shield': {
    id: 'iron-shield',
    name: 'Iron Shield',
    type: 'armor',
    description: 'A solid iron shield, dented from heavy use but utterly reliable.',
    slot: 'offhand',
    acBonus: 3,
  },

  // ── Stronger Consumables ───────────────────────────────────────────────────
  'greater-health-potion': {
    id: 'greater-health-potion',
    name: 'Greater Health Potion',
    type: 'consumable',
    description: 'A large flask of vivid crimson liquid, warm to the touch. Closes wounds at remarkable speed. Restores 20 HP.',
    healAmount: 20,
  },
  'holy-water': {
    id: 'holy-water',
    name: 'Vial of Holy Water',
    type: 'consumable',
    description: 'Blessed water in a sealed crystal vial. Drinkable in a pinch — faintly bitter, oddly restorative. Restores 6 HP.',
    healAmount: 6,
  },
  'god-apple': {
    id: 'god-apple',
    name: 'GOD Apple',
    type: 'consumable',
    description: 'How did this end up here?',
    healAmount: 50,
  },

  // ── Holy Relic ─────────────────────────────────────────────────────────────
  'holy-relic': {
    id: 'holy-relic',
    name: 'Holy Relic',
    type: 'armor',
    description: 'A golden reliquary warm to the touch, pulsing with divine light. Carried in the shield hand, it grants fortitude and wards off undead.',
    slot: 'offhand',
    acBonus: 1,
    onEquipHeal: 10,
    onEquipMaxHpBonus: 10,
  },

  // ── Grimoire ───────────────────────────────────────────────────────────────
  'grimoire': {
    id: 'grimoire',
    name: 'Arcane Grimoire',
    type: 'consumable',
    description: 'A singed leather tome crackling with trapped fire. One-use only — releases a bolt of fire for 10 damage, bypassing armour.',
    spellDamage: 10,
  },

  // ── Trinket ────────────────────────────────────────────────────────────────
  'trinket-necklace': {
    id: 'trinket-necklace',
    name: 'Sanguine Amulet',
    type: 'armor',
    description: 'A dark ruby set in tarnished silver. Heals you for 25% of all damage you deal.',
    slot: 'necklace',
    acBonus: 0,
    lifeStealPct: 25,
  },

  // ── Keys / Utilities ──────────────────────────────────────
  'village-key': {
    id: 'village-key',
    name: 'Village House Key',
    type: 'key',
    description: "A plain iron key pressed into your hand by a desperate villager. It unlocks the blacksmith's storage room.",
  },
  'rusty-key': {
    id: 'rusty-key',
    name: 'Rusty Iron Key',
    type: 'key',
    description: 'A heavy iron key, thick with rust. It looks like it fits the lock on the cell door.',
    unlocksRoomId: 'guard-post',
  },
  'rope': {
    id: 'rope',
    name: 'Coiled Rope',
    type: 'utility',
    description: 'Thirty feet of hempen rope. Could be useful.',
  },
};

export function getItems(locale: Locale): Record<string, Item> {
  if (locale === 'en') return BASE_ITEMS;
  const text = ITEM_TEXT[locale];
  const result: Record<string, Item> = {};
  for (const [id, item] of Object.entries(BASE_ITEMS)) {
    result[id] = { ...item, ...(text[id] ?? {}) };
  }
  return result;
}

export const ITEMS = BASE_ITEMS;
