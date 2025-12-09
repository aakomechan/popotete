import { WebSocketServer, WebSocket } from 'ws';
import { v4 as uuidv4 } from 'uuid';
import http from 'http';

// Import Pokemon Showdown modules
// Note: We need to use relative paths to the parent directory
const { BattleStream } = require('../sim/index');
const { Teams } = require('../sim/index');

interface Battle {
	id: string;
	stream: any;
	players: Map<string, WebSocket>;
	log: string[];
	requests: Map<string, any>;
	ended: boolean;
	winner: string | null;
}

const battles = new Map<string, Battle>();
const playerBattles = new Map<WebSocket, string>();

const PORT = process.env.PORT || 3001;

// Create HTTP server for health checks
const server = http.createServer((req, res) => {
	if (req.url === '/health') {
		res.writeHead(200, { 'Content-Type': 'application/json' });
		res.end(JSON.stringify({ status: 'ok', battles: battles.size }));
	} else {
		res.writeHead(404);
		res.end('Not Found');
	}
});

// Create WebSocket server
const wss = new WebSocketServer({ server });

console.log(`Pokemon Battle Server starting on port ${PORT}...`);

wss.on('connection', (ws: WebSocket) => {
	console.log('New client connected');

	ws.on('message', async (data: Buffer) => {
		try {
			const message = JSON.parse(data.toString());
			await handleMessage(ws, message);
		} catch (error: any) {
			console.error('Error handling message:', error);
			sendError(ws, error.message);
		}
	});

	ws.on('close', () => {
		console.log('Client disconnected');
		const battleId = playerBattles.get(ws);
		if (battleId) {
			const battle = battles.get(battleId);
			if (battle) {
				battle.players.delete(getPlayerSide(battle, ws) || '');
				// If both players left, clean up the battle
				if (battle.players.size === 0) {
					battles.delete(battleId);
					console.log(`Battle ${battleId} cleaned up`);
				}
			}
			playerBattles.delete(ws);
		}
	});

	ws.on('error', (error: Error) => {
		console.error('WebSocket error:', error);
	});
});

async function handleMessage(ws: WebSocket, message: any) {
	const { type, payload } = message;

	switch (type) {
		case 'start_battle':
			await startBattle(ws);
			break;

		case 'make_choice':
			await makeChoice(ws, payload.choice);
			break;

		case 'forfeit':
			await forfeit(ws);
			break;

		default:
			sendError(ws, `Unknown message type: ${type}`);
	}
}

async function startBattle(ws: WebSocket) {
	const battleId = uuidv4();
	const stream = new BattleStream();

	// Generate random teams
	const p1Team = Teams.generate('gen9randombattle');
	const p2Team = Teams.generate('gen9randombattle');

	const p1spec = { name: 'Player', team: Teams.pack(p1Team) };
	const p2spec = { name: 'CPU', team: Teams.pack(p2Team) };

	const battle: Battle = {
		id: battleId,
		stream,
		players: new Map([['p1', ws]]),
		log: [],
		requests: new Map(),
		ended: false,
		winner: null,
	};

	battles.set(battleId, battle);
	playerBattles.set(ws, battleId);

	// Start listening to stream output
	processStream(battle);

	// Initialize the battle
	stream.write(`>start {"formatid":"gen9randombattle"}`);
	stream.write(`>player p1 ${JSON.stringify(p1spec)}`);
	stream.write(`>player p2 ${JSON.stringify(p2spec)}`);

	// Wait a bit for initial output
	await sleep(100);

	// Send initial state to player
	sendBattleUpdate(ws, battle, 'p1');

	console.log(`Battle ${battleId} started`);
}

async function processStream(battle: Battle) {
	for await (const chunk of battle.stream) {
		const lines = chunk.split('\n');

		for (const line of lines) {
			if (!line) continue;

			battle.log.push(line);

			// Parse requests
			if (line.startsWith('|request|')) {
				const requestJson = line.slice(9);
				try {
					const request = JSON.parse(requestJson);
					const side = request.side?.id || (request.rqid ? 'p1' : null);
					if (side) {
						battle.requests.set(side, request);
					}
				} catch (e) { }
			}

			// Check for game end
			if (line.startsWith('|win|')) {
				battle.ended = true;
				battle.winner = line.slice(5);
			}

			if (line.startsWith('|tie')) {
				battle.ended = true;
				battle.winner = 'tie';
			}
		}

		// Send updates to connected players
		for (const [side, playerWs] of battle.players) {
			if (playerWs.readyState === WebSocket.OPEN) {
				sendBattleUpdate(playerWs, battle, side);
			}
		}

		// AI makes a move if needed
		if (!battle.ended) {
			const p2Request = battle.requests.get('p2');
			if (p2Request && !p2Request.wait) {
				const aiChoice = getRandomChoice(p2Request);
				if (aiChoice) {
					await sleep(500); // Small delay for realism
					battle.stream.write(`>p2 ${aiChoice}`);
				}
			}
		}
	}
}

