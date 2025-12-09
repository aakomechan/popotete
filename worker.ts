// Pokemon Battle System - Worker with Auth, Database, and Real-time PvP

// Showdown完全データをインポート（データのみ）
import {
  EXTRACTED_TYPE_CHART as SHOWDOWN_TYPE_CHART,
  EXTRACTED_POKEDEX as SHOWDOWN_POKEDEX,
  EXTRACTED_MOVES as SHOWDOWN_MOVES,
  EXTRACTED_LEARNSETS,
  EXTRACTED_SETS,
  EXTRACTED_ABILITIES,
  EXTRACTED_ITEMS,
} from './showdown-extracted-data';


// Battle Data
type MonsterType = 'normal' | 'fire' | 'water' | 'grass' | 'electric' | 'ice' |
  'fighting' | 'poison' | 'ground' | 'flying' | 'psychic' | 'bug' |
  'rock' | 'ghost' | 'dragon' | 'dark' | 'steel' | 'fairy' | string;

// 天候タイプ
type WeatherType = 'sun' | 'rain' | 'sand' | 'snow' | null;

interface MoveTemplate {
  id: string;
  name: string;
  type: MonsterType;
  power: number;
  accuracy: number | true;
  pp: number;
  priority: number;
  category: 'physical' | 'special' | 'status' | string;
  description: string;
  drain?: [number, number];
  recoil?: [number, number];
  secondary?: {
    chance?: number;
    status?: string;
    boosts?: Record<string, number>;
  } | null;
  boosts?: Record<string, number>;
  self?: {
    boosts?: Record<string, number>;
  };
  target?: string;
  flags?: Record<string, number>;
  status?: string;
  heal?: [number, number];
}

interface MonsterTemplate {
  id: string;
  name: string;
  type: MonsterType;
  type2?: MonsterType;
  baseStats: { hp: number; atk: number; def: number; spa: number; spd: number; spe: number; };
  movePool: string[]; // 習得可能な技IDのリスト
  spriteUrl?: string;
  abilities?: string[];
}

// Generated Data - Using extracted Showdown data
// TYPE_CHART, MOVE_TEMPLATES, MONSTER_TEMPLATES now use Showdown's complete data
// string型も受け入れるためにキャスト
const TYPE_CHART: Record<string, Record<string, number>> = SHOWDOWN_TYPE_CHART as Record<string, Record<string, number>>;

const ABILITIES = EXTRACTED_ABILITIES;
const ITEMS = EXTRACTED_ITEMS;
// MOVE_TEMPLATES - Showdownの完全データを使用
// 日本語名・効果説明付き（714技）
const MOVE_TEMPLATES: MoveTemplate[] = SHOWDOWN_MOVES.map((m: any) => ({
  id: m.id,
  name: m.name,
  type: m.type,
  power: m.power,
  accuracy: m.accuracy,
  pp: m.pp,
  priority: m.priority,
  category: m.category,
  drain: m.drain,
  recoil: m.recoil,
  secondary: m.secondary,
  boosts: m.boosts,
  self: m.self,
  target: m.target,
  description: m.desc || m.shortDesc || '',
  flags: m.flags,
}));

// MONSTER_TEMPLATES - Showdownの完全データを使用
// 日本語名付き（1118ポケモン）
const MONSTER_TEMPLATES: MonsterTemplate[] = SHOWDOWN_POKEDEX.map(p => {
  let movePool: string[] = [];
  if (EXTRACTED_SETS[p.id]) {
    const sets = EXTRACTED_SETS[p.id] as any;
    for (const setName in sets) {
      if (sets[setName].moves) {
        movePool.push(...sets[setName].moves);
      }
    }
  }
  if (EXTRACTED_LEARNSETS[p.id]) {
    movePool.push(...EXTRACTED_LEARNSETS[p.id]);
  }
  movePool = Array.from(new Set(movePool)).filter(id => SHOWDOWN_MOVES.some(m => m.id === id));
  if (movePool.length === 0) movePool = ['tackle'];

  return {
    id: p.id,
    name: p.name,
    type: p.type,
    type2: p.type2,
    baseStats: {
      hp: p.baseStats.hp,
      atk: p.baseStats.atk,
      def: p.baseStats.def,
      spa: p.baseStats.spa,
      spd: p.baseStats.spd,
      spe: p.baseStats.spe,
    },
    movePool,
    abilities: p.abilities,
    spriteUrl: `https://play.pokemonshowdown.com/sprites/ani/${p.id}.gif`,
  };
});

// Battle Engine (6ステータス対応版)
interface BattleMonster {
  unique_id: string;
  template_id: string;
  nickname: string;
  type: MonsterType;
  type2?: MonsterType;  // デュアルタイプ
  hp_current: number;
  hp_max: number;
  current_atk: number;  // 攻撃
  current_def: number;  // 防御
  current_spa: number;  // 特攻
  current_spd: number;  // 特防
  current_spe: number;  // 素早さ
  moves: MoveTemplate[];
  movePP: number[];  // 残りPP
  buffs: { atk: number; def: number; spa: number; spd: number; spe: number; crit: number; evade: number; };
  spriteUrl: string;
  level: number;
  ability: string;
  abilityName?: string;
  abilityDescription?: string;
  item: string;
  itemName?: string;
  itemDescription?: string;
  status?: 'brn' | 'par' | 'psn' | 'tox' | 'frz' | 'slp';  // 状態異常（tox=もうどく）
  toxicTurns?: number;  // もうどくの経過ターン数
  volatiles?: {  // 一時的状態（交代で解除）
    confusion?: number;  // 残りターン数
    leechSeed?: boolean;  // やどりぎのタネ
    substitute?: number;  // みがわりHP
    protect?: boolean;  // まもる
    protectCount?: number;  // まもる連続使用回数
    encore?: { moveId: string; turns: number; };
    taunt?: { turns: number; };
  };
}

// PlayerState、BattleAction、BattleEvent、BattleState、SerializedBattleState interfaces
interface PlayerState {
  id: string;
  name: string;
  team: BattleMonster[];
  activeSlot: number;
  ready: boolean;
  action?: BattleAction;
  hazards?: {  // 設置技
    stealthRock?: boolean;
    spikes?: number;  // 0-3層
    toxicSpikes?: number; // どくびし（回数）
  };
  lastMove?: string;
}

interface BattleAction {
  type: 'move' | 'switch';
  moveId?: string;
  target?: number;
}

interface BattleEvent {
  type: string;
  [key: string]: any;
}

interface BattleState {
  phase: 'selection' | 'animation' | 'forced_switch' | 'end';
  turn: number;
  players: { [id: string]: PlayerState; };
  events: BattleEvent[];
  winner?: string;
  forcedSwitchPlayer?: string;
  // 天候システム
  weather?: WeatherType;
  weatherTurns?: number;  // 残りターン数
}

interface SerializedBattleState {
  seed: number;
  turn: number;
  phase: string;
  players: { [id: string]: any; };
  choices: any[];
  forcedSwitchPlayer?: string;
}

// ...

class BattleEngine {
  private seed: number;

  constructor(seed?: number) {
    this.seed = seed ?? Math.floor(Math.random() * 0x7fffffff);
  }

  private random(): number {
    this.seed = (this.seed * 1103515245 + 12345) & 0x7fffffff;
    return this.seed / 0x7fffffff;
  }

  createMonster(template: MonsterTemplate, level: number = 50): BattleMonster {
    // Pokemon formula for stats
    const calcHP = (base: number) => Math.floor((2 * base + 31) * level / 100 + level + 10);
    const calcStat = (base: number) => Math.floor((2 * base + 31) * level / 100 + 5);

    const hp = calcHP(template.baseStats.hp);
    const atk = calcStat(template.baseStats.atk);
    const def = calcStat(template.baseStats.def);
    const spa = calcStat((template.baseStats as any).spa ?? template.baseStats.atk);  // fallback
    const spd = calcStat((template.baseStats as any).spd ?? template.baseStats.def);  // fallback
    const spe = calcStat((template.baseStats as any).spe ?? (template.baseStats as any).spd ?? 50);  // fallback

    const availableMoves = (template.movePool ?? [])
      .map(id => MOVE_TEMPLATES.find(m => m.id === id))
      .filter((m): m is MoveTemplate => m !== undefined);

    const shuffled = [...availableMoves].sort(() => this.random() - 0.5);
    const selectedMoves = shuffled.slice(0, Math.min(4, shuffled.length));

    // Select random ability if multiple
    const ability = template.abilities && template.abilities.length > 0
      ? template.abilities[Math.floor(this.random() * template.abilities.length)]
      : 'unknown';

    const abilityData = (ABILITIES as any[]).find(a => a.id === ability);

    return {
      unique_id: `${template.id}_${Math.floor(this.random() * 10000)}`,
      template_id: template.id,
      nickname: template.name,
      type: template.type,
      type2: (template as any).type2,
      hp_current: hp,
      hp_max: hp,
      current_atk: atk,
      current_def: def,
      current_spa: spa,
      current_spd: spd,
      current_spe: spe,
      moves: selectedMoves,
      movePP: selectedMoves.map(m => m.pp),
      buffs: { atk: 0, def: 0, spa: 0, spd: 0, spe: 0, crit: 0, evade: 0 },
      spriteUrl: template.spriteUrl ?? '',
      level,
      ability,
      item: '',
    };
  }

  generateTeam(size: number = 3): BattleMonster[] {
    const shuffled = [...MONSTER_TEMPLATES].sort(() => this.random() - 0.5);
    const selected = shuffled.slice(0, size);
    return selected.map(t => this.createMonster(t, 50));
  }

  getStat(mon: BattleMonster, stat: 'atk' | 'def' | 'spa' | 'spd' | 'spe'): number {
    let base: number;
    switch (stat) {
      case 'atk': base = mon.current_atk; break;
      case 'def': base = mon.current_def; break;
      case 'spa': base = mon.current_spa; break;
      case 'spd': base = mon.current_spd; break;
      case 'spe': base = mon.current_spe; break;
    }

    const buff = mon.buffs[stat];
    const clampedBuff = Math.max(-6, Math.min(6, buff));
    // Pokemon式: +1で1.5倍、+2で2倍...
    const multiplier = clampedBuff >= 0
      ? (2 + clampedBuff) / 2
      : 2 / (2 - clampedBuff);
    let val = Math.floor(base * multiplier);

    // Choice Items (Speed/Atk boost)
    if (mon.item === 'choicescarf' && stat === 'spe') {
      val = Math.floor(val * 1.5);
    } else if (mon.item === 'choiceband' && stat === 'atk') {
      val = Math.floor(val * 1.5);
    } else if (mon.item === 'choicespecs' && stat === 'spa') {
      val = Math.floor(val * 1.5);
    }

    return val;
  }

  triggerItem(mon: BattleMonster, trigger: 'onTurnEnd' | 'onDamage', context?: any): BattleEvent[] {
    const events: BattleEvent[] = [];

    if (trigger === 'onTurnEnd') {
      if (mon.item === 'leftovers' && mon.hp_current < mon.hp_max && mon.hp_current > 0) {
        const heal = Math.floor(mon.hp_max / 16) || 1;
        mon.hp_current = Math.min(mon.hp_max, mon.hp_current + heal);
        events.push({
          type: 'text',
          message: `${mon.nickname}は たべのこしで かいふくした！`
        });
      }
    }

    return events;
  }

