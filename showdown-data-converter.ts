/**
 * Showdownデータ変換モジュール
 * data/ディレクトリの公式データをworker.ts用に変換
 */

import { Pokedex } from './data/pokedex';
import { Moves } from './data/moves';
import { TypeChart } from './data/typechart';

// タイプ名の正規化 (Grass -> grass)
function normalizeType(type: string): string {
	return type.toLowerCase();
}

// ============================================
// タイプ相性変換
// ============================================

// Showdownの形式を変換
// damageTaken: 0=等倍, 1=弱点(2x), 2=耐性(0.5x), 3=無効(0x)
const DAMAGE_MULTIPLIERS: Record<number, number> = {
	0: 1,
	1: 2,
	2: 0.5,
	3: 0,
};

type MonsterType = 'normal' | 'fire' | 'water' | 'grass' | 'electric' | 'ice' |
	'fighting' | 'poison' | 'ground' | 'flying' | 'psychic' | 'bug' |
	'rock' | 'ghost' | 'dragon' | 'dark' | 'steel' | 'fairy';

const ALL_TYPES: MonsterType[] = [
	'normal', 'fire', 'water', 'grass', 'electric', 'ice',
	'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
	'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
];

// 攻撃タイプ → 防御タイプ → 倍率  の形式に変換
export function buildTypeChart(): Record<MonsterType, Record<MonsterType, number>> {
	const chart: Record<string, Record<string, number>> = {};

	// まず全タイプで等倍を初期化
	for (const atkType of ALL_TYPES) {
		chart[atkType] = {};
		for (const defType of ALL_TYPES) {
			chart[atkType][defType] = 1;
		}
	}

	// TypeChartから防御側の視点を攻撃側の視点に変換
	for (const [defTypeRaw, data] of Object.entries(TypeChart)) {
		const defType = normalizeType(defTypeRaw) as MonsterType;
		if (!ALL_TYPES.includes(defType)) continue;

		const damageTaken = (data as any).damageTaken;
		if (!damageTaken) continue;

		for (const [atkTypeRaw, value] of Object.entries(damageTaken)) {
			const atkType = normalizeType(atkTypeRaw) as MonsterType;
			if (!ALL_TYPES.includes(atkType)) continue;
			if (typeof value !== 'number') continue;

			const multiplier = DAMAGE_MULTIPLIERS[value] ?? 1;
			chart[atkType][defType] = multiplier;
		}
	}

	return chart as Record<MonsterType, Record<MonsterType, number>>;
}

// ============================================
// ポケモンデータ変換
// ============================================

export interface ConvertedPokemon {
	id: string;
	name: string;
	type: MonsterType;
	type2?: MonsterType;
	baseStats: {
		hp: number;
		atk: number;
		def: number;
		spa: number;
		spd: number;
		spe: number;
	};
	abilities: string[];
}

export function convertPokedex(): ConvertedPokemon[] {
	const result: ConvertedPokemon[] = [];

	for (const [id, data] of Object.entries(Pokedex)) {
		// フォルムチェンジ（Mega, Gmax等）は除外
		if ((data as any).forme || (data as any).isNonstandard) continue;

		const types = (data as any).types as string[];
		if (!types || types.length === 0) continue;

		const baseStats = (data as any).baseStats;
		if (!baseStats) continue;

		const abilities: string[] = [];
		const abilitiesData = (data as any).abilities;
		if (abilitiesData) {
			if (abilitiesData['0']) abilities.push(abilitiesData['0'].toLowerCase().replace(/\s+/g, ''));
			if (abilitiesData['1']) abilities.push(abilitiesData['1'].toLowerCase().replace(/\s+/g, ''));
			if (abilitiesData['H']) abilities.push(abilitiesData['H'].toLowerCase().replace(/\s+/g, ''));
		}

		result.push({
			id,
			name: (data as any).name || id,
			type: normalizeType(types[0]) as MonsterType,
			type2: types[1] ? normalizeType(types[1]) as MonsterType : undefined,
			baseStats: {
				hp: baseStats.hp || 50,
				atk: baseStats.atk || 50,
				def: baseStats.def || 50,
				spa: baseStats.spa || 50,
				spd: baseStats.spd || 50,
				spe: baseStats.spe || 50,
			},
			abilities,
		});
	}

	return result;
}

// ============================================
// 技データ変換
// ============================================

export interface ConvertedMove {
	id: string;
	name: string;
	type: MonsterType;
	category: 'physical' | 'special' | 'status';
	power: number;
	accuracy: number;
	pp: number;
	priority: number;
	drain?: number;  // HP吸収率 (0-100%)
	recoil?: number; // 反動ダメージ率 (0-100%)
	secondary?: {
		chance: number;
		status?: 'brn' | 'par' | 'psn' | 'frz' | 'slp';
		boosts?: { [stat: string]: number; };
	};
}

export function convertMoves(): ConvertedMove[] {
	const result: ConvertedMove[] = [];

	for (const [id, data] of Object.entries(Moves)) {
		// 過去世代専用技は除外
		if ((data as any).isNonstandard === 'Past') continue;
		// Z技やMax技は除外
		if ((data as any).isZ || (data as any).isMax) continue;

		const type = normalizeType((data as any).type || 'normal') as MonsterType;
		if (!ALL_TYPES.includes(type)) continue;

		const category = (data as any).category?.toLowerCase() || 'status';

		const move: ConvertedMove = {
			id,
			name: (data as any).name || id,
			type,
			category: category as 'physical' | 'special' | 'status',
			power: (data as any).basePower || 0,
			accuracy: typeof (data as any).accuracy === 'number' ? (data as any).accuracy : 100,
			pp: (data as any).pp || 10,
			priority: (data as any).priority || 0,
		};

		// HP吸収 (drain: [1, 2] -> 50%)
		const drain = (data as any).drain;
		if (drain && Array.isArray(drain) && drain.length === 2) {
			move.drain = Math.floor((drain[0] / drain[1]) * 100);
		}

		// 反動ダメージ (recoil: [1, 3] -> 33%)
		const recoil = (data as any).recoil;
		if (recoil && Array.isArray(recoil) && recoil.length === 2) {
			move.recoil = Math.floor((recoil[0] / recoil[1]) * 100);
		}

		// 追加効果
		const secondary = (data as any).secondary;
		if (secondary && typeof secondary === 'object') {
			const chance = secondary.chance || 100;
			const status = secondary.status;
			const boosts = secondary.boosts;

			if (status || boosts) {
				move.secondary = { chance };
				if (status) move.secondary.status = status;
				if (boosts) move.secondary.boosts = boosts;
			}
		}

		result.push(move);
	}

	return result;
}

// ============================================
// エクスポート用定数
// ============================================

export const SHOWDOWN_TYPE_CHART = buildTypeChart();
export const SHOWDOWN_POKEDEX = convertPokedex();
export const SHOWDOWN_MOVES = convertMoves();

// 便利関数
export function getPokemonById(id: string): ConvertedPokemon | undefined {
	return SHOWDOWN_POKEDEX.find(p => p.id === id.toLowerCase());
}

export function getMoveById(id: string): ConvertedMove | undefined {
	return SHOWDOWN_MOVES.find(m => m.id === id.toLowerCase().replace(/[^a-z0-9]/g, ''));
}
