/**
 * Showdownデータ抽出スクリプト（日本語名・技説明対応版）
 * node extract-showdown-data.js で実行
 */

const fs = require('fs');
const path = require('path');

// Showdownのデータを読み込み
// Showdownのデータを読み込み
const {Pokedex} = require('./data/pokedex');
const {Moves} = require('./data/moves');
const {TypeChart} = require('./data/typechart');
const {Learnsets} = require('./data/learnsets');
const {Abilities} = require('./data/abilities');
const {Items} = require('./data/items');
const {JP_SPECIES, JP_MOVES, JP_TYPES, JP_ABILITIES} = require('./data/jp_names');
const {MovesText} = require('./data/text/moves');
const {AbilitiesText} = require('./data/text/abilities');
const {ItemsText} = require('./data/text/items');

const JP_ITEMS_DICT = {
	'leftovers': 'たべのこし',
	'choiceband': 'こだわりハチマキ',
	'choicescarf': 'こだわりスカーフ',
	'choicespecs': 'こだわりメガネ',
	'lifeorb': 'いのちのたま',
	'focussash': 'きあいのタスキ',
	'sitrusberry': 'オボンのみ',
	'lumberry': 'ラムのみ',
	'expertbelt': 'たつじんのおび',
	'rockyhelmet': 'ゴツゴツメット',
	'assaultvest': 'とつげきチョッキ',
	'weaknesspolicy': 'じゃくてんほけん',
	'flameorb': 'かえんだま',
	'toxicorb': 'どくどくだま',
	'blacksludge': 'くろいヘドロ',
	'whiteherb': 'しろいハーブ',
	'mentalherb': 'メンタルハーブ',
	'powerherb': 'パワフルハーブ',
	'lightclay': 'ひかりのねんど',
	'kingsrock': 'おうじゃのしるし',
	'quickclaw': 'せんせいのツメ',
	'laggingtail': 'こうこうのしっぽ',
	'ironball': 'くろいてっきゅう',
	'airballoon': 'ふうせん',
	'redcard': 'レッドカード',
	'ejectbutton': 'だっしゅつボタン',
	'safetygoggles': 'ぼうじんゴーグル',
	'heavydutyboots': 'あつぞこブーツ',
	'eviolite': 'しんかのきせき',
	'charcoal': 'もくたん',
	'mysticwater': 'しんぴのしずく',
	'miracleseed': 'きせきのタネ',
	'magnet': 'じしゃく',
	'hardstone': 'かたいいし',
	'nevermeltice': 'とけないこおり',
	'blackbelt': 'くろおび',
	'poisonbarb': 'どくバリ',
	'softsand': 'やわらかいすな',
	'sharpbeak': 'するどいくちばし',
	'twistedspoon': 'まがったスプーン',
	'silverpowder': 'ぎんのこな',
	'dragonfang': 'りゅうのキバ',
	'spelltag': 'のろいのおふだ',
	'metalcoat': 'メタルコート',
	'blackglasses': 'くろいメガネ',
	'silkscarf': 'シルクのスカーフ',
	'occaberry': 'オッカのみ',
	'passhoberry': 'イトケのみ',
	'wacanberry': 'ソクノのみ',
	'rindoberry': 'リンドのみ',
	'yacheberry': 'ヤチェのみ',
	'chopleberry': 'ヨプのみ',
	'kebiaberry': 'ビアーのみ',
	'shucaberry': 'シュカのみ',
	'cobaberry': 'バコウのみ',
	'payapaberry': 'ウタンのみ',
	'tangaberry': 'タンガのみ',
	'chartiberry': 'ヨロギのみ',
	'kasibberry': 'カシブのみ',
	'habanberry': 'ハバンのみ',
	'colburberry': 'ナモのみ',
	'babiriberry': 'リリバのみ',
	'chilanberry': 'ホズのみ',
	'liechiberry': 'チイラのみ',
	'ganlonberry': 'リュガのみ',
	'salacberry': 'カムラのみ',
	'petayaberry': 'ヤタピのみ',
	'apicotberry': 'ズアのみ',
	'lansatberry': 'サンのみ',
	'starfberry': 'スターのみ',
	'micleberry': 'ミクルのみ',
	'custapberry': 'イバンのみ',
	'jabocaberry': 'ジャポのみ',
	'rowapberry': 'レンブのみ',
	'keeberry': 'アッキのみ',
	'marangaberry': 'タラプのみ',
	'oranberry': 'オレンのみ',
	'leppaberry': 'ヒメリのみ',
	'chestoberry': 'カゴのみ',
	'pechaberry': 'モモンのみ',
	'rawstberry': 'チーゴのみ',
	'cheriberry': 'クラボのみ',
	'aspearberry': 'ナナシのみ',
	'persimberry': 'キーのみ',
};

