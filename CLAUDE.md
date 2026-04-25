# CLAUDE.md — MediSync Backend

This file is automatically loaded by Claude Code at the start of every session.
It provides all the context, conventions, and guardrails needed to work on this project.

---

## AI Development Structure

This project uses **Specification-Driven Development (SDD)**. Key directories:

| Path | Purpose |
|---|---|
| `.ai/AGENTS.md` | Universal context — readable by any AI agent |
| `.ai/config.yaml` | Project config: stack, conventions, authors |
| `.ai/skills/` | Reusable prompt templates (see slash commands below) |
| `.ai/hooks/` | Automation scripts (lint + typecheck on edit, guards on commit) |
| `specs/features/` | Gherkin acceptance criteria — **read before implementing any feature** |

### Slash commands available in this session

| Command | When to use |
|---|---|
| `/clean-code` | Apply SOLID, naming, and code smell rules |
| `/testing` | Write or improve tests following AAA + Gherkin mapping |
| `/git-workflow` | Draft commits, branch names, and PR descriptions |
| `/code-review` | Full checklist review of the current changes |
| `/api-design` | Design or review REST endpoints, DTOs, and Swagger |
| `/documentation` | Write JSDoc, README sections, or inline comments |

### SDD workflow

```
1. Read specs/features/<US-XXX>.feature   ← acceptance criteria
2. /clean-code or /api-design              ← load the right skill
3. Implement                               ← hooks run lint + typecheck automatically
4. /testing                                ← write tests mapping Gherkin scenarios
5. /code-review                            ← verify before committing
```

---

## Project Overview

**Project:** MediSync — Medical Appointment Management System  
**Course:** Arquitectura Centrada en el Negocio (ARCN_M)  
**Authors:** Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano  
**Repository:** `medi-sync-backend`

Event-driven microservices backend for managing medical appointments. Patients can schedule
appointments with specialist doctors, select available time slots, and receive email confirmations.

```
React App → API Gateway → [patient-service | doctor-service | appointments-service]
                    ↕ async events
                 RabbitMQ (topic exchange)
                    ↕
              PostgreSQL (one schema per service)
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Language | TypeScript 5 |
| Framework | NestJS 11 |
| ORM | TypeORM |
| Database | PostgreSQL 16 |
| Messaging | RabbitMQ 3.13 (topic + direct exchange) |
| Validation | class-validator + class-transformer |
| Configuration | @nestjs/config |
| Containerisation | Docker + Docker Compose |
| Testing | Jest + Supertest |
| Node version | 20 (LTS) |

---

## Architecture

Each microservice follows **Hexagonal Architecture (Ports & Adapters)** with **DDD** principles:

```
src/
├── domain/              # Core business logic — no external dependencies
│   ├── entities/        # Aggregate Roots (pure TypeScript classes)
│   ├── value-objects/   # Immutable value types
│   ├── events/          # Domain Events
│   └── repositories/   # Repository interfaces (Ports — Dependency Inversion)
├── application/         # Use cases — orchestrates domain objects
│   ├── use-cases/       # One class per use case with .execute() method
│   ├── dtos/            # Input/output data shapes (class-validator)
│   └── ports/           # Interfaces for external dependencies (event publisher, email)
├── infrastructure/      # Adapters — implements ports with real technology
│   ├── persistence/     # TypeORM entities + repository implementations
│   ├── messaging/       # RabbitMQ publisher adapter + event handlers
│   ├── notifications/   # Email adapter (appointments-service only)
│   └── config/          # Database + RabbitMQ configuration
├── presentation/
│   └── http/            # NestJS controllers (HTTP adapter)
├── <feature>.module.ts  # Feature module aggregating all providers
├── app.module.ts
└── main.ts
```

**Key rule:** Domain layer has zero imports from `infrastructure/`. Infrastructure imports from
`domain/` and `application/`, never the other way around.

---

## Services & Ports

| Service | Port | Responsibility |
|---|---|---|
| api-gateway | 3000 | Single entry point — HTTP proxy to downstream services |
| auth-service | 3001 | Out of scope — stub only |
| patient-service | 3002 | Patient CRUD + publishes `event.patient.registered` |
| doctor-service | 3003 | Doctor/specialty/schedule CRUD + publishes `event.doctor.profile-created` |
| appointments-service | 3004 | Appointment lifecycle + email confirmation |

---

## Repository Structure

```
medi-sync-backend/
├── .claude/settings.json        # Claude Code permissions
├── .devcontainer/devcontainer.json
├── .env.example                 # Template — never commit .env
├── .dockerignore
├── .gitignore
├── CLAUDE.md                    # This file
├── docker-compose.yml
├── assets/
│   ├── diagrams/
│   └── images/
├── contracts/
│   └── events/
│       ├── domain-events.json   # Event contract registry
│       └── commands.json        # Command contract registry
└── services/
    ├── api-gateway/
    ├── patient-service/
    ├── doctor-service/
    ├── appointments-service/
    └── auth-service/            # Stub — do not implement
