import React from 'react';
import { GameState, Item } from '../game/types';
import { getItems } from '../game/data/items';
import { getT } from '../game/i18n';

interface Props {
  gameState: GameState;
}

interface HudEntry {
  item: Item;
  isEquipped: boolean;
}

function weaponStat(item: Item): string {
  const dmg = item.damageDice ?? '';
  const bonus = item.attackBonus;
  if (!dmg) return '';
  if (bonus === undefined || bonus === 0) return dmg;
  return `${dmg}  ${bonus > 0 ? '+' : ''}${bonus} atk`;
}

function armorStat(item: Item): string {
  if (item.lifeStealPct) return `${item.lifeStealPct}% lifesteal`;
  if (!item.acBonus) return '';
  return `AC +${item.acBonus}`;
}

function WeaponIcon({ id }: { id: string }) {
  const svg = { width: 28, height: 28, viewBox: '0 0 24 24', fill: 'none', className: 'hud-weapon-icon' };

  if (id === 'enchanted-staff') {
    return (
      <svg {...svg}>
        <line x1="12" y1="22" x2="12" y2="9" stroke="white" strokeWidth="1.8" strokeLinecap="round" opacity={0.85} />
        <circle cx="12" cy="6" r="3" stroke="white" strokeWidth="1.6" opacity={0.85} />
        <line x1="9" y1="10" x2="15" y2="10" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity={0.5} />
      </svg>
    );
  }

  if (id.includes('axe') || id === 'halberd') {
    return (
      <svg {...svg}>
        {/* Handle */}
        <line x1="5" y1="20" x2="17" y2="8" stroke="white" strokeWidth="1.8" strokeLinecap="round" opacity={0.85} />
        {/* Blade — curved wedge at the head */}
        <path d="M15 6 C17 2 22 4 21 10 L17 8 Z" fill="white" opacity={0.85} />
      </svg>
    );
  }

  if (id === 'warhammer' || id === 'iron-mace' || id === 'morning-star') {
    return (
      <svg {...svg}>
        {/* Handle */}
        <line x1="5" y1="20" x2="15" y2="10" stroke="white" strokeWidth="1.8" strokeLinecap="round" opacity={0.85} />
        {/* Head — block rotated 45° */}
        <rect x="13" y="5" width="8" height="6" rx="1" transform="rotate(-45 17 8)" fill="white" opacity={0.85} />
      </svg>
    );
  }

  // Default: sword / dagger / blade
  return (
    <svg {...svg}>
      {/* Blade */}
      <line x1="5" y1="20" x2="20" y2="4" stroke="white" strokeWidth="2" strokeLinecap="round" opacity={0.9} />
      {/* Crossguard — perpendicular to blade at ~25% from pommel */}
      <line x1="7" y1="14" x2="11" y2="18" stroke="white" strokeWidth="1.6" strokeLinecap="round" opacity={0.6} />
      {/* Pommel */}
      <circle cx="4" cy="21" r="1.5" fill="white" opacity={0.6} />
    </svg>
  );
}

const InventoryHUD: React.FC<Props> = ({ gameState }) => {
  const { player, phase, language } = gameState;

  if (phase === 'language-select' || phase === 'post-escape') return null;

  const T = getT(language);
  const localizedItems = getItems(language);

  const localName = (item: Item) => localizedItems[item.id]?.name ?? item.name;

  const { equipped, inventory } = player;

  const weapons: HudEntry[] = [];
  if (equipped.weapon) weapons.push({ item: equipped.weapon, isEquipped: true });
  inventory.filter(i => i.type === 'weapon').forEach(i => weapons.push({ item: i, isEquipped: false }));

  const armors: HudEntry[] = [];
  if (equipped.body) armors.push({ item: equipped.body, isEquipped: true });
  if (equipped.offhand) armors.push({ item: equipped.offhand, isEquipped: true });
  if (equipped.necklace) armors.push({ item: equipped.necklace, isEquipped: true });
  inventory.filter(i => i.type === 'armor').forEach(i => armors.push({ item: i, isEquipped: false }));

  const consumableMap = new Map<string, { count: number; heal: number | undefined }>();
  inventory.filter(i => i.type === 'consumable').forEach(i => {
    const n = localName(i);
    const prev = consumableMap.get(n);
    consumableMap.set(n, { count: (prev?.count ?? 0) + 1, heal: i.healAmount });
  });

  return (
    <div className="inventory-hud">
      <div className="hud-title">{T.invHud.title}</div>

      <div className="hud-section">
        <div className="hud-section-label">{T.invHud.weapons}</div>
        {weapons.length === 0 ? <span className="hud-empty">—</span> : weapons.map((w, i) => (
          <div key={i} className="hud-item">
            <WeaponIcon id={w.item.id} />
            {w.isEquipped && <span className="hud-eq">{T.invHud.equipped}</span>}
            <span className="hud-name">{localName(w.item)}</span>
            {weaponStat(w.item) && <span className="hud-stat">{weaponStat(w.item)}</span>}
          </div>
        ))}
      </div>

      <div className="hud-section">
        <div className="hud-section-label">{T.invHud.armor}</div>
        {armors.length === 0 ? <span className="hud-empty">—</span> : armors.map((a, i) => (
          <div key={i} className="hud-item">
            {a.isEquipped && <span className="hud-eq">{T.invHud.equipped}</span>}
            <span className="hud-name">{localName(a.item)}</span>
            {armorStat(a.item) && <span className="hud-stat">{armorStat(a.item)}</span>}
          </div>
        ))}
      </div>

      <div className="hud-section">
        <div className="hud-section-label">{T.invHud.consumables}</div>
        {consumableMap.size === 0 ? <span className="hud-empty">—</span> : (
          Array.from(consumableMap.entries()).map(([n, { count, heal }]) => (
            <div key={n} className="hud-item">
              <span className="hud-name">{n}</span>
              {heal !== undefined && <span className="hud-stat hud-stat-heal">+{heal} HP</span>}
              {count > 1 && <span className="hud-count">×{count}</span>}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default InventoryHUD;
