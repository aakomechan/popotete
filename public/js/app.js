// Pokemon Battle System - Complete Frontend Application

const SPRITE_BASE = 'https://play.pokemonshowdown.com/sprites';

// Event timing constants
const TIMING = {
	TEXT_SHORT: 600,
	TEXT_NORMAL: 800,
	MOVE_ANNOUNCE: 700,
	ATTACK_ANIM: 400,
	DAMAGE_DISPLAY: 800,
	EFFECTIVENESS: 600,
	FAINT: 1200,
	SWITCH: 800,
	TURN_START: 500,
};

// Global Data
let ALL_POKEMON = [];
let AVAILABLE_MOVES = {};

const TYPE_TRANSLATIONS = {
	'normal': 'ノーマル', 'fire': 'ほのお', 'water': 'みず', 'grass': 'くさ',
	'electric': 'でんき', 'ice': 'こおり', 'fighting': 'かくとう', 'poison': 'どく',
	'ground': 'じめん', 'flying': 'ひこう', 'psychic': 'エスパー', 'bug': 'むし',
	'rock': 'いわ', 'ghost': 'ゴースト', 'dragon': 'ドラゴン', 'dark': 'あく',
	'steel': 'はがね', 'fairy': 'フェアリー'
};

const CATEGORY_TRANSLATIONS = {
	'physical': '物理',
	'special': '特殊',
	'status': '変化'
};

// BGM URLs (from Pokemon Showdown)
const BGM_URLS = {
	lobby: 'https://play.pokemonshowdown.com/audio/dpp-trainer.mp3',
	battle: 'https://play.pokemonshowdown.com/audio/dpp-trainer.mp3' // DPP Trainer Battle
};

// Audio Manager
class AudioManager {
	constructor() {
		this.bgm = null;
		this.enabled = true;
		this.volume = 0.3;
		this.currentTrack = null;
	}

	init() {
		// Audio manager initialized - no visible button
	}

	play(trackName) {
		if (!this.enabled) return;

		const url = BGM_URLS[trackName];
		if (!url || this.currentTrack === trackName) return;

		this.stop();
		this.bgm = new Audio(url);
		this.bgm.loop = true;
		this.bgm.volume = this.volume;
		this.bgm.play().catch(() => {
			// Autoplay blocked - will play on next user interaction
			console.log('BGM autoplay blocked, will play on interaction');
		});
		this.currentTrack = trackName;
	}

	stop() {
		if (this.bgm) {
			this.bgm.pause();
			this.bgm.currentTime = 0;
			this.bgm = null;
			this.currentTrack = null;
		}
	}

	toggle() {
		this.enabled = !this.enabled;
		const btn = document.getElementById('bgm-toggle');
		if (btn) {
			btn.innerHTML = this.enabled ? '🔊' : '🔇';
		}
		if (this.enabled) {
			// Resume with last track or lobby
			this.play(this.currentTrack || 'lobby');
		} else {
			this.stop();
		}
	}

	setVolume(vol) {
		this.volume = Math.max(0, Math.min(1, vol));
		if (this.bgm) {
			this.bgm.volume = this.volume;
		}
	}

	// Play Pokemon cry sound
	playCry(pokemonId) {
		if (!this.enabled || !pokemonId) return;

		// Normalize pokemon id (lowercase, remove special characters)
		const normalizedId = pokemonId.toLowerCase().replace(/[^a-z0-9]/g, '');
		const cryUrl = `https://play.pokemonshowdown.com/audio/cries/${normalizedId}.mp3`;

		const cry = new Audio(cryUrl);
		cry.volume = this.volume * 0.7; // Slightly quieter than BGM
		cry.play().catch(() => {
			console.log('Cry playback failed for:', pokemonId);
		});
	}

	// Play button click sound (using notification.wav from Pokemon Showdown CDN)
	playButtonClick() {
		if (!this.enabled) return;
		const sound = new Audio('https://play.pokemonshowdown.com/audio/notification.wav');
		sound.volume = this.volume * 0.4;
		sound.play().catch(() => { });
	}

	// Note: The following sound effects are not available on Pokemon Showdown CDN
	// They are implemented as no-ops to prevent errors, but can be replaced with custom sounds later

	// Play damage sound (no sound available - silent)
	playDamage() {
		// Sound not available on CDN
	}

	// Play super effective sound (no sound available - silent)
	playSuperEffective() {
		// Sound not available on CDN
	}

	// Play not very effective sound (no sound available - silent)
	playResisted() {
		// Sound not available on CDN
	}

	// Play faint sound (no sound available - silent)
	playFaint() {
		// Sound not available on CDN
	}
}

const audioManager = new AudioManager();

class BattleApp {
	constructor() {
		// User state
		this.currentUser = null;
		this.team = Array(6).fill(null); // 6 slots, null or object
		this.selectedSlot = 0; // Currently selected team slot (0-5)

		// UI State
		this.selectedPokemon = null; // Currently viewed pokemon in detail panel
		this.selectedMoves = []; // Moves for the currently viewed pokemon

		// Battle state
		this.battleState = null;
		this.serializedState = null;
		this.playerTeam = [];
		this.opponentTeam = [];
		this.playerActive = 0;
		this.opponentActive = 0;
		this.forcedSwitch = false;
		this.battlePhase = 'idle';
		this.eventQueue = [];
		this.isPlayingEvents = false;
		this.displayedHPs = {};

		// Room state
		this.roomCode = null;
		this.ws = null;

		this.initElements();
		this.bindEvents();
		this.checkAuth();
	}

