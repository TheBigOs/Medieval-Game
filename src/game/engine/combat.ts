import { Player, EnemyInstance, BodyPart, BodyPartStatus, BodyStatus, DEFAULT_BODY_STATUS } from '../types';
import { rollDice, d20, statMod } from './dice';
import { Locale, getT, BODY_LABELS } from '../i18n';

// ── Body-part attack modifiers ─────────────────────────────────────────────

const PART_MODS: Record<BodyPart, { hitMod: number; damageMult: number }> = {
  head:     { hitMod: -4, damageMult: 1.6 },
  chest:    { hitMod:  0, damageMult: 1.0 },
  rightArm: { hitMod: -2, damageMult: 0.8 },
  leftArm:  { hitMod: -2, damageMult: 0.8 },
  rightLeg: { hitMod: -2, damageMult: 0.8 },
  leftLeg:  { hitMod: -2, damageMult: 0.8 },
};

// ── Derive runtime penalties from body status ──────────────────────────────

export interface EnemyPenalties {
  attackBonus: number;   // delta to apply to baseAttackBonus
  acMod: number;         // delta to apply to base ac
  canAttack: boolean;
  cantFlee: boolean;
}

export function getEnemyPenalties(enemy: EnemyInstance): EnemyPenalties {
  const bs = enemy.bodyStatus ?? DEFAULT_BODY_STATUS;
  let attackBonus = 0;
  let acMod = 0;
  let canAttack = true;
  let cantFlee = false;

  // Right arm = primary weapon arm
  if (bs.rightArm === 'wounded') attackBonus -= 3;
  if (bs.rightArm === 'disabled') canAttack = false;

  // Left arm = shield/guard arm
  if (bs.leftArm === 'wounded') acMod -= 1;
  if (bs.leftArm === 'disabled') acMod -= 2;

  // Both arms out → definitely no attack
  if (bs.leftArm === 'disabled' && bs.rightArm === 'disabled') canAttack = false;

  // Legs
  const legWounded = bs.rightLeg !== 'intact' || bs.leftLeg !== 'intact';
  const legDisabled = bs.rightLeg === 'disabled' || bs.leftLeg === 'disabled';
  const bothLegsOut = bs.rightLeg === 'disabled' && bs.leftLeg === 'disabled';

  if (legWounded) cantFlee = true;
  if (legDisabled) acMod -= 2;
  if (bothLegsOut) { acMod -= 2; canAttack = false; }

  return { attackBonus, acMod, canAttack, cantFlee };
}

// ── Apply a body-part hit and return a status message ─────────────────────

export interface BodyHitResult {
  updatedEnemy: EnemyInstance;
  effectMsg: string;
}

function nextStatus(cur: BodyPartStatus, part: BodyPart): BodyPartStatus {
  if (part === 'head' || part === 'chest') return 'wounded'; // head/chest don't go "disabled"
  return cur === 'intact' ? 'wounded' : 'disabled';
}

export function applyBodyHit(enemy: EnemyInstance, part: BodyPart, locale: Locale = 'en'): BodyHitResult {
  const T = getT(locale);
  const safeBodyStatus = enemy.bodyStatus ?? DEFAULT_BODY_STATUS;
  const current = safeBodyStatus[part];
  const next = nextStatus(current, part);
  const newBodyStatus: BodyStatus = { ...safeBodyStatus, [part]: next };
  let stunned = enemy.stunned ?? false;
  let effectMsg = '';
  const lbl = (BODY_LABELS[locale][part] ?? part).toLowerCase();

  if (current === next) {
    effectMsg = T.bodyFx.alreadyDamaged(enemy.name, lbl);
  } else {
    effectMsg = buildEffectMsg(T, enemy.name, part, next, newBodyStatus, lbl);
    if (part === 'head') stunned = true;
  }

  return { updatedEnemy: { ...enemy, bodyStatus: newBodyStatus, stunned }, effectMsg };
}

function buildEffectMsg(T: ReturnType<typeof getT>, name: string, part: BodyPart, next: BodyPartStatus, bs: BodyStatus, lbl: string): string {
  switch (part) {
    case 'head':     return T.bodyFx.head(name);
    case 'chest':    return T.bodyFx.chest(name);
    case 'rightArm': return next === 'wounded' ? T.bodyFx.rightArmWounded(name) : T.bodyFx.rightArmDisabled(name);
    case 'leftArm':  return next === 'wounded' ? T.bodyFx.leftArmWounded(name)  : T.bodyFx.leftArmDisabled(name);
    case 'rightLeg':
    case 'leftLeg':
      if (next === 'wounded') return T.bodyFx.legWounded(name, lbl);
      if (bs.rightLeg === 'disabled' && bs.leftLeg === 'disabled') return T.bodyFx.legBothCrippled(name, lbl);
      return T.bodyFx.legCrippled(name, lbl);
    default: return '';
  }
}

// ── Player attacks enemy ───────────────────────────────────────────────────

export interface AttackResult {
  hit: boolean;
  critical: boolean;
  miss: boolean;
  d20Roll: number;
  attackTotal: number;
  targetAC: number;
  damage: number;
  targetPart: BodyPart;
}

export function playerAttack(player: Player, enemy: EnemyInstance, targetPart: BodyPart = 'chest', sneakBonus = 0): AttackResult {
  const weapon = player.equipped.weapon;
  const strBonus = statMod(player.str);
  const weaponBonus = weapon?.attackBonus ?? -2;
  const proficiency = 5;
  const partMod = PART_MODS[targetPart];

  const roll = d20();
  const attackTotal = roll + proficiency + strBonus + weaponBonus + partMod.hitMod + sneakBonus;
  const critical = roll === 20;
  const miss = roll === 1;
  const hit = !miss && (critical || attackTotal >= enemy.ac);

  let damage = 0;
  if (hit) {
    const damageDice = weapon?.damageDice ?? '1d2';
    const result = rollDice(damageDice);
    const base = result.total + strBonus;
    const scaled = Math.round(base * partMod.damageMult);
    damage = critical ? Math.max(1, scaled + Math.round(result.total * partMod.damageMult)) : Math.max(1, scaled);
  }

  return { hit, critical, miss, d20Roll: roll, attackTotal, targetAC: enemy.ac, damage, targetPart };
}

// ── Enemy attacks player ───────────────────────────────────────────────────

export function enemyAttack(enemy: EnemyInstance, player: Player): AttackResult {
  const penalties = getEnemyPenalties(enemy);
  const effectiveBonus = (enemy.baseAttackBonus ?? 0) + penalties.attackBonus;

  const roll = d20();
  const attackTotal = roll + effectiveBonus;
  const critical = roll === 20;
  const miss = roll === 1;
  const hit = !miss && (critical || attackTotal >= player.ac);

  let damage = 0;
  if (hit) {
    const result = rollDice(enemy.damageDice);
    damage = critical ? Math.max(1, result.total * 2) : Math.max(1, result.total);
  }

  return { hit, critical, miss, d20Roll: roll, attackTotal, targetAC: player.ac, damage, targetPart: 'chest' };
}

// ── Flee attempt ───────────────────────────────────────────────────────────

export function attemptFlee(player: Player): boolean {
  return d20() + statMod(player.dex) >= 12;
}
