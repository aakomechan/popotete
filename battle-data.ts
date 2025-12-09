// Custom Battle System - Type Definitions and Data
// 18タイプ完全対応版

export type MonsterType =
	| 'normal' | 'fire' | 'water' | 'grass' | 'electric' | 'ice'
	| 'fighting' | 'poison' | 'ground' | 'flying' | 'psychic' | 'bug'
	| 'rock' | 'ghost' | 'dragon' | 'dark' | 'steel' | 'fairy';

// 全18タイプの相性表（攻撃タイプ → 防御タイプ → 倍率）
// Based on data/typechart.ts (official Pokemon type chart)
export const TYPE_CHART: Record<MonsterType, Record<MonsterType, number>> = {
	normal: {
		normal: 1, fire: 1, water: 1, grass: 1, electric: 1, ice: 1,
		fighting: 1, poison: 1, ground: 1, flying: 1, psychic: 1, bug: 1,
		rock: 0.5, ghost: 0, dragon: 1, dark: 1, steel: 0.5, fairy: 1
	},
	fire: {
		normal: 1, fire: 0.5, water: 0.5, grass: 2, electric: 1, ice: 2,
		fighting: 1, poison: 1, ground: 1, flying: 1, psychic: 1, bug: 2,
		rock: 0.5, ghost: 1, dragon: 0.5, dark: 1, steel: 2, fairy: 1
	},
	water: {
		normal: 1, fire: 2, water: 0.5, grass: 0.5, electric: 1, ice: 1,
		fighting: 1, poison: 1, ground: 2, flying: 1, psychic: 1, bug: 1,
		rock: 2, ghost: 1, dragon: 0.5, dark: 1, steel: 1, fairy: 1
	},
	grass: {
		normal: 1, fire: 0.5, water: 2, grass: 0.5, electric: 1, ice: 1,
		fighting: 1, poison: 0.5, ground: 2, flying: 0.5, psychic: 1, bug: 0.5,
		rock: 2, ghost: 1, dragon: 0.5, dark: 1, steel: 0.5, fairy: 1
	},
	electric: {
		normal: 1, fire: 1, water: 2, grass: 0.5, electric: 0.5, ice: 1,
		fighting: 1, poison: 1, ground: 0, flying: 2, psychic: 1, bug: 1,
		rock: 1, ghost: 1, dragon: 0.5, dark: 1, steel: 1, fairy: 1
	},
	ice: {
		normal: 1, fire: 0.5, water: 0.5, grass: 2, electric: 1, ice: 0.5,
		fighting: 1, poison: 1, ground: 2, flying: 2, psychic: 1, bug: 1,
		rock: 1, ghost: 1, dragon: 2, dark: 1, steel: 0.5, fairy: 1
	},
	fighting: {
		normal: 2, fire: 1, water: 1, grass: 1, electric: 1, ice: 2,
		fighting: 1, poison: 0.5, ground: 1, flying: 0.5, psychic: 0.5, bug: 0.5,
		rock: 2, ghost: 0, dragon: 1, dark: 2, steel: 2, fairy: 0.5
	},
	poison: {
		normal: 1, fire: 1, water: 1, grass: 2, electric: 1, ice: 1,
		fighting: 1, poison: 0.5, ground: 0.5, flying: 1, psychic: 1, bug: 1,
		rock: 0.5, ghost: 0.5, dragon: 1, dark: 1, steel: 0, fairy: 2
	},
	ground: {
		normal: 1, fire: 2, water: 1, grass: 0.5, electric: 2, ice: 1,
		fighting: 1, poison: 2, ground: 1, flying: 0, psychic: 1, bug: 0.5,
		rock: 2, ghost: 1, dragon: 1, dark: 1, steel: 2, fairy: 1
	},
	flying: {
		normal: 1, fire: 1, water: 1, grass: 2, electric: 0.5, ice: 1,
		fighting: 2, poison: 1, ground: 1, flying: 1, psychic: 1, bug: 2,
		rock: 0.5, ghost: 1, dragon: 1, dark: 1, steel: 0.5, fairy: 1
	},
	psychic: {
		normal: 1, fire: 1, water: 1, grass: 1, electric: 1, ice: 1,
		fighting: 2, poison: 2, ground: 1, flying: 1, psychic: 0.5, bug: 1,
		rock: 1, ghost: 1, dragon: 1, dark: 0, steel: 0.5, fairy: 1
	},
	bug: {
		normal: 1, fire: 0.5, water: 1, grass: 2, electric: 1, ice: 1,
		fighting: 0.5, poison: 0.5, ground: 1, flying: 0.5, psychic: 2, bug: 1,
		rock: 1, ghost: 0.5, dragon: 1, dark: 2, steel: 0.5, fairy: 0.5
	},
	rock: {
		normal: 1, fire: 2, water: 1, grass: 1, electric: 1, ice: 2,
		fighting: 0.5, poison: 1, ground: 0.5, flying: 2, psychic: 1, bug: 2,
		rock: 1, ghost: 1, dragon: 1, dark: 1, steel: 0.5, fairy: 1
	},
	ghost: {
		normal: 0, fire: 1, water: 1, grass: 1, electric: 1, ice: 1,
		fighting: 1, poison: 1, ground: 1, flying: 1, psychic: 2, bug: 1,
		rock: 1, ghost: 2, dragon: 1, dark: 0.5, steel: 1, fairy: 1
	},
	dragon: {
		normal: 1, fire: 1, water: 1, grass: 1, electric: 1, ice: 1,
		fighting: 1, poison: 1, ground: 1, flying: 1, psychic: 1, bug: 1,
		rock: 1, ghost: 1, dragon: 2, dark: 1, steel: 0.5, fairy: 0
	},
	dark: {
		normal: 1, fire: 1, water: 1, grass: 1, electric: 1, ice: 1,
		fighting: 0.5, poison: 1, ground: 1, flying: 1, psychic: 2, bug: 1,
		rock: 1, ghost: 2, dragon: 1, dark: 0.5, steel: 1, fairy: 0.5
	},
	steel: {
		normal: 1, fire: 0.5, water: 0.5, grass: 1, electric: 0.5, ice: 2,
		fighting: 1, poison: 1, ground: 1, flying: 1, psychic: 1, bug: 1,
		rock: 2, ghost: 1, dragon: 1, dark: 1, steel: 0.5, fairy: 2
	},
	fairy: {
		normal: 1, fire: 0.5, water: 1, grass: 1, electric: 1, ice: 1,
		fighting: 2, poison: 0.5, ground: 1, flying: 1, psychic: 1, bug: 1,
		rock: 1, ghost: 1, dragon: 2, dark: 2, steel: 0.5, fairy: 1
	},
};

