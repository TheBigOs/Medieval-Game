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

// ── Icons ──────────────────────────────────────────────────────────────────

const ICON_PROPS = {
  width: 28, height: 28,
  viewBox: '0 0 24 24',
  fill: 'none',
  className: 'hud-item-icon',
};

function WeaponIcon({ id }: { id: string }) {
  if (id === 'enchanted-staff') {
    return (
      <svg {...ICON_PROPS}>
        <line x1="12" y1="22" x2="12" y2="9" stroke="white" strokeWidth="1.8" strokeLinecap="round" opacity={0.85} />
        <circle cx="12" cy="6" r="3" stroke="white" strokeWidth="1.6" opacity={0.85} />
        <line x1="9" y1="10" x2="15" y2="10" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity={0.5} />
      </svg>
    );
  }
  if (id.includes('axe') || id === 'halberd') {
    return (
      <svg {...ICON_PROPS}>
        <line x1="5" y1="20" x2="17" y2="8" stroke="white" strokeWidth="1.8" strokeLinecap="round" opacity={0.85} />
        <path d="M15 6 C17 2 22 4 21 10 L17 8 Z" fill="white" opacity={0.85} />
      </svg>
    );
  }
  if (id === 'warhammer' || id === 'iron-mace' || id === 'morning-star') {
    return (
      <svg {...ICON_PROPS}>
        <line x1="5" y1="20" x2="15" y2="10" stroke="white" strokeWidth="1.8" strokeLinecap="round" opacity={0.85} />
        <rect x="13" y="5" width="8" height="6" rx="1" transform="rotate(-45 17 8)" fill="white" opacity={0.85} />
      </svg>
    );
  }
  // Sword / dagger / blade (default)
  return (
    <svg {...ICON_PROPS}>
      <line x1="5" y1="20" x2="20" y2="4" stroke="white" strokeWidth="2" strokeLinecap="round" opacity={0.9} />
      <line x1="7" y1="14" x2="11" y2="18" stroke="white" strokeWidth="1.6" strokeLinecap="round" opacity={0.6} />
      <circle cx="4" cy="21" r="1.5" fill="white" opacity={0.6} />
    </svg>
  );
}

function ArmorIcon({ item }: { item: Item }) {
  // Necklace / trinket — gem diamond
  if (item.slot === 'necklace') {
    return (
      <svg {...ICON_PROPS}>
        <path d="M12 2 L20 9 L12 22 L4 9 Z" stroke="white" strokeWidth="1.5" opacity={0.85} />
        <line x1="4" y1="9" x2="20" y2="9" stroke="white" strokeWidth="0.9" opacity={0.45} />
        <line x1="12" y1="2" x2="4" y2="9" stroke="white" strokeWidth="0.9" opacity={0.35} />
        <line x1="12" y1="2" x2="20" y2="9" stroke="white" strokeWidth="0.9" opacity={0.35} />
      </svg>
    );
  }
  // Holy relic (offhand) — cross
  if (item.id === 'holy-relic') {
    return (
      <svg {...ICON_PROPS}>
        <line x1="12" y1="3" x2="12" y2="21" stroke="white" strokeWidth="2" strokeLinecap="round" opacity={0.85} />
        <line x1="6" y1="9" x2="18" y2="9" stroke="white" strokeWidth="2" strokeLinecap="round" opacity={0.85} />
        <circle cx="12" cy="12" r="1.5" fill="white" opacity={0.4} />
      </svg>
    );
  }
  // Shields (offhand)
  if (item.slot === 'offhand') {
    return (
      <svg {...ICON_PROPS}>
        <path d="M12 3 L19 7 L19 15 L12 21 L5 15 L5 7 Z" stroke="white" strokeWidth="1.6" opacity={0.85} />
        <circle cx="12" cy="12" r="2.5" fill="white" opacity={0.65} />
      </svg>
    );
  }
  // Body armor — breastplate
  return (
    <svg {...ICON_PROPS}>
      <path d="M7 21 L5 10 L7 5 L12 4 L17 5 L19 10 L17 21 Z" stroke="white" strokeWidth="1.5" opacity={0.85} />
      <path d="M7 5 Q10 3 12 4 Q14 3 17 5" stroke="white" strokeWidth="1.4" strokeLinecap="round" opacity={0.7} />
      <line x1="9" y1="7" x2="15" y2="7" stroke="white" strokeWidth="0.9" opacity={0.4} />
    </svg>
  );
}

