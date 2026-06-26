import React from 'react';
import { GameState, EnemyInstance, BODY_PART_LABELS, BodyPart, DEFAULT_BODY_STATUS } from '../game/types';
import { getEnemyPenalties } from '../game/engine/combat';
import { getT } from '../game/i18n';

interface Props {
  gameState: GameState;
}

function HpBar({ current, max, width = 100 }: { current: number; max: number; width?: number }) {
  const pct = Math.max(0, (current / max) * 100);
  const color = pct > 60 ? '#4caf50' : pct > 30 ? '#ff9800' : '#e53935';
  return (
    <div className="hp-bar-wrap">
      <div className="hp-bar-track" style={{ width }}>
        <div className="hp-bar-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="hp-num" style={{ color }}>{current}/{max}</span>
    </div>
  );
}

function EnemyCombatPanel({ enemy, gameState }: { enemy: EnemyInstance; gameState: GameState }) {
  const T = getT(gameState.language);
  const penalties = getEnemyPenalties(enemy);
  const woundedParts = (Object.entries(enemy.bodyStatus ?? DEFAULT_BODY_STATUS) as [BodyPart, string][])
    .filter(([, status]) => status !== 'intact');

  return (
    <div className="enemy-panel">
      <div className="enemy-panel-header">
        <span className="enemy-label">{T.ui.fightingLabel}</span>
        <span className="enemy-name-big">{enemy.name}</span>
      </div>
      <div className="enemy-panel-hp">
        <HpBar current={enemy.hp} max={enemy.maxHp} width={140} />
      </div>
      {(woundedParts.length > 0 || !penalties.canAttack || penalties.cantFlee || enemy.stunned) && (
        <div className="enemy-conditions">
          {enemy.stunned && <span className="condition stun">{T.ui.stunned}</span>}
          {!penalties.canAttack && <span className="condition disabled">{T.ui.disarmed}</span>}
          {penalties.cantFlee && <span className="condition cant-flee">{T.ui.crippled}</span>}
          {woundedParts.map(([part, status]) => (
            <span key={part} className={`condition ${status}`}>
              {BODY_PART_LABELS[part]} {status}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

const StatusBar: React.FC<Props> = ({ gameState }) => {
  const { player, rooms, phase, combat } = gameState;
  const T = getT(gameState.language);

  // During language selection or post-escape choice, show minimal banner
  if (phase === 'language-select') {
    return (
      <div className="status-bar">
        <div className="status-main">
          <div className="stat-block phase-badge explore-badge">🌐 LANGUAGE / LANGUE</div>
        </div>
      </div>
    );
  }
  if (phase === 'post-escape') {
    return (
      <div className="status-bar">
        <div className="status-main">
          <div className="stat-block phase-badge victory-badge">{T.ui.escapedBadge}</div>
        </div>
      </div>
    );
  }

  const room = rooms[player.currentRoomId];

  const combatEnemy = combat
    ? room.enemies.find(e => e.instanceId === combat.enemyInstanceId && e.isAlive)
    : null;

  return (
    <div className="status-bar">
      <div className="status-main">
        <div className="stat-block hp-block">
          <div className="stat-label">{T.ui.health}</div>
          <HpBar current={player.hp} max={player.maxHp} width={110} />
        </div>

        <div className="stat-block">
          <div className="stat-label">{T.ui.ac}</div>
          <div className="stat-val">{player.ac}</div>
        </div>

        <div className="stat-block">
          <div className="stat-label">{T.ui.xp}</div>
          <div className="stat-val">{player.xp}</div>
        </div>

        <div className="stat-block weapon-block">
          <div className="stat-label">{T.ui.weapon}</div>
          <div className="stat-val weapon-val">{player.equipped.weapon?.name ?? T.ui.bareHands}</div>
        </div>

        <div className="stat-block location-block">
          <div className="stat-label">{T.ui.location}</div>
          <div className="stat-val location-val">{room.name}</div>
        </div>

        {phase === 'combat' && <div className="stat-block phase-badge combat-badge">{T.ui.combatBadge}</div>}
        {phase === 'exploring' && !gameState.sneaking && <div className="stat-block phase-badge explore-badge">{T.ui.exploringBadge}</div>}
        {phase === 'exploring' && gameState.sneaking && <div className="stat-block phase-badge sneak-badge">{T.ui.hiddenBadge}</div>}
        {phase === 'victory' && <div className="stat-block phase-badge victory-badge">{T.ui.escapedBadge}</div>}
        {phase === 'game_over' && <div className="stat-block phase-badge dead-badge">{T.ui.deadBadge}</div>}
      </div>

      {combatEnemy && (
        <div className="status-combat">
          <EnemyCombatPanel enemy={combatEnemy} gameState={gameState} />
        </div>
      )}
    </div>
  );
};

export default StatusBar;
