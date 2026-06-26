export type Direction = 'north' | 'south' | 'east' | 'west';
export type ItemType = 'weapon' | 'armor' | 'consumable' | 'utility' | 'key';
export type GamePhase = 'language-select' | 'exploring' | 'combat' | 'game_over' | 'victory' | 'post-escape';
export type MessageType = 'narrative' | 'combat' | 'loot' | 'error' | 'system' | 'success' | 'roll';
export type EquipSlot = 'weapon' | 'offhand' | 'body';

// ── Body Part System ───────────────────────────────────────────────────────

export type BodyPart = 'head' | 'chest' | 'rightArm' | 'leftArm' | 'rightLeg' | 'leftLeg';
export type BodyPartStatus = 'intact' | 'wounded' | 'disabled';
export type BodyStatus = Record<BodyPart, BodyPartStatus>;

export const ALL_BODY_PARTS: BodyPart[] = ['head', 'chest', 'rightArm', 'leftArm', 'rightLeg', 'leftLeg'];

export const BODY_PART_LABELS: Record<BodyPart, string> = {
  head: 'Head',
  chest: 'Chest',
  rightArm: 'Right Arm',
  leftArm: 'Left Arm',
  rightLeg: 'Right Leg',
  leftLeg: 'Left Leg',
};

export const DEFAULT_BODY_STATUS: BodyStatus = {
  head: 'intact',
  chest: 'intact',
  rightArm: 'intact',
  leftArm: 'intact',
  rightLeg: 'intact',
  leftLeg: 'intact',
};

// ── Items ──────────────────────────────────────────────────────────────────

export interface Item {
  id: string;
  name: string;
  type: ItemType;
  description: string;
  slot?: EquipSlot;
  damageDice?: string;
  attackBonus?: number;
  acBonus?: number;
  healAmount?: number;
  unlocksRoomId?: string;
  onEquipHeal?: number;
  onEquipMaxHpBonus?: number;
}

// ── Enemies ────────────────────────────────────────────────────────────────

export interface EnemyInstance {
  templateId: string;
  instanceId: string;
  name: string;
  description: string;
  hp: number;
  maxHp: number;
  ac: number;
  baseAttackBonus: number;   // unmodified; runtime modifiers applied from bodyStatus
  damageDice: string;
  xp: number;
  loot: string[];
  isAlive: boolean;
  aggressive: boolean;
  bodyStatus: BodyStatus;
  stunned: boolean;          // skips next attack when true
}

export interface LockedExit {
  keyId: string;
  description: string;
}

export interface Room {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  exits: Partial<Record<Direction, string>>;
  items: string[];
  enemies: EnemyInstance[];
  visited: boolean;
  lockedExits?: Partial<Record<Direction, LockedExit>>;
  searchable?: boolean;
  hiddenItems?: string[];
  searched?: boolean;
  searchKeyId?: string;
  wellTrap?: boolean;
  npcName?: string;
  npcDialogue?: string;
}

export interface EquippedItems {
  weapon: Item | null;
  offhand: Item | null;
  body: Item | null;
}

export interface Player {
  hp: number;
  maxHp: number;
  str: number;
  dex: number;
  con: number;
  ac: number;
  inventory: Item[];
  equipped: EquippedItems;
  xp: number;
  currentRoomId: string;
  previousRoomId: string | null;
}

export interface GameMessage {
  id: string;
  text: string;
  type: MessageType;
}

export interface CombatState {
  enemyInstanceId: string;
  round: number;
}

export interface CheckpointData {
  player: Player;
}

export interface GameState {
  player: Player;
  rooms: Record<string, Room>;
  messages: GameMessage[];
  phase: GamePhase;
  combat: CombatState | null;
  sneaking: boolean;
  language: import('./i18n').Locale;
  checkpoint?: CheckpointData;
}