  // 特性発動処理
  triggerAbility(
    mon: BattleMonster,
    trigger: 'onSwitchIn' | 'onBeforeMove' | 'onTurnEnd',
    context?: { opponent?: BattleMonster; state?: BattleState; }
  ): BattleEvent[] {
    const events: BattleEvent[] = [];
    const ability = mon.ability?.toLowerCase().replace(/\s+/g, '');

    if (trigger === 'onSwitchIn') {
      // いかく (Intimidate) - 登場時、相手の攻撃-1
      if (ability === 'intimidate' && context?.opponent) {
        const opponent = context.opponent;
        opponent.buffs.atk = Math.max(-6, opponent.buffs.atk - 1);
        events.push({
          type: 'ability',
          abilityName: 'いかく',
          pokemonName: mon.nickname,
          message: `${mon.nickname}の いかく！`,
        });
        events.push({
          type: 'stat_change',
          targetId: opponent.unique_id,
          targetName: opponent.nickname,
          stat: 'atk',
          stages: -1,
        });
      }

      // ひでり (Drought) - 晴れにする
      if (ability === 'drought' && context?.state) {
        context.state.weather = 'sun';
        context.state.weatherTurns = 5;
        events.push({
          type: 'ability',
          abilityName: 'ひでり',
          pokemonName: mon.nickname,
          message: `${mon.nickname}の ひでり！`,
        });
        events.push({
          type: 'weather',
          weather: 'sun',
          message: 'ひざしが つよくなった！',
        });
      }

      // あめふらし (Drizzle) - 雨にする
      if (ability === 'drizzle' && context?.state) {
        context.state.weather = 'rain';
        context.state.weatherTurns = 5;
        events.push({
          type: 'ability',
          abilityName: 'あめふらし',
          pokemonName: mon.nickname,
          message: `${mon.nickname}の あめふらし！`,
        });
        events.push({
          type: 'weather',
          weather: 'rain',
          message: 'あめが ふりはじめた！',
        });
      }

      // すなおこし (Sand Stream) - 砂嵐にする
      if (ability === 'sandstream' && context?.state) {
        context.state.weather = 'sand';
        context.state.weatherTurns = 5;
        events.push({
          type: 'ability',
          abilityName: 'すなおこし',
          pokemonName: mon.nickname,
          message: `${mon.nickname}の すなおこし！`,
        });
        events.push({
          type: 'weather',
          weather: 'sand',
          message: 'すなあらしが ふきはじめた！',
        });
      }

      // ゆきふらし (Snow Warning) - 雪にする
      if (ability === 'snowwarning' && context?.state) {
        context.state.weather = 'snow';
        context.state.weatherTurns = 5;
        events.push({
          type: 'ability',
          abilityName: 'ゆきふらし',
          pokemonName: mon.nickname,
          message: `${mon.nickname}の ゆきふらし！`,
        });
        events.push({
          type: 'weather',
          weather: 'snow',
          message: 'ゆきが ふりはじめた！',
        });
      }
    }

    return events;
  }

  // 特性による攻撃無効化判定
  checkAbilityImmunity(
    defender: BattleMonster,
    move: MoveTemplate
  ): { isImmune: boolean; absorb?: 'heal' | 'boost'; events: BattleEvent[]; } {
    const events: BattleEvent[] = [];
    const ability = defender.ability?.toLowerCase().replace(/\s+/g, '');

    // もらいび (Flash Fire) - 炎技無効、炎技威力上昇
    if (ability === 'flashfire' && move.type === 'fire') {
      events.push({
        type: 'ability',
        abilityName: 'もらいび',
        pokemonName: defender.nickname,
        message: `${defender.nickname}の もらいびで 炎技を 吸収した！`,
      });
      return { isImmune: true, absorb: 'boost', events };
    }

    // ぼうだん (Bulletproof) - 弾丸技無効
    if (ability === 'bulletproof' && (move as any).flags?.bullet) {
      events.push({
        type: 'ability',
        abilityName: 'ぼうだん',
        pokemonName: defender.nickname,
        message: `${defender.nickname}の ぼうだんで 弾丸技を 防いだ！`,
      });
      return { isImmune: true, events };
    }

    // ぼうおん (Soundproof) - 音技無効
    if (ability === 'soundproof' && (move as any).flags?.sound) {
      events.push({
        type: 'ability',
        abilityName: 'ぼうおん',
        pokemonName: defender.nickname,
        message: `${defender.nickname}の ぼうおんで 音技を 防いだ！`,
      });
      return { isImmune: true, events };
    }

    // ちょすい (Water Absorb) - 水技無効、HP回復
    if (ability === 'waterabsorb' && move.type === 'water') {
      const healAmount = Math.floor(defender.hp_max / 4);
      defender.hp_current = Math.min(defender.hp_max, defender.hp_current + healAmount);
      events.push({
        type: 'ability',
        abilityName: 'ちょすい',
        pokemonName: defender.nickname,
        message: `${defender.nickname}の ちょすいで HPが 回復した！`,
      });
      events.push({
        type: 'heal',
        targetId: defender.unique_id,
        targetName: defender.nickname,
        amount: healAmount,
        newHp: defender.hp_current,
        maxHp: defender.hp_max,
      });
      return { isImmune: true, absorb: 'heal', events };
    }

    // ふゆう (Levitate) - 地面技無効
    if (ability === 'levitate' && move.type === 'ground') {
      events.push({
        type: 'ability',
        abilityName: 'ふゆう',
        pokemonName: defender.nickname,
        message: `${defender.nickname}は ふゆうで 地面技を 受けない！`,
      });
      return { isImmune: true, events };
    }

    // でんきエンジン (Motor Drive) - 電気技無効、素早さ上昇
    if (ability === 'motordrive' && move.type === 'electric') {
      defender.buffs.spe = Math.min(6, defender.buffs.spe + 1);
      events.push({
        type: 'ability',
        abilityName: 'でんきエンジン',
        pokemonName: defender.nickname,
        message: `${defender.nickname}の でんきエンジンで 素早さが 上がった！`,
      });
      events.push({
        type: 'stat_change',
        targetId: defender.unique_id,
        targetName: defender.nickname,
        stat: 'spe',
        stages: 1,
      });
      return { isImmune: true, absorb: 'boost', events };
    }

    return { isImmune: false, events: [] };
  }


  calculateDamage(
    attacker: BattleMonster,
    defender: BattleMonster,
    move: MoveTemplate,
    weather?: WeatherType
  ): { damage: number; isCrit: boolean; effectiveness: number; isStab: boolean; } {
    // 変化技はダメージなし
    if (move.power === 0 || (move as any).category === 'status') {
      return { damage: 0, isCrit: false, effectiveness: 1, isStab: false };
    }

    // 物理/特殊に応じたステータスを使用
    const category = (move as any).category || 'physical';
    const isPhysical = category === 'physical';
    const atkStat = isPhysical ? this.getStat(attacker, 'atk') : this.getStat(attacker, 'spa');
    const defStat = isPhysical ? this.getStat(defender, 'def') : this.getStat(defender, 'spd');

    // やけど状態は物理攻撃力半減
    const burnPenalty = (attacker.status === 'brn' && isPhysical) ? 0.5 : 1.0;

    const power = move.power;

    // タイプ相性（デュアルタイプ対応）
    let effectiveness = TYPE_CHART[move.type]?.[defender.type] ?? 1;
    if (defender.type2) {
      effectiveness *= TYPE_CHART[move.type]?.[defender.type2] ?? 1;
    }

    // STAB (Same Type Attack Bonus) - タイプ一致で1.5倍
    const isStab = move.type === attacker.type || move.type === attacker.type2;
    const stabMultiplier = isStab ? 1.5 : 1.0;

    // 急所 (6.25% base chance)
    const critChance = 0.0625 + (attacker.buffs.crit * 0.05);
    const isCrit = this.random() < critChance;
    const critMultiplier = isCrit ? 1.5 : 1.0;

    // ランダム補正 (0.85 - 1.0)
    const randomFactor = 0.85 + this.random() * 0.15;

    // 特性によるブースト
    let abilityMultiplier = 1.0;
    const atkAbility = attacker.ability?.toLowerCase().replace(/\s+/g, '');
    const defAbility = defender.ability?.toLowerCase().replace(/\s+/g, '');

    // ピンチ特性 (もうか/げきりゅう/しんりょく/むしのしらせ)
    if (attacker.hp_current <= attacker.hp_max / 3) {
      if ((atkAbility === 'blaze' && move.type === 'fire') ||
        (atkAbility === 'torrent' && move.type === 'water') ||
        (atkAbility === 'overgrow' && move.type === 'grass') ||
        (atkAbility === 'swarm' && move.type === 'bug')) {
        abilityMultiplier = 1.5;
      }
    }

    // てきおうりょく (Adaptability) - タイプ一致ボーナスが2倍になる
    // 上で計算したSTABを上書き
    let finalStabMultiplier = stabMultiplier;
    if (atkAbility === 'adaptability' && isStab) {
      finalStabMultiplier = 2.0;
    }

    // ちからもち / ヨガパワー (Huge Power / Pure Power) - 攻撃2倍
    let hugePowerMod = 1.0;
    if ((atkAbility === 'hugepower' || atkAbility === 'purepower') && isPhysical) {
      hugePowerMod = 2.0;
    }

    // テクニシャン (Technician) - 威力60以下の技が1.5倍
    if (atkAbility === 'technician' && move.power <= 60) {
      abilityMultiplier *= 1.5;
    }

    // かたいつめ (Tough Claws) - 接触技1.3倍
    if (atkAbility === 'toughclaws' && (move as any).flags?.contact) {
      abilityMultiplier *= 1.3;
    }

    // てつのこぶし (Iron Fist) - パンチ技1.2倍
    if (atkAbility === 'ironfist' && (move as any).flags?.punch) {
      abilityMultiplier *= 1.2;
    }

    // すてみ (Reckless) - 反動技1.2倍
    if (atkAbility === 'reckless' && (move as any).recoil) {
      abilityMultiplier *= 1.2;
    }

    // いろめがね (Tinted Lens) - 半減を等倍に
    if (atkAbility === 'tintedlens' && effectiveness < 1) {
      abilityMultiplier *= 2.0;
    }

    // スナイパー (Sniper) - 急所で1.5倍追加
    let sniperMod = 1.0;
    if (atkAbility === 'sniper' && isCrit) {
      sniperMod = 1.5;
    }

    // はりきり (Hustle) - 物理技1.5倍 (命中0.8倍は別途処理)
    if (atkAbility === 'hustle' && isPhysical) {
      hugePowerMod *= 1.5;
    }

    // サンパワー (Solar Power) - 晴れで特攻1.5倍 (HPダメージは別途)
    if (atkAbility === 'solarpower' && weather === 'sun' && !isPhysical) {
      hugePowerMod *= 1.5;
    }

    // 防御側特性
    let defAbilityMod = 1.0;

    // あついしぼう (Thick Fat) - 炎/氷半減
    if (defAbility === 'thickfat' && (move.type === 'fire' || move.type === 'ice')) {
      defAbilityMod = 0.5;
    }

    // ハードロック / フィルター (Solid Rock / Filter) - 弱点半減
    if ((defAbility === 'solidrock' || defAbility === 'filter') && effectiveness > 1) {
      defAbilityMod = 0.75;
    }

    // マルチスケイル (Multiscale) - HP満タンでダメージ半減
    if (defAbility === 'multiscale' && defender.hp_current === defender.hp_max) {
      defAbilityMod = 0.5;
    }

    // ふしぎなまもり (Wonder Guard) - 弱点以外無効
    if (defAbility === 'wonderguard' && effectiveness <= 1) {
      return { damage: 0, isCrit, effectiveness, isStab };
    }

    // ファントムガード (Shadow Shield) - HP満タンでダメージ半減
    if (defAbility === 'shadowshield' && defender.hp_current === defender.hp_max) {
      defAbilityMod = 0.5;
    }

    // アイテムによるブースト
    let itemMultiplier = 1.0;
    if (attacker.item === 'lifeorb') {
      itemMultiplier = 1.3;
    } else if (attacker.item === 'expertbelt' && effectiveness > 1) {
      itemMultiplier = 1.2;
    } else if (attacker.item === 'choiceband' && isPhysical) {
      itemMultiplier = 1.5;
    } else if (attacker.item === 'choicespecs' && !isPhysical) {
      itemMultiplier = 1.5;
    }

    // 天候によるダメージ補正
    let weatherMultiplier = 1.0;
    if (weather) {
      if (weather === 'sun') {
        if (move.type === 'fire') weatherMultiplier = 1.5;
        if (move.type === 'water') weatherMultiplier = 0.5;
      } else if (weather === 'rain') {
        if (move.type === 'water') weatherMultiplier = 1.5;
        if (move.type === 'fire') weatherMultiplier = 0.5;
      }
      // 砂嵐・雪は直接ダメージ補正なし（岩タイプ特防1.5倍は別途処理）
    }

    // ポケモン式ダメージ計算
    const level = 50;
    // hugePowerMod は atkStat に適用
    const effectiveAtk = Math.floor(atkStat * hugePowerMod);
    const baseDamage = Math.floor(((2 * level / 5 + 2) * power * effectiveAtk / defStat) / 50 + 2);
    // finalStabMultiplier (てきおうりょく対応), sniperMod, defAbilityMod を追加
    let damage = Math.floor(baseDamage * effectiveness * finalStabMultiplier * critMultiplier * sniperMod * randomFactor * burnPenalty * abilityMultiplier * itemMultiplier * weatherMultiplier * defAbilityMod);

    // 最小1ダメージ
    if (damage < 1) damage = 1;

    return { damage, isCrit, effectiveness, isStab };
  }

