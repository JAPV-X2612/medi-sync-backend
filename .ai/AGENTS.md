# MediSync Backend — Universal AI Agent Context

> **This file is the single source of truth for all AI agents.**
> CLAUDE.md, GEMINI.md, AGENTS.md, and .github/copilot-instructions.md all reference this.
> Full configuration details are in `.ai/config.yaml`.

---

## What is this project?

**MediSync** is an event-driven microservices backend for managing medical appointments.
Patients register, browse specialist doctors by specialty, pick available time slots,
and receive automated email confirmations.

- **Course:** Arquitectura Centrada en el Negocio (ARCN_M)
- **Repo:** https://github.com/JAPV-X2612/medi-sync-backend

---

## Architecture

Each microservice follows **Hexagonal Architecture (Ports & Adapters)** with **DDD**:

```
domain/          ← Pure business logic. ZERO imports from infrastructure.
  entities/      ← Aggregate Roots (pure TypeScript)
  value-objects/
  events/        ← Domain Events
  repositories/  ← Port interfaces (Dependency Inversion)
application/     ← Use cases — one class, one .execute() method
  use-cases/
  dtos/          ← Validated input/output (class-validator)
  ports/         ← Interfaces for event publisher, email, etc.
infrastructure/  ← Adapters implementing the ports
  persistence/   ← TypeORM entities + repository implementations
  messaging/     ← RabbitMQ publisher + event handlers
  notifications/ ← Email (appointments-service only)
presentation/
  http/          ← NestJS controllers (HTTP only, no business logic)
```

**Hard rule:** The dependency arrow always points inward. `infrastructure/` imports from
`domain/` and `application/`. Never the reverse.

---

## Services & Ports

| Service | Port | Publishes |
|---|---|---|
| api-gateway | 3000 | — |
| patient-service | 3002 | `event.patient.registered` |
| doctor-service | 3003 | `event.doctor.profile-created` |
| appointments-service | 3004 | `event.appointment.confirmed` |

All events use the `medi-sync.events` **topic exchange** in RabbitMQ.
Routing key pattern: `event.<aggregate>.<past-tense-verb>`

---

## Specification-Driven Development (SDD)

**Before implementing any feature, read the relevant Gherkin file in `specs/features/`.**

| User Story | Feature File |
|---|---|
| US-001 | `specs/features/patients/US-001-register-patient.feature` |
| US-002 | `specs/features/patients/US-002-manage-patient.feature` |
| US-003 | `specs/features/doctors/US-003-create-doctor.feature` |
| US-004 | `specs/features/doctors/US-004-manage-schedule.feature` |
| US-005 | `specs/features/appointments/US-005-request-appointment.feature` |
| US-006 | `specs/features/appointments/US-006-confirm-appointment.feature` |
| US-007 | `specs/features/appointments/US-007-cancel-appointment.feature` |

The Gherkin scenarios ARE the acceptance criteria. Implementation must make all scenarios pass.

---

## Available Skills

Load the relevant skill before starting a task:

| Skill | File | Use when |
|---|---|---|
| Clean Code | `.ai/skills/01-clean-code.md` | Refactoring, naming, SOLID |
| Testing | `.ai/skills/02-testing.md` | Writing unit/e2e tests |
| Git Workflow | `.ai/skills/03-git-workflow.md` | Commits, branches, PRs |
| Code Review | `.ai/skills/04-code-review.md` | Reviewing changes |
| API Design | `.ai/skills/05-api-design.md` | REST endpoints, DTOs, Swagger |
| Documentation | `.ai/skills/06-documentation.md` | README, JSDoc, Markdown |

---

## Naming Conventions

| Element | Convention | Example |
|---|---|---|
| Classes, interfaces, enums | PascalCase | `PatientRepository`, `AppointmentStatus` |
| Methods, variables | camelCase | `findById`, `patientId` |
| Constants | UPPER_SNAKE_CASE | `MAX_SLOT_DURATION` |
| Files, folders | kebab-case | `create-patient.use-case.ts` |
| DB columns | snake_case in DB → camelCase in code | `appointment_time` → `appointmentTime` |
| Env vars | UPPER_SNAKE_CASE | `RABBITMQ_HOST` |

**All code, comments, variable names, and test strings must be in English.**

---

## JSDoc Convention

Every exported class, interface, and use case must have:

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

## What NOT to do

- Do NOT import infrastructure in domain layer
- Do NOT put business logic in controllers
- Do NOT put TypeORM decorators on domain entities
- Do NOT use `process.env` directly — use `ConfigService`
- Do NOT hardcode connection strings or credentials
- Do NOT use `@All()` route handlers — use specific HTTP method decorators
- Do NOT use field injection — always use constructor injection
- Do NOT add error handling for scenarios that cannot happen
- Do NOT write comments explaining WHAT the code does — only WHY

---

## Environment Variables

Every service reads config exclusively through `@nestjs/config` (`ConfigService`).
All vars are validated at startup via Joi schema in `ConfigModule.forRoot()`.
Never commit `.env`. Always keep `.env.example` updated.

---

## Testing

- Minimum coverage: **80%**
- Unit tests: co-located with class (`*.spec.ts`)
- E2e tests: `test/` directory (`*.e2e-spec.ts`)
- Mock only external dependencies (TypeORM, RabbitMQ, email, HTTP)
- Use real instances for domain entities and value objects
- Test naming: `should <action>` / `should not <action>`
- Structure: always AAA (Arrange → Act → Assert)

---

## Docker

- `docker compose up --build` — start everything
- `docker compose down` — stop (preserves data volumes)
- **Never** `docker compose down -v` without explicit user confirmation

---

## Authors

- Andrés Chavarro — https://github.com/Andr3xDev
- Jesús Pinzón — https://github.com/JAPV-X2612
- Laura Rodríguez — https://github.com/LauraRo166
- Sergio Bejarano — https://github.com/SergioBejarano
