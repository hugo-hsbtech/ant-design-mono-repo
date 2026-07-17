# Per-package release automation with `nx release`

**Date:** 2026-07-17
**Status:** Approved
**Author:** Hugo Seabra (with Claude)

## Problem

The monorepo (`plataforma`, pnpm + Turborepo, 13 workspace projects) has no version
management. All projects sit at `0.0.0`, no git tags exist, and there is no release
automation. We want per-package version management: every project that has a
`package.json` should be independently versioned, tagged, and released when its code
ships to `main` — analogous to the `release.py` tag-driven tool used in the
`pagana-ai-knowledge-base` repo, but per-package instead of repo-wide.

## Goals

- Independent semantic version per workspace project, derived automatically from
  Conventional Commits (already enforced via commitlint).
- Every merge to `main` cuts releases for the affected projects: bump `package.json`,
  update per-project `CHANGELOG.md`, create a git tag, and publish a GitHub Release.
- CI is the source of truth; no manual version bookkeeping and no manual intent files.
- Keep Turborepo as the build/task runner — introduce Nx **only** for releasing.

## Non-goals (YAGNI)

- npm publishing (every package is `private`; publishing can be layered on later).
- Deploy triggers, prerelease/canary channels, version-locked groups.
- Migrating build/test orchestration from Turborepo to Nx.

## Decision summary

| Decision         | Choice                                                                           |
| ---------------- | -------------------------------------------------------------------------------- |
| Version model    | Per-package, independent                                                         |
| Version source   | Conventional Commits (commitlint already enforces them)                          |
| Engine           | `nx release` (release-only; Turborepo stays the build runner)                    |
| Trigger          | Auto on every merge to `main`                                                    |
| Source of truth  | CI (GitHub Actions)                                                              |
| Scope            | All 13 workspace projects (`apps/*` + `packages/*`)                              |
| Release artifact | `package.json` bump + `CHANGELOG.md` + git tag + GitHub Release (no npm publish) |
| Changesets       | Removed                                                                          |

### Why `nx release` (vs release-please / Changesets / custom script)

- **Changesets** derives version intent from hand-authored files — redundant given
  Conventional Commits are already enforced.
- **release-please** is CI-only and its native model is an auto-maintained release PR;
  a good fit, but no local `--dry-run` "cut a release" command.
- **Custom `release.py` port** would require rebuilding monorepo internal-dependency
  handling and edge cases by hand.
- **`nx release`** derives per-project bumps from Conventional Commits, handles the
  internal-dependency graph, does changelog + tag + GitHub Release, works in a
  package-based repo (reads pnpm workspaces — no Nx build migration), and preserves the
  `release.py` "one command, with `--dry-run`" ergonomics.

## Scope: managed projects

All workspace projects (from `pnpm-workspace.yaml` globs `apps/*` + `packages/*`):

Packages (libs): `@repo/brand-tokens`, `@repo/utils`, `@repo/tsup-config`,
`@repo/eslint-config`, `@repo/icons`, `@repo/typescript-config`, `@repo/test-config`,
`@repo/i18n`, `@repo/design-system`.

Apps: `web`, `landing`, `site`, `@repo/storybook`.

All are `private` and currently at `0.0.0`.

## Architecture / components

### 1. `nx` + `nx.json` (new)

- Add `nx` to root `devDependencies`. Pin the version and record it here at
  implementation time.
- `nx.json` contains a single `release` block (no executors, no build config). Intended
  shape (exact keys validated against the pinned Nx version during implementation):
  - `projectsRelationship: "independent"`
  - Conventional-commits versioning enabled (`version.conventionalCommits: true` in
    current Nx; verify against pinned version).
  - `changelog.projectChangelogs: true` with `createRelease: "github"` for per-project
    `CHANGELOG.md` + GitHub Releases. Workspace-level changelog disabled.
  - `git: { commit: true, tag: true, push: true }` so the run commits the bumps, tags
    each bumped project, and pushes back to `main`.
  - `releaseTagPattern` left at the independent-mode default `{projectName}@{version}`
    (e.g. `@repo/design-system@0.1.0`).
