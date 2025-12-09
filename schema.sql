-- Users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at INTEGER DEFAULT (unixepoch())
);

-- Monsters table
CREATE TABLE IF NOT EXISTS monsters (
  id TEXT PRIMARY KEY,
  owner_id TEXT NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'normal',
  hp INTEGER NOT NULL DEFAULT 100,
  atk INTEGER NOT NULL DEFAULT 50,
  def INTEGER NOT NULL DEFAULT 50,
  spd INTEGER NOT NULL DEFAULT 50,
  sprite_url TEXT,
  move1 TEXT,
  move2 TEXT,
  move3 TEXT,
  move4 TEXT,
  created_at INTEGER DEFAULT (unixepoch()),
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Team slots (max 6 per user)
CREATE TABLE IF NOT EXISTS team_slots (
  user_id TEXT NOT NULL,
  slot INTEGER NOT NULL CHECK (slot >= 0 AND slot <= 5),
  monster_id TEXT,
  PRIMARY KEY (user_id, slot),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (monster_id) REFERENCES monsters(id) ON DELETE SET NULL
);

-- Sessions table
CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_monsters_owner ON monsters(owner_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);
