import { EnemyInstance, DEFAULT_BODY_STATUS } from '../types';
import { Locale, ENEMY_TEXT } from '../i18n';

interface EnemyTemplate {
  templateId: string;
  name: string;
  description: string;
  maxHp: number;
  ac: number;
  attackBonus: number;
  damageDice: string;
  xp: number;
  loot: string[];
  aggressive: boolean;
}

const TEMPLATES: Record<string, EnemyTemplate> = {
  guard: {
    templateId: 'guard',
    name: 'Castle Guard',
    description: 'A human soldier in leather armor, hand on his sword. He looks groggy — you may have caught him mid-nap.',
    maxHp: 12,
    ac: 13,
    attackBonus: 3,
    damageDice: '1d6+1',
    xp: 24,
    loot: ['dagger'],
    aggressive: false,
  },
  skeleton: {
    templateId: 'skeleton',
    name: 'Skeleton',
    description: 'A reanimated skeleton, its bones yellowed and cracked. Empty eye sockets regard you with cold malice.',
    maxHp: 8,
    ac: 12,
    attackBonus: 2,
    damageDice: '1d6',
    xp: 16,
    loot: [],
    aggressive: true,
  },
  orc_torturer: {
    templateId: 'orc_torturer',
    name: 'Orc Torturer',
    description: 'A broad-shouldered orc in a filthy leather apron, gripping a spiked club. He grins at your arrival.',
    maxHp: 16,
    ac: 11,
    attackBonus: 4,
    damageDice: '1d8+2',
    xp: 32,
    loot: ['health-potion', 'health-potion'],
    aggressive: true,
  },
  skeleton_knight: {
    templateId: 'skeleton_knight',
    name: 'Skeleton Knight',
    description: 'An ancient warrior entombed here centuries ago, still standing guard in crumbling plate armor. Blue flames burn in its visor.',
    maxHp: 22,
    ac: 16,
    attackBonus: 5,
    damageDice: '1d8+2',
    xp: 44,
    loot: ['longsword', 'chainmail'],
    aggressive: true,
  },
  cook: {
    templateId: 'cook',
    name: 'Castle Cook',
    description: 'A heavyset man in a stained apron, cleaver already raised. "Back to your cell, wretch!"',
    maxHp: 9,
    ac: 10,
    attackBonus: 3,
    damageDice: '1d6',
    xp: 18,
    loot: ['bread-loaf', 'kitchen-knife'],
    aggressive: false,
  },
  dark_knight: {
    templateId: 'dark_knight',
    name: 'Dark Knight',
    description: 'The castle\'s champion, clad head-to-toe in black plate. He draws a massive greatsword and his voice rumbles: "You\'ll not leave here alive."',
    maxHp: 28,
    ac: 17,
    attackBonus: 6,
    damageDice: '2d6+3',
    xp: 50,
    loot: ['greatsword', 'plate-armor'],
    aggressive: true,
  },
  gate_captain: {
    templateId: 'gate_captain',
    name: 'Gate Captain',
    description: 'A scarred veteran in chainmail, halberd leveled at your chest. "Nobody passes," he says flatly.',
    maxHp: 20,
    ac: 14,
    attackBonus: 5,
    damageDice: '1d10+2',
    xp: 40,
    loot: ['halberd'],
    aggressive: false,
  },
  weak_skeleton: {
    templateId: 'weak_skeleton',
    name: 'Decrepit Skeleton',
    description: 'A crumbling skeleton with barely any bones intact. It shambles toward you with ancient malice, arms outstretched.',
    maxHp: 5,
    ac: 9,
    attackBonus: 1,
    damageDice: '1d4',
    xp: 10,
    loot: [],
    aggressive: true,
  },
  ghost: {
    templateId: 'ghost',
    name: 'Wailing Ghost',
    description: 'A translucent figure drifts from the shadows, hollow mouth open in a silent scream. Cold radiates from its form.',
    maxHp: 14,
    ac: 13,
    attackBonus: 4,
    damageDice: '1d6',
    xp: 28,
    loot: ['holy-water'],
    aggressive: true,
  },
  mad_priest: {
    templateId: 'mad_priest',
    name: 'Mad Priest',
    description: 'A hollow-eyed cleric in tattered robes, babbling dark scripture and clutching a bloodstained mace. His faith has curdled into something terrible.',
    maxHp: 15,
    ac: 12,
    attackBonus: 4,
    damageDice: '1d6+1',
    xp: 30,
    loot: ['iron-mace', 'health-potion'],
    aggressive: true,
  },
  wizard_apprentice: {
    templateId: 'wizard_apprentice',
    name: "Wizard's Apprentice",
    description: 'A young man in ink-stained robes clutching a gnarled staff. His eyes flash with panic — and dangerous power.',
    maxHp: 12,
    ac: 11,
    attackBonus: 3,
    damageDice: '1d6+2',
    xp: 24,
    loot: ['enchanted-staff', 'greater-health-potion'],
    aggressive: true,
  },
  stable_raider: {
    templateId: 'stable_raider',
    name: 'Stable Raider',
    description: 'A brigand who has taken shelter in the stables, armed and desperate. He levels a crossbow at you from the shadows.',
    maxHp: 14,
    ac: 12,
    attackBonus: 4,
    damageDice: '1d8',
    xp: 28,
    loot: ['health-potion'],
    aggressive: true,
  },
  dormitory_soldier: {
    templateId: 'dormitory_soldier',
    name: 'Castle Soldier',
    description: 'An armed soldier caught resting in the dormitory. He scrambles to his feet, sword already in hand.',
    maxHp: 14,
    ac: 13,
    attackBonus: 4,
    damageDice: '1d6+1',
    xp: 28,
    loot: ['longsword'],
    aggressive: true,
  },
};

let instanceCounter = 0;
export function spawnEnemy(templateId: string, locale: Locale = 'en'): EnemyInstance {
  const t = TEMPLATES[templateId];
  if (!t) throw new Error(`Unknown enemy template: ${templateId}`);
  const locText: Partial<{ name: string; description: string }> = locale !== 'en' ? (ENEMY_TEXT[locale][templateId] ?? {}) : {};
  return {
    templateId: t.templateId,
    instanceId: `${templateId}-${++instanceCounter}`,
    name: locText.name ?? t.name,
    description: locText.description ?? t.description,
    hp: t.maxHp,
    maxHp: t.maxHp,
    ac: t.ac,
    baseAttackBonus: t.attackBonus,
    damageDice: t.damageDice,
    xp: t.xp,
    loot: [...t.loot],
    isAlive: true,
    aggressive: t.aggressive,
    bodyStatus: { ...DEFAULT_BODY_STATUS },
    stunned: false,
  };
}