// Gen4 Random Battle Sets
const Gen4Sets = require('./data/random-battles/gen4/sets.json');

const ALL_TYPES = [
	'normal', 'fire', 'water', 'grass', 'electric', 'ice',
	'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
	'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
];

const DAMAGE_MULTIPLIERS = {
	0: 1,
	1: 2,
	2: 0.5,
	3: 0,
};

function normalizeType(type) {
	return type.toLowerCase();
}

function buildTypeChart() {
	const chart = {};

	for (const atkType of ALL_TYPES) {
		chart[atkType] = {};
		for (const defType of ALL_TYPES) {
			chart[atkType][defType] = 1;
		}
	}

	for (const [defTypeRaw, data] of Object.entries(TypeChart)) {
		const defType = normalizeType(defTypeRaw);
		if (!ALL_TYPES.includes(defType)) continue;

		const damageTaken = data.damageTaken;
		if (!damageTaken) continue;

		for (const [atkTypeRaw, value] of Object.entries(damageTaken)) {
			const atkType = normalizeType(atkTypeRaw);
			if (!ALL_TYPES.includes(atkType)) continue;
			if (typeof value !== 'number') continue;

			chart[atkType][defType] = DAMAGE_MULTIPLIERS[value] ?? 1;
		}
	}

	return chart;
}

// 技の効果説明を生成
function generateMoveDescription(move) {
	const parts = [];

	// 基本情報
	if (move.category === 'status') {
		parts.push('変化技');
	} else {
		const catName = move.category === 'physical' ? '物理' : '特殊';
		parts.push(`${catName}・威力${move.power}`);
	}

	// 命中率
	if (move.accuracy !== 100 && move.accuracy !== true) {
		parts.push(`命中${move.accuracy}`);
	}

	// 追加効果
	if (move.secondary) {
		const chance = move.secondary.chance;
		const status = move.secondary.status;
		const boosts = move.secondary.boosts;

		if (status) {
			const statusNames = {
				'brn': 'やけど',
				'par': 'まひ',
				'psn': 'どく',
				'tox': 'もうどく',
				'frz': 'こおり',
				'slp': 'ねむり',
			};
			parts.push(`${chance}%で${statusNames[status] || status}`);
		}

		if (boosts) {
			const statNames = {
				'atk': 'こうげき', 'def': 'ぼうぎょ', 'spa': 'とくこう',
				'spd': 'とくぼう', 'spe': 'すばやさ', 'accuracy': '命中',
				'evasion': '回避',
			};
			const boostParts = [];
			for (const [stat, value] of Object.entries(boosts)) {
				const dir = value > 0 ? '↑' : '↓';
				boostParts.push(`${statNames[stat] || stat}${dir}${Math.abs(value)}`);
			}
			if (boostParts.length > 0) {
				parts.push(`${chance}%で${boostParts.join('/')}`);
			}
		}
	}

	// 自己強化
	if (move.boosts) {
		const statNames = {
			'atk': 'こうげき', 'def': 'ぼうぎょ', 'spa': 'とくこう',
			'spd': 'とくぼう', 'spe': 'すばやさ',
		};
		const boostParts = [];
		for (const [stat, value] of Object.entries(move.boosts)) {
			const dir = value > 0 ? '↑' : '↓';
			boostParts.push(`${statNames[stat] || stat}${dir}${Math.abs(value)}`);
		}
		if (boostParts.length > 0) {
			parts.push(`自分の${boostParts.join('/')}`);
		}
	}

	// HP吸収
	if (move.drain) {
		const percent = Math.floor((move.drain[0] / move.drain[1]) * 100);
		parts.push(`与ダメの${percent}%回復`);
	}

	// 反動
	if (move.recoil) {
		const percent = Math.floor((move.recoil[0] / move.recoil[1]) * 100);
		parts.push(`${percent}%反動`);
	}

	// 優先度
	if (move.priority && move.priority !== 0) {
		parts.push(`先制+${move.priority}`);
	}

	return parts.join('・');
}

