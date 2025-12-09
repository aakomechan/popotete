// Pokemon Battle System - Worker with Auth, Database, and Real-time PvP

// Battle Data
type MonsterType = string;
interface MoveTemplate {
  id: string;
  name: string;
  type: MonsterType;
  power: number;
  accuracy: number;
  pp: number;
  priority: number;
  effect?: {
    type: 'buff' | 'debuff';
    stat: 'atk' | 'def' | 'spd' | 'crit' | 'evade';
    stages: number;
    target: 'self' | 'opponent';
  };
}