```

---

## Language and Naming Conventions

- **All code, comments, variable names, log messages, and test strings must be in English.**
- Follow standard TypeScript / NestJS naming conventions:

| Element | Convention | Example |
|---|---|---|
| Classes, interfaces, enums | `PascalCase` | `PatientRepository`, `AppointmentStatus` |
| Methods, variables, parameters | `camelCase` | `findById`, `patientId` |
| Constants | `UPPER_SNAKE_CASE` | `MAX_SLOT_DURATION` |
| Files | `kebab-case` | `create-patient.use-case.ts` |
| Folders | `kebab-case` | `value-objects/`, `use-cases/` |
| NestJS decorators | as provided by the framework | `@Injectable()`, `@Controller()` |
| TypeORM columns | `snake_case` in DB, `camelCase` in code | `appointment_time` → `appointmentTime` |
| Environment variables | `UPPER_SNAKE_CASE` | `RABBITMQ_HOST` |

---

## JSDoc Convention

Every exported class, interface, and use case must have this exact JSDoc header:

```typescript
/**
 * Brief description of the class or interface.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since YYYY-MM-DD
 */
```

- Public methods that form part of an interface contract get a concise `/** ... */` JSDoc.
- Private helpers do **not** need JSDoc unless the logic is genuinely non-obvious.
- Inline comments are added **only** when the WHY is non-obvious: a hidden constraint,
  a subtle invariant, or a workaround for a specific limitation. Never explain WHAT the code
  does — well-named identifiers already do that.

---

## Design Principles

| Principle | How it applies |
|---|---|
| **SRP** | One use case per class; domain entity ≠ ORM entity ≠ DTO |
| **OCP** | New domain behavior → new use case class, not modifications to existing ones |
| **LSP** | Repository adapters must be fully substitutable for their port interface |
| **ISP** | Ports define only what the use case needs — no fat interfaces |
| **DIP** | Use cases depend on repository and publisher interfaces, never on TypeORM/amqplib directly |
| **DRY** | Shared config lives in environment variables; no duplicated connection strings |
| **KISS** | No abstraction layers beyond what the current use case requires |
| **YAGNI** | Do not add fields, methods, or services for hypothetical future requirements |

---

## DTO and Validation Rules

Apply `class-validator` constraints **only at system entry boundaries** (controller DTOs):

```typescript
@IsString()
@IsNotEmpty()
@MaxLength(100)
firstName: string;
```

- Do not add validation annotations on domain entities or internal application objects.
- Always apply `ValidationPipe` globally in `main.ts` with `whitelist: true` and `forbidNonWhitelisted: true`.
- Use `class-transformer` `@Exclude()` and `@Expose()` on response DTOs to control what gets serialized.

---

## RabbitMQ Event Contracts

Event and command names must match the contracts defined in `contracts/events/`:

| Exchange | Type | Used for |
|---|---|---|
| `medi-sync.events` | topic | Domain events (async, fire-and-forget) |
| `medi-sync.commands` | direct | Commands targeting a specific service |

Routing key pattern for events: `event.<aggregate>.<past-tense-verb>`
Example: `event.patient.registered`, `event.appointment.confirmed`

---

## Testing Rules

### Framework
**Jest** + **Supertest** for e2e. **Minimum coverage: 80%** (`npm run test:cov`).

### File placement
- Unit tests: co-located with the class under test inside `src/`, suffix `.spec.ts`
- E2e tests: `test/` directory, suffix `.e2e-spec.ts`
- Example: `create-patient.use-case.ts` → `create-patient.use-case.spec.ts`

### Test naming — use the `should` / `shouldNot` pattern
```typescript
it('should create a patient and publish a registered event')
it('should throw NotFoundException when patient does not exist')
it('should not allow duplicate email registration')
```

### Structure — always AAA
```typescript
it('should return the patient when found by id', () => {
  // Arrange
  const patient = Patient.create({ ... });
  mockRepository.findById.mockResolvedValue(patient);

  // Act
  const result = await useCase.execute({ id: patient.id });

  // Assert
  expect(result.id).toBe(patient.id);
});
```

### Mock policy
- Mock **only external dependencies**: TypeORM repositories, RabbitMQ client, email provider, HTTP clients.
- Use **real instances** for domain entities, value objects, and pure use case logic.
- Inject mocked dependencies via Jest's `jest.fn()` and object literals implementing the port interface.
- For e2e tests, spin up the NestJS application with `Test.createTestingModule()` and replace
  infrastructure providers with in-memory fakes or mocks.
- Do **not** use `@nestjs/testing`'s full application context for pure unit tests — keep them fast.

### Quality checklist
- Cover happy path **and** edge/boundary cases (null, empty string, invalid UUID, past dates, etc.).
- Each test must be fully independent — no shared mutable state between `it()` blocks.
- Extract shared setup into `beforeEach()` to avoid duplication (DRY).
- All imports at the file header; no inline `require()` inside test functions.
- Apply the **FIRST** principles: Fast, Independent, Repeatable, Self-validating, Timely.
- Do not write tests that only pass because mocks return hardcoded values — test real behaviour.
- Do not add tests for framework plumbing (NestJS module wiring, TypeORM column definitions).

---

## Docker and docker-compose Rules

- `docker-compose.yml` uses `depends_on: condition: service_healthy` to guarantee PostgreSQL
  and RabbitMQ are fully ready before services start connecting.
- All Dockerfiles use **multi-stage builds** (build stage installs devDependencies and compiles;
  runner stage uses `npm ci --only=production` and copies only `dist/`).
- Never use `docker compose down -v` without explicit user confirmation — it deletes named volumes
  and destroys all database data.
- Service ports are always read from environment variables (`process.env.PORT`).
- Each service connects to PostgreSQL using its own schema to maintain data isolation.

---

## Environment Variables

- Never commit `.env` files. Always keep `.env.example` up to date with every new variable.
- Access config exclusively through `@nestjs/config` (`ConfigService`) — never use `process.env` directly inside domain or application layers.
- Validate required env vars at startup using `Joi` schema in `ConfigModule.forRoot({ validationSchema })`.

---

## What to Avoid

- **Do not** share domain entities or TypeORM entities between services — each service owns its data.
- **Do not** use `@Autowired`-style field injection — always use constructor injection with `private readonly`.
- **Do not** put business logic inside controllers — controllers only validate input and delegate to use cases.
- **Do not** put TypeORM decorators on domain entities — keep domain and ORM entities separate.
- **Do not** hardcode connection strings, credentials, or port numbers — always use `ConfigService`.
- **Do not** commit generated files (`dist/`, `coverage/`, `node_modules/`).
- **Do not** push directly to `main` — use feature branches.
- **Do not** write multi-paragraph JSDoc blocks that explain WHAT the code does.
- **Do not** add error handling or fallbacks for scenarios that cannot happen in the current scope.
