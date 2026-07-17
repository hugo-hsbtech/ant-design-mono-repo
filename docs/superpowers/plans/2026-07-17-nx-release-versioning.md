# nx release Per-Package Versioning — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give the monorepo per-package semantic versioning, git tags, changelogs, and GitHub Releases, auto-cut on every merge to `main`, driven by `nx release` over the Conventional Commits already enforced.

**Architecture:** Add Nx to the repo _only_ as a release engine (Turborepo stays the build/task runner). A single `release` block in `nx.json` configures independent, conventional-commit-driven versioning with per-project changelogs + GitHub Releases. A `push`-to-`main` GitHub Actions workflow runs `nx release --yes`. The unused Changesets setup is removed.

**Tech Stack:** pnpm workspaces, Turborepo (unchanged), Nx `23.x` (`nx release` only), GitHub Actions, Conventional Commits (commitlint).

## Global Constraints

- Managed projects: **all 13 workspaces** (`apps/*` + `packages/*`), all currently `private` at `0.0.0`.
- **No npm publish** — release artifact is `package.json` bump + `CHANGELOG.md` + git tag `<project>@<version>` + GitHub Release.
- Versioning is **independent** per project, from Conventional Commits (`feat`→minor, `fix`/`perf`→patch, `!`/`BREAKING CHANGE`→major; 0.x rule: first `feat` → `0.1.0`).
- Internal deps are `workspace:*` — ranges are not rewritten; dependents may still receive a version bump (`updateDependents: "auto"`, the default) so a lib change cascades to its consumers.
- Turborepo remains the sole build/test runner; Nx config stays limited to the `release` block.
- Node 20, pnpm `10.33.0`.
- Commit messages follow Conventional Commits (commitlint is enforced by the pre-commit/commit-msg hooks).

---

### Task 1: Add Nx and the `nx.json` release config

**Files:**

- Modify: root `package.json` (add `nx` devDependency)
- Create: `nx.json`
- Modify: `pnpm-lock.yaml` (via install)

**Interfaces:**

- Produces: a working `pnpm nx release --dry-run --first-release` that lists all 13 projects and their computed first versions without mutating anything.

- [ ] **Step 1: Install Nx as a dev dependency (workspace root)**

```bash
pnpm add -Dw nx@23
```

- [ ] **Step 2: Create `nx.json` with the release block**

```json
{
  "$schema": "./node_modules/nx/schemas/nx-schema.json",
  "release": {
    "projectsRelationship": "independent",
    "releaseTagPattern": "{projectName}@{version}",
    "version": {
      "conventionalCommits": true
    },
    "changelog": {
      "automaticFromRef": true,
      "workspaceChangelog": false,
      "projectChangelogs": {
        "createRelease": "github"
      }
    },
    "git": {
      "commit": true,
      "commitMessage": "chore(release): publish {version} [skip ci]",
      "tag": true,
      "push": true
    }
  }
}
```

- [ ] **Step 3: Dry-run first release to validate config (the "test")**

Run: `pnpm nx release --first-release --dry-run`
Expected: Nx prints a per-project version plan for all 13 projects (each `0.0.0` → computed version or "skipped, no changes"), previews `CHANGELOG.md` content and `<project>@<version>` tags, and makes **no** file changes. If the config schema is rejected, reconcile keys against `./node_modules/nx/schemas/nx-schema.json` and the installed Nx version, then re-run until the dry-run succeeds.

- [ ] **Step 4: Confirm no files were mutated by the dry-run**

Run: `git status --porcelain`
Expected: only `package.json` + `pnpm-lock.yaml` (from Step 1) and the new `nx.json` are dirty/untracked — no `CHANGELOG.md` or version changes.

- [ ] **Step 5: Commit**

```bash
git add package.json pnpm-lock.yaml nx.json
git commit -m "build: add nx release engine and release config"
```

---

### Task 2: Remove the unused Changesets setup

**Files:**

- Delete: `.changeset/config.json`, `.changeset/README.md` (whole `.changeset/` dir)
- Modify: root `package.json` (drop `@changesets/cli` dep + `changeset`/`version-packages`/`release` scripts)
- Modify: `pnpm-lock.yaml` (via install)

**Interfaces:**