// Move template with category for physical/special distinction
export interface MoveTemplate {
	id: string;
	name: string;
	type: MonsterType;
	power: number;      // 0 for status moves
	accuracy: number;   // 0-100
	pp: number;
	priority: number;   // -6 to +5
	category: 'physical' | 'special' | 'status';  // NEW: 物理/特殊/変化
	effect?: {
		type: 'buff' | 'debuff';
		stat: 'atk' | 'def' | 'spa' | 'spd' | 'spe' | 'crit' | 'evade';
		stages: number;
		target: 'self' | 'opponent';
	};
	secondary?: {  // NEW: 追加効果
		chance: number;  // 発動確率 (%)
		status?: 'brn' | 'par' | 'psn' | 'frz' | 'slp';
		boosts?: { [stat: string]: number; };
	};
	recoil?: number;  // NEW: 反動ダメージ (%)
	drain?: number;   // NEW: HP吸収 (%)
}

// Sample moves (updated with category)
export const MOVE_TEMPLATES: MoveTemplate[] = [
	// Fire moves
	{ id: 'ember', name: 'ひのこ', type: 'fire', power: 40, accuracy: 100, pp: 25, priority: 0, category: 'special', secondary: { chance: 10, status: 'brn' } },
	{ id: 'flamethrower', name: 'かえんほうしゃ', type: 'fire', power: 90, accuracy: 100, pp: 15, priority: 0, category: 'special', secondary: { chance: 10, status: 'brn' } },
	{ id: 'fire_blast', name: 'だいもんじ', type: 'fire', power: 110, accuracy: 85, pp: 5, priority: 0, category: 'special', secondary: { chance: 10, status: 'brn' } },
	{ id: 'flare_blitz', name: 'フレアドライブ', type: 'fire', power: 120, accuracy: 100, pp: 15, priority: 0, category: 'physical', recoil: 33, secondary: { chance: 10, status: 'brn' } },
	{ id: 'fire_punch', name: 'ほのおのパンチ', type: 'fire', power: 75, accuracy: 100, pp: 15, priority: 0, category: 'physical', secondary: { chance: 10, status: 'brn' } },

	// Water moves
	{ id: 'water_gun', name: 'みずでっぽう', type: 'water', power: 40, accuracy: 100, pp: 25, priority: 0, category: 'special' },
	{ id: 'surf', name: 'なみのり', type: 'water', power: 90, accuracy: 100, pp: 15, priority: 0, category: 'special' },
	{ id: 'hydro_pump', name: 'ハイドロポンプ', type: 'water', power: 110, accuracy: 80, pp: 5, priority: 0, category: 'special' },
	{ id: 'aqua_jet', name: 'アクアジェット', type: 'water', power: 40, accuracy: 100, pp: 20, priority: 1, category: 'physical' },
	{ id: 'waterfall', name: 'たきのぼり', type: 'water', power: 80, accuracy: 100, pp: 15, priority: 0, category: 'physical' },

	// Grass moves
	{ id: 'vine_whip', name: 'つるのムチ', type: 'grass', power: 45, accuracy: 100, pp: 25, priority: 0, category: 'physical' },
	{ id: 'razor_leaf', name: 'はっぱカッター', type: 'grass', power: 55, accuracy: 95, pp: 25, priority: 0, category: 'physical' },
	{ id: 'solar_beam', name: 'ソーラービーム', type: 'grass', power: 120, accuracy: 100, pp: 10, priority: 0, category: 'special' },
	{ id: 'energy_ball', name: 'エナジーボール', type: 'grass', power: 90, accuracy: 100, pp: 10, priority: 0, category: 'special' },
	{ id: 'giga_drain', name: 'ギガドレイン', type: 'grass', power: 75, accuracy: 100, pp: 10, priority: 0, category: 'special', drain: 50 },

	// Electric moves
	{ id: 'thunder_shock', name: 'でんきショック', type: 'electric', power: 40, accuracy: 100, pp: 30, priority: 0, category: 'special', secondary: { chance: 10, status: 'par' } },
	{ id: 'thunderbolt', name: '10まんボルト', type: 'electric', power: 90, accuracy: 100, pp: 15, priority: 0, category: 'special', secondary: { chance: 10, status: 'par' } },
	{ id: 'thunder', name: 'かみなり', type: 'electric', power: 110, accuracy: 70, pp: 10, priority: 0, category: 'special', secondary: { chance: 30, status: 'par' } },
	{ id: 'volt_tackle', name: 'ボルテッカー', type: 'electric', power: 120, accuracy: 100, pp: 15, priority: 0, category: 'physical', recoil: 33, secondary: { chance: 10, status: 'par' } },

	// Ice moves
	{ id: 'ice_beam', name: 'れいとうビーム', type: 'ice', power: 90, accuracy: 100, pp: 10, priority: 0, category: 'special', secondary: { chance: 10, status: 'frz' } },
	{ id: 'blizzard', name: 'ふぶき', type: 'ice', power: 110, accuracy: 70, pp: 5, priority: 0, category: 'special', secondary: { chance: 10, status: 'frz' } },
	{ id: 'ice_punch', name: 'れいとうパンチ', type: 'ice', power: 75, accuracy: 100, pp: 15, priority: 0, category: 'physical', secondary: { chance: 10, status: 'frz' } },

	// Fighting moves
	{ id: 'karate_chop', name: 'からてチョップ', type: 'fighting', power: 50, accuracy: 100, pp: 25, priority: 0, category: 'physical' },
	{ id: 'close_combat', name: 'インファイト', type: 'fighting', power: 120, accuracy: 100, pp: 5, priority: 0, category: 'physical' },
	{ id: 'aura_sphere', name: 'はどうだん', type: 'fighting', power: 80, accuracy: 100, pp: 20, priority: 0, category: 'special' },

	// Poison moves
	{ id: 'poison_sting', name: 'どくばり', type: 'poison', power: 15, accuracy: 100, pp: 35, priority: 0, category: 'physical', secondary: { chance: 30, status: 'psn' } },
	{ id: 'sludge_bomb', name: 'ヘドロばくだん', type: 'poison', power: 90, accuracy: 100, pp: 10, priority: 0, category: 'special', secondary: { chance: 30, status: 'psn' } },

	// Ground moves
	{ id: 'earthquake', name: 'じしん', type: 'ground', power: 100, accuracy: 100, pp: 10, priority: 0, category: 'physical' },
	{ id: 'earth_power', name: 'だいちのちから', type: 'ground', power: 90, accuracy: 100, pp: 10, priority: 0, category: 'special' },

	// Flying moves
	{ id: 'aerial_ace', name: 'つばめがえし', type: 'flying', power: 60, accuracy: 100, pp: 20, priority: 0, category: 'physical' },
	{ id: 'brave_bird', name: 'ブレイブバード', type: 'flying', power: 120, accuracy: 100, pp: 15, priority: 0, category: 'physical', recoil: 33 },

	// Psychic moves
	{ id: 'confusion', name: 'ねんりき', type: 'psychic', power: 50, accuracy: 100, pp: 25, priority: 0, category: 'special' },
	{ id: 'psychic', name: 'サイコキネシス', type: 'psychic', power: 90, accuracy: 100, pp: 10, priority: 0, category: 'special' },

	// Bug moves
	{ id: 'bug_buzz', name: 'むしのさざめき', type: 'bug', power: 90, accuracy: 100, pp: 10, priority: 0, category: 'special' },
	{ id: 'x_scissor', name: 'シザークロス', type: 'bug', power: 80, accuracy: 100, pp: 15, priority: 0, category: 'physical' },

	// Rock moves
	{ id: 'rock_slide', name: 'いわなだれ', type: 'rock', power: 75, accuracy: 90, pp: 10, priority: 0, category: 'physical' },
	{ id: 'stone_edge', name: 'ストーンエッジ', type: 'rock', power: 100, accuracy: 80, pp: 5, priority: 0, category: 'physical' },

	// Ghost moves
	{ id: 'shadow_ball', name: 'シャドーボール', type: 'ghost', power: 80, accuracy: 100, pp: 15, priority: 0, category: 'special' },
	{ id: 'shadow_claw', name: 'シャドークロー', type: 'ghost', power: 70, accuracy: 100, pp: 15, priority: 0, category: 'physical' },

	// Dragon moves
	{ id: 'dragon_claw', name: 'ドラゴンクロー', type: 'dragon', power: 80, accuracy: 100, pp: 15, priority: 0, category: 'physical' },
	{ id: 'draco_meteor', name: 'りゅうせいぐん', type: 'dragon', power: 130, accuracy: 90, pp: 5, priority: 0, category: 'special' },

	// Dark moves
	{ id: 'bite', name: 'かみつく', type: 'dark', power: 60, accuracy: 100, pp: 25, priority: 0, category: 'physical' },
	{ id: 'crunch', name: 'かみくだく', type: 'dark', power: 80, accuracy: 100, pp: 15, priority: 0, category: 'physical' },
	{ id: 'dark_pulse', name: 'あくのはどう', type: 'dark', power: 80, accuracy: 100, pp: 15, priority: 0, category: 'special' },

	// Steel moves
	{ id: 'iron_tail', name: 'アイアンテール', type: 'steel', power: 100, accuracy: 75, pp: 15, priority: 0, category: 'physical' },
	{ id: 'flash_cannon', name: 'ラスターカノン', type: 'steel', power: 80, accuracy: 100, pp: 10, priority: 0, category: 'special' },

	// Fairy moves
	{ id: 'moonblast', name: 'ムーンフォース', type: 'fairy', power: 95, accuracy: 100, pp: 15, priority: 0, category: 'special' },
	{ id: 'play_rough', name: 'じゃれつく', type: 'fairy', power: 90, accuracy: 90, pp: 10, priority: 0, category: 'physical' },

	// Normal moves
	{ id: 'tackle', name: 'たいあたり', type: 'normal', power: 40, accuracy: 100, pp: 35, priority: 0, category: 'physical' },
	{ id: 'quick_attack', name: 'でんこうせっか', type: 'normal', power: 40, accuracy: 100, pp: 30, priority: 1, category: 'physical' },
	{ id: 'body_slam', name: 'のしかかり', type: 'normal', power: 85, accuracy: 100, pp: 15, priority: 0, category: 'physical', secondary: { chance: 30, status: 'par' } },
	{ id: 'hyper_beam', name: 'はかいこうせん', type: 'normal', power: 150, accuracy: 90, pp: 5, priority: 0, category: 'special' },
	{ id: 'double_edge', name: 'すてみタックル', type: 'normal', power: 120, accuracy: 100, pp: 15, priority: 0, category: 'physical', recoil: 33 },

	// Status moves
	{
		id: 'growl', name: 'なきごえ', type: 'normal', power: 0, accuracy: 100, pp: 40, priority: 0, category: 'status',
		effect: { type: 'debuff', stat: 'atk', stages: -1, target: 'opponent' }
	},
	{
		id: 'defense_curl', name: 'まるくなる', type: 'normal', power: 0, accuracy: 100, pp: 40, priority: 0, category: 'status',
		effect: { type: 'buff', stat: 'def', stages: 1, target: 'self' }
	},
	{
		id: 'agility', name: 'こうそくいどう', type: 'psychic', power: 0, accuracy: 100, pp: 30, priority: 0, category: 'status',
		effect: { type: 'buff', stat: 'spe', stages: 2, target: 'self' }
	},
	{
		id: 'swords_dance', name: 'つるぎのまい', type: 'normal', power: 0, accuracy: 100, pp: 20, priority: 0, category: 'status',
		effect: { type: 'buff', stat: 'atk', stages: 2, target: 'self' }
	},
	{
		id: 'calm_mind', name: 'めいそう', type: 'psychic', power: 0, accuracy: 100, pp: 20, priority: 0, category: 'status',
		effect: { type: 'buff', stat: 'spa', stages: 1, target: 'self' }
	},
];

