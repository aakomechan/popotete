import { Pokedex } from './data/pokedex.ts';
import { Moves } from './data/moves.ts';
import { Learnsets } from './data/learnsets.ts';
import { TypeChart } from './data/typechart.ts';
import { Abilities } from './data/abilities.ts';
import { Items } from './data/items.ts';
import { JP_SPECIES, JP_MOVES, JP_TYPES, JP_ABILITIES } from './data/jp_names.ts';
import * as fs from 'fs';

// Gen 4 ends at 493 (Arceus)
const MAX_DEX_NUM = 493;
const MAX_GEN = 4;

// Types in Gen 4
const VALID_TYPES = [
	'Normal', 'Fire', 'Water', 'Grass', 'Electric', 'Ice', 'Fighting', 'Poison', 'Ground',
	'Flying', 'Psychic', 'Bug', 'Rock', 'Ghost', 'Dragon', 'Steel', 'Dark'
];

// Map Showdown types to our lowercase types
const typeMap: Record<string, string> = {};
VALID_TYPES.forEach(t => typeMap[t] = t.toLowerCase());

// 1. Extract Type Chart
const extractedTypeChart: Record<string, Record<string, number>> = {};
for (const type of VALID_TYPES) {
	const lowerType = type.toLowerCase();
	// Use Japanese type name if available, otherwise English
	const typeName = JP_TYPES[lowerType] || lowerType;

	// We need to keep keys as English for logic, but maybe we want Japanese keys?
	// The worker uses keys for logic. Logic should stay English keys.
	// Display names can be Japanese.
	// But TYPE_CHART structure is { fire: { water: 2.0 } }.
	// If we change keys to Japanese, we break logic.
	// So we keep keys English.

	extractedTypeChart[lowerType] = {};
	const typeData = TypeChart[type.toLowerCase()];
	if (typeData) {
		for (const targetType of VALID_TYPES) {
			const targetLower = targetType.toLowerCase();
			const damageTaken = typeData.damageTaken[targetType];
			// damageTaken: 0 = 1x, 1 = 2x, 2 = 0.5x, 3 = 0x
			// Wait, Showdown format is "damageTaken" by the type.
			// 0: normal, 1: super effective (taken), 2: not effective (taken), 3: immune
			// But my chart is Attacker -> Defender.
			// Showdown TypeChart is Defender -> Attacker (damageTaken).

			// Let's verify standard Showdown TypeChart format.
			// damageTaken: { Bug: 1, Dark: 0, ... }
			// If I am Fire, and Bug attacks me:
			// Fire takes 0.5x from Bug.
			// So damageTaken['Bug'] should be 2 (Resist).

			let effectiveness = 1.0;
			if (damageTaken === 1) effectiveness = 2.0; // Weakness
			if (damageTaken === 2) effectiveness = 0.5; // Resistance
			if (damageTaken === 3) effectiveness = 0.0; // Immunity

			// My chart: TYPE_CHART[Attacker][Defender]
			// So I need to populate extractedTypeChart[Attacker][Defender]
			// Here 'type' is the Defender. 'targetType' is the Attacker.

			if (!extractedTypeChart[targetLower]) extractedTypeChart[targetLower] = {};
			extractedTypeChart[targetLower][lowerType] = effectiveness;
		}
	}
}

// 2. Extract Abilities
const extractedAbilities: any[] = [];
for (const [id, ability] of Object.entries(Abilities)) {
	if (ability.isNonstandard && ability.isNonstandard !== 'Past') continue;
	if (ability.gen && ability.gen > MAX_GEN) continue;

	const jpName = JP_ABILITIES[id] || ability.name;

	extractedAbilities.push({
		id: id,
		name: jpName,
		desc: ability.desc || ability.shortDesc
	});
}

// 3. Extract Items
const extractedItems: any[] = [];
for (const [id, item] of Object.entries(Items)) {
	if (item.isNonstandard && item.isNonstandard !== 'Past') continue;
	if (item.gen && item.gen > MAX_GEN) continue;

	extractedItems.push({
		id: id,
		name: item.name,
		desc: item.desc || item.shortDesc,
	});
}

// 4. Extract Pokemon (including forms)
const extractedMonsters: any[] = [];
const usedMoves = new Set<string>();