function ConsumableIcon({ id }: { id: string }) {
  // Grimoire — book with flame
  if (id === 'grimoire') {
    return (
      <svg {...ICON_PROPS}>
        <rect x="5" y="3" width="13" height="18" rx="1" stroke="white" strokeWidth="1.5" opacity={0.85} />
        <line x1="5" y1="3" x2="5" y2="21" stroke="white" strokeWidth="3" strokeLinecap="round" opacity={0.85} />
        <path d="M12 17 C10 14 13 11 12 8 C14 11 15 14 12 17 Z" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity={0.7} />
      </svg>
    );
  }
  // God apple — apple with leaf
  if (id === 'god-apple') {
    return (
      <svg {...ICON_PROPS} className="hud-item-icon hud-icon-special">
        <path d="M12 9 C7 9 4 13 5 17 C6 21 9 23 12 22 C15 23 18 21 19 17 C20 13 17 9 12 9 Z"
              stroke="white" strokeWidth="1.5" opacity={0.95} />
        <line x1="12" y1="9" x2="12" y2="6" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity={0.9} />
        <path d="M12 6 C13 3 17 4 16 7" stroke="white" strokeWidth="1.3" fill="none" strokeLinecap="round" opacity={0.85} />
        <path d="M9.5 9.5 Q12 7.5 14.5 9.5" stroke="white" strokeWidth="0.9" opacity={0.45} />
      </svg>
    );
  }
  // Bread — rounded loaf
  if (id === 'bread-loaf') {
    return (
      <svg {...ICON_PROPS}>
        <path d="M4 15 Q4 7 12 6 Q20 7 20 15 L20 19 Q12 21 4 19 Z" stroke="white" strokeWidth="1.5" opacity={0.85} />
        <path d="M9 7 L8 19" stroke="white" strokeWidth="0.9" opacity={0.4} />
        <path d="M15 7 L16 19" stroke="white" strokeWidth="0.9" opacity={0.4} />
      </svg>
    );
  }
  // Healing herbs — leaf
  if (id === 'healing-herbs') {
    return (
      <svg {...ICON_PROPS}>
        <path d="M12 3 C6 5 5 14 12 16 C19 14 18 5 12 3 Z" stroke="white" strokeWidth="1.5" opacity={0.85} />
        <line x1="12" y1="3" x2="12" y2="16" stroke="white" strokeWidth="0.9" opacity={0.45} />
        <line x1="12" y1="16" x2="12" y2="21" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity={0.85} />
      </svg>
    );
  }
  // Potion (health-potion, greater-health-potion, holy-water — default)
  return (
    <svg {...ICON_PROPS}>
      <rect x="10" y="2" width="4" height="3" rx="0.8" fill="white" opacity={0.65} />
      <line x1="10" y1="5" x2="9" y2="8" stroke="white" strokeWidth="1.4" strokeLinecap="round" opacity={0.8} />
      <line x1="14" y1="5" x2="15" y2="8" stroke="white" strokeWidth="1.4" strokeLinecap="round" opacity={0.8} />
      <path d="M9 8 Q4 12 5 17 Q6 22 12 22 Q18 22 19 17 Q20 12 15 8 Z"
            stroke="white" strokeWidth="1.5" opacity={0.85} />
      <path d="M7 16 Q12 19 17 16" stroke="white" strokeWidth="0.9" opacity={0.35} />
    </svg>
  );
}

// ── Component ──────────────────────────────────────────────────────────────

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

  // Group consumables: name → { count, healAmount, id }
  const consumableMap = new Map<string, { count: number; heal: number | undefined; id: string }>();
  inventory.filter(i => i.type === 'consumable').forEach(i => {
    const n = localName(i);
    const prev = consumableMap.get(n);
    consumableMap.set(n, { count: (prev?.count ?? 0) + 1, heal: i.healAmount, id: prev?.id ?? i.id });
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
            <ArmorIcon item={a.item} />
            {a.isEquipped && <span className="hud-eq">{T.invHud.equipped}</span>}
            <span className="hud-name">{localName(a.item)}</span>
            {armorStat(a.item) && <span className="hud-stat">{armorStat(a.item)}</span>}
          </div>
        ))}
      </div>

      <div className="hud-section">
        <div className="hud-section-label">{T.invHud.consumables}</div>
        {consumableMap.size === 0 ? <span className="hud-empty">—</span> : (
          Array.from(consumableMap.entries()).map(([n, { count, heal, id }]) => (
            <div key={n} className="hud-item">
              <ConsumableIcon id={id} />
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