  checkAccuracy(move: MoveTemplate): boolean {
    if (move.accuracy === true) return true;
    const accuracy = move.accuracy ?? 100;
    return this.random() * 100 <= accuracy;
  }

  checkEvasion(defender: BattleMonster): boolean {
    const baseDodge = 0.05;
    const evadeBuffBonus = defender.buffs.evade * 0.05;
    const dodgeSynergy = baseDodge * evadeBuffBonus * 0.5;
    const totalDodge = Math.min(baseDodge + evadeBuffBonus + dodgeSynergy, 0.50);
    return this.random() < totalDodge;
  }

  executeTurn(state: BattleState): BattleState {
    console.log('[Battle] executeTurn started');
    const events: BattleEvent[] = [];
    const playerIds = Object.keys(state.players);

    events.push({ type: 'turn_start', turn: state.turn });

    const actions: Array<{
      playerId: string;
      player: PlayerState;
      mon: BattleMonster;
      action: BattleAction;
    }> = [];

    for (const playerId of playerIds) {
      const player = state.players[playerId];
      const mon = player.team[player.activeSlot];
      if (player.action && mon.hp_current > 0) {
        actions.push({ playerId, player, mon, action: player.action });
      }
    }

    actions.sort((a, b) => {
      if (a.action.type === 'switch' && b.action.type !== 'switch') return -1;
      if (b.action.type === 'switch' && a.action.type !== 'switch') return 1;

      if (a.action.type === 'move' && b.action.type === 'move') {
        const moveA = MOVE_TEMPLATES.find(m => m.id === a.action.moveId);
        const moveB = MOVE_TEMPLATES.find(m => m.id === b.action.moveId);
        const priorityA = moveA?.priority ?? 0;
        const priorityB = moveB?.priority ?? 0;

        if (priorityA !== priorityB) return priorityB - priorityA;

        const spdA = this.getStat(a.mon, 'spd');
        const spdB = this.getStat(b.mon, 'spd');
        if (spdA !== spdB) return spdB - spdA;

        return this.random() - 0.5;
      }

      return 0;
    });

    console.log(`[Battle] Actions sorted: ${actions.length}`);
    for (const { playerId, player, mon, action } of actions) {
      console.log(`[Battle] Processing action for ${playerId}: ${action.type}`);
      if (mon.hp_current <= 0) continue;

      const opponentId = playerIds.find(id => id !== playerId)!;
      const opponent = state.players[opponentId];
      const opponentMon = opponent.team[opponent.activeSlot];

      if (action.type === 'switch') {
        const newSlot = action.target!;
        this.runSwitch(player, newSlot, opponentMon, state, events);
      } else if (action.type === 'move') {
        // アンコール判定
        if (mon.volatiles?.encore) {
          action.moveId = mon.volatiles.encore.moveId;
        }
        const move = MOVE_TEMPLATES.find(m => m.id === action.moveId);
        if (!move) continue;

        // 最後に使用した技を記録
        player.lastMove = move.id;

        this.runMove(player, mon, opponentMon, move, state, events);
        console.log(`[Battle] Move executed: ${move.name}, Opponent HP: ${opponentMon.hp_current}`);
      }

      // ひんし判定とゲーム終了判定
      // 攻撃側と防御側の両方をチェック（反動や混乱で攻撃側も倒れる可能性があるため）
      const participants = [player, opponent];
      for (const p of participants) {
        const active = p.team[p.activeSlot];
        if (active.hp_current <= 0) {
          const remaining = p.team.filter(m => m.hp_current > 0);
          if (remaining.length === 0) {
            state.phase = 'end';
            state.winner = (p.id === player.id) ? opponent.id : player.id; // 相手の勝ち
            events.push({
              type: 'battle_end',
              winnerId: state.winner,
              winnerName: state.players[state.winner].name,
            });
            state.events = events;
            return state;
          } else {
            // すでに終了フェーズでなければ強制交代フェーズへ
            if (state.phase !== 'end') {
              state.phase = 'forced_switch';
              state.forcedSwitchPlayer = p.id;
              events.push({
                type: 'forced_switch_request',
                playerId: p.id,
              });
              state.events = events;
              return state;
            }
          }
        }
      }
    }


    for (const playerId of playerIds) {
      state.players[playerId].ready = false;
      state.players[playerId].action = undefined;

      const player = state.players[playerId];
      const mon = player.team[player.activeSlot];
      if (mon && mon.hp_current > 0) {
        // 状態異常によるターン終了時ダメージ
        if (mon.status === 'brn') {
          const burnDamage = Math.floor(mon.hp_max / 16);
          mon.hp_current = Math.max(0, mon.hp_current - burnDamage);
          events.push({
            type: 'text',
            message: `${mon.nickname}は やけどの ダメージを うけた！`,
          });
          events.push({
            type: 'damage',
            targetId: mon.unique_id,
            targetName: mon.nickname,
            amount: burnDamage,
            newHp: mon.hp_current,
            maxHp: mon.hp_max,
            isCrit: false,
            effectiveness: 1,
          });
        } else if (mon.status === 'psn') {
          const poisonDamage = Math.floor(mon.hp_max / 8);
          mon.hp_current = Math.max(0, mon.hp_current - poisonDamage);
          events.push({
            type: 'text',
            message: `${mon.nickname}は どくの ダメージを うけた！`,
          });
          events.push({
            type: 'damage',
            targetId: mon.unique_id,
            targetName: mon.nickname,
            amount: poisonDamage,
            newHp: mon.hp_current,
            maxHp: mon.hp_max,
            isCrit: false,
            effectiveness: 1,
          });
        } else if (mon.status === 'tox') {
          // もうどく: ターン経過でダメージ増加 (1/16, 2/16, 3/16...)
          mon.toxicTurns = (mon.toxicTurns || 0) + 1;
          const toxicDamage = Math.max(1, Math.floor(mon.hp_max * mon.toxicTurns / 16));
          mon.hp_current = Math.max(0, mon.hp_current - toxicDamage);
          events.push({
            type: 'text',
            message: `${mon.nickname}は どくの ダメージを うけた！`,
          });
          events.push({
            type: 'damage',
            targetId: mon.unique_id,
            targetName: mon.nickname,
            amount: toxicDamage,
            newHp: mon.hp_current,
            maxHp: mon.hp_max,
            isCrit: false,
            effectiveness: 1,
          });
        }

        // やどりぎのタネ
        if (mon.volatiles?.leechSeed && mon.hp_current > 0) {
          const leechDamage = Math.max(1, Math.floor(mon.hp_max / 8));
          mon.hp_current = Math.max(0, mon.hp_current - leechDamage);
          events.push({
            type: 'text',
            message: `${mon.nickname}は やどりぎに HPを すいとられた！`,
          });
          events.push({
            type: 'damage',
            targetId: mon.unique_id,
            targetName: mon.nickname,
            amount: leechDamage,
            newHp: mon.hp_current,
            maxHp: mon.hp_max,
            isCrit: false,
            effectiveness: 1,
          });
          // 相手を回復（簡略化：opponnentを探して回復）
          const opponentId = playerIds.find(id => id !== playerId);
          if (opponentId) {
            const oppPlayer = state.players[opponentId];
            const oppMon = oppPlayer.team[oppPlayer.activeSlot];
            if (oppMon.hp_current > 0) {
              const healAmount = Math.min(leechDamage, oppMon.hp_max - oppMon.hp_current);
              oppMon.hp_current = Math.min(oppMon.hp_max, oppMon.hp_current + leechDamage);
              if (healAmount > 0) {
                events.push({
                  type: 'heal',
                  targetId: oppMon.unique_id,
                  targetName: oppMon.nickname,
                  amount: healAmount,
                  newHp: oppMon.hp_current,
                  maxHp: oppMon.hp_max,
                });
              }
            }
          }
        }

        // こんらんターン減少
        if (mon.volatiles?.confusion && mon.volatiles.confusion > 0) {
          mon.volatiles.confusion--;
          if (mon.volatiles.confusion <= 0) {
            delete mon.volatiles.confusion;
            events.push({
              type: 'text',
              message: `${mon.nickname}は こんらんが とけた！`,
            });
          }
        }

        // たべのこし回復
        if (mon.item === 'leftovers' && mon.hp_current < mon.hp_max) {
          const healAmount = Math.floor(mon.hp_max / 16);
          const prevHp = mon.hp_current;
          mon.hp_current = Math.min(mon.hp_max, mon.hp_current + healAmount);
          const healed = mon.hp_current - prevHp;
          if (healed > 0) {
            events.push({
              type: 'text',
              message: `${mon.nickname}は たべのこしで 少し回復した！`,
            });
            events.push({
              type: 'heal',
              targetId: mon.unique_id,
              targetName: mon.nickname,
              amount: healed,
              newHp: mon.hp_current,
              maxHp: mon.hp_max,
            });
          }
        }

        // Trigger onTurnEnd (for other items)
        const turnEndEvents = this.triggerItem(mon, 'onTurnEnd');
        events.push(...turnEndEvents);

        // 状態異常によるひんし判定
        if (mon.hp_current <= 0) {
          events.push({
            type: 'faint',
            targetId: mon.unique_id,
            targetName: mon.nickname,
          });
        }
      }
    }

    // 天候ダメージ処理（砂嵐・雪）
    if (state.weather === 'sand' || state.weather === 'snow') {
      for (const playerId of playerIds) {
        const player = state.players[playerId];
        const mon = player.team[player.activeSlot];
        if (mon.hp_current <= 0) continue;

        // 砂嵐: 岩・地面・鋼タイプ以外に1/16ダメージ
        if (state.weather === 'sand') {
          const immuneTypes = ['rock', 'ground', 'steel'];
          const isImmune = immuneTypes.includes(mon.type) || (mon.type2 && immuneTypes.includes(mon.type2));
          if (!isImmune) {
            const sandDamage = Math.max(1, Math.floor(mon.hp_max / 16));
            mon.hp_current = Math.max(0, mon.hp_current - sandDamage);
            events.push({
              type: 'text',
              message: `${mon.nickname}は すなあらしの ダメージを うけた！`,
            });
            events.push({
              type: 'damage',
              targetId: mon.unique_id,
              targetName: mon.nickname,
              amount: sandDamage,
              newHp: mon.hp_current,
              maxHp: mon.hp_max,
              isCrit: false,
              effectiveness: 1,
            });
            if (mon.hp_current <= 0) {
              events.push({
                type: 'faint',
                targetId: mon.unique_id,
                targetName: mon.nickname,
              });
            }
          }
        }
        // 雪: ダメージなし（あられとは異なる）
      }
    }

    // 天候ターン管理
    if (state.weather && state.weatherTurns !== undefined) {
      state.weatherTurns--;
      if (state.weatherTurns <= 0) {
        const weatherNames: Record<string, string> = {
          sun: 'ひざしが つよい',
          rain: 'あめ',
          sand: 'すなあらし',
          snow: 'ゆき',
        };
        events.push({
          type: 'text',
          message: `${weatherNames[state.weather] || state.weather}が おさまった！`,
        });
        state.weather = null;
        state.weatherTurns = undefined;
      }
    }

    // ターン終了時にまもる状態を解除
    for (const playerId of playerIds) {
      const player = state.players[playerId];
      const mon = player.team[player.activeSlot];
      if (mon.volatiles?.protect) {
        delete mon.volatiles.protect;
      }

      if (mon.volatiles) {
        // アンコール
        if (mon.volatiles.encore) {
          mon.volatiles.encore.turns--;
          if (mon.volatiles.encore.turns <= 0) {
            delete mon.volatiles.encore;
            events.push({
              type: 'text',
              message: `${mon.nickname}の アンコールが とけた！`
            });
          }
        }
        // ちょうはつ
        if (mon.volatiles.taunt) {
          mon.volatiles.taunt.turns--;
          if (mon.volatiles.taunt.turns <= 0) {
            delete mon.volatiles.taunt;
            events.push({
              type: 'text',
              message: `${mon.nickname}の ちょうはつが とけた！`
            });
          }
        }
      }
    }
    return state;
  }

