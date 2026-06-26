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

  // Group consumables: name → { count, healAmount }
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