	initElements() {
		// Screens
		this.loginScreen = document.getElementById('login-screen');
		this.builderScreen = document.getElementById('builder-screen');
		this.roomScreen = document.getElementById('room-screen');
		this.battleScreen = document.getElementById('battle-screen');
		this.resultScreen = document.getElementById('result-screen');

		// Sidebar
		this.usernameDisplay = document.getElementById('username-display');
		this.logoutBtn = document.getElementById('logout-btn');
		this.teamSlotsContainer = document.getElementById('team-slots');
		this.saveTeamBtn = document.getElementById('save-team-btn');
		this.createRoomBtn = document.getElementById('create-room-btn');
		this.roomCodeInput = document.getElementById('room-code-input');
		this.joinRoomBtn = document.getElementById('join-room-btn');

		// Login
		this.loginUsername = document.getElementById('login-username');
		this.loginPassword = document.getElementById('login-password');
		this.loginBtn = document.getElementById('login-btn');
		this.registerUsername = document.getElementById('register-username');
		this.registerPassword = document.getElementById('register-password');
		this.registerBtn = document.getElementById('register-btn');
		this.authError = document.getElementById('auth-error');
		this.tabBtns = document.querySelectorAll('.tab-btn');

		// Builder - List
		this.pokemonSearch = document.getElementById('pokemon-search');
		this.typeFilter = document.getElementById('type-filter');
		this.sortFilter = document.getElementById('sort-filter');
		this.pokemonList = document.getElementById('pokemon-list');

		// Builder - Detail
		this.detailPanel = document.getElementById('pokemon-detail-panel');
		this.detailContent = this.detailPanel.querySelector('.detail-content');
		this.emptyState = this.detailPanel.querySelector('.empty-state');
		this.detailSprite = document.getElementById('detail-sprite');
		this.detailName = document.getElementById('detail-name');
		this.detailTypes = document.getElementById('detail-types');
		this.addToTeamBtn = document.getElementById('add-to-team-btn');
		this.statsChart = document.getElementById('stats-chart');
		this.statTotal = document.getElementById('stat-total');
		this.moveSearch = document.getElementById('move-search');
		this.moveTypeFilter = document.getElementById('move-type-filter');
		this.moveCategoryFilter = document.getElementById('move-category-filter');
		this.movesList = document.getElementById('moves-list');

		// Room
		this.leaveRoomBtn = document.getElementById('leave-room-btn');
		this.roomCodeDisplay = document.getElementById('room-code-display');
		this.copyCodeBtn = document.getElementById('copy-code-btn');
		this.playersList = document.getElementById('players-list');
		this.readyBtn = document.getElementById('ready-btn');

		// Battle
		this.battleLog = document.getElementById('battle-log');
		this.messageBox = document.getElementById('message-box');
		this.mainMenu = document.getElementById('main-menu');
		this.moveMenu = document.getElementById('move-menu');
		this.switchMenu = document.getElementById('switch-menu');
		this.waitingPanel = document.getElementById('waiting-panel');
		this.fightBtn = document.getElementById('fight-btn');
		this.pokemonBtn = document.getElementById('pokemon-btn');
		this.movesGrid = document.getElementById('moves-grid');
		this.switchGrid = document.getElementById('switch-grid');
		this.moveBackBtn = document.getElementById('move-back-btn');
		this.switchBackBtn = document.getElementById('switch-back-btn');

		// Result
		this.resultText = document.getElementById('result-text');
		this.toDashboardBtn = document.getElementById('to-dashboard-btn');
	}

	bindEvents() {
		// Auth
		this.tabBtns.forEach(btn => {
			btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
		});
		this.loginBtn?.addEventListener('click', () => this.login());
		this.registerBtn?.addEventListener('click', () => this.register());
		this.logoutBtn?.addEventListener('click', () => this.logout());

		// Builder
		this.pokemonSearch?.addEventListener('input', () => this.renderPokemonList());
		this.typeFilter?.addEventListener('change', () => this.renderPokemonList());
		this.sortFilter?.addEventListener('change', () => this.renderPokemonList());
		this.addToTeamBtn?.addEventListener('click', () => this.addToTeam());
		this.saveTeamBtn?.addEventListener('click', () => this.saveTeam());
		this.moveSearch?.addEventListener('input', () => this.renderMovesList());
		this.moveTypeFilter?.addEventListener('change', () => this.renderMovesList());
		this.moveCategoryFilter?.addEventListener('change', () => this.renderMovesList());

		// Mobile action bar
		document.getElementById('mobile-save-btn')?.addEventListener('click', () => this.saveTeam());
		document.getElementById('mobile-create-room-btn')?.addEventListener('click', () => this.createRoom());
		document.getElementById('mobile-join-btn')?.addEventListener('click', () => {
			const code = document.getElementById('mobile-room-code')?.value?.trim().toUpperCase();
			if (code?.length === 6) {
				this.roomCode = code;
				this.showRoom();
				this.connectWebSocket();
			}
		});

		// Room
		this.createRoomBtn?.addEventListener('click', () => this.createRoom());
		this.joinRoomBtn?.addEventListener('click', () => this.joinRoom());
		this.leaveRoomBtn?.addEventListener('click', () => this.leaveRoom());
		this.copyCodeBtn?.addEventListener('click', () => this.copyRoomCode());
		this.readyBtn?.addEventListener('click', () => this.setReady());

		// Battle
		this.fightBtn?.addEventListener('click', () => {
			audioManager.playButtonClick();
			this.showMoveMenu();
		});
		this.pokemonBtn?.addEventListener('click', () => {
			audioManager.playButtonClick();
			this.showSwitchMenu();
		});
		this.moveBackBtn?.addEventListener('click', () => {
			audioManager.playButtonClick();
			this.showMainMenu();
		});
		this.switchBackBtn?.addEventListener('click', () => {
			audioManager.playButtonClick();
			if (!this.forcedSwitch) this.showMainMenu();
		});
		this.toDashboardBtn?.addEventListener('click', () => this.showScreen('builder'));
	}