  runMove(player: PlayerState, mon: BattleMonster, opponentMon: BattleMonster, move: MoveTemplate, state: BattleState, events: BattleEvent[]) {
    const protectMoves = ['protect', 'detect', 'kingsshield', 'spikyshield', 'banefulbunker', 'obstruct', 'silktrap'];

    if (!protectMoves.includes(move.id)) {
      if (mon.volatiles) {
        delete mon.volatiles.protectCount;
      }
    }

    // まひ状態の行動不能チェック (1/4の確率でしびれて動けない)
    if (mon.status === 'par' && this.random() < 0.25) {
      events.push({
        type: 'text',
        message: `${mon.nickname}は しびれて うごけない！`,
      });
      return;
    }

    // こおり状態のチェック (行動不能、20%で解凍)
    if (mon.status === 'frz') {
      if (this.random() < 0.20 || (move as any).type === 'fire') {
        mon.status = undefined;
        events.push({
          type: 'text',
          message: `${mon.nickname}の こおりが とけた！`,
        });
      } else {
        events.push({
          type: 'text',
          message: `${mon.nickname}は こおって うごけない！`,
        });
        return;
      }
    }

    // ねむり状態のチェック
    if (mon.status === 'slp') {
      // 簡易実装: 50%で起きる
      if (this.random() < 0.5) {
        mon.status = undefined;
        events.push({
          type: 'text',
          message: `${mon.nickname}は めを さました！`,
        });
      } else {
        events.push({
          type: 'text',
          message: `${mon.nickname}は ぐうぐう ねむっている...`,
        });
        return;
      }
    }

    // こんらん状態のチェック
    if (mon.volatiles?.confusion && mon.volatiles.confusion > 0) {
      events.push({
        type: 'text',
        message: `${mon.nickname}は こんらんしている...`,
      });
      // 33%で自傷ダメージ
      if (this.random() < 0.33) {
        const confusionDamage = Math.max(1, Math.floor(mon.hp_max / 8));
        mon.hp_current = Math.max(0, mon.hp_current - confusionDamage);
        events.push({
          type: 'text',
          message: `${mon.nickname}は こんらんで 自分を 攻撃した！`,
        });
        events.push({
          type: 'damage',
          targetId: mon.unique_id,
          targetName: mon.nickname,
          amount: confusionDamage,
          newHp: mon.hp_current,
          maxHp: mon.hp_max,
          isCrit: false,
          effectiveness: 1,
        });
        if (mon.hp_current <= 0) {
          events.push({
            type: 'faint',
            targetId: mon.unique_id,
            targetName: mon.nickname,
          });
        }
        return;
      }
    }

    // ちょうはつ判定
    if (mon.volatiles?.taunt && move.category === 'Status') {
      events.push({
        type: 'text',
        message: `${mon.nickname}は ちょうはつされていて ${move.name}が 出せない！`,
      });
      return;
    }

    events.push({
      type: 'move_announce',
      actorId: mon.unique_id,
      actorName: mon.nickname,
      moveName: move.name,
      moveType: move.type,
    });

    if (opponentMon.hp_current <= 0) return;

    if (!this.checkAccuracy(move)) {
      events.push({
        type: 'text',
        message: 'しかし 攻撃は はずれた！',
      });
      return;
    }

    // 変化技の処理
    if (move.category === 'Status') {
      // 天候変化
      if (['sunnyday', 'raindance', 'sandstorm', 'hail'].includes(move.id)) {
        const weatherMap: Record<string, WeatherType> = {
          'sunnyday': 'sun',
          'raindance': 'rain',
          'sandstorm': 'sand',
          'hail': 'snow'
        };
        const newWeather = weatherMap[move.id];
        state.weather = newWeather;
        state.weatherTurns = 5;
        const weatherMessages: Record<string, string> = {
          'sun': '日差しが 強くなった！',
          'rain': '雨が 降り始めた！',
          'sand': '砂あらしが 吹き荒れた！',
          'snow': '雪が 降り始めた！'
        };
        events.push({
          type: 'text',
          message: weatherMessages[newWeather]
        });
      }

      // やどりぎのタネ
      if (move.id === 'leechseed') {
        if (opponentMon.type === 'grass' || opponentMon.type2 === 'grass') {
          events.push({
            type: 'text',
            message: 'しかし うまくきまらなかった！'
          });
        } else if (opponentMon.volatiles?.leechSeed) {
          events.push({
            type: 'text',
            message: 'しかし うまくきまらなかった！'
          });
        } else {
          if (!opponentMon.volatiles) opponentMon.volatiles = {};
          opponentMon.volatiles.leechSeed = true;
          events.push({
            type: 'text',
            message: `${opponentMon.nickname}に やどりぎのタネを 植え付けた！`
          });
        }
      }

      // どくどく
      if (move.id === 'toxic') {
        if (opponentMon.type === 'poison' || opponentMon.type2 === 'poison' || opponentMon.type === 'steel' || opponentMon.type2 === 'steel') {
          events.push({
            type: 'text',
            message: 'しかし うまくきまらなかった！'
          });
        } else {
          opponentMon.status = 'tox';
          opponentMon.toxicTurns = 0;
          events.push({
            type: 'status',
            targetId: opponentMon.unique_id,
            targetName: opponentMon.nickname,
            status: 'tox',
            message: `${opponentMon.nickname}は もうどくを あびた！`
          });
        }
      }

      // あやしいひかり
      if (move.id === 'confuseray') {
        if (opponentMon.volatiles?.confusion) {
          events.push({
            type: 'text',
            message: 'しかし うまくきまらなかった！'
          });
        } else {
          if (!opponentMon.volatiles) opponentMon.volatiles = {};
          opponentMon.volatiles.confusion = Math.floor(this.random() * 4) + 2;
          events.push({
            type: 'text',
            message: `${opponentMon.nickname}は こんらんした！`
          });
        }
      }

      // 設置技
      const opponentId = Object.keys(state.players).find(id => id !== player.id)!;
      const opponent = state.players[opponentId];

      if (move.id === 'stealthrock') {
        if (!opponent.hazards) opponent.hazards = {};
        if (opponent.hazards.stealthRock) {
          events.push({ type: 'text', message: 'しかし うまくきまらなかった！' });
        } else {
          opponent.hazards.stealthRock = true;
          events.push({ type: 'text', message: '相手の周りに とがった岩が 漂い始めた！' });
        }
      }
      if (move.id === 'spikes') {
        if (!opponent.hazards) opponent.hazards = {};
        if (!opponent.hazards.spikes) opponent.hazards.spikes = 0;
        if (opponent.hazards.spikes >= 3) {
          events.push({ type: 'text', message: 'しかし うまくきまらなかった！' });
        } else {
          opponent.hazards.spikes++;
          events.push({ type: 'text', message: '相手の足元に まきびしが 散らばった！' });
        }
      }
      if (move.id === 'toxicspikes') {
        if (!opponent.hazards) opponent.hazards = {};
        if (!opponent.hazards.toxicSpikes) opponent.hazards.toxicSpikes = 0;
        if (opponent.hazards.toxicSpikes >= 2) {
          events.push({ type: 'text', message: 'しかし うまくきまらなかった！' });
        } else {
          opponent.hazards.toxicSpikes++;
          events.push({ type: 'text', message: '相手の足元に どくびしが 散らばった！' });
        }
      }

      // まもる・みがわり・アンコール・ちょうはつ
      // アンコール (Encore)
      if (move.id === 'encore') {
        if (opponent.lastMove) {
          if (!opponentMon.volatiles) opponentMon.volatiles = {};
          opponentMon.volatiles.encore = { moveId: opponent.lastMove, turns: 3 };
          events.push({
            type: 'text',
            message: `${opponentMon.nickname}は アンコールを受けた！`
          });
        } else {
          events.push({
            type: 'text',
            message: 'しかし うまくきまらなかった！'
          });
        }
      }

      // ちょうはつ (Taunt)
      if (move.id === 'taunt') {
        if (!opponentMon.volatiles) opponentMon.volatiles = {};
        opponentMon.volatiles.taunt = { turns: 3 };
        events.push({
          type: 'text',
          message: `${opponentMon.nickname}は ちょうはつに のってしまった！`
        });
      }

      if (move.id === 'substitute') {
        if (!mon.volatiles) mon.volatiles = {};
        const subCost = Math.floor(mon.hp_max / 4);
        if (mon.hp_current <= subCost) {
          events.push({
            type: 'text',
            message: 'しかし 体力が 足りなかった！',
          });
        } else {
          mon.hp_current -= subCost;
          mon.volatiles.substitute = subCost;
          events.push({
            type: 'text',
            message: `${mon.nickname}は 自分の 身代わりを 出した！`,
          });
          events.push({
            type: 'damage',
            targetId: mon.unique_id,
            targetName: mon.nickname,
            amount: subCost,
            newHp: mon.hp_current,
            maxHp: mon.hp_max,
            isCrit: false,
            effectiveness: 1,
          });
        }
      }

      if (['protect', 'detect', 'kingsshield'].includes(move.id)) {
        if (!mon.volatiles) mon.volatiles = {};
        // 連続使用で成功率低下 (1, 1/3, 1/9...)
        const count = mon.volatiles.protectCount || 0;
        const chance = Math.pow(3, -count); // 1, 0.33, 0.11...

        if (this.random() < chance) {
          mon.volatiles.protect = true;
          mon.volatiles.protectCount = count + 1;
          events.push({
            type: 'text',
            message: `${mon.nickname}は 守りの 体勢に 入った！`,
          });
        } else {
          mon.volatiles.protectCount = 0; // 失敗したらリセット？いや、失敗してもカウント増える？Showdownは失敗したらリセットしないが、成功率計算は連続使用回数依存。
          // ここでは失敗したらリセットせず、カウントだけ増やすか、あるいは失敗メッセージ。
          events.push({
            type: 'text',
            message: 'しかし うまくきまらなかった！',
          });
        }
      }

      // 能力変化 (Boosts)
      const statBoosts: Record<string, { stat: string; stages: number; }[]> = {
        'swordsdance': [{ stat: 'atk', stages: 2 }],
        'dragondance': [{ stat: 'atk', stages: 1 }, { stat: 'spe', stages: 1 }],
        'calmmind': [{ stat: 'spa', stages: 1 }, { stat: 'spd', stages: 1 }],
        'nastyplot': [{ stat: 'spa', stages: 2 }],
        'agility': [{ stat: 'spe', stages: 2 }],
        'rockpolish': [{ stat: 'spe', stages: 2 }],
        'irondefense': [{ stat: 'def', stages: 2 }],
        'amnesia': [{ stat: 'spd', stages: 2 }],
        'bulkup': [{ stat: 'atk', stages: 1 }, { stat: 'def', stages: 1 }],
        'coil': [{ stat: 'atk', stages: 1 }, { stat: 'def', stages: 1 }],
        'growth': [{ stat: 'atk', stages: 1 }, { stat: 'spa', stages: 1 }],
        'workup': [{ stat: 'atk', stages: 1 }, { stat: 'spa', stages: 1 }],
        'howl': [{ stat: 'atk', stages: 1 }],
        'tailglow': [{ stat: 'spa', stages: 3 }],
        'bellydrum': [{ stat: 'atk', stages: 6 }], // 特殊処理: HPを半分消費
        'shellsmash': [{ stat: 'atk', stages: 2 }, { stat: 'spa', stages: 2 }, { stat: 'spe', stages: 2 }],
        'quiverdance': [{ stat: 'spa', stages: 1 }, { stat: 'spd', stages: 1 }, { stat: 'spe', stages: 1 }],
        'autotomize': [{ stat: 'spe', stages: 2 }],
        'cottonguard': [{ stat: 'def', stages: 3 }],
        'honeclaws': [{ stat: 'atk', stages: 1 }],
        'curse': [{ stat: 'atk', stages: 1 }, { stat: 'def', stages: 1 }], // ゴースト以外
        // 相手の能力を下げる技
        'scaryface': [{ stat: 'spe', stages: -2 }],
        'screech': [{ stat: 'def', stages: -2 }],
        'metalsound': [{ stat: 'spd', stages: -2 }],
        'faketears': [{ stat: 'spd', stages: -2 }],
        'charm': [{ stat: 'atk', stages: -2 }],
        'featherdance': [{ stat: 'atk', stages: -2 }],
        'tickle': [{ stat: 'atk', stages: -1 }, { stat: 'def', stages: -1 }],
        'growl': [{ stat: 'atk', stages: -1 }],
        'leer': [{ stat: 'def', stages: -1 }],
        'tailwhip': [{ stat: 'def', stages: -1 }],
        'sandattack': [{ stat: 'evade', stages: -1 }],
        'smokescreen': [{ stat: 'evade', stages: -1 }],
        'flashcannon': [], // 追加効果として後で処理
      };

      let boostInfo = statBoosts[move.id];
      // move.boostsプロパティがある場合もサポート
      if (!boostInfo && move.boosts) {
        boostInfo = Object.entries(move.boosts).map(([stat, stages]) => ({ stat, stages: stages as number }));
      }

      if (boostInfo && boostInfo.length > 0) {
        // 自己強化か相手弱体かを判定
        const isSelfBuff = !['scaryface', 'screech', 'metalsound', 'faketears', 'charm', 'featherdance', 'tickle', 'growl', 'leer', 'tailwhip', 'sandattack', 'smokescreen'].includes(move.id);
        const target = isSelfBuff ? mon : opponentMon;

        // はらだいこ特殊処理
        if (move.id === 'bellydrum') {
          const cost = Math.floor(mon.hp_max / 2);
          if (mon.hp_current <= cost) {
            events.push({ type: 'text', message: 'しかし 体力が 足りなかった！' });
            return;
          }
          mon.hp_current -= cost;
          events.push({ type: 'damage', targetId: mon.unique_id, targetName: mon.nickname, amount: cost, newHp: mon.hp_current, maxHp: mon.hp_max, isCrit: false, effectiveness: 1 });
        }

        // からをやぶる特殊処理: 防御・特防下降
        if (move.id === 'shellsmash') {
          mon.buffs.def = Math.max(-6, mon.buffs.def - 1);
          mon.buffs.spd = Math.max(-6, mon.buffs.spd - 1);
          events.push({ type: 'stat_change', targetId: mon.unique_id, targetName: mon.nickname, stat: 'def', stages: -1 });
          events.push({ type: 'stat_change', targetId: mon.unique_id, targetName: mon.nickname, stat: 'spd', stages: -1 });
        }

        for (const { stat, stages } of boostInfo) {
          const statKey = stat as keyof typeof target.buffs;
          if (target.buffs[statKey] !== undefined) {
            const oldVal = target.buffs[statKey];
            if (stages > 0) {
              target.buffs[statKey] = Math.min(6, target.buffs[statKey] + stages);
            } else {
              target.buffs[statKey] = Math.max(-6, target.buffs[statKey] + stages);
            }
            const actualChange = target.buffs[statKey] - oldVal;

            if (actualChange !== 0) {
              const statNameMap: Record<string, string> = { atk: 'こうげき', def: 'ぼうぎょ', spa: 'とくこう', spd: 'とくぼう', spe: 'すばやさ', evade: '回避' };
              const changeText = actualChange > 0 ? (actualChange >= 2 ? 'ぐーんと 上がった！' : '上がった！') : (actualChange <= -2 ? 'がくっと 下がった！' : '下がった！');
              events.push({
                type: 'stat_change',
                targetId: target.unique_id,
                targetName: target.nickname,
                stat: statKey,
                stages: actualChange,
              });
              events.push({
                type: 'text',
                message: `${target.nickname}の ${statNameMap[statKey] || stat}が ${changeText}`,
              });
            } else {
              events.push({
                type: 'text',
                message: `${target.nickname}の ${stat}は もう 変わらない！`,
              });
            }
          }
        }
        return; // Status move done
      }

      // 状態異常 (Status)
      if (move.status) {
        // ...
      }

      // 回復 (Heal)
      if (move.heal) {
        // ...
      }

    } else {
      // 攻撃技
      if (move.power > 0) {
        // 特性による免疫判定
        const immunityResult = this.checkAbilityImmunity(opponentMon, move);
        if (immunityResult.isImmune) {
          events.push(...immunityResult.events);
          return;
        }

        // まもる判定
        if (opponentMon.volatiles?.protect && (move as any).flags?.protect) {
          events.push({
            type: 'text',
            message: `${opponentMon.nickname}は 攻撃を まもった！`,
          });
          return;
        }

        const { damage, isCrit, effectiveness, isStab } = this.calculateDamage(mon, opponentMon, move, state.weather);

        // みがわり判定
        if (opponentMon.volatiles?.substitute && opponentMon.volatiles.substitute > 0) {
          const subHp = opponentMon.volatiles.substitute;
          if (damage >= subHp) {
            // みがわり破壊
            delete opponentMon.volatiles.substitute;
            events.push({
              type: 'text',
              message: `${opponentMon.nickname}の みがわりが こわれた！`,
            });
          } else {
            // みがわりにダメージ
            opponentMon.volatiles.substitute -= damage;
            events.push({
              type: 'text',
              message: `${opponentMon.nickname}の みがわりが ダメージを 受けた！`,
            });
          }
          return;
        }

        // きあいのタスキ (Focus Sash)
        let actualDamage = damage;
        if (opponentMon.item === 'focussash' && opponentMon.hp_current === opponentMon.hp_max && damage >= opponentMon.hp_current) {
          actualDamage = opponentMon.hp_current - 1;
          opponentMon.item = ''; // 消費
          events.push({
            type: 'text',
            message: `${opponentMon.nickname}は きあいのタスキで 持ちこたえた！`,
          });
        }

        opponentMon.hp_current = Math.max(0, opponentMon.hp_current - actualDamage);

        // オボンのみ (Sitrus Berry)
        if (opponentMon.item === 'sitrusberry' && opponentMon.hp_current > 0 && opponentMon.hp_current <= opponentMon.hp_max / 2) {
          const heal = Math.floor(opponentMon.hp_max / 4);
          opponentMon.hp_current = Math.min(opponentMon.hp_max, opponentMon.hp_current + heal);
          opponentMon.item = ''; // 消費
          events.push({
            type: 'text',
            message: `${opponentMon.nickname}は オボンのみで 回復した！`,
          });
          events.push({
            type: 'heal',
            targetId: opponentMon.unique_id,
            targetName: opponentMon.nickname,
            amount: heal,
            newHp: opponentMon.hp_current,
            maxHp: opponentMon.hp_max
          });
        }

        events.push({
          type: 'damage',
          targetId: opponentMon.unique_id,
          targetName: opponentMon.nickname,
          amount: damage,
          newHp: opponentMon.hp_current,
          maxHp: opponentMon.hp_max,
          isCrit,
          effectiveness,
        });

        if (effectiveness > 1) {
          events.push({ type: 'text', message: 'こうかは ばつぐんだ！' });
        } else if (effectiveness < 1 && effectiveness > 0) {
          events.push({ type: 'text', message: 'こうかは いまひとつのようだ...' });
        } else if (effectiveness === 0) {
          events.push({ type: 'text', message: 'こうかは ないようだ...' });
        }

        if (isCrit) {
          events.push({ type: 'text', message: 'きゅうしょに あたった！' });
        }

        // 反動ダメージ (Recoil)
        if (move.recoil) {
          const recoilDamage = Math.floor(damage * move.recoil[0] / move.recoil[1]);
          if (recoilDamage > 0) {
            mon.hp_current = Math.max(0, mon.hp_current - recoilDamage);
            events.push({
              type: 'text',
              message: `${mon.nickname}は 反動による ダメージを 受けた！`,
            });
            events.push({
              type: 'damage',
              targetId: mon.unique_id,
              targetName: mon.nickname,
              amount: recoilDamage,
              newHp: mon.hp_current,
              maxHp: mon.hp_max,
              isCrit: false,
              effectiveness: 1,
            });
          }
        }

        // 吸収 (Drain)
        if (move.drain) {
          const drainAmount = Math.floor(damage * move.drain[0] / move.drain[1]);
          if (drainAmount > 0) {
            mon.hp_current = Math.min(mon.hp_max, mon.hp_current + drainAmount);
            events.push({
              type: 'text',
              message: `${mon.nickname}は 体力を 吸い取った！`,
            });
            events.push({
              type: 'heal',
              targetId: mon.unique_id,
              targetName: mon.nickname,
              amount: drainAmount,
              newHp: mon.hp_current,
              maxHp: mon.hp_max,
            });
          }
        }

        // いのちのたま
        if (mon.item === 'lifeorb' && !move.recoil) { // 反動技以外？いや、反動技でも発動するが、ここでは簡易的に
          const recoil = Math.floor(mon.hp_max / 10);
          mon.hp_current = Math.max(0, mon.hp_current - recoil);
          events.push({
            type: 'text',
            message: `${mon.nickname}は いのちのたまで 体力を 削られた！`,
          });
        }

        // 状態異常追加効果 (secondary)
        const secondary = (move as any).secondary;
        if (secondary && opponentMon.hp_current > 0) {
          if (this.random() * 100 < secondary.chance) {
            if (secondary.status && !opponentMon.status) {
              // タイプ免疫をチェック
              const types = [opponentMon.type];
              if (opponentMon.type2) types.push(opponentMon.type2);
              let canInflict = true;
              if (secondary.status === 'brn' && types.includes('fire')) canInflict = false;
              if (secondary.status === 'par' && types.includes('electric')) canInflict = false;
              if ((secondary.status === 'psn' || secondary.status === 'tox') && (types.includes('poison') || types.includes('steel'))) canInflict = false;
              if (secondary.status === 'frz' && types.includes('ice')) canInflict = false;

              if (canInflict) {
                opponentMon.status = secondary.status;
                const statusNames: Record<string, string> = { brn: 'やけど', par: 'まひ', psn: 'どく', frz: 'こおり', slp: 'ねむり' };
                events.push({
                  type: 'status',
                  targetId: opponentMon.unique_id,
                  targetName: opponentMon.nickname,
                  status: secondary.status,
                  message: `${opponentMon.nickname}は ${statusNames[secondary.status] || secondary.status}状態に なった！`,
                });

                // ラムのみ (Lum Berry)
                if (opponentMon.item === 'lumberry') {
                  delete opponentMon.status;
                  opponentMon.item = '';
                  events.push({
                    type: 'text',
                    message: `${opponentMon.nickname}は ラムのみで 状態異常を 回復した！`,
                  });
                  events.push({
                    type: 'status',
                    targetId: opponentMon.unique_id,
                    targetName: opponentMon.nickname,
                    status: null,
                    message: '',
                  });
                  events.push({
                    type: 'item_consume',
                    targetId: opponentMon.unique_id,
                    targetName: opponentMon.nickname,
                    itemName: 'ラムのみ'
                  });
                }
              }
            }
          }
        }

        if (opponentMon.hp_current <= 0) {
          events.push({
            type: 'faint',
            targetId: opponentMon.unique_id,
            targetName: opponentMon.nickname,
          });
        }
      }
    }
  }
  runSwitch(player: PlayerState, newSlot: number, opponentMon: BattleMonster, state: BattleState, events: BattleEvent[]) {
    const mon = player.team[player.activeSlot];
    const newMon = player.team[newSlot];

    if (newMon && newMon.hp_current > 0) {
      // 交代前のポケモンの状態変化をリセット
      mon.volatiles = undefined;
      player.activeSlot = newSlot;
      events.push({
        type: 'switch',
        playerId: player.id,
        playerName: player.name,
        monsterName: newMon.nickname,
        monsterId: newMon.unique_id,
        newSlot,
      });

      // Trigger onSwitchIn (e.g. Intimidate, weather abilities)
      const switchEvents = this.triggerAbility(newMon, 'onSwitchIn', { opponent: opponentMon, state });
      events.push(...switchEvents);

      // 設置技ダメージ処理
      if (player.hazards) {
        // ステルスロック（タイプ相性でダメージ変動）
        if (player.hazards.stealthRock) {
          let rockEffectiveness = 1;
          rockEffectiveness *= TYPE_CHART['rock']?.[newMon.type] ?? 1;
          if (newMon.type2) {
            rockEffectiveness *= TYPE_CHART['rock']?.[newMon.type2] ?? 1;
          }
          const damageRatio = 0.125 * rockEffectiveness;
          if (damageRatio > 0) {
            const damage = Math.floor(newMon.hp_max * damageRatio);
            newMon.hp_current = Math.max(0, newMon.hp_current - damage);
            events.push({
              type: 'text',
              message: `${newMon.nickname}は とがった岩に 突き刺さった！`,
            });
            events.push({
              type: 'damage',
              targetId: newMon.unique_id,
              targetName: newMon.nickname,
              amount: damage,
              newHp: newMon.hp_current,
              maxHp: newMon.hp_max,
              isCrit: false,
              effectiveness: 1,
            });
          }
        }

        // まきびし（飛行・浮遊無効）
        if (player.hazards.spikes && player.hazards.spikes > 0) {
          const isFlying = newMon.type === 'flying' || newMon.type2 === 'flying';
          const hasLevitate = newMon.ability?.toLowerCase().replace(/\s+/g, '') === 'levitate';

          if (!isFlying && !hasLevitate) {
            const damageRatios = [0, 1 / 8, 1 / 6, 1 / 4];
            const ratio = damageRatios[Math.min(3, player.hazards.spikes)];
            const spikeDamage = Math.floor(newMon.hp_max * ratio);
            newMon.hp_current = Math.max(0, newMon.hp_current - spikeDamage);
            events.push({
              type: 'text',
              message: `${newMon.nickname}は まきびしの ダメージを 受けた！`,
            });
            events.push({
              type: 'damage',
              targetId: newMon.unique_id,
              targetName: newMon.nickname,
              amount: spikeDamage,
              newHp: newMon.hp_current,
              maxHp: newMon.hp_max,
              isCrit: false,
              effectiveness: 1,
            });
          }
        }

        // どくびし（毒・鋼・飛行には無効、毒タイプは除去）
        if (player.hazards.toxicSpikes && player.hazards.toxicSpikes > 0) {
          const isFlying = newMon.type === 'flying' || newMon.type2 === 'flying';
          const isPoison = newMon.type === 'poison' || newMon.type2 === 'poison';
          const isSteel = newMon.type === 'steel' || newMon.type2 === 'steel';
          const hasLevitate = newMon.ability?.toLowerCase().replace(/\s+/g, '') === 'levitate';

          if (isPoison && !isFlying && !hasLevitate) {
            // 毒タイプがどくびしを除去
            player.hazards.toxicSpikes = 0;
            events.push({
              type: 'text',
              message: `${newMon.nickname}は どくびしを 吸収した！`,
            });
          } else if (!isFlying && !isPoison && !isSteel && !hasLevitate && !newMon.status) {
            // 毒状態付与（2層ならもうどく）
            if (player.hazards.toxicSpikes >= 2) {
              newMon.status = 'tox';
              newMon.toxicTurns = 0;
              events.push({
                type: 'status',
                targetId: newMon.unique_id,
                targetName: newMon.nickname,
                status: 'tox',
                message: `${newMon.nickname}は どくびしで もうどくを あびた！`,
              });
            } else {
              newMon.status = 'psn';
              events.push({
                type: 'status',
                targetId: newMon.unique_id,
                targetName: newMon.nickname,
                status: 'psn',
                message: `${newMon.nickname}は どくびしで どくを あびた！`,
              });
            }
          }
        }

        // 設置技ダメージによるひんし判定
        if (newMon.hp_current <= 0) {
          events.push({
            type: 'faint',
            targetId: newMon.unique_id,
            targetName: newMon.nickname,
          });
        }
      }
    }
  }