- Consumes: nothing.
- Produces: a repo with a single versioning system (`nx release`); `pnpm install --frozen-lockfile` still resolves.

- [ ] **Step 1: Delete the Changesets directory**

```bash
git rm -r .changeset
```

- [ ] **Step 2: Remove Changesets scripts and dependency from `package.json`**

Remove these three `scripts` entries:

```json
"changeset": "changeset",
"version-packages": "changeset version",
"release": "turbo run build && changeset publish",
```

Remove this `devDependencies` entry:

```json
"@changesets/cli": "^2.27.10",
```

- [ ] **Step 3: Update the lockfile**

Run: `pnpm install`
Expected: `@changesets/cli` removed from `pnpm-lock.yaml`, install succeeds.

- [ ] **Step 4: Verify no lingering Changesets references**

Run: `grep -rn "changeset" package.json .github 2>/dev/null; ls .changeset 2>/dev/null || echo "no .changeset dir"`
Expected: no matches in `package.json`/`.github`; `.changeset` dir gone.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: remove unused changesets in favor of nx release"
```

---

### Task 3: Add the release GitHub Actions workflow

**Files:**

- Create: `.github/workflows/release.yml`

**Interfaces:**

- Consumes: `nx.json` release config (Task 1).
- Produces: a `push`-to-`main` workflow that runs `nx release --yes`, committing bumps + changelogs, tagging, pushing, and cutting GitHub Releases.

- [ ] **Step 1: Create `.github/workflows/release.yml`**

```yaml
name: Release

on:
  push:
    branches: [main]

concurrency:
  group: release-${{ github.ref }}
  cancel-in-progress: false

permissions:
  contents: write

env:
  TURBO_TELEMETRY_DISABLED: 1
  NX_TELEMETRY_DISABLED: 1

jobs:
  release:
    name: nx release
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - name: Configure git identity
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "41898282+github-actions[bot]@users.noreply.github.com"
      - name: nx release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: pnpm nx release --yes
```

- [ ] **Step 2: Lint the workflow YAML**

Run: `pnpm prettier --check .github/workflows/release.yml || pnpm prettier --write .github/workflows/release.yml`
Expected: file is valid YAML and prettier-clean.

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/release.yml
git commit -m "ci: auto-cut per-package releases on merge to main"
```

---

### Task 4: Document the first-release bootstrap and deploy prerequisites

**Files:**

- Modify: `README.md` (add a "Versioning & Releases" section)

**Interfaces:**

- Consumes: everything above.
- Produces: human-readable instructions for the one-time first release and the branch-protection caveat.

- [ ] **Step 1: Add a "Versioning & Releases" section to `README.md`**

Document, in prose matching the README's style/language:

- Releases are per-package, independent, driven by Conventional Commits, auto-cut on merge to `main` by `.github/workflows/release.yml`.
- Preview locally with `pnpm nx release --dry-run`.
- **One-time bootstrap:** the first release must be run once with `pnpm nx release --first-release` (locally by a maintainer with push rights, or via a one-off manual run) to seed the baseline `<project>@<version>` tags; afterwards the workflow runs the standard command.
- **Branch-protection caveat:** if `main` is protected, the workflow's push-back needs a PAT/GitHub App token with bypass, or the flow must switch to a release PR.

- [ ] **Step 2: Verify the section renders and references are correct**

Run: `grep -n "nx release" README.md`
Expected: the new section references `pnpm nx release` and `--first-release`.

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "docs: document nx release versioning and first-release bootstrap"
```

---

## Self-Review notes

- **Spec coverage:** nx.json + Nx dep (Task 1) ✓; auto-on-merge workflow (Task 3) ✓; all-13-project scope via workspace inference + independent config (Task 1) ✓; no-publish/tag+changelog+release (Task 1 config) ✓; Changesets removal (Task 2) ✓; first-release + branch-protection caveats (Task 4) ✓.
- **Empirical validation:** Task 1 Step 3 is the gate — the exact `nx.json` keys are confirmed against the installed Nx version via `--dry-run` before anything is committed. If Nx 23 renames a key, reconcile there.
- **Risk:** `updateDependents: "auto"` cascades lib bumps to apps; accepted per spec (private packages, want consumers to reflect updated deps).
