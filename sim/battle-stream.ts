/**
 * Battle Stream
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * Supports interacting with a PS battle in Stream format.
 *
 * This format is VERY NOT FINALIZED, please do not use it directly yet.
 *
 * @license MIT
 */

import * as Streams from '../lib/streams';
import { Utils } from '../lib/utils';
import { Teams } from './teams';
import { Battle, extractChannelMessages } from './battle';
import type { ChoiceRequest } from './side';

/**
 * Like string.split(delimiter), but only recognizes the first `limit`
 * delimiters (default 1).
 *
 * `"1 2 3 4".split(" ", 2) => ["1", "2"]`
 *
 * `Utils.splitFirst("1 2 3 4", " ", 1) => ["1", "2 3 4"]`
 *
 * Returns an array of length exactly limit + 1.
 */
function splitFirst(str: string, delimiter: string, limit = 1) {
	const splitStr: string[] = [];
	while (splitStr.length < limit) {
		const delimiterIndex = str.indexOf(delimiter);
		if (delimiterIndex >= 0) {
			splitStr.push(str.slice(0, delimiterIndex));
			str = str.slice(delimiterIndex + delimiter.length);
		} else {
			splitStr.push(str);
			str = '';
		}
	}
	splitStr.push(str);
	return splitStr;
}

export class BattleStream extends Streams.ObjectReadWriteStream<string> {
	debug: boolean;
	noCatch: boolean;
	replay: boolean | 'spectator';
	keepAlive: boolean;
	battle: Battle | null;

	constructor(options: {
		debug?: boolean, noCatch?: boolean, keepAlive?: boolean, replay?: boolean | 'spectator',
	} = {}) {
		super();
		this.debug = !!options.debug;
		this.noCatch = !!options.noCatch;
		this.replay = options.replay || false;
		this.keepAlive = !!options.keepAlive;
		this.battle = null;
	}

	override _write(chunk: string) {
		if (this.noCatch) {
			this._writeLines(chunk);
		} else {
			try {
				this._writeLines(chunk);
			} catch (err: any) {
				this.pushError(err, true);
				return;
			}
		}
		if (this.battle) this.battle.sendUpdates();
	}

	_writeLines(chunk: string) {
		for (const line of chunk.split('\n')) {
			if (line.startsWith('>')) {
				const [type, message] = splitFirst(line.slice(1), ' ');
				this._writeLine(type, message);
			}
		}
	}

	pushMessage(type: string, data: string) {
		if (this.replay) {
			if (type === 'update') {
				if (this.replay === 'spectator') {
					const channelMessages = extractChannelMessages(data, [0]);
					this.push(channelMessages[0].join('\n'));
				} else {
					const channelMessages = extractChannelMessages(data, [-1]);
					this.push(channelMessages[-1].join('\n'));
				}
			}
			return;
		}
		this.push(`${type}\n${data}`);
	}

	_writeLine(type: string, message: string) {
		switch (type) {
			case 'start':
				const options = JSON.parse(message);
				options.send = (t: string, data: any) => {
					if (Array.isArray(data)) data = data.join("\n");
					this.pushMessage(t, data);
					if (t === 'end' && !this.keepAlive) this.pushEnd();
				};
				if (this.debug) options.debug = true;
				this.battle = new Battle(options);
				break;
			case 'player':
				const [slot, optionsText] = splitFirst(message, ' ');
				this.battle!.setPlayer(slot as SideID, JSON.parse(optionsText));
				break;
			case 'p1':
			case 'p2':
			case 'p3':
			case 'p4':
				if (message === 'undo') {
					this.battle!.undoChoice(type);
				} else {
					this.battle!.choose(type, message);
				}
				break;
			case 'forcewin':
			case 'forcetie':
				this.battle!.win(type === 'forcewin' ? message as SideID : null);
				if (message) {
					this.battle!.inputLog.push(`>forcewin ${message}`);
				} else {
					this.battle!.inputLog.push(`>forcetie`);
				}
				break;
			case 'forcelose':
				this.battle!.lose(message as SideID);
				this.battle!.inputLog.push(`>forcelose ${message}`);
				break;
			case 'reseed':
				this.battle!.resetRNG(message as PRNGSeed);
				// could go inside resetRNG, but this makes using it in `eval` slightly less buggy
				this.battle!.inputLog.push(`>reseed ${this.battle!.prng.getSeed()}`);
				break;
			case 'tiebreak':
				this.battle!.tiebreak();
				break;
			case 'chat-inputlogonly':
				this.battle!.inputLog.push(`>chat ${message}`);
				break;
			case 'chat':
				this.battle!.inputLog.push(`>chat ${message}`);
				this.battle!.add('chat', `${message}`);
				break;
			case 'eval':
				// eval is not supported in Cloudflare Workers
				this.battle!.add('', '>>> ' + message.replace(/\n/g, '\n||'));
				this.battle!.add('', '<<< error: eval is not supported in Cloudflare Workers');
				break;
			case 'requestlog':
				this.push(`requesteddata\n${this.battle!.inputLog.join('\n')}`);
				break;
			case 'requestexport':
				this.push(`requesteddata\n${this.battle!.prngSeed}\n${this.battle!.inputLog.join('\n')}`);
				break;
			case 'requestteam':
				message = message.trim();
				const slotNum = parseInt(message.slice(1)) - 1;
				if (isNaN(slotNum) || slotNum < 0) {
					throw new Error(`Team requested for slot ${message}, but that slot does not exist.`);
				}
				const side = this.battle!.sides[slotNum];
				const team = Teams.pack(side.team);
				this.push(`requesteddata\n${team}`);
				break;
			case 'show-openteamsheets':
				this.battle!.showOpenTeamSheets();
				break;
			case 'version':
			case 'version-origin':
				break;
			default:
				throw new Error(`Unrecognized command ">${type} ${message}"`);
		}
	}