  getAIChoice(player: PlayerState): BattleAction {
    const activeMon = player.team[player.activeSlot];

    if (activeMon.hp_current <= 0) {
      const aliveIndex = player.team.findIndex(m => m.hp_current > 0);
      if (aliveIndex >= 0) {
        return { type: 'switch', target: aliveIndex };
      }
    }

    const availableMoves = activeMon.moves.filter(m => true);
    if (availableMoves.length > 0) {
      const move = availableMoves[Math.floor(this.random() * availableMoves.length)];
      return { type: 'move', moveId: move.id };
    }

    return { type: 'move', moveId: activeMon.moves[0]?.id ?? 'tackle' };
  }

  serializeState(state: BattleState): SerializedBattleState {
    const serialized: SerializedBattleState = {
      seed: this.seed,
      turn: state.turn,
      phase: state.phase,
      players: {},
      choices: [],
      forcedSwitchPlayer: state.forcedSwitchPlayer,
    };

    for (const [id, player] of Object.entries(state.players)) {
      serialized.players[id] = {
        name: player.name,
        team: player.team.map(mon => ({
          template_id: mon.template_id,
          nickname: mon.nickname,
          hp_current: mon.hp_current,
          hp_max: mon.hp_max,
          type: mon.type,
          current_atk: mon.current_atk,
          current_def: mon.current_def,
          current_spd: mon.current_spd,
          spriteUrl: mon.spriteUrl,
          moves: mon.moves.map(m => m.id),
          buffs: { ...mon.buffs },
        })),
        activeSlot: player.activeSlot,
      };
    }


    return serialized;
  }

