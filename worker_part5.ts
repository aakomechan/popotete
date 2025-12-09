// @ts-nocheck
// Battle Engine
interface BattleMonster {
  unique_id: string;
  template_id: string;
  nickname: string;
  type: MonsterType;
  hp_current: number;
  hp_max: number;
  current_atk: number;
  current_def: number;
  current_spd: number;
  moves: MoveTemplate[];
  buffs: { atk: number; def: number; spd: number; crit: number; evade: number; };
  spriteUrl: string;
  ability: string;
  item: string;
}

// ... (PlayerState, BattleAction, BattleEvent, BattleState, SerializedBattleState interfaces remain unchanged)

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
    const statMultiplier = (level / 50);
    const hp = Math.floor(template.baseStats.hp * 2 * statMultiplier + level + 10);
    const atk = Math.floor(template.baseStats.atk * 2 * statMultiplier + 5);
    const def = Math.floor(template.baseStats.def * 2 * statMultiplier + 5);
    const spd = Math.floor(template.baseStats.spd * 2 * statMultiplier + 5);

    const availableMoves = template.movePool
      .map(id => MOVE_TEMPLATES.find(m => m.id === id))
      .filter((m): m is MoveTemplate => m !== undefined);

    const shuffled = [...availableMoves].sort(() => this.random() - 0.5);
    const selectedMoves = shuffled.slice(0, Math.min(4, shuffled.length));

    // Select random ability if multiple
    const ability = template.abilities && template.abilities.length > 0
      ? template.abilities[Math.floor(this.random() * template.abilities.length)]
      : 'unknown';

    return {
      unique_id: `${template.id}_${Math.floor(this.random() * 10000)}`,
      template_id: template.id,
      nickname: template.name,
      type: template.type,
      hp_current: hp,
      hp_max: hp,
      current_atk: atk,
      current_def: def,
      current_spd: spd,
      moves: selectedMoves,
      buffs: { atk: 0, def: 0, spd: 0, crit: 0, evade: 0 },
      spriteUrl: template.spriteUrl,
      ability,
      item: '', // Item implementation planned for later, default empty
    };
  }

  generateTeam(size: number = 3): BattleMonster[] {
    const shuffled = [...MONSTER_TEMPLATES].sort(() => this.random() - 0.5);
    const selected = shuffled.slice(0, size);
    return selected.map(t => this.createMonster(t, 50));
  }

  getStat(mon: BattleMonster, stat: 'atk' | 'def' | 'spd'): number {
    let base: number;
    if (stat === 'atk') base = mon.current_atk;
    else if (stat === 'def') base = mon.current_def;
    else base = mon.current_spd;

    const buff = mon.buffs[stat];
    const clampedBuff = Math.max(-6, Math.min(6, buff));
    let val = Math.floor(base * (1 + clampedBuff * 0.1));

    // Choice Items (Speed/Atk boost)
    if (mon.item === 'choicescarf' && stat === 'spd') {
      val = Math.floor(val * 1.5);
    } else if (mon.item === 'choiceband' && stat === 'atk') {
      val = Math.floor(val * 1.5);
    }

    return val;
  }

  triggerAbility(mon: BattleMonster, trigger: 'onSwitchIn' | 'onTurnEnd' | 'onDamage', context?: any): BattleEvent[] {
    const events: BattleEvent[] = [];

    if (trigger === 'onSwitchIn') {
      if (mon.ability === 'intimidate') {
        // Intimidate: Lowers opponent's Attack
        const opponent = context.opponent as BattleMonster;
        if (opponent && opponent.hp_current > 0) {
          opponent.buffs.atk = Math.max(-6, opponent.buffs.atk - 1);
          events.push({
            type: 'text',
            message: `${mon.nickname}の いかく！ ${opponent.nickname}の こうげきが さがった！`
          });
          events.push({
            type: 'stat_change',
            targetId: opponent.unique_id,
            targetName: opponent.nickname,
            stat: 'atk',
            stages: -1
          });
        }
      }
    }

    return events;
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
        // We might want a 'heal' event type, but for now text is fine or reuse damage with negative?
        // Let's just use text for simplicity as the client might not handle heal events yet.
        // Actually, update HP in client via state, but visual effect would be nice.
      }
    }

    return events;
  }

  calculateDamage(
    attacker: BattleMonster,
    defender: BattleMonster,
    move: MoveTemplate
  ): { damage: number; isCrit: boolean; effectiveness: number; } {
    if (move.power === 0) {
      return { damage: 0, isCrit: false, effectiveness: 1 };
    }

    const atk = this.getStat(attacker, 'atk');
    const def = this.getStat(defender, 'def');
    const power = move.power;
    const effectiveness = TYPE_CHART[move.type][defender.type] ?? 1;

    const critChance = 0.0625 + (attacker.buffs.crit * 0.05);
    const isCrit = this.random() < critChance;
    const critMultiplier = isCrit ? 1.5 : 1.0;

    const randomFactor = 0.85 + this.random() * 0.15;

    // Base damage
    let base = Math.max(atk - def / 2, 1);

    // Ability Modifiers
    let abilityMultiplier = 1.0;
    if (attacker.hp_current <= attacker.hp_max / 3) {
      if ((attacker.ability === 'blaze' && move.type === 'fire') ||
        (attacker.ability === 'torrent' && move.type === 'water') ||
        (attacker.ability === 'overgrow' && move.type === 'grass') ||
        (attacker.ability === 'swarm' && move.type === 'bug')) {
        abilityMultiplier = 1.5;
      }
    }

    let damage = Math.floor(base * (power / 100) * effectiveness * randomFactor * critMultiplier * abilityMultiplier * 0.3);

    // Minimum 1 damage
    if (damage < 1) damage = 1;

    return { damage, isCrit, effectiveness };
  }

  checkAccuracy(move: MoveTemplate): boolean {
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

    for (const { playerId, player, mon, action } of actions) {
      if (mon.hp_current <= 0) continue;

      const opponentId = playerIds.find(id => id !== playerId)!;
      const opponent = state.players[opponentId];
      const opponentMon = opponent.team[opponent.activeSlot];

      if (action.type === 'switch') {
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

          // Trigger onSwitchIn (e.g. Intimidate)
          const switchEvents = this.triggerAbility(newMon, 'onSwitchIn', { opponent: opponentMon });
          events.push(...switchEvents);
        }
      } else if (action.type === 'move') {
        const move = MOVE_TEMPLATES.find(m => m.id === action.moveId);
        if (!move) continue;

        events.push({
          type: 'move_announce',
          actorId: mon.unique_id,
          actorName: mon.nickname,
          moveName: move.name,
          moveType: move.type,
        });

        if (opponentMon.hp_current <= 0) continue;

        if (!this.checkAccuracy(move)) {
          events.push({ type: 'miss', attackerName: mon.nickname });
          continue;
        }

        if (move.power > 0 && this.checkEvasion(opponentMon)) {
          events.push({ type: 'evade', targetName: opponentMon.nickname });
          continue;
        }

        if (move.power === 0 && move.effect) {
          const target = move.effect.target === 'self' ? mon : opponentMon;
          const targetId = move.effect.target === 'self' ? playerId : opponentId;
          const stat = move.effect.stat;
          const stages = move.effect.stages;

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

        if (move.power > 0) {
          const { damage, isCrit, effectiveness } = this.calculateDamage(mon, opponentMon, move);

          opponentMon.hp_current = Math.max(0, opponentMon.hp_current - damage);

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

          if (opponentMon.hp_current <= 0) {
            events.push({
              type: 'faint',
              targetId: opponentMon.unique_id,
              targetName: opponentMon.nickname,
            });

            const remaining = opponent.team.filter(m => m.hp_current > 0);

            if (remaining.length === 0) {
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

    for (const playerId of playerIds) {
      state.players[playerId].ready = false;
      state.players[playerId].action = undefined;

      // Trigger onTurnEnd (e.g. Leftovers)
      const player = state.players[playerId];
      const mon = player.team[player.activeSlot];
      if (mon && mon.hp_current > 0) {
        const turnEndEvents = this.triggerItem(mon, 'onTurnEnd');
        events.push(...turnEndEvents);
      }
    }

    state.turn++;
    state.phase = 'selection';
    state.events = events;
    return state;
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

          baseMon.nickname = monData.nickname;
          baseMon.hp_current = monData.hp_current;
          baseMon.moves = monData.moves
            .map(id => MOVE_TEMPLATES.find(m => m.id === id))
            .filter((m): m is MoveTemplate => m !== undefined);
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
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
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
    const moves = [...t.movePool].sort(() => Math.random() - 0.5).slice(0, 4);

    // Ensure 4 moves (fill with null if less)
    const move1 = moves[0] || null;
    const move2 = moves[1] || null;
    const move3 = moves[2] || null;
    const move4 = moves[3] || null;

    await db.prepare(`
      INSERT INTO monsters (id, owner_id, name, type, hp, atk, def, spd, sprite_url, move1, move2, move3, move4)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      monsterId, userId,
      t.name, t.type,
      t.baseStats.hp, t.baseStats.atk, t.baseStats.def, t.baseStats.spd,
      t.spriteUrl,
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

      if (!q || q.length < 2) {
        return new Response(JSON.stringify({ results: [] }), { headers: { 'Content-Type': 'application/json', ...corsHeaders } });
      }

      let results: any[] = [];
      if (type === 'pokemon') {
        results = MONSTER_TEMPLATES
          .filter((m: any) => m.name.toLowerCase().includes(q) || m.id.includes(q))
          .slice(0, 20)
          .map((m: any) => ({ id: m.id, name: m.name, spriteUrl: m.spriteUrl, type: m.type, baseStats: m.baseStats, movePool: m.movePool }));
      } else if (type === 'move') {
        results = MOVE_TEMPLATES
          .filter((m: any) => m.name.toLowerCase().includes(q) || m.id.includes(q))
          .slice(0, 20)
          .map((m: any) => ({ id: m.id, name: m.name, type: m.type, power: m.power, accuracy: m.accuracy }));
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
      return new Response(JSON.stringify({ moves: MOVE_TEMPLATES }), {
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
    playerTeam: player.team.map(mon => ({
      unique_id: mon.unique_id,
      nickname: mon.nickname,
      type: mon.type,
      hp_current: mon.hp_current,
      hp_max: mon.hp_max,
      spriteUrl: mon.spriteUrl,
      moves: mon.moves.map(m => ({ id: m.id, name: m.name, type: m.type, power: m.power })),
    })),
    opponentTeam: opponent.team.map(mon => ({
      unique_id: mon.unique_id,
      nickname: mon.nickname,
      type: mon.type,
      hp_current: mon.hp_current,
      hp_max: mon.hp_max,
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
    const players = Array.from(this.players.values());
    if (players.length !== 2) return;

    this.battleEngine = new BattleEngine();

    // Convert DB monsters to BattleMonsters
    const p1Team = this.convertToBattleTeam(players[0].team);
    const p2Team = this.convertToBattleTeam(players[1].team);

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

    // Send initial state to each player
    this.sendBattleState();
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
        current_atk: m.atk,
        current_def: m.def,
        current_spd: m.spd,
        moves: moves,
        buffs: { atk: 0, def: 0, spd: 0, crit: 0, evade: 0 },
        spriteUrl: m.sprite_url || 'https://play.pokemonshowdown.com/sprites/gen5ani/substitute.gif',
        ability: 'unknown',
        item: ''
      };
    });
  }

  handleBattleAction(userId: string, action: BattleAction) {
    if (!this.battleState || !this.battleEngine) return;

    const playerState = this.battleState.players[userId];
    if (!playerState) return;

    // Handle forced switch immediately
    if (this.battleState.phase === 'forced_switch' && this.battleState.forcedSwitchPlayer === userId) {
      if (action.type === 'switch' && action.target !== undefined) {
        const newMon = playerState.team[action.target];
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

          this.sendBattleState();
        }
      }
      return;
    }

    // Normal turn action
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