	override _writeEnd() {
		// if battle already ended, we don't need to pushEnd.
		if (!this.atEOF) this.pushEnd();
		this._destroy();
	}

	override _destroy() {
		if (this.battle) this.battle.destroy();
	}
}

/**
 * Splits a BattleStream into omniscient, spectator, p1, p2, p3 and p4
 * streams, for ease of consumption.
 */
export function getPlayerStreams(stream: BattleStream) {
	const streams = {
		omniscient: new Streams.ObjectReadWriteStream({
			write(data: string) {
				void stream.write(data);
			},
			writeEnd() {
				return stream.writeEnd();
			},
		}),
		spectator: new Streams.ObjectReadStream<string>({
			read() { },
		}),
		p1: new Streams.ObjectReadWriteStream({
			write(data: string) {
				void stream.write(data.replace(/(^|\n)/g, `$1>p1 `));
			},
		}),
		p2: new Streams.ObjectReadWriteStream({
			write(data: string) {
				void stream.write(data.replace(/(^|\n)/g, `$1>p2 `));
			},
		}),
		p3: new Streams.ObjectReadWriteStream({
			write(data: string) {
				void stream.write(data.replace(/(^|\n)/g, `$1>p3 `));
			},
		}),
		p4: new Streams.ObjectReadWriteStream({
			write(data: string) {
				void stream.write(data.replace(/(^|\n)/g, `$1>p4 `));
			},
		}),
	};
	(async () => {
		for await (const chunk of stream) {
			const [type, data] = splitFirst(chunk, `\n`);
			switch (type) {
				case 'update':
					const channelMessages = extractChannelMessages(data, [-1, 0, 1, 2, 3, 4]);
					streams.omniscient.push(channelMessages[-1].join('\n'));
					streams.spectator.push(channelMessages[0].join('\n'));
					streams.p1.push(channelMessages[1].join('\n'));
					streams.p2.push(channelMessages[2].join('\n'));
					streams.p3.push(channelMessages[3].join('\n'));
					streams.p4.push(channelMessages[4].join('\n'));
					break;
				case 'sideupdate':
					const [side, sideData] = splitFirst(data, `\n`);
					streams[side as SideID].push(sideData);
					break;
				case 'end':
					// ignore
					break;
			}
		}
		for (const s of Object.values(streams)) {
			s.pushEnd();
		}
	})().catch(err => {
		for (const s of Object.values(streams)) {
			s.pushError(err, true);
		}
	});
	return streams;
}

export abstract class BattlePlayer {
	readonly stream: Streams.ObjectReadWriteStream<string>;
	readonly log: string[];
	readonly debug: boolean;

	constructor(playerStream: Streams.ObjectReadWriteStream<string>, debug = false) {
		this.stream = playerStream;
		this.log = [];
		this.debug = debug;
	}

	async start() {
		for await (const chunk of this.stream) {
			this.receive(chunk);
		}
	}

	receive(chunk: string) {
		for (const line of chunk.split('\n')) {
			this.receiveLine(line);
		}
	}

	receiveLine(line: string) {
		if (this.debug) console.log(line);
		if (!line.startsWith('|')) return;
		const [cmd, rest] = splitFirst(line.slice(1), '|');
		if (cmd === 'request') return this.receiveRequest(JSON.parse(rest));
		if (cmd === 'error') return this.receiveError(new Error(rest));
		this.log.push(line);
	}

	abstract receiveRequest(request: ChoiceRequest): void;

	receiveError(error: Error) {
		throw error;
	}

	choose(choice: string) {
		void this.stream.write(choice);
	}
}

export class BattleTextStream extends Streams.ReadWriteStream {
	readonly battleStream: BattleStream;
	currentMessage: string;

	constructor(options: { debug?: boolean; }) {
		super();
		this.battleStream = new BattleStream(options);
		this.currentMessage = '';
		void this._listen();
	}

	async _listen() {
		for await (let message of this.battleStream) {
			if (!message.endsWith('\n')) message += '\n';
			this.push(message + '\n');
		}
		this.pushEnd();
	}

	override _write(message: string | Buffer) {
		this.currentMessage += `${message}`;
		const index = this.currentMessage.lastIndexOf('\n');
		if (index >= 0) {
			void this.battleStream.write(this.currentMessage.slice(0, index));
			this.currentMessage = this.currentMessage.slice(index + 1);
		}
	}

	override _writeEnd() {
		return this.battleStream.writeEnd();
	}
}