// Monster template with 6 stats
export interface MonsterTemplate {
	id: string;
	name: string;
	type: MonsterType;
	type2?: MonsterType;  // NEW: デュアルタイプ対応
	baseStats: {
		hp: number;
		atk: number;   // 攻撃
		def: number;   // 防御
		spa: number;   // 特攻 (NEW)
		spd: number;   // 特防 (NEW, 旧:素早さ)
		spe: number;   // 素早さ (NEW)
	};
	abilities: string[];  // 特性リスト
	movePool: string[];   // 覚える技
	spriteUrl: string;
}

// Sample monsters with 6 stats
export const MONSTER_TEMPLATES: MonsterTemplate[] = [
	// Fire types
	{
		id: 'charizard',
		name: 'リザードン',
		type: 'fire',
		type2: 'flying',
		baseStats: { hp: 78, atk: 84, def: 78, spa: 109, spd: 85, spe: 100 },
		abilities: ['blaze', 'solar_power'],
		movePool: ['flamethrower', 'fire_blast', 'dragon_claw', 'aerial_ace', 'earthquake'],
		spriteUrl: 'https://play.pokemonshowdown.com/sprites/gen5ani/charizard.gif',
	},
	{
		id: 'arcanine',
		name: 'ウインディ',
		type: 'fire',
		baseStats: { hp: 90, atk: 110, def: 80, spa: 100, spd: 80, spe: 95 },
		abilities: ['intimidate', 'flash_fire'],
		movePool: ['flare_blitz', 'fire_punch', 'close_combat', 'crunch', 'quick_attack'],
		spriteUrl: 'https://play.pokemonshowdown.com/sprites/gen5ani/arcanine.gif',
	},

	// Water types
	{
		id: 'blastoise',
		name: 'カメックス',
		type: 'water',
		baseStats: { hp: 79, atk: 83, def: 100, spa: 85, spd: 105, spe: 78 },
		abilities: ['torrent', 'rain_dish'],
		movePool: ['hydro_pump', 'surf', 'ice_beam', 'flash_cannon', 'aqua_jet'],
		spriteUrl: 'https://play.pokemonshowdown.com/sprites/gen5ani/blastoise.gif',
	},
	{
		id: 'gyarados',
		name: 'ギャラドス',
		type: 'water',
		type2: 'flying',
		baseStats: { hp: 95, atk: 125, def: 79, spa: 60, spd: 100, spe: 81 },
		abilities: ['intimidate', 'moxie'],
		movePool: ['waterfall', 'earthquake', 'stone_edge', 'crunch', 'dragon_claw'],
		spriteUrl: 'https://play.pokemonshowdown.com/sprites/gen5ani/gyarados.gif',
	},

	// Grass types
	{
		id: 'venusaur',
		name: 'フシギバナ',
		type: 'grass',
		type2: 'poison',
		baseStats: { hp: 80, atk: 82, def: 83, spa: 100, spd: 100, spe: 80 },
		abilities: ['overgrow', 'chlorophyll'],
		movePool: ['energy_ball', 'sludge_bomb', 'earth_power', 'solar_beam', 'giga_drain'],
		spriteUrl: 'https://play.pokemonshowdown.com/sprites/gen5ani/venusaur.gif',
	},

	// Electric types
	{
		id: 'pikachu',
		name: 'ピカチュウ',
		type: 'electric',
		baseStats: { hp: 35, atk: 55, def: 40, spa: 50, spd: 50, spe: 90 },
		abilities: ['static', 'lightning_rod'],
		movePool: ['thunderbolt', 'volt_tackle', 'quick_attack', 'iron_tail', 'thunder'],
		spriteUrl: 'https://play.pokemonshowdown.com/sprites/gen5ani/pikachu.gif',
	},
	{
		id: 'jolteon',
		name: 'サンダース',
		type: 'electric',
		baseStats: { hp: 65, atk: 65, def: 60, spa: 110, spd: 95, spe: 130 },
		abilities: ['volt_absorb', 'quick_feet'],
		movePool: ['thunderbolt', 'thunder', 'shadow_ball', 'quick_attack'],
		spriteUrl: 'https://play.pokemonshowdown.com/sprites/gen5ani/jolteon.gif',
	},

	// Ground types
	{
		id: 'sandslash',
		name: 'サンドパン',
		type: 'ground',
		baseStats: { hp: 75, atk: 100, def: 110, spa: 45, spd: 55, spe: 65 },
		abilities: ['sand_veil', 'sand_rush'],
		movePool: ['earthquake', 'stone_edge', 'x_scissor', 'swords_dance'],
		spriteUrl: 'https://play.pokemonshowdown.com/sprites/gen5ani/sandslash.gif',
	},

	// Psychic types
	{
		id: 'alakazam',
		name: 'フーディン',
		type: 'psychic',
		baseStats: { hp: 55, atk: 50, def: 45, spa: 135, spd: 95, spe: 120 },
		abilities: ['synchronize', 'magic_guard'],
		movePool: ['psychic', 'shadow_ball', 'energy_ball', 'calm_mind'],
		spriteUrl: 'https://play.pokemonshowdown.com/sprites/gen5ani/alakazam.gif',
	},

	// Ghost types
	{
		id: 'gengar',
		name: 'ゲンガー',
		type: 'ghost',
		type2: 'poison',
		baseStats: { hp: 60, atk: 65, def: 60, spa: 130, spd: 75, spe: 110 },
		abilities: ['cursed_body', 'levitate'],
		movePool: ['shadow_ball', 'sludge_bomb', 'dark_pulse', 'thunderbolt'],
		spriteUrl: 'https://play.pokemonshowdown.com/sprites/gen5ani/gengar.gif',
	},

	// Dragon types
	{
		id: 'dragonite',
		name: 'カイリュー',
		type: 'dragon',
		type2: 'flying',
		baseStats: { hp: 91, atk: 134, def: 95, spa: 100, spd: 100, spe: 80 },
		abilities: ['inner_focus', 'multiscale'],
		movePool: ['dragon_claw', 'earthquake', 'fire_punch', 'ice_punch', 'aqua_jet'],
		spriteUrl: 'https://play.pokemonshowdown.com/sprites/gen5ani/dragonite.gif',
	},

	// Normal types
	{
		id: 'snorlax',
		name: 'カビゴン',
		type: 'normal',
		baseStats: { hp: 160, atk: 110, def: 65, spa: 65, spd: 110, spe: 30 },
		abilities: ['immunity', 'thick_fat'],
		movePool: ['body_slam', 'earthquake', 'crunch', 'hyper_beam'],
		spriteUrl: 'https://play.pokemonshowdown.com/sprites/gen5ani/snorlax.gif',
	},
];

