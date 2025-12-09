
const fs = require('fs');

const content = fs.readFileSync('data/jp_names.ts', 'utf8');

// Function to clean an object block
function cleanBlock(blockName) {
	const regex = new RegExp(`export const ${blockName}: Record<string, string> = {([\\s\\S]*?)};`);
	const match = content.match(regex);
	if (!match) return;

	const body = match[1];
	const lines = body.split('\n');
	const map = new Map();

	for (const line of lines) {
		const parts = line.split(',').map(s => s.trim()).filter(s => s);
		for (const part of parts) {
			// Handle 'key': 'value' or key: 'value'
			const kvMatch = part.match(/^(['"]?)(.*?)\1:\s*(['"])(.*?)\3$/);
			if (kvMatch) {
				const key = kvMatch[2];
				const value = kvMatch[4];
				if (!map.has(key)) {
					map.set(key, value);
				}
			}
		}
	}

	// Reconstruct
	let newBody = '\n';
	let buffer = [];
	for (const [key, value] of map) {
		const keyStr = key.includes(' ') ? `'${key}'` : key;
		buffer.push(`${keyStr}: '${value}'`);
		if (buffer.length >= 5) {
			newBody += '  ' + buffer.join(', ') + ',\n';
			buffer = [];
		}
	}
	if (buffer.length > 0) {
		newBody += '  ' + buffer.join(', ') + '\n';
	}

	return content.replace(match[0], `export const ${blockName}: Record<string, string> = {${newBody}};`);
}

let newContent = content;
// We only need to clean JP_MOVES really, but let's do others if needed.
// JP_MOVES is the one with duplicates.
const movesRegex = /export const JP_MOVES: Record<string, string> = {([\s\S]*?)};/;
const match = newContent.match(movesRegex);
if (match) {
	const body = match[1];
	// Simple parser: split by comma, ignore newlines, parse k:v
	// This is hacky but should work for this specific file format
	const entries = [];
	// Remove comments if any (none in this block)
	// Split by comma, but be careful of quotes? No commas in values.
	const tokens = body.split(/,(?=(?:[^']*'[^']*')*[^']*$)/);

	const unique = new Map();

	tokens.forEach(token => {
		token = token.trim();
		if (!token) return;
		const parts = token.split(':');
		if (parts.length === 2) {
			let key = parts[0].trim();
			let val = parts[1].trim();
			// Remove quotes from key if present
			if ((key.startsWith("'") && key.endsWith("'")) || (key.startsWith('"') && key.endsWith('"'))) {
				key = key.slice(1, -1);
			}
			unique.set(key, val);
		}
	});

	let newBody = '\n';
	let count = 0;
	let line = [];
	for (const [k, v] of unique) {
		const keyStr = k.includes(' ') || k.includes('-') ? `'${k}'` : k;
		line.push(`${keyStr}: ${v}`);
		if (line.length >= 4) {
			newBody += '\t' + line.join(', ') + ',\n';
			line = [];
		}
	}
	if (line.length > 0) newBody += '\t' + line.join(', ') + '\n';

	newContent = newContent.replace(match[0], `export const JP_MOVES: Record<string, string> = {${newBody}};`);
}

fs.writeFileSync('data/jp_names.ts', newContent);
console.log('Cleaned JP_MOVES');