async function makeChoice(ws: WebSocket, choice: string) {
	const battleId = playerBattles.get(ws);
	if (!battleId) {
		sendError(ws, 'Not in a battle');
		return;
	}

	const battle = battles.get(battleId);
	if (!battle) {
		sendError(ws, 'Battle not found');
		return;
	}

	if (battle.ended) {
		sendError(ws, 'Battle already ended');
		return;
	}

	const playerSide = getPlayerSide(battle, ws);
	if (!playerSide) {
		sendError(ws, 'Invalid player');
		return;
	}

	// Send the choice
	battle.stream.write(`>${playerSide} ${choice}`);

	// Clear the log index for this turn
	const logIndex = battle.log.length;

	// Wait for processing
	await sleep(200);

	// Get new log entries
	const newLog = battle.log.slice(logIndex);

	sendToPlayer(ws, {
		type: 'battle_update',
		payload: {
			battleId: battle.id,
			log: newLog,
			request: battle.requests.get(playerSide),
			ended: battle.ended,
			winner: battle.winner,
		},
	});
}

async function forfeit(ws: WebSocket) {
	const battleId = playerBattles.get(ws);
	if (!battleId) return;

	const battle = battles.get(battleId);
	if (!battle || battle.ended) return;

	battle.ended = true;
	battle.winner = 'CPU';

	sendToPlayer(ws, {
		type: 'battle_update',
		payload: {
			battleId: battle.id,
			log: ['|win|CPU'],
			ended: true,
			winner: 'CPU',
		},
	});
}

function getPlayerSide(battle: Battle, ws: WebSocket): string | null {
	for (const [side, playerWs] of battle.players) {
		if (playerWs === ws) return side;
	}
	return null;
}

function sendBattleUpdate(ws: WebSocket, battle: Battle, side: string) {
	sendToPlayer(ws, {
		type: 'battle_update',
		payload: {
			battleId: battle.id,
			log: battle.log,
			request: battle.requests.get(side),
			ended: battle.ended,
			winner: battle.winner,
		},
	});
}

function sendToPlayer(ws: WebSocket, message: any) {
	if (ws.readyState === WebSocket.OPEN) {
		ws.send(JSON.stringify(message));
	}
}

function sendError(ws: WebSocket, error: string) {
	sendToPlayer(ws, { type: 'error', payload: { message: error } });
}

function getRandomChoice(request: any): string | null {
	if (!request) return null;

	// Force switch
	if (request.forceSwitch) {
		const validSwitches: number[] = [];
		if (request.side?.pokemon) {
			for (let i = 0; i < request.side.pokemon.length; i++) {
				const pokemon = request.side.pokemon[i];
				if (!pokemon.active && pokemon.condition !== '0 fnt') {
					validSwitches.push(i + 1);
				}
			}
		}
		if (validSwitches.length > 0) {
			const idx = validSwitches[Math.floor(Math.random() * validSwitches.length)];
			return `switch ${idx}`;
		}
		return 'pass';
	}

	// Normal turn - pick a random move
	if (request.active?.[0]?.moves) {
		const validMoves: number[] = [];
		for (let i = 0; i < request.active[0].moves.length; i++) {
			const move = request.active[0].moves[i];
			if (!move.disabled && move.pp > 0) {
				validMoves.push(i + 1);
			}
		}
		if (validMoves.length > 0) {
			const idx = validMoves[Math.floor(Math.random() * validMoves.length)];
			return `move ${idx}`;
		}
	}

	return null;
}

function sleep(ms: number): Promise<void> {
	return new Promise(resolve => setTimeout(resolve, ms));
}

server.listen(PORT, () => {
	console.log(`Pokemon Battle Server running on port ${PORT}`);
});
