#!/usr/bin/env node
/**
 * Ratchet per-project coverage floors up to current levels.
 *
 * Run after `pnpm test:coverage`. For each package that has a coverage report,
 * this reads its `coverage/coverage-summary.json` and raises the thresholds in
 * that package's `vitest.config.ts` to `floor(current)` — but only upward. It
 * never lowers a floor, so it can't mask a regression; it just captures gains
 * as new tests land. Review the diff and commit it.
 *
 *   pnpm test:coverage && pnpm coverage:ratchet
 */
import { readFileSync, existsSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const METRICS = ['lines', 'statements', 'functions', 'branches'];
const GLOB_DIRS = ['apps', 'packages'];

const pkgDirs = GLOB_DIRS.flatMap((base) => {
  const abs = join(root, base);
  if (!existsSync(abs)) return [];
  return readdirSync(abs, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => join(base, d.name));
});

let changed = 0;

for (const dir of pkgDirs) {
  const summaryFile = join(root, dir, 'coverage', 'coverage-summary.json');
  const configFile = join(root, dir, 'vitest.config.ts');
  if (!existsSync(summaryFile) || !existsSync(configFile)) continue;

  let total;
  try {
    total = JSON.parse(readFileSync(summaryFile, 'utf8')).total;
  } catch {
    continue;
  }
  if (!total) continue;

  let source = readFileSync(configFile, 'utf8');
  const bumps = [];

  for (const metric of METRICS) {
    const floor = Math.floor(total[metric].pct);
    // Each metric key appears exactly once, inside coverageConfig({ ... }).
    const re = new RegExp(`(\\b${metric}:\\s*)(\\d+(?:\\.\\d+)?)`);
    const m = source.match(re);
    if (!m) continue;
    const current = Number(m[2]);
    if (floor > current) {
      source = source.replace(re, `$1${floor}`);
      bumps.push(`${metric} ${current}→${floor}`);
    }
  }

  if (bumps.length > 0) {
    writeFileSync(configFile, source);
    changed++;
    console.log(`↑ ${dir}: ${bumps.join(', ')}`);
  } else {
    console.log(`= ${dir}: already at floor`);
  }
}

console.log(
  changed > 0
    ? `\nRaised floors in ${changed} package(s). Review the diff and commit.`
    : '\nNo floors changed — every project is already at its current coverage.',
);
