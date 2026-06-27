// Imports a Figma-exported (W3C DTCG) tokens JSON into our `tokens/base/` source.
//
//   Figma Variables / Tokens Studio  ->  DTCG JSON  ->  tokens/base/*.tokens.json
//
// The DTCG `.tokens.json` files are the single source of truth for the build
// (see scripts/build-tokens.mjs). This importer refreshes the brand *values*
// coming from design while PRESERVING the antd ThemeConfig mapping that lives in
// each token's `$extensions["com.plataforma.antd"]` — Figma exports rarely carry
// that mapping, so we must not drop it on re-import.
//
// Usage:
//   node ./scripts/import-figma-tokens.mjs [path/to/figma.tokens.json]
//   pnpm --filter @repo/brand-tokens tokens:import
//
// Uses only node: builtins. Does NOT depend on style-dictionary.
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const BASE_DIR = join(root, 'tokens', 'base');

// Map a top-level DTCG group to the file under tokens/base/ it belongs in.
// Unknown groups fall back to `<group>.tokens.json`.
const GROUP_TO_FILE = {
  color: 'color',
  font: 'typography',
  radius: 'radius',
  space: 'spacing',
};

const fileForGroup = (group) => `${GROUP_TO_FILE[group] ?? group}.tokens.json`;

// ---------------------------------------------------------------------------
// DTCG helpers
// ---------------------------------------------------------------------------

const isPlainObject = (v) => typeof v === 'object' && v !== null && !Array.isArray(v);

// A DTCG node is a leaf token when it carries a `$value`.
const isToken = (node) => isPlainObject(node) && '$value' in node;

// DTCG reserved keys that are token/group metadata rather than child groups.
const RESERVED = new Set(['$value', '$type', '$description', '$extensions', '$deprecated']);

/**
 * Walk a DTCG tree and yield every leaf token as `{ path, token }`, where
 * `path` is the array of group keys leading to the token (excluding `$*` keys).
 */
function* walkTokens(node, path = []) {
  if (!isPlainObject(node)) return;
  if (isToken(node)) {
    yield { path, token: node };
    return;
  }
  for (const [key, child] of Object.entries(node)) {
    if (RESERVED.has(key)) continue;
    yield* walkTokens(child, [...path, key]);
  }
}

/** Read + parse a DTCG file, returning `{}` when the file does not exist. */
function readTokenFile(filePath) {
  if (!existsSync(filePath)) return {};
  try {
    return JSON.parse(readFileSync(filePath, 'utf8'));
  } catch (err) {
    throw new Error(`Failed to parse existing token file ${filePath}: ${err.message}`);
  }
}

/**
 * Build a `dotted.path -> $extensions` lookup of the antd mappings already
 * present in our source files, so a re-import keeps them. `tree` is a full token
 * file, so the walk paths already include the top-level group key.
 */
function collectExistingExtensions(tree) {
  const map = new Map();
  for (const { path, token } of walkTokens(tree)) {
    if (token.$extensions) {
      map.set(path.join('.'), token.$extensions);
    }
  }
  return map;
}

/** Ensure the nested group exists for `path` and return the parent group object. */
function ensureGroup(rootObj, path) {
  let cursor = rootObj;
  for (const key of path.slice(0, -1)) {
    if (!isPlainObject(cursor[key])) cursor[key] = {};
    cursor = cursor[key];
  }
  return cursor;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  const inputArg = process.argv[2];
  const inputPath = resolve(inputArg ?? join(root, 'figma', 'figma.tokens.json'));

  if (!existsSync(inputPath)) {
    throw new Error(
      `Figma tokens file not found: ${inputPath}\n` +
        `Pass a path as the first argument or place the export at figma/figma.tokens.json.`,
    );
  }

  let incoming;
  try {
    incoming = JSON.parse(readFileSync(inputPath, 'utf8'));
  } catch (err) {
    throw new Error(`Failed to parse Figma tokens file ${inputPath}: ${err.message}`);
  }
  if (!isPlainObject(incoming)) {
    throw new Error(`Figma tokens file ${inputPath} must contain a JSON object at the top level.`);
  }

  // Validate: there must be at least one leaf token, and every leaf must look
  // like a DTCG token (have a `$value`). This catches malformed exports early.
  const incomingTokens = [...walkTokens(incoming)];
  if (incomingTokens.length === 0) {
    throw new Error(
      `Figma tokens file ${inputPath} contains no tokens (no leaf with "$value" found).`,
    );
  }

  // Group incoming tokens by their top-level key so we touch one file per group.
  const byGroup = new Map();
  for (const [topKey, topNode] of Object.entries(incoming)) {
    if (RESERVED.has(topKey)) continue;
    if (!isPlainObject(topNode)) {
      throw new Error(`Top-level "${topKey}" in ${inputPath} must be an object group.`);
    }
    byGroup.set(topKey, topNode);
  }
  if (byGroup.size === 0) {
    throw new Error(`Figma tokens file ${inputPath} has no top-level token groups.`);
  }

  mkdirSync(BASE_DIR, { recursive: true });

  let updated = 0;
  let added = 0;
  let preserved = 0;
  const writtenFiles = [];

  for (const [group, groupNode] of byGroup) {
    const filePath = join(BASE_DIR, fileForGroup(group));
    const existingTree = readTokenFile(filePath);
    const existingExt = collectExistingExtensions(existingTree);

    // Start from the existing file so untouched tokens / `$type` markers survive,
    // making the import a non-destructive merge.
    const out = existingTree;

    for (const { path, token } of walkTokens(groupNode)) {
      if (!('$value' in token)) {
        throw new Error(
          `Token "${[group, ...path].join('.')}" in ${inputPath} is missing "$value".`,
        );
      }

      const dotted = [group, ...path].join('.');
      const parent = ensureGroup(out, [group, ...path]);
      const leafKey = path[path.length - 1] ?? group;
      const existingLeaf = isToken(parent[leafKey]) ? parent[leafKey] : undefined;

      const next = { ...(existingLeaf ?? {}) };
      next.$value = token.$value;
      if (token.$type !== undefined) next.$type = token.$type;
      if (token.$description !== undefined) next.$description = token.$description;

      // Preserve our antd mapping when the incoming token lacks `$extensions`.
      if (token.$extensions !== undefined) {
        next.$extensions = token.$extensions;
      } else if (existingExt.has(dotted)) {
        next.$extensions = existingExt.get(dotted);
        preserved += 1;
      }

      if (existingLeaf) updated += 1;
      else added += 1;
      parent[leafKey] = next;
    }

    writeFileSync(filePath, `${JSON.stringify(out, null, 2)}\n`);
    writtenFiles.push(filePath);
  }

  console.log('brand-tokens: imported Figma tokens');
  console.log(`  source:    ${inputPath}`);
  console.log(`  tokens:    ${incomingTokens.length} (added ${added}, updated ${updated})`);
  console.log(`  mappings:  ${preserved} antd $extensions preserved from existing source`);
  console.log(`  files:     ${writtenFiles.map((f) => f.replace(`${root}/`, '')).join(', ')}`);
  console.log('Run `pnpm --filter @repo/brand-tokens build` to regenerate the theme + CSS.');
}

try {
  main();
} catch (err) {
  console.error(`import-figma-tokens: ${err.message}`);
  process.exit(1);
}
