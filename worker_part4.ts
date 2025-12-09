interface MonsterTemplate {
  id: string;
  name: string;
  type: MonsterType;
  baseStats: { hp: number; atk: number; def: number; spd: number; };
  movePool: string[];
  spriteUrl: string;
}
