# Keda — Agent Guide

This repository is a monorepo containing:
- Web client (Next.js) under `client/apps/web`
- Shared TS packages under `client/packages/*`
- Backend (Go) under `server/`
- Product docs under `docs/`
- Landing site under `landing/` (built output in `landing/dist`)
- Preview generator / E2E tooling under `preview-generator/`

Agents must follow this document for all tasks.

## High-level goals
- Make minimal, correct changes to implement the requested feature/bugfix.
- Do not introduce new requirements or redesigns.
- Prefer incremental diffs and keep scope tight.

## Repository map (do not invent new structure)
- `client/apps/web/` — Next.js app (App Router in `app/`, also legacy `pages/`)
- `client/apps/web/components/` — UI/components + tests in `components/__tests__/`
- `client/packages/shared/` — shared TS utilities/entities/api
- `client/packages/ui/` — shared UI primitives
- `client/packages/i18n/` — i18n strings (`en.json`, `es.json`)
- `server/` — Go API/service
- `docs/` — documentation (English + `docs/es/`)
- `landing/` — landing site sources; **`landing/dist` is generated**
- `preview-generator/` — Playwright-based asset generation/tests
- Root `docker-compose*.yml`, `Makefile`, `README.md` — dev workflows

If a file/folder does not exist, do not create it unless explicitly required.

## Ground rules for changes
- Do not do drive-by refactors.
- Do not mass-reformat.
- Do not change unrelated files.
- Keep changes localized to the relevant package/app.
- Do not modify generated artifacts:
  - **Do not edit `landing/dist/`** (generated output).
  - Prefer editing sources and regenerating only when requested.

## How to determine commands (no guessing)
Before running or suggesting commands, read the local scripts:
- Root `Makefile`
- Root `package.json`
- `client/package.json`
- `client/apps/web/package.json`
- `preview-generator/package.json`
- `docs/package.json`
If a command is not defined, do not invent it—state what is missing.

## Testing and validation
When making changes:
- Web client changes: run the relevant unit tests (Vitest) for touched components/packages.
- Server changes: run Go tests for the touched packages.
- If E2E is relevant: use `preview-generator/` tooling only if the task requires it.

If tests cannot be run, state why and which command would be used.

## TypeScript / React conventions
- Follow existing patterns in `client/apps/web/components` and `client/packages/*`.
- Keep components small and focused.
- Prefer existing UI primitives from `client/apps/web/components/ui` or `client/packages/ui`.
- Avoid introducing new dependencies unless explicitly requested.

## Next.js routing notes
- App Router pages live under `client/apps/web/app/**/page.tsx`.
- There is also legacy routing under `client/apps/web/pages/**`.
- Do not migrate between App Router and Pages Router unless explicitly requested.

## Backend (Go) conventions
- Follow patterns in `server/app/` and existing handlers/entities.
- Do not introduce new packages/deps unless requested.
- Be explicit with error handling and avoid changing behavior not asked for.

## Docs and translations
- Docs sources live under `docs/` and `docs/es/`.
- i18n strings live under `client/packages/i18n/src/locales/{en,es}.json`.
- If you add user-facing strings, update both locales unless instructed otherwise.

## Security and secrets
- Never hardcode credentials, API keys, or tokens.
- Use existing config patterns (env/config files in `server/config`, etc.).
- Do not log sensitive data.

## Output requirements (when responding)
- For code tasks: output the full updated file contents per file (preferred),
  unless explicitly asked for unified diffs.
- Always include file paths for changed files.
- If a required decision is ambiguous, stop and ask for the missing input rather than guessing.

## Definition of Done
A change is done when:
- It matches the requested behavior and stays within scope
- It follows repo conventions
- Relevant tests/build checks pass (or the reason they can’t be run is stated)
- No generated artifacts were edited directly
- No secrets were introduced
