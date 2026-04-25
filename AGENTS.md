# MediSync Backend — Agent Instructions

<!-- 
  OpenAI Codex / Operator reads AGENTS.md by convention.
  This file is also compatible with any agent that follows the AGENTS.md standard.
-->

## Universal context

All project rules, architecture, and conventions are in `.ai/AGENTS.md`.
Full configuration is in `.ai/config.yaml`.

**Read `.ai/AGENTS.md` completely before making any changes to this codebase.**

---

## Quick reference

| What | Where |
|---|---|
| Universal context | `.ai/AGENTS.md` |
| Full configuration | `.ai/config.yaml` |
| User stories (Gherkin) | `specs/features/` |
| Reusable skills | `.ai/skills/` |
| Automation hooks | `.ai/hooks/` |

---

## Workflow for any task

1. **Read the spec first** — find the relevant `.feature` file in `specs/features/`.
2. **Load the matching skill** — pick from `.ai/skills/` based on the task type.
3. **Implement** — follow the architecture in `.ai/AGENTS.md`.
4. **Verify** — run `npm run build` then `npm test` in the affected service.

---

## Services & ports

| Service | Port |
|---|---|
| api-gateway | 3000 |
| patient-service | 3002 |
| doctor-service | 3003 |
| appointments-service | 3004 |

---

## Non-negotiable rules

- All code, comments, and variable names in **English**
- `domain/` has zero imports from `infrastructure/`
- No business logic in controllers
- No `process.env` — use `ConfigService`
- No `@All()` route handlers
- No TypeORM decorators on domain entities
- Constructor injection only — no field injection
- Never commit `.env`