// ============================================
// 特性 (Abilities)
// ============================================

export type AbilityTrigger =
	| 'onSwitchIn'      // 場に出たとき
	| 'onTurnStart'     // ターン開始時
	| 'onTurnEnd'       // ターン終了時
	| 'onBeforeMove'    // 技を使う前
	| 'onAfterMove'     // 技を使った後
	| 'onDamageDealt'   // ダメージを与えたとき
	| 'onDamageTaken'   // ダメージを受けたとき
	| 'onStatChange'    // ステータス変化時
	| 'onStatusInflict' // 状態異常を受けるとき
	| 'passive';        // 常時発動

export interface AbilityTemplate {
	id: string;
	name: string;
	description: string;
	trigger: AbilityTrigger;
	effect: {
		type: 'stat_boost' | 'stat_reduce' | 'type_boost' | 'immunity' | 'heal' | 'damage' | 'prevent_status' | 'weather';
		stat?: 'atk' | 'def' | 'spa' | 'spd' | 'spe';
		amount?: number;      // 倍率 or 段階数
		targetType?: MonsterType;  // タイプブースト用
		condition?: 'hp_low' | 'type_match' | 'always';  // 発動条件
		statusImmunity?: ('brn' | 'par' | 'psn' | 'frz' | 'slp')[];
	};
}