  restoreState(serialized: SerializedBattleState): BattleState {
    this.seed = serialized.seed;

    const state: BattleState = {
      phase: serialized.phase as BattleState['phase'],
      turn: serialized.turn,
      players: {},
      events: [],
      forcedSwitchPlayer: serialized.forcedSwitchPlayer,
    };

    for (const [id, playerData] of Object.entries(serialized.players)) {
      state.players[id] = {
        id,
        name: playerData.name,
        team: playerData.team.map((monData: any) => {
          // Restore monster directly from serialized data
          const moves = monData.moves
            .map((moveId: string) => MOVE_TEMPLATES.find((m: MoveTemplate) => m.id === moveId))
            .filter((m: MoveTemplate | undefined): m is MoveTemplate => m !== undefined);

          return {
            unique_id: monData.template_id + '_' + Math.floor(Math.random() * 10000),
            template_id: monData.template_id,
            nickname: monData.nickname,
            type: monData.type,
            hp_current: monData.hp_current,
            hp_max: monData.hp_max,
            current_atk: monData.current_atk,
            current_def: monData.current_def,
            current_spd: monData.current_spd,
            moves: moves,
            buffs: { ...monData.buffs },
            spriteUrl: monData.spriteUrl || 'https://play.pokemonshowdown.com/sprites/gen5ani/substitute.gif',
            ability: 'unknown',
            item: '',
          };
        }),
        activeSlot: playerData.activeSlot,
        ready: false,
      };
    }


    return state;
  }
}
interface Env {
  DB: D1Database;
  BATTLE_ROOM: DurableObjectNamespace;
}

interface User {
  id: string;
  username: string;
  password_hash: string;
}

interface Monster {
  id: string;
  owner_id: string;
  name: string;
  type: string;
  hp: number;
  atk: number;
  def: number;
  spd: number;
  sprite_url: string | null;
  move1: string | null;
  move2: string | null;
  move3: string | null;
  move4: string | null;
}

// Simple hash function (for demo - use bcrypt in production)
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'pokemon-battle-salt');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
}

// Generate unique IDs
function generateId(): string {
  return crypto.randomUUID();
}

function generateSessionToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
}

function generateRoomCode(): string {
  // Generate 4 digit room code with R prefix (R1000-R9999)
  const code = Math.floor(1000 + Math.random() * 9000);
  return `R${code}`;
}

// Get user from session token
async function getUserFromRequest(request: Request, db: D1Database): Promise<User | null> {
  const cookie = request.headers.get('Cookie');
  if (!cookie) return null;

  const match = cookie.match(/session=([^;]+)/);
  if (!match) return null;

  const token = match[1];
  const now = Math.floor(Date.now() / 1000);

  const result = await db.prepare(`
    SELECT u.* FROM users u
    JOIN sessions s ON s.user_id = u.id
    WHERE s.token = ? AND s.expires_at > ?
      `).bind(token, now).first<User>();

  return result || null;
}

