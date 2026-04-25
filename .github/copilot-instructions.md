# MediSync Backend — GitHub Copilot Instructions

<!-- GitHub Copilot reads .github/copilot-instructions.md automatically -->

## Project context

Read `.ai/AGENTS.md` for full project context and `.ai/config.yaml` for all conventions.

This is an **event-driven microservices backend** (NestJS 11 + TypeScript 5) for managing
medical appointments. Architecture: **Hexagonal + DDD**.

---

## Critical rules (always apply)

- **Language:** All code, comments, and names must be in English.
- **Architecture:** `domain/` has ZERO imports from `infrastructure/`. Never suggest otherwise.
- **Use cases:** One class per operation. One `.execute()` method. No other public methods.
- **Config:** All env vars via `ConfigService`. Never suggest `process.env`.
- **Routes:** Always use `@Get()`, `@Post()`, etc. Never suggest `@All()`.
- **Injection:** Constructor injection only. Never suggest `@Inject()` on properties.
- **Validation:** Only on request DTOs (`class-validator`). Not on domain entities.
- **Testing:** AAA structure. `should` / `should not` naming. Mock only external dependencies.

---

## Naming (auto-complete guidance)

| Context | Pattern | Example |
|---|---|---|
| Use case class | `<Verb><Noun>UseCase` | `CreatePatientUseCase` |
| Repository port | `<Noun>Repository` | `PatientRepository` |
| ORM entity | `<Noun>OrmEntity` | `PatientOrmEntity` |
| Request DTO | `<Verb><Noun>Dto` | `CreatePatientDto` |
| Response DTO | `<Noun>ResponseDto` | `PatientResponseDto` |
| Domain event | `<Noun><PastVerb>Event` | `PatientRegisteredEvent` |
| Test file | same name + `.spec.ts` | `create-patient.use-case.spec.ts` |

---

## JSDoc (always include on exported classes)

```typescript
/**
 * Brief description.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since YYYY-MM-DD
 */
```

---

## Specs

Before implementing a feature, check `specs/features/` for the Gherkin acceptance criteria.
The test cases must cover all scenarios defined there.
