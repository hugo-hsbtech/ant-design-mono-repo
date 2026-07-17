#!/usr/bin/env node
/**
 * Render the merged Vitest coverage report as a Markdown table.
 *
 * Reads `coverage/coverage-summary.json` (produced by the `json-summary`
 * reporter) and prints a compact table. In CI it is appended to the GitHub
 * Actions job summary; locally it just prints to stdout.
 */
import { readFileSync, appendFileSync } from 'node:fs';
import { resolve } from 'node:path';

const summaryPath = resolve(process.cwd(), 'coverage/coverage-summary.json');

let summary;
try {
  summary = JSON.parse(readFileSync(summaryPath, 'utf8'));
} catch {
  console.error(`No coverage summary found at ${summaryPath}. Run "pnpm test:coverage" first.`);
  process.exit(0); // Don't fail the job just because the summary is missing.
}

const t = summary.total;
const pct = (m) => `${m.pct.toFixed(2)}%`;
const row = (label, m) => `| ${label} | ${pct(m)} | ${m.covered}/${m.total} |`;

const md = [
  '## 🧪 Coverage report',
  '',
  '| Metric | % | Covered / Total |',
  '| --- | --- | --- |',
  row('Lines', t.lines),
  row('Statements', t.statements),
  row('Functions', t.functions),
  row('Branches', t.branches),
  '',
].join('\n');

console.log(md);

if (process.env.GITHUB_STEP_SUMMARY) {
  appendFileSync(process.env.GITHUB_STEP_SUMMARY, md + '\n');
}
