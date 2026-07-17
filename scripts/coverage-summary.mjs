#!/usr/bin/env node
/**
 * Workspace-wide coverage summary (informational).
 *
 * Each package enforces its own strict coverage gate during `test:coverage`
 * and writes `<pkg>/coverage/coverage-summary.json` (json-summary reporter).
 * This script aggregates those per-package summaries into one table — a global
 * roll-up plus a row per package. It never fails the build; the gates live in
 * each package's vitest config.
 *
 * In CI the table is appended to the GitHub Actions job summary.
 */
import { readFileSync, existsSync, appendFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();

// Discover workspace packages from pnpm-workspace.yaml globs (apps/*, packages/*).
import { readdirSync } from 'node:fs';
const GLOB_DIRS = ['apps', 'packages'];
const pkgDirs = GLOB_DIRS.flatMap((base) => {
  const abs = join(root, base);
  if (!existsSync(abs)) return [];
  return readdirSync(abs, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => join(base, d.name));
});

const METRICS = ['lines', 'statements', 'functions', 'branches'];
const rows = [];
const totals = Object.fromEntries(METRICS.map((m) => [m, { covered: 0, total: 0 }]));

for (const dir of pkgDirs) {
  const file = join(root, dir, 'coverage', 'coverage-summary.json');
  if (!existsSync(file)) continue;
  let data;
  try {
    data = JSON.parse(readFileSync(file, 'utf8'));
  } catch {
    continue;
  }
  const t = data.total;
  if (!t) continue;
  rows.push({ name: dir, total: t });
  for (const m of METRICS) {
    totals[m].covered += t[m].covered;
    totals[m].total += t[m].total;
  }
}

if (rows.length === 0) {
  console.error('No per-package coverage summaries found. Run "pnpm test:coverage" first.');
  process.exit(0);
}

const pct = (covered, total) => (total === 0 ? 100 : (covered / total) * 100);
const fmt = (n) => `${n.toFixed(2)}%`;

const lines = [];
lines.push('## 🧪 Coverage summary');
lines.push('');
lines.push('> Global roll-up is informational. Each package enforces its own strict gate.');
lines.push('');
lines.push('| Package | Lines | Statements | Functions | Branches |');
lines.push('| --- | --- | --- | --- | --- |');
for (const r of rows.sort((a, b) => a.name.localeCompare(b.name))) {
  lines.push(
    `| ${r.name} | ${fmt(r.total.lines.pct)} | ${fmt(r.total.statements.pct)} | ${fmt(r.total.functions.pct)} | ${fmt(r.total.branches.pct)} |`,
  );
}
lines.push(
  `| **Global** | **${fmt(pct(totals.lines.covered, totals.lines.total))}** | **${fmt(pct(totals.statements.covered, totals.statements.total))}** | **${fmt(pct(totals.functions.covered, totals.functions.total))}** | **${fmt(pct(totals.branches.covered, totals.branches.total))}** |`,
);
lines.push('');

const md = lines.join('\n');
console.log(md);

// GitHub Actions job summary (the run's summary page).
if (process.env.GITHUB_STEP_SUMMARY) {
  appendFileSync(process.env.GITHUB_STEP_SUMMARY, md + '\n');
}

// Standalone file for downstream steps (e.g. posting a PR comment).
if (process.env.COVERAGE_SUMMARY_FILE) {
  writeFileSync(process.env.COVERAGE_SUMMARY_FILE, md + '\n');
}
