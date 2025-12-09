// Custom Battle Engine - Event-driven battle system

import {
	MonsterType,
	TYPE_CHART,
	MoveTemplate,
	MOVE_TEMPLATES,
	MonsterTemplate,
	MONSTER_TEMPLATES,
	ABILITY_TEMPLATES,
	AbilityTemplate,
	ITEM_TEMPLATES,
	ItemTemplate,
	canInflictStatus,
} from './battle-data';

// Battle Monster - instance in battle (6ステータス対応)
export interface BattleMonster {
	unique_id: string;
	template_id: string;
	nickname: string;
	type: MonsterType;
	type2?: MonsterType;  // デュアルタイプ
	hp_current: number;
	hp_max: number;
	current_atk: number;  // 攻撃
	current_def: number;  // 防御
	current_spa: number;  // 特攻 (NEW)
	current_spd: number;  // 特防 (NEW)
	current_spe: number;  // 素早さ (renamed)
	moves: MoveTemplate[];
	movePP: number[];  // Remaining PP for each move
	buffs: {
		atk: number;
		def: number;
		spa: number;
		spd: number;
		spe: number;
		crit: number;
		evade: number;
	};
	spriteUrl: string;
	status?: 'brn' | 'par' | 'psn' | 'frz' | 'slp';  // 状態異常
	sleepTurns?: number;  // 眠りの残りターン
	ability?: string;  // 特性ID
	abilityActivated?: boolean;  // 特性が発動済みか（もらいび等）
	item?: string;  // 持ち物ID
	itemConsumed?: boolean;  // 持ち物が消費済みか
}

// Player state
export interface PlayerState {
	id: string;
	name: string;
	team: BattleMonster[];
	activeSlot: number;
	ready: boolean;
	action?: BattleAction;
}

// Battle action
export interface BattleAction {
	type: 'move' | 'switch';
	moveId?: string;
	target?: number; // For switch: team slot index
}

// Battle events (18 types - added recoil and heal)
export type BattleEvent =
	| { type: 'turn_start'; turn: number; }
	| { type: 'text'; message: string; delay?: number; }
	| { type: 'move_announce'; actorId: string; actorName: string; moveName: string; moveType: MonsterType; }
	| { type: 'move_effect'; actorId: string; actorName: string; stat: string; stages: number; }
	| { type: 'damage'; targetId: string; targetName: string; amount: number; newHp: number; maxHp: number; isCrit: boolean; effectiveness: number; }
	| { type: 'miss'; attackerName: string; }
	| { type: 'evade'; targetName: string; }
	| { type: 'faint'; targetId: string; targetName: string; }
	| { type: 'stat_change'; targetId: string; targetName: string; stat: string; stages: number; }
	| { type: 'switch'; playerId: string; playerName: string; monsterName: string; monsterId: string; newSlot: number; }
	| { type: 'forced_switch_request'; playerId: string; }
	| { type: 'battle_end'; winnerId: string; winnerName: string; }
	| { type: 'status_inflict'; targetId: string; targetName: string; status: string; }
	| { type: 'status_damage'; targetId: string; targetName: string; status: string; damage: number; newHp: number; maxHp: number; }
	| { type: 'status_immobilize'; targetId: string; targetName: string; status: string; }
	| { type: 'status_cure'; targetId: string; targetName: string; status: string; }
	| { type: 'recoil'; targetId: string; targetName: string; damage: number; newHp: number; maxHp: number; }
	| { type: 'heal'; targetId: string; targetName: string; amount: number; newHp: number; maxHp: number; reason: string; }
	| { type: 'ability_activate'; pokemonId: string; pokemonName: string; abilityName: string; message?: string; };

// Battle state
export interface BattleState {
	phase: 'waiting' | 'selection' | 'execution' | 'forced_switch' | 'end';
	turn: number;
	players: { [id: string]: PlayerState; };
	events: BattleEvent[];
	forcedSwitchPlayer?: string;
	winner?: string;
	weather?: 'sun' | 'rain' | 'sand' | 'hail';  // 天候
	weatherTurns?: number;  // 天候の残りターン
}

