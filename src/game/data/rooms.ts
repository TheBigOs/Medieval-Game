import { Room } from '../types';
import { spawnEnemy } from './enemies';
import { Locale, ROOM_TEXT, ROOM_DYNAMIC } from '../i18n';

function pickRandom(pool: string[], count: number): string[] {
  const copy = [...pool];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, Math.min(count, copy.length));
}

function oneOf<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)] as T;
}

export function buildRooms(locale: Locale = 'en'): Record<string, Room> {
  const rt = ROOM_TEXT[locale];
  const rd = ROOM_DYNAMIC[locale];

  // Pre-roll random decisions for each new game
  const chapelEnemyType: 'ghost' | 'mad_priest' = oneOf(['ghost', 'mad_priest']);
  const stableHasRaider = Math.random() < 0.6;
  const dormitorySoldierCount = Math.random() < 0.5 ? 1 : 2;

  const chapelDescription = chapelEnemyType === 'ghost' ? rd.chapel_ghost_desc : rd.chapel_priest_desc;
  const chapelShort      = chapelEnemyType === 'ghost' ? rd.chapel_ghost_short : rd.chapel_priest_short;
  const stableDescription = stableHasRaider ? rd.stable_raider_desc : rd.stable_empty_desc;
  const stableShort       = stableHasRaider ? rd.stable_raider_short : rd.stable_empty_short;
  const dormShort = dormitorySoldierCount === 1 ? rd.dormitory_short_one : rd.dormitory_short_two;

  function spawn(id: string) { return spawnEnemy(id, locale); }

  const lockedDoorMsg = locale === 'fr' ? "La porte est verrouillée. Vous avez besoin d'une clé." : 'The door is locked. You need a key.';

  return {
    'dungeon-cell': {
      id: 'dungeon-cell', ...rt['dungeon-cell'],
      exits: { east: 'guard-post' },
      lockedExits: { east: { keyId: 'rusty-key', description: lockedDoorMsg } },
      items: [], enemies: [], visited: false,
      searchable: true, hiddenItems: ['rusty-shiv', 'rusty-key'], searched: false,
    },

    'guard-post': {
      id: 'guard-post', ...rt['guard-post'],
      exits: { west: 'dungeon-cell', north: 'corridor', east: 'armory' },
      items: ['wooden-shield'], enemies: [spawn('guard')], visited: false,
    },

    'armory': {
      id: 'armory', ...rt['armory'],
      exits: { west: 'guard-post' },
      items: [
        ...pickRandom(['short-sword', 'hand-axe', 'warhammer', 'morning-star', 'battle-axe'], 2),
        ...pickRandom(['leather-armor', 'scale-armor', 'iron-shield'], 1),
      ],
      enemies: [], visited: false,
    },

    'corridor': {
      id: 'corridor', ...rt['corridor'],
      exits: { south: 'guard-post', east: 'torture-chamber', west: 'barracks', north: 'undercroft' },
      items: [], enemies: [], visited: false,
    },

    'barracks': {
      id: 'barracks', ...rt['barracks'],
      exits: { east: 'corridor', north: 'charnel-chamber' },
      items: ['health-potion', ...pickRandom(['hand-axe', 'warhammer', 'iron-mace', 'morning-star'], 1)],
      enemies: [], visited: false,
    },

    'torture-chamber': {
      id: 'torture-chamber', ...rt['torture-chamber'],
      exits: { west: 'corridor' },
      items: [], enemies: [spawn('orc_torturer')], visited: false,
      searchable: true, hiddenItems: ['healing-herbs', 'rope'], searched: false,
    },

    'undercroft': {
      id: 'undercroft', ...rt['undercroft'],
      exits: { south: 'corridor', west: 'crypt', north: 'kitchen' },
      items: ['healing-herbs'], enemies: [spawn('skeleton')], visited: false,
    },

    'crypt': {
      id: 'crypt', ...rt['crypt'],
      exits: { east: 'undercroft' },
      items: [], enemies: [spawn('skeleton_knight')], visited: false,
    },

    'kitchen': {
      id: 'kitchen', ...rt['kitchen'],
      exits: { south: 'undercroft', north: 'great-hall', east: 'dormitory', west: 'wizard-office' },
      items: ['bread-loaf', 'bread-loaf'], enemies: [spawn('cook')], visited: false,
    },

    'great-hall': {
      id: 'great-hall', ...rt['great-hall'],
      exits: { south: 'kitchen', north: 'gatehouse', east: 'chapel', west: 'stable' },
      items: [], enemies: [spawn('dark_knight')], visited: false,
    },

    'gatehouse': {
      id: 'gatehouse', ...rt['gatehouse'],
      exits: { south: 'great-hall', north: 'exit' },
      items: [], enemies: [spawn('gate_captain')], visited: false,
    },

    // ── New Rooms ────────────────────────────────────────────────────────────

    'charnel-chamber': {
      id: 'charnel-chamber', ...rt['charnel-chamber'],
      exits: { south: 'barracks' },
      items: [], enemies: [spawn('weak_skeleton'), spawn('weak_skeleton')], visited: false,
      searchable: true, hiddenItems: pickRandom(['health-potion', 'healing-herbs', 'iron-shield', 'warhammer'], 1), searched: false,
    },

    'chapel': {
      id: 'chapel',
      name: rt['chapel'].name, description: chapelDescription, shortDescription: chapelShort,
      exits: { west: 'great-hall' },
      items: pickRandom(['holy-water', 'silver-sword', 'blessed-shield', 'greater-health-potion'], 2),
      enemies: [spawn(chapelEnemyType)], visited: false,
      searchable: true, hiddenItems: pickRandom(['holy-water', 'greater-health-potion', 'healing-herbs', 'silver-sword'], 1), searched: false,
    },

    'stable': {
      id: 'stable',
      name: rt['stable'].name, description: stableDescription, shortDescription: stableShort,
      exits: { east: 'great-hall' },
      items: pickRandom(['battle-axe', 'iron-shield', 'leather-armor', 'hand-axe', 'health-potion', 'rope'], 2),
      enemies: stableHasRaider ? [spawn('stable_raider')] : [], visited: false,
      searchable: true, hiddenItems: pickRandom(['health-potion', 'iron-shield', 'rope', 'morning-star'], 1), searched: false,
    },

    'dormitory': {
      id: 'dormitory',
      name: rt['dormitory'].name, description: rt['dormitory'].description, shortDescription: dormShort,
      exits: { west: 'kitchen' },
      items: pickRandom(['chainmail', 'scale-armor', 'morning-star', 'longsword', 'iron-shield', 'health-potion'], 2),
      enemies: Array.from({ length: dormitorySoldierCount }, () => spawn('dormitory_soldier')),
      visited: false,
    },

    'wizard-office': {
      id: 'wizard-office', ...rt['wizard-office'],
      exits: { east: 'kitchen' },
      items: pickRandom(['enchanted-staff', 'half-plate', 'greater-health-potion', 'health-potion'], 2),
      enemies: [spawn('wizard_apprentice')], visited: false,
      searchable: true, hiddenItems: pickRandom(['enchanted-staff', 'half-plate', 'greater-health-potion'], 1),
      searched: false,
    },

    // ── Village of Helmwick ────────────────────────────────────────────────────

    'village-road': {
      id: 'village-road', ...rt['village-road'],
      exits: { east: 'village-house', north: 'town-center' },
      items: [], enemies: [], visited: false,
      npcName: rt['village-road'].npcName,
      npcDialogue: rt['village-road'].npcDialogue,
    },

    'village-house': {
      id: 'village-house', ...rt['village-house'],
      exits: { west: 'village-road' },
      items: [], enemies: [spawn('zombie'), spawn('zombie')], visited: false,
      searchable: true, hiddenItems: ['village-key'], searched: false,
    },

    'town-center': {
      id: 'town-center', ...rt['town-center'],
      exits: { south: 'village-road', east: 'inn', west: 'blacksmith', north: 'church' },
      items: [], enemies: [spawn('zombie'), spawn('zombie')], visited: false,
      wellTrap: true, searchable: true, hiddenItems: [], searched: false,
    },

    'inn': {
      id: 'inn', ...rt['inn'],
      exits: { west: 'town-center' },
      items: pickRandom(['health-potion', 'healing-herbs', 'bread-loaf'], 2),
      enemies: [spawn('zombie_barkeep'), spawn('zombie'), spawn('zombie')], visited: false,
    },

    'blacksmith': {
      id: 'blacksmith', ...rt['blacksmith'],
      exits: { east: 'town-center', north: 'blacksmith-vault' },
      lockedExits: { north: { keyId: 'village-key', description: locale === 'fr' ? 'La porte de stockage est verrouillée. Vous avez besoin d\'une clé.' : 'The storage door is locked. You need a key.' } },
      items: [], enemies: [spawn('forge_zombie')], visited: false,
    },

    'blacksmith-vault': {
      id: 'blacksmith-vault', ...rt['blacksmith-vault'],
      exits: { south: 'blacksmith' },
      items: [
        ...pickRandom(['half-plate', 'scale-armor', 'plate-armor'], 1),
        ...pickRandom(['silver-sword', 'battle-axe', 'halberd', 'greatsword'], 1),
        'greater-health-potion',
      ],
      enemies: [], visited: false,
    },

    'church': {
      id: 'church', ...rt['church'],
      exits: { south: 'town-center', east: 'cemetery', north: 'town-hall' },
      items: ['holy-relic'],
      enemies: [spawn('skeleton_priest'), spawn('skeleton_priest')], visited: false,
      searchable: true, hiddenItems: ['greater-health-potion', 'healing-herbs'], searched: false,
    },

    'cemetery': {
      id: 'cemetery', ...rt['cemetery'],
      exits: { west: 'church' },
      items: [],
      enemies: [spawn('tomb_zombie'), spawn('tomb_zombie'), spawn('tomb_zombie'), spawn('ghoul'), spawn('ghoul')],
      visited: false,
      searchable: true, hiddenItems: pickRandom(['holy-water', 'greater-health-potion'], 1), searched: false,
    },

    'town-hall': {
      id: 'town-hall', ...rt['town-hall'],
      exits: { south: 'church' },
      items: [],
      enemies: [spawn('arch_lich')], visited: false,
    },
  };
}