export const ABILITY_TEMPLATES: AbilityTemplate[] = [
	// 御三家特性
	{
		id: 'blaze', name: 'もうか', description: 'HP1/3以下で炎技1.5倍',
		trigger: 'onBeforeMove',
		effect: { type: 'type_boost', targetType: 'fire', amount: 1.5, condition: 'hp_low' }
	},
	{
		id: 'overgrow', name: 'しんりょく', description: 'HP1/3以下で草技1.5倍',
		trigger: 'onBeforeMove',
		effect: { type: 'type_boost', targetType: 'grass', amount: 1.5, condition: 'hp_low' }
	},
	{
		id: 'torrent', name: 'げきりゅう', description: 'HP1/3以下で水技1.5倍',
		trigger: 'onBeforeMove',
		effect: { type: 'type_boost', targetType: 'water', amount: 1.5, condition: 'hp_low' }
	},

	// 人気特性
	{
		id: 'intimidate', name: 'いかく', description: '場に出たとき相手の攻撃1段階ダウン',
		trigger: 'onSwitchIn',
		effect: { type: 'stat_reduce', stat: 'atk', amount: -1 }
	},
	{
		id: 'levitate', name: 'ふゆう', description: '地面タイプの技を受けない',
		trigger: 'passive',
		effect: { type: 'immunity', targetType: 'ground' }
	},
	{
		id: 'flash_fire', name: 'もらいび', description: '炎技を受けると炎技1.5倍',
		trigger: 'onDamageTaken',
		effect: { type: 'immunity', targetType: 'fire' }
	},
	{
		id: 'water_absorb', name: 'ちょすい', description: '水技を受けるとHP回復',
		trigger: 'onDamageTaken',
		effect: { type: 'immunity', targetType: 'water' }
	},
	{
		id: 'volt_absorb', name: 'ちくでん', description: '電気技を受けるとHP回復',
		trigger: 'onDamageTaken',
		effect: { type: 'immunity', targetType: 'electric' }
	},

	// ステータス関連
	{
		id: 'guts', name: 'こんじょう', description: '状態異常で攻撃1.5倍',
		trigger: 'passive',
		effect: { type: 'stat_boost', stat: 'atk', amount: 1.5 }
	},
	{
		id: 'marvel_scale', name: 'ふしぎなうろこ', description: '状態異常で防御1.5倍',
		trigger: 'passive',
		effect: { type: 'stat_boost', stat: 'def', amount: 1.5 }
	},

	// 天候特性
	{
		id: 'chlorophyll', name: 'ようりょくそ', description: '晴れで素早さ2倍',
		trigger: 'passive',
		effect: { type: 'stat_boost', stat: 'spe', amount: 2 }
	},
	{
		id: 'swift_swim', name: 'すいすい', description: '雨で素早さ2倍',
		trigger: 'passive',
		effect: { type: 'stat_boost', stat: 'spe', amount: 2 }
	},
	{
		id: 'sand_rush', name: 'すなかき', description: '砂嵐で素早さ2倍',
		trigger: 'passive',
		effect: { type: 'stat_boost', stat: 'spe', amount: 2 }
	},

	// 状態異常耐性
	{
		id: 'immunity', name: 'めんえき', description: '毒状態にならない',
		trigger: 'passive',
		effect: { type: 'prevent_status', statusImmunity: ['psn'] }
	},
	{
		id: 'limber', name: 'じゅうなん', description: 'まひ状態にならない',
		trigger: 'passive',
		effect: { type: 'prevent_status', statusImmunity: ['par'] }
	},
	{
		id: 'magma_armor', name: 'マグマのよろい', description: 'こおり状態にならない',
		trigger: 'passive',
		effect: { type: 'prevent_status', statusImmunity: ['frz'] }
	},
	{
		id: 'insomnia', name: 'ふみん', description: 'ねむり状態にならない',
		trigger: 'passive',
		effect: { type: 'prevent_status', statusImmunity: ['slp'] }
	},
	{
		id: 'water_veil', name: 'みずのベール', description: 'やけど状態にならない',
		trigger: 'passive',
		effect: { type: 'prevent_status', statusImmunity: ['brn'] }
	},

	// 耐久系
	{
		id: 'thick_fat', name: 'あついしぼう', description: '炎・氷タイプの被ダメージ半減',
		trigger: 'onDamageTaken',
		effect: { type: 'stat_boost', stat: 'spd', amount: 0.5 }
	},
	{
		id: 'multiscale', name: 'マルチスケイル', description: 'HP満タン時の被ダメージ半減',
		trigger: 'onDamageTaken',
		effect: { type: 'stat_boost', stat: 'def', amount: 0.5, condition: 'hp_low' }
	},
];