// Serialized state for stateless API
export interface SerializedBattleState {
	seed: number;
	turn: number;
	phase: BattleState['phase'];
	players: {
		[id: string]: {
			name: string;
			team: Array<{
				template_id: string;
				nickname: string;
				hp_current: number;
				moves: string[];
				movePP: number[];  // Remaining PP for each move
				buffs: BattleMonster['buffs'];
			}>;
			activeSlot: number;
		};
	};
	choices: Array<{ playerId: string; action: BattleAction; }>;
	forcedSwitchPlayer?: string;
}

export class BattleEngine {
	private seed: number;

	constructor(seed?: number) {
		this.seed = seed ?? Math.floor(Math.random() * 0x7fffffff);
	}

	// Seeded random
	private random(): number {
		this.seed = (this.seed * 1103515245 + 12345) & 0x7fffffff;
		return this.seed / 0x7fffffff;
	}

	// Create a battle monster from template
	createMonster(template: MonsterTemplate, level: number = 50): BattleMonster {
		// Calculate stats based on level (Pokemon formula)
		const calcHP = (base: number) => Math.floor((2 * base + 31) * level / 100 + level + 10);
		const calcStat = (base: number) => Math.floor((2 * base + 31) * level / 100 + 5);

		const hp = calcHP(template.baseStats.hp);
		const atk = calcStat(template.baseStats.atk);
		const def = calcStat(template.baseStats.def);
		const spa = calcStat(template.baseStats.spa);
		const spd = calcStat(template.baseStats.spd);
		const spe = calcStat(template.baseStats.spe);

		// Select 4 random moves from move pool
		const availableMoves = template.movePool
			.map(id => MOVE_TEMPLATES.find(m => m.id === id))
			.filter((m): m is MoveTemplate => m !== undefined);

		const shuffled = [...availableMoves].sort(() => this.random() - 0.5);
		const selectedMoves = shuffled.slice(0, Math.min(4, shuffled.length));

		return {
			unique_id: `${template.id}_${Math.floor(this.random() * 10000)}`,
			template_id: template.id,
			nickname: template.name,
			type: template.type,
			type2: template.type2,
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
			spriteUrl: template.spriteUrl,
			ability: template.abilities?.[0],  // 最初の特性を使用
		};
	}

	// Generate a random team
	generateTeam(size: number = 3): BattleMonster[] {
		const shuffled = [...MONSTER_TEMPLATES].sort(() => this.random() - 0.5);
		const selected = shuffled.slice(0, size);
		return selected.map(t => this.createMonster(t, 50));
	}

	// Get effective stat with buffs (6ステータス対応)
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
		// Pokemon式: +1で1.5倍、+2で2倍... 簡易版は+10%/段階
		const clampedBuff = Math.max(-6, Math.min(6, buff));
		const multiplier = clampedBuff >= 0
			? (2 + clampedBuff) / 2
			: 2 / (2 - clampedBuff);

		let result = Math.floor(base * multiplier);

		// 麻痺状態は素早さ半減
		if (stat === 'spe' && mon.status === 'par') {
			result = Math.floor(result / 2);
		}

		// 持ち物によるステータスブースト
		if (!mon.itemConsumed) {
			if (stat === 'spe' && mon.item === 'choicescarf') result = Math.floor(result * 1.5);  // こだわりスカーフ
			if (stat === 'atk' && mon.item === 'choiceband') result = Math.floor(result * 1.5);  // こだわりハチマキ
			if (stat === 'spa' && mon.item === 'choicespecs') result = Math.floor(result * 1.5);  // こだわりメガネ
			if (stat === 'spd' && mon.item === 'assaultvest') result = Math.floor(result * 1.5);  // とつげきチョッキ
		}