	// ========== AUTH ==========
	async checkAuth() {
		try {
			const res = await fetch('/api/auth/me', {credentials: 'include'});
			const data = await res.json();
			if (data.user) {
				this.currentUser = data.user;
				this.loginScreen.classList.remove('active');
				this.initApp();
			} else {
				this.loginScreen.classList.add('active');
			}
		} catch (e) {
			this.loginScreen.classList.add('active');
		}
	}

	switchTab(tab) {
		this.tabBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.tab === tab));
		document.querySelectorAll('.tab-content').forEach(content => {
			content.classList.toggle('active', content.id === `${tab}-tab`);
		});
	}

	async login() {
		const username = this.loginUsername.value.trim();
		const password = this.loginPassword.value;
		if (!username || !password) return;

		try {
			const res = await fetch('/api/auth/login', {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				credentials: 'include',
				body: JSON.stringify({username, password}),
			});
			const data = await res.json();
			if (data.error) {
				this.authError.textContent = data.error;
			} else {
				this.currentUser = data.user;
				this.loginScreen.classList.remove('active');
				this.initApp();
			}
		} catch (e) {
			this.authError.textContent = 'Login failed';
		}
	}

	async register() {
		const username = this.registerUsername.value.trim();
		const password = this.registerPassword.value;
		if (username.length < 3 || password.length < 4) return;

		try {
			const res = await fetch('/api/auth/register', {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				credentials: 'include',
				body: JSON.stringify({username, password}),
			});
			const data = await res.json();
			if (data.error) {
				this.authError.textContent = data.error;
			} else {
				this.currentUser = data.user;
				this.loginScreen.classList.remove('active');
				this.initApp();
			}
		} catch (e) {
			this.authError.textContent = 'Registration failed';
		}
	}

	async logout() {
		await fetch('/api/auth/logout', {method: 'POST', credentials: 'include'});
		location.reload();
	}

	// ========== APP INIT ==========
	async initApp() {
		this.usernameDisplay.textContent = this.currentUser.username;
		// Set mobile username too
		const mobileUsername = document.getElementById('mobile-username');
		if (mobileUsername) {
			mobileUsername.textContent = this.currentUser.username;
		}
		this.showScreen('builder');

		// Initialize audio system (BGM will play when battle starts)
		audioManager.init();

		// Load Data
		await Promise.all([
			this.loadAllPokemon(),
			this.loadMoves(),
			this.loadTeam()
		]);

		this.renderTeamSlots();
		this.renderPokemonList();
	}

	async loadAllPokemon() {
		try {
			const res = await fetch('/api/data/search?all=true');
			const data = await res.json();
			ALL_POKEMON = data.results || [];
		} catch (e) {
			console.error('Failed to load pokemon:', e);
		}
	}

	async loadMoves() {
		try {
			const res = await fetch('/api/data/search?type=move&all=true');
			const data = await res.json();
			// Convert array to object for easier lookup
			AVAILABLE_MOVES = {};
			if (data.results) {
				data.results.forEach(m => AVAILABLE_MOVES[m.id] = m);
			}
		} catch (e) {
			console.error('Failed to load moves:', e);
		}
	}

	async loadTeam() {
		try {
			const res = await fetch('/api/team', {credentials: 'include'});
			const data = await res.json();
			const savedTeam = data.team || [];

			// Map saved team to internal structure
			this.team = Array(6).fill(null);
			savedTeam.forEach(slot => {
				if (slot && slot.slot >= 0 && slot.slot < 6) {
					// Find full pokemon data
					const pokemon = ALL_POKEMON.find(p => p.id === slot.id);
					if (pokemon) {
						this.team[slot.slot] = {
							...pokemon,
							moves: [slot.move1, slot.move2, slot.move3, slot.move4].filter(Boolean)
						};
					}
				}
			});
		} catch (e) {
			console.error('Failed to load team:', e);
		}
	}

	// ========== UI RENDERING ==========
	showScreen(screenName) {
		document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
		document.querySelectorAll('.overlay-screen').forEach(s => s.classList.remove('active'));

		if (screenName === 'login') {
			this.loginScreen.classList.add('active');
		} else if (screenName === 'result') {
			this.resultScreen.classList.add('active');
		} else {
			const screen = document.getElementById(`${screenName}-screen`);
			if (screen) screen.classList.remove('hidden');
		}
	}

	renderTeamSlots() {
		const slotHtml = this.team.map((mon, i) => `
            <div class="team-slot ${mon ? 'filled' : ''} ${this.selectedSlot === i ? 'active' : ''}" data-slot="${i}">
                ${mon ? `<img src="${mon.spriteUrl}" alt="${mon.name}">` : ''}
            </div>
        `).join('');

		// Desktop sidebar team slots
		this.teamSlotsContainer.innerHTML = slotHtml;

		// Mobile team slots
		const mobileSlots = document.getElementById('mobile-team-slots');
		if (mobileSlots) {
			mobileSlots.innerHTML = slotHtml;
			// Add click handlers for mobile slots
			mobileSlots.querySelectorAll('.team-slot').forEach(slot => {
				slot.addEventListener('click', () => {
					this.selectedSlot = parseInt(slot.dataset.slot);
					this.renderTeamSlots();
					const mon = this.team[this.selectedSlot];
					if (mon) {
						this.selectPokemon(mon.id, true);
					}
				});
			});
		}

		this.teamSlotsContainer.querySelectorAll('.team-slot').forEach(slot => {
			slot.addEventListener('click', () => {
				this.selectedSlot = parseInt(slot.dataset.slot);
				this.renderTeamSlots();

				// If slot has pokemon, show it in detail view
				const mon = this.team[this.selectedSlot];
				if (mon) {
					this.selectPokemon(mon.id, true);
				}
			});
		});
	}

	renderPokemonList() {
		const query = this.pokemonSearch.value.toLowerCase();
		const type = this.typeFilter.value;
		const sort = this.sortFilter.value;

		let filtered = ALL_POKEMON.filter(p => {
			const nameMatch = p.name.toLowerCase().includes(query);
			const typeMatch = type === 'all' || p.type === type || (p.types && p.types.includes(type));
			return nameMatch && typeMatch;
		});

		// Sorting
		filtered.sort((a, b) => {
			if (sort === 'total') {
				const totalA = Object.values(a.baseStats).reduce((sum, val) => sum + val, 0);
				const totalB = Object.values(b.baseStats).reduce((sum, val) => sum + val, 0);
				return totalB - totalA;
			} else if (sort === 'hp' || sort === 'atk' || sort === 'spe') {
				return b.baseStats[sort] - a.baseStats[sort];
			} else if (sort === 'name') {
				return a.name.localeCompare(b.name);
			} else {
				return a.id.localeCompare(b.id);
			}
		});

		this.pokemonList.innerHTML = filtered.slice(0, 100).map(p => `
            <div class="list-item ${this.selectedPokemon?.id === p.id ? 'selected' : ''}" data-id="${p.id}">
                <img src="${p.spriteUrl}" loading="lazy" onerror="this.src='https://play.pokemonshowdown.com/sprites/gen5/substitute.png'">
                <div class="info">
                    <div class="name">${p.name}</div>
                    <div class="types">
                        <span class="type-badge type-${p.type}">${TYPE_TRANSLATIONS[p.type] || p.type}</span>
                        ${p.type2 ? `<span class="type-badge type-${p.type2}">${TYPE_TRANSLATIONS[p.type2] || p.type2}</span>` : ''}
                    </div>
                </div>
            </div>
        `).join('');

		this.pokemonList.querySelectorAll('.list-item').forEach(item => {
			item.addEventListener('click', () => this.selectPokemon(item.dataset.id));
		});
	}

	selectPokemon(id, fromTeam = false) {
		const pokemon = ALL_POKEMON.find(p => p.id === id);
		if (!pokemon) return;

		this.selectedPokemon = pokemon;

		// If selecting from team, load saved moves
		if (fromTeam && this.team[this.selectedSlot]) {
			this.selectedMoves = [...this.team[this.selectedSlot].moves];
		} else {
			// Default moves (first 4 valid moves or tackle)
			this.selectedMoves = [];
		}

		// Update UI
		this.emptyState.classList.add('hidden');
		this.detailContent.classList.remove('hidden');

		this.detailSprite.src = pokemon.spriteUrl;
		this.detailName.textContent = pokemon.name;
		this.detailTypes.innerHTML = `
            <span class="type-badge type-${pokemon.type}">${TYPE_TRANSLATIONS[pokemon.type] || pokemon.type}</span>
            ${pokemon.type2 ? `<span class="type-badge type-${pokemon.type2}">${TYPE_TRANSLATIONS[pokemon.type2] || pokemon.type2}</span>` : ''}
        `;

		// Stats
		this.renderStats(pokemon.baseStats);

		// Populate move type filter
		this.populateMoveTypeFilter();

		// Moves
		this.renderMovesList();

		// Highlight in list
		this.renderPokemonList();
	}

	populateMoveTypeFilter() {
		if (!this.moveTypeFilter) return;
		// Reset filter
		this.moveTypeFilter.innerHTML = '<option value="">タイプ</option>';
		// Add all types
		const types = ['normal', 'fire', 'water', 'grass', 'electric', 'ice', 'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'];
		types.forEach(t => {
			const option = document.createElement('option');
			option.value = t;
			option.textContent = TYPE_TRANSLATIONS[t] || t;
			this.moveTypeFilter.appendChild(option);
		});
	}

	renderStats(stats) {
		const statNames = {
			hp: 'HP',
			atk: '攻撃',
			def: '防御',
			spa: '特攻',
			spd: '特防',
			spe: '素早さ'
		};
		const statDescs = {
			hp: '体力。0になると戦闘不能',
			atk: '物理技のダメージに影響',
			def: '物理技への耐性',
			spa: '特殊技のダメージに影響',
			spd: '特殊技への耐性',
			spe: '行動順を決定'
		};
		let total = 0;

		this.statsChart.innerHTML = Object.entries(stats).map(([key, val]) => {
			if (!statNames[key]) return '';
			total += val;
			const percent = Math.min(100, (val / 150) * 100);
			return `
                <div class="stat-bar-row">
                    <div class="stat-label">
                        <span class="stat-name">${statNames[key]}</span>
                        <span class="stat-help" data-stat="${key}">?</span>
                    </div>
                    <div class="stat-track">
                        <div class="stat-fill" style="width: ${percent}%"></div>
                    </div>
                    <span class="stat-val">${val}</span>
                </div>
                <div class="stat-desc-row hidden" id="stat-desc-${key}">
                    ${statDescs[key]}
                </div>
            `;
		}).join('');

		// Add click handlers for help icons
		this.statsChart.querySelectorAll('.stat-help').forEach(helpIcon => {
			helpIcon.addEventListener('click', (e) => {
				e.stopPropagation();
				const stat = helpIcon.dataset.stat;
				const descRow = document.getElementById(`stat-desc-${stat}`);
				if (descRow) {
					descRow.classList.toggle('hidden');
				}
			});
		});

		this.statTotal.textContent = total;
	}

	renderMovesList() {
		if (!this.selectedPokemon) return;

		const query = this.moveSearch.value.toLowerCase();
		const typeFilter = this.moveTypeFilter?.value || '';
		const categoryFilter = this.moveCategoryFilter?.value || '';

		// Get available moves for this pokemon
		let moves = [];
		if (this.selectedPokemon.movePool) {
			moves = this.selectedPokemon.movePool
				.map(id => AVAILABLE_MOVES[id])
				.filter(m => m && m.name.toLowerCase().includes(query));
		} else {
			// Fallback if no movePool (shouldn't happen with new API)
			moves = Object.values(AVAILABLE_MOVES)
				.filter(m => m.type === this.selectedPokemon.type || m.type === 'normal')
				.filter(m => m.name.toLowerCase().includes(query));
		}

		// Apply type filter
		if (typeFilter) {
			moves = moves.filter(m => m.type === typeFilter);
		}

		// Apply category filter
		if (categoryFilter) {
			moves = moves.filter(m => m.category === categoryFilter);
		}

		this.movesList.innerHTML = moves.map(m => `
            <div class="move-item ${this.selectedMoves.includes(m.id) ? 'selected' : ''}" data-id="${m.id}">
                <div class="move-main">
                    <div class="move-header">
                        <div class="move-name-wrapper">
                            <span class="move-name">${m.name}</span>
                            ${m.description ? `<span class="move-help" data-move="${m.id}">?</span>` : ''}
                        </div>
                        <div class="move-meta">
                            <span class="type-badge type-${m.type}">${TYPE_TRANSLATIONS[m.type] || m.type}</span>
                            <span class="category-badge category-${m.category}">${CATEGORY_TRANSLATIONS[m.category] || m.category}</span>
                            ${m.category === 'status' ? '' : `威力: ${m.power || '-'}`}
                            命中: ${m.accuracy === true ? '-' : m.accuracy || 100}
                        </div>
                    </div>
                    <div class="move-desc hidden" id="move-desc-${m.id}">${m.description || ''}</div>
                </div>
            </div>
        `).join('');

		// Add click handlers for move items
		this.movesList.querySelectorAll('.move-item').forEach(item => {
			item.addEventListener('click', (e) => {
				// Don't toggle move if clicking on help icon
				if (e.target.classList.contains('move-help')) return;
				this.toggleMove(item.dataset.id);
			});
		});

		// Add click handlers for help icons
		this.movesList.querySelectorAll('.move-help').forEach(helpIcon => {
			helpIcon.addEventListener('click', (e) => {
				e.stopPropagation();
				const moveId = helpIcon.dataset.move;
				const descRow = document.getElementById(`move-desc-${moveId}`);
				if (descRow) {
					descRow.classList.toggle('hidden');
				}
			});
		});
	}

	toggleMove(moveId) {
		if (this.selectedMoves.includes(moveId)) {
			this.selectedMoves = this.selectedMoves.filter(id => id !== moveId);
		} else {
			if (this.selectedMoves.length < 4) {
				this.selectedMoves.push(moveId);
			}
		}
		this.renderMovesList();
	}

	addToTeam() {
		if (!this.selectedPokemon) return;

		// Ensure at least one move (tackle fallback handled in backend, but good to have here)
		const moves = this.selectedMoves.length > 0 ? this.selectedMoves : ['tackle'];

		this.team[this.selectedSlot] = {
			...this.selectedPokemon,
			moves: moves
		};

		this.renderTeamSlots();

		// Auto advance slot
		if (this.selectedSlot < 5) {
			this.selectedSlot++;
			this.renderTeamSlots();
		}
	}

	async saveTeam() {
		const slots = this.team.map(mon => mon ? mon.id : null);

		try {
			const instanceIds = await Promise.all(this.team.map(async (mon) => {
				if (!mon) return null;

				// Create new monster instance
				const res = await fetch('/api/monsters', {
					method: 'POST',
					headers: {'Content-Type': 'application/json'},
					credentials: 'include',
					body: JSON.stringify({
						name: mon.name,
						type: mon.type,
						hp: mon.baseStats.hp,
						atk: mon.baseStats.atk,
						def: mon.baseStats.def,
						spd: mon.baseStats.spd,
						sprite_url: mon.spriteUrl,
						move1: mon.moves[0],
						move2: mon.moves[1],
						move3: mon.moves[2],
						move4: mon.moves[3]
					})
				});
				const data = await res.json();
				return data.id;
			}));

			// Update team slots
			await fetch('/api/team', {
				method: 'PUT',
				headers: {'Content-Type': 'application/json'},
				credentials: 'include',
				body: JSON.stringify({slots: instanceIds}),
			});

			alert('Team saved!');
		} catch (e) {
			console.error('Failed to save team:', e);
			alert('Failed to save team');
		}
	}

	// ========== ROOM & BATTLE ==========
	async createRoom() {
		try {
			const res = await fetch('/api/rooms', {
				method: 'POST',
				credentials: 'include',
			});
			const data = await res.json();
			if (data.roomCode) {
				this.roomCode = data.roomCode;
				this.showRoom();
				this.connectWebSocket();
			}
		} catch (e) {
			console.error('Failed to create room:', e);
		}
	}

	joinRoom() {
		const code = this.roomCodeInput.value.trim();
		if (code.length === 4 && /^\d{4}$/.test(code)) {
			this.roomCode = `R${code}`; // Add R prefix for server
			this.showRoom();
			this.connectWebSocket();
		}
	}

	showRoom() {
		this.showScreen('room');
		// Display without R prefix for user
		this.roomCodeDisplay.textContent = this.roomCode.replace(/^R/, '');
	}

	leaveRoom() {
		if (this.ws) {
			this.ws.close();
			this.ws = null;
		}
		this.roomCode = null;
		this.showScreen('builder');
	}

	copyRoomCode() {
		navigator.clipboard?.writeText(this.roomCode);
		// Visual feedback could be added here
	}

	connectWebSocket() {
		const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
		this.ws = new WebSocket(`${protocol}//${location.host}/api/rooms/${this.roomCode}/ws`);

		this.ws.onmessage = (event) => {
			const data = JSON.parse(event.data);
			this.handleRoomMessage(data);
		};
	}

	handleRoomMessage(data) {
		switch (data.type) {
			case 'players':
				this.renderPlayersList(data.players);
				break;
			case 'battle_start':
				// Start battle BGM when match begins
				audioManager.play('battle');
				break;
			case 'battle_update':
				this.showScreen('battle');
				audioManager.play('battle'); // Ensure battle BGM is playing
				this.processBattleResponse(data.data);
				break;
			case 'battle_end':
				this.battlePhase = 'ended';
				this.showScreen('result');
				audioManager.stop(); // Stop battle BGM
				this.showBattleResult(data);
				break;
		}
	}

	showBattleResult(data) {
		const resultCard = document.getElementById('result-card');
		const resultIcon = document.getElementById('result-icon');
		const resultSubtitle = document.getElementById('result-subtitle');

		// Check if current user won
		const isWinner = data.winnerName === this.currentUser?.username;

		if (data.winnerName) {
			if (isWinner) {
				resultCard.className = 'result-card victory';
				resultIcon.textContent = '🏆';
				this.resultText.textContent = '勝利！';
				resultSubtitle.textContent = 'おめでとうございます！';
			} else {
				resultCard.className = 'result-card defeat';
				resultIcon.textContent = '💔';
				this.resultText.textContent = '敗北...';
				resultSubtitle.textContent = '次は頑張りましょう！';
			}
		} else {
			resultCard.className = 'result-card';
			resultIcon.textContent = '🚪';
			this.resultText.textContent = '対戦終了';
			resultSubtitle.textContent = '相手が切断しました';
		}
	}

	renderPlayersList(players) {
		this.playersList.innerHTML = players.map(p => `
            <div class="player-item">
                <span class="name">${p.name}${p.isHost ? ' (Host)' : ''}</span>
                <span class="status ${p.ready ? 'ready' : 'waiting'}">${p.ready ? 'Ready' : 'Waiting'}</span>
            </div>
        `).join('');
	}

	setReady() {
		if (this.ws) {
			this.ws.send(JSON.stringify({type: 'ready'}));
			this.readyBtn.disabled = true;
			this.readyBtn.textContent = 'Ready!';
		}
	}

	// ========== BATTLE LOGIC (Preserved) ==========
	processBattleResponse(data) {
		// Track previous active Pokemon for cry detection
		const prevPlayerActive = this.playerTeam[this.playerActive];
		const prevOpponentActive = this.opponentTeam[this.opponentActive];

		this.serializedState = data.serialized;
		this.playerTeam = data.playerTeam;
		this.opponentTeam = data.opponentTeam;
		this.playerActive = data.playerActive;
		this.opponentActive = data.opponentActive;
		this.forcedSwitch = data.forcedSwitch;

		// Initialize HPs
		[...this.playerTeam, ...this.opponentTeam].forEach(mon => {
			if (this.displayedHPs[mon.unique_id] === undefined) {
				this.displayedHPs[mon.unique_id] = mon.hp_current;
			}
		});

		// Play Pokemon cries when active Pokemon changes
		const newPlayerActive = this.playerTeam[this.playerActive];
		const newOpponentActive = this.opponentTeam[this.opponentActive];

		// Play opponent cry first (slightly delayed), then player cry
		if (newOpponentActive && (!prevOpponentActive || prevOpponentActive.id !== newOpponentActive.id)) {
			audioManager.playCry(newOpponentActive.id);
		}
		if (newPlayerActive && (!prevPlayerActive || prevPlayerActive.id !== newPlayerActive.id)) {
			// Delay player cry slightly to not overlap
			setTimeout(() => audioManager.playCry(newPlayerActive.id), 400);
		}

		if (data.events?.length > 0) {
			this.eventQueue = [...data.events];
			this.playEvents();
		} else {
			this.updateUI();
			if (data.phase === 'end') {
				// Handled by battle_end message usually, but just in case
			}
		}
	}

	playEvents() {
		if (this.isPlayingEvents || this.eventQueue.length === 0) return;
		this.isPlayingEvents = true;

		const event = this.eventQueue.shift();
		this.processEvent(event).then(() => {
			this.isPlayingEvents = false;
			if (this.eventQueue.length > 0) {
				this.playEvents();
			} else {
				// Reset battlePhase when events are done - allow new input
				this.battlePhase = undefined;
				this.updateUI();
			}
		});
	}

	async processEvent(event) {
		// Generate detailed message based on event type
		let message = event.message || '';

		switch (event.type) {
			case 'turn_start':
				message = `───── ターン ${event.turn} ─────`;
				break;
			case 'move_announce':
				message = `${event.actorName}の ${event.moveName}！`;
				break;
			case 'damage':
				// Play damage sound
				audioManager.playDamage();

				if (!event.message) {
					message = `${event.targetName}に ${event.amount}の ダメージ！`;
				}
				// 効果抜群/いまひとつ/無効を表示
				if (event.effectiveness > 1) {
					this.addLog(message);
					audioManager.playSuperEffective();
					message = '効果は ばつぐんだ！';
				} else if (event.effectiveness > 0 && event.effectiveness < 1) {
					this.addLog(message);
					audioManager.playResisted();
					message = '効果は いまひとつのようだ...';
				} else if (event.effectiveness === 0) {
					this.addLog(message);
					message = '効果は ないようだ...';
				}
				// 急所を表示
				if (event.isCrit) {
					this.addLog(message);
					message = '急所に 当たった！';
				}

				// Update HP for the target
				this.updateHPForTarget(event.targetId, event.newHp, event.maxHp);
				break;
			case 'heal':
				if (!event.message) {
					message = `${event.targetName}は ${event.amount} 回復した！`;
				}
				break;
			case 'faint':
				audioManager.playFaint();
				message = `${event.targetName}は 倒れた！`;
				break;
			case 'switch':
				message = `${event.playerName}は ${event.monsterName}を 繰り出した！`;
				break;
			case 'status':
			case 'status_inflict':
				if (!event.message) {
					const statusNames = {brn: 'やけど', psn: 'どく', tox: 'もうどく', par: 'まひ', frz: 'こおり', slp: 'ねむり'};
					message = `${event.targetName}は ${statusNames[event.status] || event.status}状態になった！`;
				}
				break;
			case 'status_damage':
				// Play damage sound for status damage
				audioManager.playDamage();
				const statusDmgNames = {brn: 'やけど', psn: 'どく', tox: 'もうどく'};
				message = `${event.targetName}は ${statusDmgNames[event.status] || event.status}の ダメージを受けた！`;

				// Update HP for the target
				this.updateHPForTarget(event.targetId, event.newHp, event.maxHp);
				break;
			case 'status_immobilize':
				const immobilizeMessages = {
					par: `${event.targetName}は 体が しびれて 動けない！`,
					frz: `${event.targetName}は 凍っていて 動けない！`,
					slp: `${event.targetName}は ぐうぐう 眠っている...`
				};
				message = immobilizeMessages[event.status] || `${event.targetName}は 動けない！`;
				break;
			case 'status_cure':
				const cureMessages = {
					par: `${event.targetName}の まひが 治った！`,
					frz: `${event.targetName}の こおりが 解けた！`,
					slp: `${event.targetName}は 目を 覚ました！`,
					brn: `${event.targetName}の やけどが 治った！`,
					psn: `${event.targetName}の どくが 治った！`
				};
				message = cureMessages[event.status] || `${event.targetName}の 状態異常が 治った！`;
				break;
			case 'stat_change':
				const statNameMap = {atk: 'こうげき', def: 'ぼうぎょ', spa: 'とくこう', spd: 'とくぼう', spe: 'すばやさ', evade: '回避'};
				const changeText = event.stages > 0 ? (event.stages >= 2 ? 'ぐーんと 上がった！' : '上がった！') : (event.stages <= -2 ? 'がくっと 下がった！' : '下がった！');
				message = `${event.targetName}の ${statNameMap[event.stat] || event.stat}が ${changeText}`;
				break;
			case 'ability':
			case 'ability_activate':
				message = event.message || `${event.pokemonName}の ${event.abilityName}！`;
				break;
			case 'recoil':
				audioManager.playDamage();
				message = `${event.targetName}は 反動で ダメージを受けた！`;
				this.updateHPForTarget(event.targetId, event.newHp, event.maxHp);
				break;
			case 'heal':
				const healReasons = {
					drain: '体力を 吸い取った！',
					leftovers: 'たべのこしで 少し 回復した！',
					sitrusberry: 'オボンのみで 体力を 回復した！',
				};
				message = `${event.targetName}は ${healReasons[event.reason] || '回復した！'}`;
				this.updateHPForTarget(event.targetId, event.newHp, event.maxHp);
				break;
			case 'weather':
				message = event.message;
				break;
			case 'battle_end':
				message = `${event.winnerName}の 勝利！`;
				// Trigger result screen after a short delay
				setTimeout(() => {
					this.battlePhase = 'ended';
					this.showScreen('result');
					audioManager.stop();
					this.showBattleResult({winnerName: event.winnerName});
				}, 1500);
				break;
			case 'text':
				// Already has message
				break;
		}

		if (message) {
			this.addLog(message);
		}

		// Simple delay for reading
		await new Promise(r => setTimeout(r, TIMING.TEXT_NORMAL));
	}

	// Helper to update HP for a specific target
	updateHPForTarget(targetId, newHp, maxHp) {
		// Find the target in player or opponent team
		const playerMon = this.playerTeam.find(m => m.unique_id === targetId);
		const opponentMon = this.opponentTeam.find(m => m.unique_id === targetId);

		if (playerMon) {
			playerMon.hp_current = newHp;
			if (this.playerTeam[this.playerActive]?.unique_id === targetId) {
				this.updateHPBar('player', playerMon);
			}
		}
		if (opponentMon) {
			opponentMon.hp_current = newHp;
			if (this.opponentTeam[this.opponentActive]?.unique_id === targetId) {
				this.updateHPBar('opponent', opponentMon);
			}
		}
	}

	updateUI() {
		// Render Active Pokemon
		const pActive = this.playerTeam[this.playerActive];
		const oActive = this.opponentTeam[this.opponentActive];

		if (pActive) {
			document.getElementById('player-sprite').src = pActive.spriteUrl;
			document.getElementById('player-name').textContent = pActive.nickname || pActive.name;
			document.getElementById('player-level').textContent = `Lv.${pActive.level}`;
			this.updateHPBar('player', pActive);
			this.renderTypeBadges('player', pActive);
		}

		if (oActive) {
			document.getElementById('opponent-sprite').src = oActive.spriteUrl;
			document.getElementById('opponent-name').textContent = oActive.nickname || oActive.name;
			document.getElementById('opponent-level').textContent = `Lv.${oActive.level}`;
			this.updateHPBar('opponent', oActive);
			this.renderTypeBadges('opponent', oActive);
		}

		// Menus
		this.hideAllMenus();
		if (this.forcedSwitch) {
			this.showSwitchMenu();
			this.messageBox.textContent = 'Choose a Pokémon to switch in!';
		} else if (this.battlePhase === 'wait') {
			this.waitingPanel.style.display = 'grid';
		} else {
			this.mainMenu.style.display = 'grid';
			this.messageBox.textContent = `What will ${pActive?.nickname} do?`;
		}
	}

	updateHPBar(side, mon) {
		const bar = document.getElementById(`${side}-hp-bar`);
		const text = document.getElementById(`${side}-hp-text`);

		const targetHp = mon.hp_current;
		const maxHp = mon.hp_max;
		const monId = mon.unique_id || `${side}_active`;

		// Get current displayed HP (or initialize to target if first time)
		let currentDisplayedHp = this.displayedHPs[monId];
		if (currentDisplayedHp === undefined) {
			currentDisplayedHp = targetHp;
			this.displayedHPs[monId] = targetHp;
		}

		// If already at target, just update display
		if (currentDisplayedHp === targetHp) {
			const percent = (targetHp / maxHp) * 100;
			bar.style.width = `${percent}%`;
			bar.style.backgroundColor = percent > 50 ? 'var(--hp-green)' : percent > 20 ? 'var(--hp-yellow)' : 'var(--hp-red)';
			text.textContent = `${targetHp}/${maxHp}`;
			return;
		}

		// Animate HP change over ~1 second
		const hpDifference = Math.abs(currentDisplayedHp - targetHp);
		const duration = Math.min(1000, Math.max(300, hpDifference * 10)); // 300ms to 1000ms based on damage
		const startTime = performance.now();
		const startHp = currentDisplayedHp;

		const animate = (currentTime) => {
			const elapsed = currentTime - startTime;
			const progress = Math.min(elapsed / duration, 1);

			// Ease out animation
			const easeProgress = 1 - Math.pow(1 - progress, 2);
			const displayHp = Math.round(startHp + (targetHp - startHp) * easeProgress);

			this.displayedHPs[monId] = displayHp;

			const percent = (displayHp / maxHp) * 100;
			bar.style.width = `${percent}%`;
			bar.style.backgroundColor = percent > 50 ? 'var(--hp-green)' : percent > 20 ? 'var(--hp-yellow)' : 'var(--hp-red)';
			text.textContent = `${displayHp}/${maxHp}`;

			if (progress < 1) {
				requestAnimationFrame(animate);
			}
		};

		requestAnimationFrame(animate);
	}

	renderTypeBadges(side, mon) {
		const container = document.getElementById(`${side}-types`);
		if (!container) return;

		const types = [mon.type];
		if (mon.type2 && mon.type2 !== mon.type) {
			types.push(mon.type2);
		}

		container.innerHTML = types.map(type => `
			<span class="type-badge type-${type}">${this.getTypeNameJP(type)}</span>
		`).join('');
	}

	getTypeNameJP(type) {
		const typeNames = {
			normal: 'ノーマル', fire: 'ほのお', water: 'みず', grass: 'くさ',
			electric: 'でんき', ice: 'こおり', fighting: 'かくとう', poison: 'どく',
			ground: 'じめん', flying: 'ひこう', psychic: 'エスパー', bug: 'むし',
			rock: 'いわ', ghost: 'ゴースト', dragon: 'ドラゴン', dark: 'あく',
			steel: 'はがね', fairy: 'フェアリー'
		};
		return typeNames[type] || type;
	}

	hideAllMenus() {
		document.querySelectorAll('.menu').forEach(m => m.style.display = 'none');
	}

	showMoveMenu() {
		this.hideAllMenus();
		this.moveMenu.style.display = 'grid';

		const activeMon = this.playerTeam[this.playerActive];
		if (!activeMon) return;

		this.movesGrid.innerHTML = activeMon.moves.map((moveData, i) => {
			let move = moveData;
			if (typeof moveData === 'string') {
				move = AVAILABLE_MOVES[moveData] || {name: moveData, type: 'normal'};
			}
			const power = move.basePower || move.power || '-';
			const accuracy = move.accuracy === true ? '必中' : (move.accuracy || '-');
			return `
                <button class="action-btn type-${move.type}" onclick="app.sendMove(${i})">
                    <span class="move-name">${move.name}</span>
                    <span class="move-stats">威力:${power} / 命中:${accuracy}</span>
                </button>
            `;
		}).join('');
	}

	showSwitchMenu() {
		this.hideAllMenus();
		this.switchMenu.style.display = 'grid';

		this.switchGrid.innerHTML = this.playerTeam.map((mon, i) => `
            <button class="action-btn" ${mon.hp_current === 0 || i === this.playerActive ? 'disabled' : ''} onclick="app.sendSwitch(${i})">
                ${mon.nickname} (${mon.hp_current}/${mon.hp_max})
            </button>
        `).join('');
	}

	showMainMenu() {
		this.hideAllMenus();
		this.mainMenu.style.display = 'grid';
	}

	sendMove(index) {
		if (this.ws) {
			this.ws.send(JSON.stringify({type: 'action', action: {type: 'move', moveIndex: index}}));
			this.hideAllMenus();
			this.waitingPanel.style.display = 'grid';
		}
	}

	sendSwitch(index) {
		if (this.ws) {
			this.ws.send(JSON.stringify({type: 'action', action: {type: 'switch', target: index}}));
			this.hideAllMenus();
			this.waitingPanel.style.display = 'grid';
		}
	}

	addLog(message) {
		const div = document.createElement('div');
		div.textContent = message;
		this.battleLog.appendChild(div);
		this.battleLog.scrollTop = this.battleLog.scrollHeight;
		this.messageBox.textContent = message;
	}
}

// Global instance for inline onclick handlers
window.app = new BattleApp();