// ============================================
// アイテム (Items)
// ============================================

export type ItemTrigger =
	| 'onHold'      // 持っているだけで発動
	| 'onTurnEnd'   // ターン終了時
	| 'onHpLow'     // HP一定以下で発動
	| 'onMove'      // 技使用時
	| 'onDamage';   // ダメージ計算時

export interface ItemTemplate {
	id: string;
	name: string;
	description: string;
	trigger: ItemTrigger;
	effect: {
		type: 'stat_boost' | 'type_boost' | 'heal' | 'damage_boost' | 'priority';
		stat?: 'atk' | 'def' | 'spa' | 'spd' | 'spe';
		amount?: number;
		targetType?: MonsterType;
		consumable?: boolean;  // 消費アイテムか
		restriction?: 'physical' | 'special' | 'status';  // 技制限
	};
}

export const ITEM_TEMPLATES: ItemTemplate[] = [
	// こだわり系
	{
		id: 'choiceband', name: 'こだわりハチマキ', description: '攻撃1.5倍、同じ技しか出せない',
		trigger: 'onMove',
		effect: { type: 'stat_boost', stat: 'atk', amount: 1.5, restriction: 'physical' }
	},
	{
		id: 'choicespecs', name: 'こだわりメガネ', description: '特攻1.5倍、同じ技しか出せない',
		trigger: 'onMove',
		effect: { type: 'stat_boost', stat: 'spa', amount: 1.5, restriction: 'special' }
	},
	{
		id: 'choicescarf', name: 'こだわりスカーフ', description: '素早さ1.5倍、同じ技しか出せない',
		trigger: 'onHold',
		effect: { type: 'stat_boost', stat: 'spe', amount: 1.5 }
	},

	// 回復系
	{
		id: 'leftovers', name: 'たべのこし', description: '毎ターンHP1/16回復',
		trigger: 'onTurnEnd',
		effect: { type: 'heal', amount: 1 / 16 }
	},
	{
		id: 'shellbell', name: 'かいがらのすず', description: '与ダメージの1/8を回復',
		trigger: 'onDamage',
		effect: { type: 'heal', amount: 1 / 8 }
	},
	{
		id: 'sitrusberry', name: 'オボンのみ', description: 'HP1/2以下で1/4回復',
		trigger: 'onHpLow',
		effect: { type: 'heal', amount: 1 / 4, consumable: true }
	},

	// ダメージブースト系
	{
		id: 'lifeorb', name: 'いのちのたま', description: '技威力1.3倍、攻撃時HP1/10消費',
		trigger: 'onMove',
		effect: { type: 'damage_boost', amount: 1.3 }
	},
	{
		id: 'expertbelt', name: 'たつじんのおび', description: '効果抜群の技1.2倍',
		trigger: 'onDamage',
		effect: { type: 'damage_boost', amount: 1.2 }
	},

	// タイプ強化系
	{
		id: 'charcoal', name: 'もくたん', description: '炎技1.2倍',
		trigger: 'onMove',
		effect: { type: 'type_boost', targetType: 'fire', amount: 1.2 }
	},
	{
		id: 'mysticwater', name: 'しんぴのしずく', description: '水技1.2倍',
		trigger: 'onMove',
		effect: { type: 'type_boost', targetType: 'water', amount: 1.2 }
	},
	{
		id: 'miracleseed', name: 'きせきのタネ', description: '草技1.2倍',
		trigger: 'onMove',
		effect: { type: 'type_boost', targetType: 'grass', amount: 1.2 }
	},
	{
		id: 'magnet', name: 'じしゃく', description: '電気技1.2倍',
		trigger: 'onMove',
		effect: { type: 'type_boost', targetType: 'electric', amount: 1.2 }
	},

	// 防御系
	{
		id: 'assaultvest', name: 'とつげきチョッキ', description: '特防1.5倍、変化技使用不可',
		trigger: 'onHold',
		effect: { type: 'stat_boost', stat: 'spd', amount: 1.5, restriction: 'status' }
	},
	{
		id: 'eviolite', name: 'しんかのきせき', description: '進化前のポケモンの防御・特防1.5倍',
		trigger: 'onHold',
		effect: { type: 'stat_boost', stat: 'def', amount: 1.5 }
	},

	// きあいのタスキ
	{
		id: 'focussash', name: 'きあいのタスキ', description: 'HP満タンで一撃でひんしにならない',
		trigger: 'onDamage',
		effect: { type: 'heal', amount: 1, consumable: true }
	},
];

