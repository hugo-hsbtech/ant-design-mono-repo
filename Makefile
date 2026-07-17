# Plataforma — dev Makefile
# Run each service on its own so the box (≈8 GB) doesn't OOM building all the
# package type-watchers at once. Apps consume the packages' prebuilt `dist`
# (via Next `transpilePackages`), so you only need `make packages` once.
#
# Quick start:
#   make setup       # install deps (+ git hooks) + create apps/web/.env.local + build packages
#   make web         # http://localhost:3000  (the product app — needs auth env)
#   make landing     # http://localhost:3001
#   make site        # http://localhost:3002
#   make storybook   # http://localhost:6006
#   make pre-commit  # run the same checks the pre-commit hook runs, on demand

.DEFAULT_GOAL := help

PNPM := pnpm

# Service -> port (kept in sync with each app's `dev` script)
WEB_PORT       := 3000
LANDING_PORT   := 3001
SITE_PORT      := 3002
STORYBOOK_PORT := 6006

.PHONY: help
help: ## Show this help
	@grep -hE '^[a-zA-Z0-9_-]+:.*?## ' $(MAKEFILE_LIST) \
		| sort \
		| awk 'BEGIN{FS=":.*?## "}{printf "  \033[36m%-14s\033[0m %s\n", $$1, $$2}'

# ---------------------------------------------------------------------------
# Setup
# ---------------------------------------------------------------------------

.PHONY: install
install: ## Install all workspace dependencies
	$(PNPM) install

.PHONY: packages
packages: ## Build the shared packages once (apps read their dist/)
	$(PNPM) exec turbo run build --filter='./packages/*'

apps/web/.env.local: apps/web/.env.example
	@echo "Creating apps/web/.env.local with a generated AUTH_SECRET…"
	@sed 's#^AUTH_SECRET=.*#AUTH_SECRET='"$$(openssl rand -base64 32)"'#' \
		apps/web/.env.example > apps/web/.env.local

.PHONY: env
env: apps/web/.env.local ## Create apps/web/.env.local (Auth.js secret) if missing

.PHONY: setup
setup: install env packages ## One-shot: install + env + build packages

# ---------------------------------------------------------------------------
# Run services (each in its own process — run in separate terminals)
# ---------------------------------------------------------------------------

.PHONY: web
web: env ## Run the product app (web) on :3000
	$(PNPM) --filter web dev

.PHONY: landing
landing: ## Run the landing app on :3001
	$(PNPM) --filter landing dev

.PHONY: site
site: ## Run the site app on :3002
	$(PNPM) --filter site dev

.PHONY: storybook
storybook: ## Run Storybook on :6006
	$(PNPM) --filter @repo/storybook dev

.PHONY: dev-all
dev-all: ## Run every app at once via turbo (memory-heavy — needs ~8 GB+ free)
	TURBO_UI=false $(PNPM) exec turbo run dev \
		--filter=web --filter=landing --filter=site --filter=@repo/storybook

# Watch shared package source and rebuild dist/ on change. Use when editing
# packages so apps pick up changes (apps read dist/ via transpilePackages).
# Watch one package to keep memory low:  make watch-packages PKG=i18n
PKG ?=
.PHONY: watch-packages
watch-packages: ## Watch+rebuild package dist/ on change (one: PKG=i18n; default all)
ifeq ($(PKG),)
	TURBO_UI=false $(PNPM) exec turbo run dev --filter='./packages/*'
else
	$(PNPM) --filter @repo/$(PKG) dev
endif

# ---------------------------------------------------------------------------
# Quality gates
# ---------------------------------------------------------------------------

.PHONY: build
build: ## Build everything
	$(PNPM) build

.PHONY: lint
lint: ## Lint all packages/apps
	$(PNPM) lint

.PHONY: typecheck
typecheck: ## Typecheck all packages/apps
	$(PNPM) typecheck

.PHONY: test
test: ## Run unit tests
	$(PNPM) test

.PHONY: clean
clean: ## Remove build artifacts (.next, dist, .turbo)
	$(PNPM) exec turbo run clean

.PHONY: hooks
hooks: ## (Re)install git hooks (runs automatically after `make install`)
	$(PNPM) exec husky

.PHONY: pre-commit
pre-commit: ## Run the pre-commit checks on staged files without committing
	$(PNPM) exec lint-staged
	$(PNPM) exec turbo run lint typecheck --filter='[HEAD]'

# ---------------------------------------------------------------------------
# Utilities
# ---------------------------------------------------------------------------

.PHONY: stop
stop: ## Stop any running dev servers (ports 3000-3002, 6006)
	@for port in $(WEB_PORT) $(LANDING_PORT) $(SITE_PORT) $(STORYBOOK_PORT); do \
		if fuser $$port/tcp >/dev/null 2>&1; then \
			echo "killing :$$port"; fuser -k $$port/tcp >/dev/null 2>&1 || true; \
		fi; \
	done

.PHONY: ps
ps: ## Show what's listening on the dev ports
	@for port in $(WEB_PORT) $(LANDING_PORT) $(SITE_PORT) $(STORYBOOK_PORT); do \
		pid=$$(ss -ltnpH "sport = :$$port" 2>/dev/null | grep -oP 'pid=\K[0-9]+' | head -1); \
		if [ -n "$$pid" ]; then echo ":$$port  UP   (pid $$pid)"; else echo ":$$port  down"; fi; \
	done