- The internal-dependency graph (e.g. `@repo/design-system` depending on `@repo/utils`)
  is handled by Nx: when a dependency bumps, dependents are updated per Nx's rules.

### 2. `.github/workflows/release.yml` (new)

- Trigger: `push` to `main`.
- `permissions: { contents: write }` (push tags/commits + create Releases) with
  `GITHUB_TOKEN`.
- `concurrency` group (e.g. `release-${{ github.ref }}`, `cancel-in-progress: false`)
  to serialize release runs and prevent tag races.
- Steps: `actions/checkout` with `fetch-depth: 0` (full history required for commit
  analysis) → `pnpm/action-setup` → `actions/setup-node` (node 20, pnpm cache) →
  `pnpm install --frozen-lockfile` → `pnpm nx release --yes`.
- Configure git identity for the release commit (bot user).

### 3. First release

- The first CI run has no prior `<project>@x.y.z` tags to diff against, so it uses
  `nx release --first-release`. Subsequent runs use the standard command.
- Implementation gates this as a one-time action (e.g. a manual first `workflow_dispatch`
  run with `--first-release`, or a documented one-time bootstrap), so the recurring
  push-to-main workflow stays simple.

### 4. Changesets removal

- Delete `.changeset/` (`config.json`, `README.md`).
- Remove `@changesets/cli` from root `devDependencies`.
- Remove the `changeset`, `version-packages`, and `release` scripts from root
  `package.json`.
- Update `pnpm-lock.yaml` accordingly.

## Data flow

```
merge to main
  └─ CI: pnpm nx release --yes
       └─ for each project:
            read commits since <project>@<lastVersion>
            compute bump: feat→minor · fix/perf→patch · !|BREAKING→major
              (0.x rule: first feat → 0.1.0)
            if no shippable commits → skip project
            else:
              rewrite package.json version
              update CHANGELOG.md
       └─ commit "chore(release): …", tag each bumped <project>@<version>
       └─ push to main
       └─ create a GitHub Release per bumped project
```

## Loop safety & edge cases (adapted from `release.py` lessons)

- **No infinite release loop:** the release commit is pushed with `GITHUB_TOKEN`, whose
  pushes do not re-trigger workflows. Even if they did, a `chore(release)` commit carries
  no bump, so nothing releases.
- **Branch protection on `main`:** a protected `main` will block the workflow's
  push-back — the same caveat `release.py` documents. Deploy-time prerequisite: if `main`
  is protected, provide a PAT/GitHub App token with bypass, or switch to a release-PR
  flow. Documented, not solved here.
- **Concurrency:** the `concurrency` group prevents overlapping runs from racing on tags.
- **Default branch mismatch:** `origin/HEAD` currently points at
  `claude/antd-ui-platform-blueprint-t6d67j`, not `main`. The workflow targets `main`
  explicitly. Fixing the repo default branch is a separate, optional task.

## Testing / verification

- `pnpm nx release --dry-run` (and/or `--first-release --dry-run`) locally to preview
  computed bumps, changelog entries, and tags without mutating anything.
- Confirm a `fix:`-only change to a single package bumps only that package (patch), and a
  `feat:` bumps minor; verify unrelated packages are skipped.
- Verify Turborepo build/test still work unchanged after Nx is added (`pnpm build`,
  `pnpm test`).
- Verify `pnpm install --frozen-lockfile` passes after Changesets removal + Nx addition.

## Rollout

1. Land config (`nx.json`, `release.yml`), remove Changesets, update lockfile.
2. Perform the one-time first release (`--first-release`) to seed baseline tags/versions.
3. Thereafter, merges to `main` auto-release affected projects.