// Create starter monsters for new user
async function createStarterMonsters(db: D1Database, userId: string): Promise<void> {
  // Select 3 random unique monsters
  const shuffled = [...MONSTER_TEMPLATES].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, 3);

  for (let i = 0; i < selected.length; i++) {
    const t = selected[i];
    const monsterId = generateId();

    // Select up to 4 random moves
    const moves = [...(t.movePool ?? [])].sort(() => Math.random() - 0.5).slice(0, 4);

    // Ensure 4 moves (fill with null if less)
    const move1 = moves[0] || null;
    const move2 = moves[1] || null;
    const move3 = moves[2] || null;
    const move4 = moves[3] || null;

    // スプライトURLを生成（Showdownデータにはないため）
    const spriteUrl = `https://play.pokemonshowdown.com/sprites/gen5ani/${t.id}.gif`;

    // baseStatsのフォールバック
    const hp = t.baseStats?.hp ?? 50;
    const atk = t.baseStats?.atk ?? 50;
    const def = t.baseStats?.def ?? 50;
    const spd = (t.baseStats as any)?.spe ?? (t.baseStats as any)?.spd ?? 50; // spe(素早さ)を優先

    await db.prepare(`
      INSERT INTO monsters (id, owner_id, name, type, hp, atk, def, spd, sprite_url, move1, move2, move3, move4)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      monsterId, userId,
      t.name ?? 'Unknown', t.type ?? 'normal',
      hp, atk, def, spd,
      spriteUrl,
      move1, move2, move3, move4
    ).run();

    // Add to team slot
    await db.prepare(`
      INSERT INTO team_slots (user_id, slot, monster_id) VALUES (?, ?, ?)
    `).bind(userId, i, monsterId).run();
  }
}

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Credentials': 'true',
};

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // ========== DATA SEARCH API ==========
    if (path === '/api/data/search') {
      const q = url.searchParams.get('q')?.toLowerCase() || '';
      const type = url.searchParams.get('type') || 'pokemon';
      const getAll = url.searchParams.get('all') === 'true';

      if (!getAll && (!q || q.length < 2)) {
        return new Response(JSON.stringify({ results: [] }), { headers: { 'Content-Type': 'application/json', ...corsHeaders } });
      }

      let results: any[] = [];
      if (type === 'pokemon') {
        if (getAll) {
          results = MONSTER_TEMPLATES.map((m: any) => ({
            id: m.id,
            name: m.name,
            spriteUrl: m.spriteUrl,
            type: m.type,
            baseStats: m.baseStats,
            movePool: m.movePool
          }));
        } else {
          results = MONSTER_TEMPLATES
            .filter((m: any) => m.name.toLowerCase().includes(q) || m.id.includes(q))
            .slice(0, 20)
            .map((m: any) => ({ id: m.id, name: m.name, spriteUrl: m.spriteUrl, type: m.type, baseStats: m.baseStats, movePool: m.movePool }));
        }
      } else if (type === 'move') {
        if (getAll) {
          results = MOVE_TEMPLATES.map((m: any) => ({
            id: m.id, name: m.name, type: m.type, power: m.power, accuracy: m.accuracy, category: m.category, description: m.description
          }));
        } else {
          results = MOVE_TEMPLATES
            .filter((m: any) => m.name.toLowerCase().includes(q) || m.id.includes(q))
            .slice(0, 20)
            .map((m: any) => ({ id: m.id, name: m.name, type: m.type, power: m.power, accuracy: m.accuracy }));
        }
      }

      return new Response(JSON.stringify({ results }), { headers: { 'Content-Type': 'application/json', ...corsHeaders } });
    }

    // ========== AUTH ROUTES ==========

    // Register
    if (path === '/api/auth/register' && request.method === 'POST') {
      try {
        const body = await request.json() as { username: string; password: string; };
        const { username, password } = body;

        if (!username || !password || username.length < 3 || password.length < 4) {
          return new Response(JSON.stringify({ error: 'Invalid username or password' }), {
            status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders }
          });
        }

        // Check if username exists
        const existing = await env.DB.prepare('SELECT id FROM users WHERE username = ?').bind(username).first();
        if (existing) {
          return new Response(JSON.stringify({ error: 'Username already exists' }), {
            status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders }
          });
        }

        const userId = generateId();
        const passwordHash = await hashPassword(password);

        await env.DB.prepare(`
          INSERT INTO users (id, username, password_hash) VALUES (?, ?, ?)
        `).bind(userId, username, passwordHash).run();

        // Create starter monsters
        await createStarterMonsters(env.DB, userId);

        // Create session
        const token = generateSessionToken();
        const expiresAt = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7; // 7 days

        await env.DB.prepare(`
          INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)
        `).bind(token, userId, expiresAt).run();

        return new Response(JSON.stringify({ success: true, user: { id: userId, username } }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Set-Cookie': `session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}`,
            ...corsHeaders
          }
        });

      } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }
    }

    // Login
    if (path === '/api/auth/login' && request.method === 'POST') {
      try {
        const body = await request.json() as { username: string; password: string; };
        const { username, password } = body;

        const user = await env.DB.prepare('SELECT * FROM users WHERE username = ?').bind(username).first<User>();
        if (!user) {
          return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
            status: 401, headers: { 'Content-Type': 'application/json', ...corsHeaders }
          });
        }

        const valid = await verifyPassword(password, user.password_hash);
        if (!valid) {
          return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
            status: 401, headers: { 'Content-Type': 'application/json', ...corsHeaders }
          });
        }

        // Create session
        const token = generateSessionToken();
        const expiresAt = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7;

        await env.DB.prepare(`
          INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)
        `).bind(token, user.id, expiresAt).run();

        return new Response(JSON.stringify({ success: true, user: { id: user.id, username: user.username } }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Set-Cookie': `session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}`,
            ...corsHeaders
          }
        });

      } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }
    }

    // Logout
    if (path === '/api/auth/logout' && request.method === 'POST') {
      const cookie = request.headers.get('Cookie');
      const match = cookie?.match(/session=([^;]+)/);
      if (match) {
        await env.DB.prepare('DELETE FROM sessions WHERE token = ?').bind(match[1]).run();
      }

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': 'session=; Path=/; HttpOnly; Max-Age=0',
          ...corsHeaders
        }
      });
    }

    // Get current user
    if (path === '/api/auth/me' && request.method === 'GET') {
      const user = await getUserFromRequest(request, env.DB);
      if (!user) {
        return new Response(JSON.stringify({ user: null }), {
          status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      return new Response(JSON.stringify({ user: { id: user.id, username: user.username } }), {
        status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    // ========== MONSTER ROUTES ==========

    // Get all monsters for user
    if (path === '/api/monsters' && request.method === 'GET') {
      const user = await getUserFromRequest(request, env.DB);
      if (!user) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401, headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      const monsters = await env.DB.prepare(`
        SELECT * FROM monsters WHERE owner_id = ? ORDER BY created_at DESC
      `).bind(user.id).all<Monster>();

      return new Response(JSON.stringify({ monsters: monsters.results }), {
        status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    // Create monster
    if (path === '/api/monsters' && request.method === 'POST') {
      const user = await getUserFromRequest(request, env.DB);
      if (!user) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401, headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      try {
        const body = await request.json() as Partial<Monster>;
        const monsterId = generateId();

        await env.DB.prepare(`
          INSERT INTO monsters (id, owner_id, name, type, hp, atk, def, spd, sprite_url, move1, move2, move3, move4)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
          monsterId, user.id,
          body.name || 'New Monster',
          body.type || 'normal',
          body.hp || 100,
          body.atk || 50,
          body.def || 50,
          body.spd || 50,
          body.sprite_url || null,
          body.move1 || 'tackle',
          body.move2 || null,
          body.move3 || null,
          body.move4 || null
        ).run();

        return new Response(JSON.stringify({ success: true, id: monsterId }), {
          status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });

      } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }
    }

    // Delete monster
    if (path.startsWith('/api/monsters/') && request.method === 'DELETE') {
      const user = await getUserFromRequest(request, env.DB);
      if (!user) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401, headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      const monsterId = path.split('/')[3];
      await env.DB.prepare(`
        DELETE FROM monsters WHERE id = ? AND owner_id = ?
      `).bind(monsterId, user.id).run();

      return new Response(JSON.stringify({ success: true }), {
        status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    // ========== TEAM ROUTES ==========

    // Get team
    if (path === '/api/team' && request.method === 'GET') {
      const user = await getUserFromRequest(request, env.DB);
      if (!user) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401, headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      const teamSlots = await env.DB.prepare(`
        SELECT ts.slot, m.* FROM team_slots ts
        LEFT JOIN monsters m ON ts.monster_id = m.id
        WHERE ts.user_id = ?
        ORDER BY ts.slot
      `).bind(user.id).all();

      return new Response(JSON.stringify({ team: teamSlots.results }), {
        status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    // Update team
    if (path === '/api/team' && request.method === 'PUT') {
      const user = await getUserFromRequest(request, env.DB);
      if (!user) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401, headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      try {
        const body = await request.json() as { slots: (string | null)[]; };
        const { slots } = body;

        // Clear existing team
        await env.DB.prepare('DELETE FROM team_slots WHERE user_id = ?').bind(user.id).run();

        // Insert new team
        for (let i = 0; i < Math.min(slots.length, 6); i++) {
          await env.DB.prepare(`
            INSERT INTO team_slots (user_id, slot, monster_id) VALUES (?, ?, ?)
          `).bind(user.id, i, slots[i]).run();
        }

        return new Response(JSON.stringify({ success: true }), {
          status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });

      } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }
    }

    // ========== ROOM ROUTES ==========

    // Create room
    if (path === '/api/rooms' && request.method === 'POST') {
      const user = await getUserFromRequest(request, env.DB);
      if (!user) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401, headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      const roomCode = generateRoomCode();
      const roomId = env.BATTLE_ROOM.idFromName(roomCode);
      const room = env.BATTLE_ROOM.get(roomId);

      // Initialize room
      await room.fetch(new Request('http://internal/init', {
        method: 'POST',
        body: JSON.stringify({ hostId: user.id, hostName: user.username })
      }));

      return new Response(JSON.stringify({ roomCode }), {
        status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    // Join room via WebSocket
    if (path.match(/^\/api\/rooms\/[A-Z0-9]+\/ws$/)) {
      const roomCode = path.split('/')[3];
      const user = await getUserFromRequest(request, env.DB);

      if (!user) {
        return new Response('Unauthorized', { status: 401 });
      }

      // Get user's team
      const teamResult = await env.DB.prepare(`
        SELECT m.* FROM team_slots ts
        JOIN monsters m ON ts.monster_id = m.id
        WHERE ts.user_id = ?
        ORDER BY ts.slot
      `).bind(user.id).all<Monster>();

      const roomId = env.BATTLE_ROOM.idFromName(roomCode);
      const room = env.BATTLE_ROOM.get(roomId);

      // Forward WebSocket upgrade to Durable Object
      const upgradeHeader = request.headers.get('Upgrade');
      if (upgradeHeader !== 'websocket') {
        return new Response('Expected WebSocket', { status: 426 });
      }

      const newUrl = new URL(request.url);
      newUrl.pathname = '/connect';
      newUrl.searchParams.set('userId', user.id);
      newUrl.searchParams.set('username', user.username);
      newUrl.searchParams.set('team', JSON.stringify(teamResult.results));

      return room.fetch(new Request(newUrl.toString(), request));
    }

    // ========== BATTLE ROUTES (CPU) ==========

    // Start battle (CPU)
    if (path === '/api/battle/start' && request.method === 'POST') {
      try {
        const engine = new BattleEngine();
        const playerTeam = engine.generateTeam(3);
        const cpuTeam = engine.generateTeam(3);

        const state: BattleState = {
          phase: 'selection',
          turn: 1,
          players: {
            player: { id: 'player', name: 'プレイヤー', team: playerTeam, activeSlot: 0, ready: false },
            cpu: { id: 'cpu', name: 'CPU', team: cpuTeam, activeSlot: 0, ready: false },
          },
          events: [
            { type: 'text', message: 'バトルスタート！' },
            { type: 'switch', playerId: 'player', playerName: 'プレイヤー', monsterName: playerTeam[0].nickname, monsterId: playerTeam[0].unique_id, newSlot: 0 },
            { type: 'switch', playerId: 'cpu', playerName: 'CPU', monsterName: cpuTeam[0].nickname, monsterId: cpuTeam[0].unique_id, newSlot: 0 },
          ],
        };

        return new Response(JSON.stringify(createAPIResponse(state, 'player', engine)), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });

      } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }
    }

    // Battle choice (CPU)
    if (path === '/api/battle/choice' && request.method === 'POST') {
      try {
        const body = await request.json() as { state: SerializedBattleState; action: BattleAction; };
        const { state: serialized, action } = body;

        const engine = new BattleEngine(serialized.seed);
        let state = engine.restoreState(serialized);

        state.players.player.action = action;
        state.players.player.ready = true;

        if (state.phase === 'forced_switch' && state.forcedSwitchPlayer === 'player') {
          if (action.type === 'switch' && action.target !== undefined) {
            const newMon = state.players.player.team[action.target];
            if (newMon && newMon.hp_current > 0) {
              state.players.player.activeSlot = action.target;
              state.events = [{
                type: 'switch', playerId: 'player', playerName: 'プレイヤー',
                monsterName: newMon.nickname, monsterId: newMon.unique_id, newSlot: action.target,
              }];
              state.phase = 'selection';
              state.forcedSwitchPlayer = undefined;
              state.players.player.ready = false;
              state.players.cpu.ready = false;
              state.players.player.action = undefined;
              state.players.cpu.action = undefined;
            }
          }
          return new Response(JSON.stringify(createAPIResponse(state, 'player', engine)), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          });
        }

        const cpuAction = engine.getAIChoice(state.players.cpu);
        state.players.cpu.action = cpuAction;
        state.players.cpu.ready = true;

        state = engine.executeTurn(state);

        if (state.phase === 'forced_switch' && state.forcedSwitchPlayer === 'cpu') {
          const cpuSwitchAction = engine.getAIChoice(state.players.cpu);
          if (cpuSwitchAction.type === 'switch' && cpuSwitchAction.target !== undefined) {
            const newMon = state.players.cpu.team[cpuSwitchAction.target];
            if (newMon && newMon.hp_current > 0) {
              state.players.cpu.activeSlot = cpuSwitchAction.target;
              state.events.push({
                type: 'switch', playerId: 'cpu', playerName: 'CPU',
                monsterName: newMon.nickname, monsterId: newMon.unique_id, newSlot: cpuSwitchAction.target,
              });
              state.phase = 'selection';
              state.forcedSwitchPlayer = undefined;
            }
          }
        }

        return new Response(JSON.stringify(createAPIResponse(state, 'player', engine)), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });

      } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }
    }

    // Get available moves list
    if (path === '/api/moves' && request.method === 'GET') {
      // Convert array to object keyed by move ID for frontend compatibility
      const movesObj: { [id: string]: any; } = {};
      for (const move of MOVE_TEMPLATES) {
        movesObj[move.id] = move;
      }
      return new Response(JSON.stringify({ moves: movesObj }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }


    // Health check
    if (path === '/health') {
      return new Response(JSON.stringify({ status: 'ok' }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // Fallback for static files
    return new Response('Not Found', { status: 404, headers: corsHeaders });
  },
};



// Helper function for battle response
function createAPIResponse(state: BattleState, playerId: string, engine: BattleEngine) {
  const player = state.players[playerId];
  const opponentId = Object.keys(state.players).find(id => id !== playerId)!;
  const opponent = state.players[opponentId];

  return {
    serialized: engine.serializeState(state),
    events: state.events,
    playerTeam: player.team.map((mon, i) => ({
      unique_id: mon.unique_id,
      nickname: mon.nickname,
      type: mon.type,
      type2: mon.type2,
      hp_current: mon.hp_current,
      hp_max: mon.hp_max,
      level: mon.level,
      spriteUrl: mon.spriteUrl,
      moves: mon.moves.map((m, j) => ({
        id: m.id,
        name: m.name,
        type: m.type,
        power: m.power,
        pp: mon.movePP[j],
        maxPP: m.pp,
      })),
    })),
    opponentTeam: opponent.team.map(mon => ({
      unique_id: mon.unique_id,
      nickname: mon.nickname,
      type: mon.type,
      type2: mon.type2,
      hp_current: mon.hp_current,
      hp_max: mon.hp_max,
      level: mon.level,
      spriteUrl: mon.spriteUrl,
    })),
    playerActive: player.activeSlot,
    opponentActive: opponent.activeSlot,
    phase: state.phase,
    turn: state.turn,
    winner: state.winner,
    forcedSwitch: state.forcedSwitchPlayer === playerId,
  };
}

// ========== DURABLE OBJECT: Battle Room ==========
export class BattleRoom {
  state: DurableObjectState;
  players: Map<string, { ws: WebSocket; userId: string; name: string; team: Monster[]; ready: boolean; action?: BattleAction; }>;
  hostId: string | null;
  battleEngine: BattleEngine | null;
  battleState: BattleState | null;

  constructor(state: DurableObjectState) {
    this.state = state;
    this.players = new Map();
    this.hostId = null;
    this.battleEngine = null;
    this.battleState = null;
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/init') {
      const body = await request.json() as { hostId: string; hostName: string; };
      this.hostId = body.hostId;
      return new Response('OK');
    }

    if (url.pathname === '/connect') {
      const userId = url.searchParams.get('userId')!;
      const username = url.searchParams.get('username')!;
      const team = JSON.parse(url.searchParams.get('team') || '[]');

      const pair = new WebSocketPair();
      const [client, server] = Object.values(pair);

      this.handleWebSocket(server, userId, username, team);

      return new Response(null, { status: 101, webSocket: client });
    }

    return new Response('Not Found', { status: 404 });
  }

  handleWebSocket(ws: WebSocket, userId: string, name: string, team: Monster[]) {
    ws.accept();

    this.players.set(userId, { ws, userId, name, team, ready: false });
    console.log(`[Room] Player joined: ${userId} (${name}). Total players: ${this.players.size}`);

    // Broadcast player list
    this.broadcastPlayerList();

    ws.addEventListener('message', async (event) => {
      try {
        const data = JSON.parse(event.data as string);

        switch (data.type) {
          case 'ready':
            const player = this.players.get(userId);
            if (player) player.ready = true;
            this.broadcastPlayerList();

            // Check if both ready to start
            if (this.players.size === 2 && !this.battleState) {
              const allReady = Array.from(this.players.values()).every(p => p.ready);
              if (allReady) {
                this.startBattle();
              }
            }
            break;

          case 'action':
            this.handleBattleAction(userId, data.action);
            break;
        }
      } catch (err) {
        console.error('WebSocket error:', err);
      }
    });

    ws.addEventListener('close', () => {
      this.players.delete(userId);
      this.broadcastPlayerList();
      // End battle if player disconnects
      if (this.battleState) {
        this.battleState = null;
        this.battleEngine = null;
        this.broadcast({ type: 'battle_end', winnerName: 'Opponent Disconnected' });
      }
    });
  }

  broadcastPlayerList() {
    const playerList = Array.from(this.players.values()).map(p => ({
      id: p.userId,
      name: p.name,
      ready: p.ready,
      isHost: p.userId === this.hostId,
    }));

    this.broadcast({ type: 'players', players: playerList });
    console.log(`[Room] Broadcasted player list: ${JSON.stringify(playerList)}`);
  }

  broadcast(message: any) {
    const str = JSON.stringify(message);
    for (const player of this.players.values()) {
      try { player.ws.send(str); } catch { }
    }
  }

  sendToPlayer(userId: string, message: any) {
    const player = this.players.get(userId);
    if (player) {
      try { player.ws.send(JSON.stringify(message)); } catch { }
    }
  }

  startBattle() {
    try {
      console.log('[Battle] startBattle called');
      const players = Array.from(this.players.values());
      if (players.length !== 2) {
        console.log('[Battle] Not enough players:', players.length);
        return;
      }

      console.log('[Battle] Player 0 team:', players[0].team?.length, 'monsters');
      console.log('[Battle] Player 1 team:', players[1].team?.length, 'monsters');

      // Validate teams
      if (!players[0].team?.length || !players[1].team?.length) {
        console.log('[Battle] One or both players have no team!');
        this.broadcast({ type: 'error', message: 'チームを設定してください！' });
        return;
      }

      this.battleEngine = new BattleEngine();

      // Convert DB monsters to BattleMonsters
      const p1Team = this.convertToBattleTeam(players[0].team);
      const p2Team = this.convertToBattleTeam(players[1].team);

      console.log('[Battle] Converted teams - P1:', p1Team.length, 'P2:', p2Team.length);

      this.battleState = {
        phase: 'selection',
        turn: 1,
        players: {
          [players[0].userId]: { id: players[0].userId, name: players[0].name, team: p1Team, activeSlot: 0, ready: false },
          [players[1].userId]: { id: players[1].userId, name: players[1].name, team: p2Team, activeSlot: 0, ready: false },
        },
        events: [
          { type: 'text', message: 'バトルスタート！' },
          { type: 'switch', playerId: players[0].userId, playerName: players[0].name, monsterName: p1Team[0].nickname, monsterId: p1Team[0].unique_id, newSlot: 0 },
          { type: 'switch', playerId: players[1].userId, playerName: players[1].name, monsterName: p2Team[0].nickname, monsterId: p2Team[0].unique_id, newSlot: 0 },
        ],
      };

      console.log('[Battle] Battle state created, sending to players');

      // Send initial state to each player
      this.sendBattleState();
    } catch (err) {
      console.error('[Battle] Error in startBattle:', err);
    }
  }

  convertToBattleTeam(monsters: Monster[]): BattleMonster[] {
    return monsters.map(m => {
      // Find moves from templates
      const moves = [m.move1, m.move2, m.move3, m.move4]
        .filter(id => id)
        .map(id => MOVE_TEMPLATES.find(mt => mt.id === id))
        .filter((mt): mt is MoveTemplate => mt !== undefined);

      return {
        unique_id: m.id,
        template_id: 'custom',
        nickname: m.name,
        type: m.type as any,
        hp_current: m.hp,
        hp_max: m.hp,
        level: 50,
        current_atk: m.atk,
        current_def: m.def,
        current_spa: (m as any).spa ?? m.atk,  // fallback to atk
        current_spd: (m as any).spd ?? m.def,  // fallback to def
        current_spe: (m as any).spe ?? m.spd ?? 50,  // fallback
        moves: moves,
        movePP: moves.map(mv => mv.pp),
        buffs: { atk: 0, def: 0, spa: 0, spd: 0, spe: 0, crit: 0, evade: 0 },
        spriteUrl: m.sprite_url || 'https://play.pokemonshowdown.com/sprites/gen5ani/substitute.gif',
        ability: 'unknown',
        item: ''
      };
    });
  }

  handleBattleAction(userId: string, action: BattleAction) {
    console.log(`handleBattleAction called: userId=${userId}, action=${JSON.stringify(action)}`);
    console.log(`battleState phase=${this.battleState?.phase}, forcedSwitchPlayer=${this.battleState?.forcedSwitchPlayer}`);

    if (!this.battleState || !this.battleEngine) return;

    const playerState = this.battleState.players[userId];
    console.log(`playerState found: ${playerState ? 'yes' : 'no'}, players keys: ${Object.keys(this.battleState.players).join(', ')}`);
    if (!playerState) return;

    // Handle forced switch: only the player who needs to switch can act
    if (this.battleState.forcedSwitchPlayer) {
      // If this player is NOT the one who needs to switch, ignore their action
      if (this.battleState.forcedSwitchPlayer !== userId) {
        console.log(`Ignoring action from ${userId} - waiting for ${this.battleState.forcedSwitchPlayer} to switch`);
        return;
      }

      // This player needs to switch
      console.log(`Processing forced switch for ${userId}`);
      if (action.type === 'switch' && action.target !== undefined) {
        const newMon = playerState.team[action.target];
        console.log(`Switching to slot ${action.target}, newMon=${newMon?.nickname}, hp=${newMon?.hp_current}`);
        if (newMon && newMon.hp_current > 0) {
          playerState.activeSlot = action.target;
          this.battleState.events = [{
            type: 'switch', playerId: userId, playerName: playerState.name,
            monsterName: newMon.nickname, monsterId: newMon.unique_id, newSlot: action.target,
          }];
          this.battleState.phase = 'selection';
          this.battleState.forcedSwitchPlayer = undefined;

          // Reset ready states
          Object.values(this.battleState.players).forEach(p => {
            p.ready = false;
            p.action = undefined;
          });

          console.log('Forced switch completed, sending battle state');
          this.sendBattleState();
        }
      }
      return;
    }

    // Normal turn action
    // Normal turn action
    if (action.type === 'move' && (action as any).moveIndex !== undefined) {
      const moveIndex = (action as any).moveIndex;
      const mon = playerState.team[playerState.activeSlot];
      if (mon && mon.moves[moveIndex]) {
        action.moveId = mon.moves[moveIndex].id;
      }
    }
    playerState.action = action;
    playerState.ready = true;

    // Check if all players have acted
    const allReady = Object.values(this.battleState.players).every(p => p.ready);
    if (allReady) {
      this.battleState = this.battleEngine.executeTurn(this.battleState);
      this.sendBattleState();
    }
  }

  sendBattleState() {
    if (!this.battleState || !this.battleEngine) return;

    for (const userId of this.players.keys()) {
      const response = createAPIResponse(this.battleState, userId, this.battleEngine);
      this.sendToPlayer(userId, { type: 'battle_update', data: response });
    }
  }
}