for (const [id, species] of Object.entries(Pokedex)) {
	if (species.num <= MAX_DEX_NUM && species.num > 0) {
		// Basic filtering for base forms (mostly). 
		// Showdown Pokedex has entries like "rattata", "rattataalola".
		// "rattata" has num 19. "rattataalola" has num 19 but forme "Alola".
		// We want Gen 4, so no Alola.
		// Also skip megas etc.
		// Check generation for forms
		if (species.gen && species.gen > MAX_GEN) continue; // Skip Alola/Galar/Hisui forms
		if (species.isNonstandard && species.isNonstandard !== 'Past') continue; // Skip CAP, etc.

		// Get moves (use base species learnset if form doesn't have one)
		let learnset = Learnsets[id]?.learnset;
		if (!learnset && species.baseSpecies) {
			const baseId = species.baseSpecies.toLowerCase().replace(/[^a-z0-9]/g, '');
			learnset = Learnsets[baseId]?.learnset;
		}

		if (!learnset) continue;

		const validMoves: string[] = [];
		for (const [moveId, sources] of Object.entries(learnset)) {
			// Check if move is from Gen 1-4
			const isGen4 = sources.some(s => ['1', '2', '3', '4'].includes(s.charAt(0)));
			if (isGen4) {
				validMoves.push(moveId);
				usedMoves.add(moveId);
			}
		}

		if (validMoves.length === 0) continue;

		// Map stats
		// Worker uses: hp, atk, def, spd (speed)
		// We map:
		// hp -> hp
		// atk -> max(atk, spa)
		// def -> max(def, spd)
		// spd -> spe

		const stats = species.baseStats;
		const hp = stats.hp;
		const atk = Math.max(stats.atk, stats.spa);
		const def = Math.max(stats.def, stats.spd);
		const spd = stats.spe;

		// Map types
		// Showdown types are Capitalized.
		const type1 = species.types[0].toLowerCase();
		// Worker only supports single type for now? 
		// "type: MonsterType" in worker.ts.
		// I should probably keep it single type for simplicity or pick the first one.
		// Or refactor worker to support dual types. 
		// For now, pick first type.

		// Sprite URL
		// https://play.pokemonshowdown.com/sprites/gen5ani/bulbasaur.gif
		// ID needs to be clean.
		const spriteId = species.name.toLowerCase().replace(/[^a-z0-9]/g, '');
		// Handle forms for sprite URLs if needed, but Showdown usually handles it by name
		// e.g. rotom-wash -> rotom-wash.gif
		const spriteUrl = `https://play.pokemonshowdown.com/sprites/gen5ani/${spriteId}.gif`;

		// Map abilities
		const abilities = Object.values(species.abilities).map(name =>
			name.toLowerCase().replace(/[^a-z0-9]/g, '')
		);

		// Localization
		let name = JP_SPECIES[id];
		if (!name) {
			// Try base species if form
			if (species.baseSpecies) {
				const baseName = JP_SPECIES[species.baseSpecies.toLowerCase().replace(/[^a-z0-9]/g, '')];
				if (baseName) {
					// Append form name? e.g. "Rotom-Wash" -> "ロトム (ウォッシュ)"
					// I don't have form translations.
					// Just use base name or keep English form name?
					// Let's use English for form part if missing.
					name = `${baseName} (${species.forme})`;
				}
			}
		}
		if (!name) name = species.name; // Fallback

		extractedMonsters.push({
			id: id,
			name: name,
			type: type1,
			baseStats: { hp, atk, def, spd },
			movePool: validMoves,
			spriteUrl: spriteUrl,
			abilities: abilities
		});
	}
}

// 5. Extract Moves
const extractedMoves: any[] = [];

for (const moveId of usedMoves) {
	const move = Moves[moveId];
	if (!move) continue;
	if (move.isNonstandard && move.isNonstandard !== 'Past') continue;
	if (move.gen && move.gen > MAX_GEN) continue;

	// Filter Z-moves, Max moves
	if (move.isZ || move.isMax) continue;

	// Map fields
	const type = move.type.toLowerCase();
	// ... (type mapping logic)
	let finalType = type;
	if (finalType === 'fairy') finalType = 'normal';

	let effect = undefined;
	if (move.boosts) {
		// ... (boost logic)
		const stats = Object.keys(move.boosts);
		if (stats.length === 1) {
			const stat = stats[0];
			const stages = move.boosts[stat];
			let targetStat = undefined;
			if (stat === 'atk' || stat === 'spa') targetStat = 'atk';
			if (stat === 'def' || stat === 'spd') targetStat = 'def';
			if (stat === 'spe') targetStat = 'spd';
			if (stat === 'evasion') targetStat = 'evade';

			if (targetStat) {
				effect = {
					type: stages > 0 ? 'buff' : 'debuff',
					stat: targetStat,
					stages: Math.abs(stages),
					target: move.target === 'self' ? 'self' : 'opponent'
				};
			}
		}
	}

	const jpName = JP_MOVES[moveId] || move.name;

	extractedMoves.push({
		id: moveId,
		name: jpName,
		type: finalType,
		power: move.basePower,
		accuracy: move.accuracy === true ? 100 : move.accuracy,
		pp: move.pp,
		priority: move.priority,
		effect: effect
	});
}

// Output
const output = `
// Generated Data (Gen 1-4 Complete + JP)
const TYPE_CHART = ${JSON.stringify(extractedTypeChart, null, 2)};

const ABILITIES = ${JSON.stringify(extractedAbilities, null, 2)};

const ITEMS = ${JSON.stringify(extractedItems, null, 2)};

const MOVE_TEMPLATES = ${JSON.stringify(extractedMoves, null, 2)};

const MONSTER_TEMPLATES = ${JSON.stringify(extractedMonsters, null, 2)};
`;

console.log(output);
