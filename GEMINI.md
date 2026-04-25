# MediSync Backend — Gemini Agent Context

<!-- Gemini CLI reads this file automatically at session start -->

## Universal context

All project rules, architecture, and conventions are in `.ai/AGENTS.md`.
Full configuration is in `.ai/config.yaml`.

**Read `.ai/AGENTS.md` before making any changes.**

---

## Quick reference

| What | Where |
|---|---|
| Universal context | `.ai/AGENTS.md` |
| Config (stack, conventions, authors) | `.ai/config.yaml` |
| User story specs (Gherkin) | `specs/features/` |
| Skills (reusable prompts) | `.ai/skills/` |
| Hooks (automation) | `.ai/hooks/` |

---

## Gemini-specific workflow

1. Read the relevant Gherkin spec in `specs/features/` before implementing.
2. Apply the matching skill from `.ai/skills/` for your task type.
3. Run `npm run build` in the affected service to verify TypeScript compiles.
4. Run `npm test` to verify no regressions.
5. All code and comments must be in **English**.

---

## Architecture reminders

- `domain/` has **zero imports** from `infrastructure/`
- One use case = one class with one `.execute()` method
- Controllers contain no business logic
- Use `ConfigService` for all env vars — never `process.env`
- Route handlers must use specific decorators (`@Get`, `@Post`, etc.) — never `@All()`
