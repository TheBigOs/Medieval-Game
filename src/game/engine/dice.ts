export function rollDice(expression: string): { rolls: number[]; total: number } {
  const match = expression.match(/^(\d+)d(\d+)([+-]\d+)?$/i);
  if (!match) return { rolls: [0], total: 0 };

  const count = parseInt(match[1]);
  const sides = parseInt(match[2]);
  const modifier = match[3] ? parseInt(match[3]) : 0;

  const rolls: number[] = [];
  for (let i = 0; i < count; i++) {
    rolls.push(Math.floor(Math.random() * sides) + 1);
  }

  const total = Math.max(0, rolls.reduce((a, b) => a + b, 0) + modifier);
  return { rolls, total };
}

export function d20(): number {
  return Math.floor(Math.random() * 20) + 1;
}

export function statMod(stat: number): number {
  return Math.floor((stat - 10) / 2);
}