// ============================================
// 状態異常 (Status Conditions)
// ============================================

export type StatusCondition = 'brn' | 'par' | 'psn' | 'frz' | 'slp' | 'tox';

export interface StatusTemplate {
	id: StatusCondition;
	name: string;
	description: string;
	// 効果
	turnDamage?: number;       // ターン終了時ダメージ (maxHPの割合)
	statModifier?: {           // ステータス補正
		stat: 'atk' | 'def' | 'spa' | 'spd' | 'spe';
		multiplier: number;
	};
	cannotMove?: boolean;      // 行動不能になる可能性
	moveChance?: number;       // 行動できる確率 (0-1)
	thawChance?: number;       // 解除される確率 (0-1)
	// 持続
	minTurns?: number;         // 最小ターン
	maxTurns?: number;         // 最大ターン
	escalating?: boolean;      // ダメージが増加するか (もうどく)
}

export const STATUS_TEMPLATES: StatusTemplate[] = [
	{
		id: 'brn',
		name: 'やけど',
		description: '毎ターン1/16ダメージ、物理攻撃力半減',
		turnDamage: 1 / 16,
		statModifier: { stat: 'atk', multiplier: 0.5 }
	},
	{
		id: 'par',
		name: 'まひ',
		description: '1/4の確率で行動不能、素早さ1/2',
		cannotMove: true,
		moveChance: 0.75,
		statModifier: { stat: 'spe', multiplier: 0.5 }
	},
	{
		id: 'psn',
		name: 'どく',
		description: '毎ターン1/8ダメージ',
		turnDamage: 1 / 8
	},
	{
		id: 'tox',
		name: 'もうどく',
		description: '毎ターンダメージ増加（1/16→2/16→...）',
		turnDamage: 1 / 16,
		escalating: true
	},
	{
		id: 'frz',
		name: 'こおり',
		description: '行動不能、20%で解除、炎技で解除',
		cannotMove: true,
		moveChance: 0,
		thawChance: 0.20
	},
	{
		id: 'slp',
		name: 'ねむり',
		description: '1-3ターン行動不能',
		cannotMove: true,
		moveChance: 0,
		minTurns: 1,
		maxTurns: 3
	},
];

// 状態異常の適用可能判定
export function canInflictStatus(
	status: StatusCondition,
	defenderType: MonsterType,
	defenderType2?: MonsterType
): boolean {
	// タイプによる免疫
	const types = [defenderType];
	if (defenderType2) types.push(defenderType2);

	switch (status) {
		case 'brn':
			// 炎タイプはやけどにならない
			return !types.includes('fire');
		case 'par':
			// 電気タイプはまひにならない (Gen6以降)
			return !types.includes('electric');
		case 'psn':
		case 'tox':
			// 毒・鋼タイプは毒にならない
			return !types.includes('poison') && !types.includes('steel');
		case 'frz':
			// 氷タイプはこおりにならない
			return !types.includes('ice');
		case 'slp':
			// ねむりには免疫がない
			return true;
		default:
			return true;
	}
}