function convertPokedex() {
	const result = [];

	for (const [id, data] of Object.entries(Pokedex)) {
		if (data.forme || data.isNonstandard) continue;

		// Gen4までに制限（#1-493: フシギダネ〜アルセウス）
		const num = data.num;
		if (!num || num < 1 || num > 493) continue;

		const types = data.types;
		if (!types || types.length === 0) continue;

		const baseStats = data.baseStats;
		if (!baseStats) continue;

		const abilities = [];
		const abilitiesData = data.abilities;
		if (abilitiesData) {
			if (abilitiesData['0']) abilities.push(abilitiesData['0'].toLowerCase().replace(/\s+/g, ''));
			if (abilitiesData['1']) abilities.push(abilitiesData['1'].toLowerCase().replace(/\s+/g, ''));
			if (abilitiesData['H']) abilities.push(abilitiesData['H'].toLowerCase().replace(/\s+/g, ''));
		}

		// 日本語名を取得
		const jpName = JP_SPECIES[id] || data.name || id;

		result.push({
			id,
			name: jpName,
			nameEn: data.name || id,
			type: normalizeType(types[0]),
			type2: types[1] ? normalizeType(types[1]) : undefined,
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

function convertMoves() {
	const result = [];

	for (const [id, data] of Object.entries(Moves)) {
		if (data.isNonstandard === 'Past') continue;
		if (data.isZ || data.isMax) continue;

		// Gen4までに制限
		const gen = data.gen || 1;
		if (gen > 4) continue;

		const type = normalizeType(data.type || 'normal');
		if (!ALL_TYPES.includes(type)) continue;

		const category = data.category?.toLowerCase() || 'status';

		// 日本語名を取得
		const jpName = JP_MOVES[id] || data.name || id;

		// 技説明: MovesTextからshortDescを取得、なければ生成
		const moveText = MovesText[id];
		const shortDesc = moveText?.shortDesc || '';
		const description = shortDesc || generateMoveDescription(data);

		const move = {
			id,
			name: jpName,
			nameEn: data.name || id,
			type,
			category,
			power: data.basePower || 0,
			accuracy: typeof data.accuracy === 'number' ? data.accuracy : 100,
			pp: data.pp || 10,
			priority: data.priority || 0,
			description,
			flags: data.flags || {},
		};

		// HP吸収
		const drain = data.drain;
		if (drain && Array.isArray(drain) && drain.length === 2) {
			move.drain = Math.floor((drain[0] / drain[1]) * 100);
		}

		// 反動
		const recoil = data.recoil;
		if (recoil && Array.isArray(recoil) && recoil.length === 2) {
			move.recoil = Math.floor((recoil[0] / recoil[1]) * 100);
		}

		// 追加効果
		const secondary = data.secondary;
		if (secondary && typeof secondary === 'object') {
			const chance = secondary.chance || 100;
			const status = secondary.status;
			const boosts = secondary.boosts;

			if (status || boosts) {
				move.secondary = {chance};
				if (status) move.secondary.status = status;
				if (boosts) move.secondary.boosts = boosts;
			}
		}

		result.push(move);
	}

	return result;
}

function convertAbilities() {
	const result = [];
	for (const [id, data] of Object.entries(Abilities)) {
		if (data.isNonstandard || data.gen > 4) continue;
		const text = AbilitiesText[id] || {};
		result.push({
			id,
			name: JP_ABILITIES[id] || data.name,
			nameEn: data.name,
			description: text.desc || text.shortDesc || data.desc || data.shortDesc || ''
		});
	}
	return result;
}

function convertItems() {
	const result = [];
	for (const [id, data] of Object.entries(Items)) {
		if (data.isNonstandard || data.gen > 4) continue;
		const text = ItemsText[id] || {};
		result.push({
			id,
			name: JP_ITEMS_DICT[id] || data.name,
			nameEn: data.name,
			description: text.desc || text.shortDesc || data.desc || data.shortDesc || ''
		});
	}
	return result;
}

function convertLearnsets(pokedex) {
	const result = {};
	const validMoves = new Set(Object.keys(Moves));

	for (const pokemon of pokedex) {
		const id = pokemon.id;
		const learnset = Learnsets[id]?.learnset;
		if (!learnset) continue;

		const moves = [];
		for (const [moveId, sources] of Object.entries(learnset)) {
			// Gen4以前のソースがあるか確認 (1L1, 2T, 3M, 4Eなど)
			const hasGen4Source = sources.some(s => ['1', '2', '3', '4'].some(gen => s.includes(gen)));

			if (hasGen4Source && validMoves.has(moveId)) {
				moves.push(moveId);
			}
		}
		if (moves.length > 0) {
			result[id] = moves;
		}
	}
	return result;
}

function convertSets() {
	const result = {};
	for (const [id, data] of Object.entries(Gen4Sets)) {
		if (!data.sets || data.sets.length === 0) continue;

		const allMoves = new Set();
		for (const set of data.sets) {
			if (set.movepool) {
				set.movepool.forEach(m => allMoves.add(m));
			}
		}

		if (allMoves.size > 0) {
			result[id] = Array.from(allMoves);
		}
	}
	return result;
}

function main() {
	console.log('Extracting Showdown data with Japanese names...');

	const typeChart = buildTypeChart();
	const pokedex = convertPokedex();
	const moves = convertMoves();

	console.log(`Type Chart: 18 types`);
	console.log(`Pokedex: ${pokedex.length} Pokemon`);
	console.log(`Moves: ${moves.length} moves`);

	const abilities = convertAbilities();
	console.log(`Abilities: ${abilities.length} abilities`);

	const items = convertItems();
	console.log(`Items: ${items.length} items`);

	const learnsets = convertLearnsets(pokedex);
	console.log(`Learnsets: ${Object.keys(learnsets).length} pokemon learnsets`);

	const sets = convertSets();
	console.log(`Sets: ${Object.keys(sets).length} pokemon sets`);


	const output = `
// Generated from Showdown data
// Do not edit manually

export const EXTRACTED_TYPE_CHART = ${JSON.stringify(typeChart, null, 2)};

export interface ExtractedPokemon {
	id: string;
	name: string;
	nameEn: string;
	type: string;
	type2?: string;
	baseStats: { hp: number; atk: number; def: number; spa: number; spd: number; spe: number };
	abilities: string[];
}

export const EXTRACTED_POKEDEX: ExtractedPokemon[] = ${JSON.stringify(pokedex, null, 2)};

export interface ExtractedMove {
	id: string;
	name: string;
	nameEn: string;
	type: string;
	category: string;
	power: number;
	accuracy: number | true;
	pp: number;
	priority: number;
	description: string;
	drain?: [number, number];
	recoil?: [number, number];
	secondary?: {
		chance?: number;
		status?: string;
		boosts?: Record<string, number>;
	} | null;
	flags?: Record<string, number>;
}

export const EXTRACTED_MOVES: ExtractedMove[] = ${JSON.stringify(moves, null, 2)};

export const EXTRACTED_ABILITIES = ${JSON.stringify(abilities, null, 2)};

export const EXTRACTED_ITEMS = ${JSON.stringify(items, null, 2)};

export const EXTRACTED_LEARNSETS: Record<string, string[]> = ${JSON.stringify(learnsets, null, 2)};

export const EXTRACTED_SETS: Record<string, string[]> = ${JSON.stringify(sets, null, 2)};
`;

	const tsOutputPath = path.join(__dirname, 'showdown-extracted-data.ts');
	fs.writeFileSync(tsOutputPath, output);
	console.log(`TypeScript file written to ${tsOutputPath}`);
	console.log(`File size: ${(fs.statSync(tsOutputPath).size / 1024 / 1024).toFixed(2)} MB`);
}

main();