		return result;
	}

	// Calculate damage (物理/特殊対応)
	calculateDamage(
		attacker: BattleMonster,
		defender: BattleMonster,
		move: MoveTemplate
	): { damage: number; isCrit: boolean; effectiveness: number; isStab: boolean; } {
		if (move.power === 0 || move.category === 'status') {
			return { damage: 0, isCrit: false, effectiveness: 1, isStab: false };
		}

		// 物理/特殊に応じた攻撃・防御ステータスを使用
		const isPhysical = move.category === 'physical';
		let atkStat = isPhysical ? this.getStat(attacker, 'atk') : this.getStat(attacker, 'spa');
		let defStat = isPhysical ? this.getStat(defender, 'def') : this.getStat(defender, 'spd');

		// こんじょう: 状態異常時、攻撃1.5倍（やけどペナルティ無視）
		const hasGuts = attacker.ability === 'guts' && attacker.status;
		if (hasGuts && isPhysical) {
			atkStat = Math.floor(atkStat * 1.5);
		}

		// ふしぎなうろこ: 状態異常時、防御1.5倍
		if (defender.ability === 'marvel_scale' && defender.status && isPhysical) {
			defStat = Math.floor(defStat * 1.5);
		}

		// やけど状態は物理攻撃力半減（こんじょう持ちは無視）
		const burnPenalty = (attacker.status === 'brn' && isPhysical && !hasGuts) ? 0.5 : 1.0;

		const power = move.power;

		// タイプ相性（デュアルタイプ対応）
		let effectiveness = TYPE_CHART[move.type]?.[defender.type] ?? 1;
		if (defender.type2) {
			effectiveness *= TYPE_CHART[move.type]?.[defender.type2] ?? 1;
		}

		// 特性によるタイプ免疫
		if (defender.ability === 'levitate' && move.type === 'ground') effectiveness = 0;  // ふゆう
		if (defender.ability === 'flash_fire' && move.type === 'fire') effectiveness = 0;  // もらいび
		if (defender.ability === 'water_absorb' && move.type === 'water') effectiveness = 0;  // ちょすい
		if (defender.ability === 'volt_absorb' && move.type === 'electric') effectiveness = 0;  // ちくでん

		// STAB (Same Type Attack Bonus) - タイプ一致で1.5倍
		const isStab = move.type === attacker.type || move.type === attacker.type2;
		const stabMultiplier = isStab ? 1.5 : 1.0;

		// 急所 (6.25% base chance)
		const critChance = 0.0625 + (attacker.buffs.crit * 0.05);
		const isCrit = this.random() < critChance;
		const critMultiplier = isCrit ? 1.5 : 1.0;

		// ランダム補正 (0.85 - 1.0)
		const randomFactor = 0.85 + this.random() * 0.15;

		// 特性による威力補正
		let abilityMultiplier = 1.0;

		// HP1/3以下で発動する特性（もうか、しんりょく、げきりゅう）
		const hpRatio = attacker.hp_current / attacker.hp_max;
		if (hpRatio <= 1 / 3) {
			if (attacker.ability === 'blaze' && move.type === 'fire') abilityMultiplier = 1.5;
			if (attacker.ability === 'overgrow' && move.type === 'grass') abilityMultiplier = 1.5;
			if (attacker.ability === 'torrent' && move.type === 'water') abilityMultiplier = 1.5;
		}

		// 防御側の特性による補正
		// あついしぼう: 炎・氷タイプの被ダメージ半減
		if (defender.ability === 'thick_fat' && (move.type === 'fire' || move.type === 'ice')) {
			abilityMultiplier *= 0.5;
		}

		// マルチスケイル: HP満タン時の被ダメージ半減
		if (defender.ability === 'multiscale' && defender.hp_current === defender.hp_max) {
			abilityMultiplier *= 0.5;
		}

		// 持ち物によるダメージ補正
		let itemMultiplier = 1.0;
		if (!attacker.itemConsumed) {
			if (attacker.item === 'lifeorb') itemMultiplier = 1.3;  // いのちのたま
		}

		// ポケモン式ダメージ計算（簡易版）
		// damage = ((2*Level/5+2) * Power * A/D) / 50 + 2) * Modifiers
		const level = 50;
		const baseDamage = Math.floor(((2 * level / 5 + 2) * power * atkStat / defStat) / 50 + 2);
		let damage = Math.floor(baseDamage * effectiveness * stabMultiplier * critMultiplier * randomFactor * burnPenalty * abilityMultiplier * itemMultiplier);

		// たつじんのおび: 効果抜群時1.2倍
		if (!attacker.itemConsumed && attacker.item === 'expertbelt' && effectiveness > 1) {
			damage = Math.floor(damage * 1.2);
		}

		// 最小1ダメージ
		if (damage < 1) damage = 1;

		return { damage, isCrit, effectiveness, isStab };
	}

	// Check accuracy
	checkAccuracy(move: MoveTemplate): boolean {
		const accuracy = move.accuracy ?? 100;
		return this.random() * 100 <= accuracy;
	}

	// Check evasion
	checkEvasion(defender: BattleMonster): boolean {
		const baseDodge = 0.05;
		const evadeBuffBonus = defender.buffs.evade * 0.05;
		const dodgeSynergy = baseDodge * evadeBuffBonus * 0.5;
		const totalDodge = Math.min(baseDodge + evadeBuffBonus + dodgeSynergy, 0.50);
		return this.random() < totalDodge;
	}

	// Execute a full battle turn
	executeTurn(state: BattleState): BattleState {
		const events: BattleEvent[] = [];
		const playerIds = Object.keys(state.players);

		// Turn start event
		events.push({ type: 'turn_start', turn: state.turn });

		// Collect actions
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

		// Sort by priority
		actions.sort((a, b) => {
			// 1. Switches have highest priority
			if (a.action.type === 'switch' && b.action.type !== 'switch') return -1;
			if (b.action.type === 'switch' && a.action.type !== 'switch') return 1;

			// 2. Move priority
			if (a.action.type === 'move' && b.action.type === 'move') {
				const moveA = MOVE_TEMPLATES.find(m => m.id === a.action.moveId);
				const moveB = MOVE_TEMPLATES.find(m => m.id === b.action.moveId);
				const priorityA = moveA?.priority ?? 0;
				const priorityB = moveB?.priority ?? 0;

				if (priorityA !== priorityB) return priorityB - priorityA;

				// 3. Speed comparison
				const spdA = this.getStat(a.mon, 'spe');
				const spdB = this.getStat(b.mon, 'spe');
				if (spdA !== spdB) return spdB - spdA;

				// 4. Random tiebreaker
				return this.random() - 0.5;
			}

			return 0;
		});

		// Execute actions
		for (const { playerId, player, mon, action } of actions) {
			// Check if actor is still alive
			if (mon.hp_current <= 0) continue;

			const opponentId = playerIds.find(id => id !== playerId)!;
			const opponent = state.players[opponentId];
			const opponentMon = opponent.team[opponent.activeSlot];

			// Check status conditions that may prevent action
			if (action.type === 'move' && mon.status) {
				// Paralysis: 25% chance to be fully paralyzed
				if (mon.status === 'par' && this.random() < 0.25) {
					events.push({
						type: 'status_immobilize',
						targetId: mon.unique_id,
						targetName: mon.nickname,
						status: 'par',
					});
					continue;
				}

				// Frozen: 20% chance to thaw each turn
				if (mon.status === 'frz') {
					if (this.random() < 0.20) {
						mon.status = undefined;
						events.push({
							type: 'status_cure',
							targetId: mon.unique_id,
							targetName: mon.nickname,
							status: 'frz',
						});
					} else {
						events.push({
							type: 'status_immobilize',
							targetId: mon.unique_id,
							targetName: mon.nickname,
							status: 'frz',
						});
						continue;
					}
				}

				// Sleep: count down turns
				if (mon.status === 'slp') {
					if (mon.sleepTurns !== undefined && mon.sleepTurns > 0) {
						mon.sleepTurns--;
						if (mon.sleepTurns === 0) {
							mon.status = undefined;
							events.push({
								type: 'status_cure',
								targetId: mon.unique_id,
								targetName: mon.nickname,
								status: 'slp',
							});
						} else {
							events.push({
								type: 'status_immobilize',
								targetId: mon.unique_id,
								targetName: mon.nickname,
								status: 'slp',
							});
							continue;
						}
					} else {
						// Initialize sleep turns (2-4)
						mon.sleepTurns = 2 + Math.floor(this.random() * 3);
						events.push({
							type: 'status_immobilize',
							targetId: mon.unique_id,
							targetName: mon.nickname,
							status: 'slp',
						});
						continue;
					}
				}
			}

			if (action.type === 'switch') {
				// Switch action
				const newSlot = action.target!;
				const newMon = player.team[newSlot];

				if (newMon && newMon.hp_current > 0) {
					player.activeSlot = newSlot;
					events.push({
						type: 'switch',
						playerId,
						playerName: player.name,
						monsterName: newMon.nickname,
						monsterId: newMon.unique_id,
						newSlot,
					});

					// 登場時特性の発動
					// いかく: 相手の攻撃を1段階下げる
					if (newMon.ability === 'intimidate') {
						const opponentMon = opponent.team[opponent.activeSlot];
						if (opponentMon && opponentMon.hp_current > 0) {
							opponentMon.buffs.atk = Math.max(-6, opponentMon.buffs.atk - 1);
							events.push({
								type: 'ability_activate',
								pokemonId: newMon.unique_id,
								pokemonName: newMon.nickname,
								abilityName: 'いかく',
							});
							events.push({
								type: 'stat_change',
								targetId: opponentMon.unique_id,
								targetName: opponentMon.nickname,
								stat: 'atk',
								stages: -1,
							});
						}
					}
				}
			} else if (action.type === 'move') {
				// Move action
				const move = MOVE_TEMPLATES.find(m => m.id === action.moveId);
				if (!move) continue;

				// Find move index and check PP
				const moveIndex = mon.moves.findIndex(m => m.id === action.moveId);
				if (moveIndex >= 0 && mon.movePP[moveIndex] <= 0) {
					// No PP left, move fails
					events.push({
						type: 'text',
						message: `${mon.nickname}は${move.name}のPPが足りない！`,
					});
					continue;
				}

				// Consume PP
				if (moveIndex >= 0) {
					mon.movePP[moveIndex]--;
				}

				// Announce move
				events.push({
					type: 'move_announce',
					actorId: mon.unique_id,
					actorName: mon.nickname,
					moveName: move.name,
					moveType: move.type,
				});

				// Check if opponent is alive
				if (opponentMon.hp_current <= 0) continue;

				// Accuracy check
				if (!this.checkAccuracy(move)) {
					events.push({ type: 'miss', attackerName: mon.nickname });
					continue;
				}

				// Evasion check
				if (move.power > 0 && this.checkEvasion(opponentMon)) {
					events.push({ type: 'evade', targetName: opponentMon.nickname });
					continue;
				}

				// Status move
				if (move.power === 0 && move.effect) {
					const target = move.effect.target === 'self' ? mon : opponentMon;
					const targetId = move.effect.target === 'self' ? playerId : opponentId;
					const stat = move.effect.stat;
					const stages = move.effect.stages;

					// Apply buff/debuff
					target.buffs[stat] = Math.max(-6, Math.min(6, target.buffs[stat] + stages));

					events.push({
						type: 'stat_change',
						targetId: target.unique_id,
						targetName: target.nickname,
						stat,
						stages,
					});

					events.push({
						type: 'move_effect',
						actorId: mon.unique_id,
						actorName: mon.nickname,
						stat,
						stages,
					});
				}

				// Damage move
				if (move.power > 0) {
					const { damage, isCrit, effectiveness } = this.calculateDamage(mon, opponentMon, move);

					// きあいのタスキ: HP満タンから一撃死を防ぐ
					let actualDamage = damage;
					const wasFullHp = opponentMon.hp_current === opponentMon.hp_max;
					const wouldFaint = opponentMon.hp_current - damage <= 0;

					if (wasFullHp && wouldFaint && opponentMon.item === 'focussash' && !opponentMon.itemConsumed) {
						actualDamage = opponentMon.hp_current - 1;  // HP1で耐える
						opponentMon.itemConsumed = true;
						opponentMon.hp_current = 1;
						events.push({
							type: 'ability_activate',  // アイテム発動メッセージ用
							pokemonId: opponentMon.unique_id,
							pokemonName: opponentMon.nickname,
							abilityName: 'きあいのタスキ',
						});
					} else {
						opponentMon.hp_current = Math.max(0, opponentMon.hp_current - damage);
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

					// Apply secondary effects (status conditions, etc.)
					if (move.secondary && opponentMon.hp_current > 0 && !opponentMon.status) {
						const chance = move.secondary.chance ?? 0;
						if (this.random() * 100 < chance && move.secondary.status) {
							// タイプ免疫チェック（電気タイプは麻痺にならない等）
							const canApplyStatus = canInflictStatus(
								move.secondary.status as 'brn' | 'par' | 'psn' | 'frz' | 'slp',
								opponentMon.type,
								opponentMon.type2
							);

							if (canApplyStatus) {
								opponentMon.status = move.secondary.status;
								if (move.secondary.status === 'slp') {
									opponentMon.sleepTurns = 2 + Math.floor(this.random() * 3); // 2-4 turns
								}
								events.push({
									type: 'status_inflict',
									targetId: opponentMon.unique_id,
									targetName: opponentMon.nickname,
									status: move.secondary.status,
								});
							}
						}
					}

					// Apply recoil damage (反動ダメージ)
					if (move.recoil && damage > 0 && mon.hp_current > 0) {
						const recoilDamage = Math.max(1, Math.floor(damage * move.recoil / 100));
						mon.hp_current = Math.max(0, mon.hp_current - recoilDamage);
						events.push({
							type: 'recoil',
							targetId: mon.unique_id,
							targetName: mon.nickname,
							damage: recoilDamage,
							newHp: mon.hp_current,
							maxHp: mon.hp_max,
						});

						// Check if attacker faints from recoil
						if (mon.hp_current <= 0) {
							events.push({
								type: 'faint',
								targetId: mon.unique_id,
								targetName: mon.nickname,
							});
							// Will be handled later for forced switch
						}
					}

					// いのちのたま: 攻撃時HP1/10消費
					if (mon.item === 'lifeorb' && !mon.itemConsumed && damage > 0 && mon.hp_current > 0) {
						const lifeOrbDamage = Math.max(1, Math.floor(mon.hp_max / 10));
						mon.hp_current = Math.max(0, mon.hp_current - lifeOrbDamage);
						events.push({
							type: 'recoil',
							targetId: mon.unique_id,
							targetName: mon.nickname,
							damage: lifeOrbDamage,
							newHp: mon.hp_current,
							maxHp: mon.hp_max,
						});

						if (mon.hp_current <= 0) {
							events.push({
								type: 'faint',
								targetId: mon.unique_id,
								targetName: mon.nickname,
							});
						}
					}

					// Apply drain heal (吸収回復)
					if (move.drain && damage > 0 && mon.hp_current > 0) {
						const healAmount = Math.max(1, Math.floor(damage * move.drain / 100));
						const actualHeal = Math.min(healAmount, mon.hp_max - mon.hp_current);
						if (actualHeal > 0) {
							mon.hp_current += actualHeal;
							events.push({
								type: 'heal',
								targetId: mon.unique_id,
								targetName: mon.nickname,
								amount: actualHeal,
								newHp: mon.hp_current,
								maxHp: mon.hp_max,
								reason: 'drain',
							});
						}
					}

					// Check faint
					if (opponentMon.hp_current <= 0) {
						events.push({
							type: 'faint',
							targetId: opponentMon.unique_id,
							targetName: opponentMon.nickname,
						});

						// Check for remaining pokemon
						const remaining = opponent.team.filter(m => m.hp_current > 0);

						if (remaining.length === 0) {
							// Battle end
							state.phase = 'end';
							state.winner = playerId;
							events.push({
								type: 'battle_end',
								winnerId: playerId,
								winnerName: player.name,
							});
							state.events = events;
							return state;
						} else {
							// Forced switch
							state.phase = 'forced_switch';
							state.forcedSwitchPlayer = opponentId;
							events.push({
								type: 'forced_switch_request',
								playerId: opponentId,
							});
							state.events = events;
							return state;
						}
					}
				}
			}
		}

		// End of turn: Apply status damage (burn, poison)
		for (const playerId of playerIds) {
			const player = state.players[playerId];
			const mon = player.team[player.activeSlot];

			if (mon.hp_current > 0 && mon.status) {
				let statusDamage = 0;

				if (mon.status === 'brn') {
					// Burn: 1/16 max HP damage
					statusDamage = Math.max(1, Math.floor(mon.hp_max / 16));
				} else if (mon.status === 'psn') {
					// Poison: 1/8 max HP damage
					statusDamage = Math.max(1, Math.floor(mon.hp_max / 8));
				}

				if (statusDamage > 0) {
					mon.hp_current = Math.max(0, mon.hp_current - statusDamage);
					events.push({
						type: 'status_damage',
						targetId: mon.unique_id,
						targetName: mon.nickname,
						status: mon.status,
						damage: statusDamage,
						newHp: mon.hp_current,
						maxHp: mon.hp_max,
					});

					// Check faint from status damage
					if (mon.hp_current <= 0) {
						events.push({
							type: 'faint',
							targetId: mon.unique_id,
							targetName: mon.nickname,
						});

						const opponentId = playerIds.find(id => id !== playerId)!;
						const remaining = player.team.filter(m => m.hp_current > 0);

						if (remaining.length === 0) {
							state.phase = 'end';
							state.winner = opponentId;
							events.push({
								type: 'battle_end',
								winnerId: opponentId,
								winnerName: state.players[opponentId].name,
							});
							state.events = events;
							return state;
						} else {
							state.phase = 'forced_switch';
							state.forcedSwitchPlayer = playerId;
							events.push({
								type: 'forced_switch_request',
								playerId: playerId,
							});
							state.events = events;
							return state;
						}
					}
				}
			}

			// 持ち物によるターン終了時効果
			if (mon.hp_current > 0 && !mon.itemConsumed) {
				// たべのこし: 毎ターンHP1/16回復
				if (mon.item === 'leftovers' && mon.hp_current < mon.hp_max) {
					const healAmount = Math.max(1, Math.floor(mon.hp_max / 16));
					const actualHeal = Math.min(healAmount, mon.hp_max - mon.hp_current);
					mon.hp_current += actualHeal;
					events.push({
						type: 'heal',
						targetId: mon.unique_id,
						targetName: mon.nickname,
						amount: actualHeal,
						newHp: mon.hp_current,
						maxHp: mon.hp_max,
						reason: 'leftovers',
					});
				}

				// オボンのみ: HP1/2以下で1/4回復（消費）
				if (mon.item === 'sitrusberry' && mon.hp_current <= mon.hp_max / 2) {
					const healAmount = Math.max(1, Math.floor(mon.hp_max / 4));
					const actualHeal = Math.min(healAmount, mon.hp_max - mon.hp_current);
					mon.hp_current += actualHeal;
					mon.itemConsumed = true;
					events.push({
						type: 'heal',
						targetId: mon.unique_id,
						targetName: mon.nickname,
						amount: actualHeal,
						newHp: mon.hp_current,
						maxHp: mon.hp_max,
						reason: 'sitrusberry',
					});
				}
			}
		}

		// Reset ready state for next turn
		for (const playerId of playerIds) {
			state.players[playerId].ready = false;
			state.players[playerId].action = undefined;
		}

		state.turn++;
		state.phase = 'selection';
		state.events = events;
		return state;
	}

	// Get AI choice
	getAIChoice(player: PlayerState): BattleAction {
		const activeMon = player.team[player.activeSlot];

		// If current mon is fainted, switch to first alive
		if (activeMon.hp_current <= 0) {
			const aliveIndex = player.team.findIndex(m => m.hp_current > 0);
			if (aliveIndex >= 0) {
				return { type: 'switch', target: aliveIndex };
			}
		}

		// Pick a random available move
		const availableMoves = activeMon.moves.filter(m => true); // Could add PP check
		if (availableMoves.length > 0) {
			const move = availableMoves[Math.floor(this.random() * availableMoves.length)];
			return { type: 'move', moveId: move.id };
		}

		// Fallback to first move
		return { type: 'move', moveId: activeMon.moves[0]?.id ?? 'tackle' };
	}

	// Serialize state for API
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
					moves: mon.moves.map(m => m.id),
					movePP: [...mon.movePP],
					buffs: { ...mon.buffs },
				})),
				activeSlot: player.activeSlot,
			};
		}

		return serialized;
	}

	// Restore state from serialized
	restoreState(serialized: SerializedBattleState): BattleState {
		this.seed = serialized.seed;

		const state: BattleState = {
			phase: serialized.phase,
			turn: serialized.turn,
			players: {},
			events: [],
			forcedSwitchPlayer: serialized.forcedSwitchPlayer,
		};

		for (const [id, playerData] of Object.entries(serialized.players)) {
			state.players[id] = {
				id,
				name: playerData.name,
				team: playerData.team.map(monData => {
					const template = MONSTER_TEMPLATES.find(t => t.id === monData.template_id)!;
					const baseMon = this.createMonster(template, 50);

					// Override with saved data
					baseMon.nickname = monData.nickname;
					baseMon.hp_current = monData.hp_current;
					baseMon.moves = monData.moves
						.map(id => MOVE_TEMPLATES.find(m => m.id === id))
						.filter((m): m is MoveTemplate => m !== undefined);
					baseMon.movePP = monData.movePP ? [...monData.movePP] : baseMon.moves.map(m => m.pp);
					baseMon.buffs = { ...monData.buffs };

					return baseMon;
				}),
				activeSlot: playerData.activeSlot,
				ready: false,
			};
		}

		return state;
	}
}
