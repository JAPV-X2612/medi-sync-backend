# MediSync — Specifications (SDD)

This directory contains the **Specification-Driven Development (SDD)** artifacts for MediSync.
Each feature file is written in **Gherkin** and defines the acceptance criteria for a user story.

## How to use

1. **Before implementing** any feature, read the corresponding `.feature` file.
2. The scenarios are the acceptance criteria — your implementation must satisfy all of them.
3. Map each Gherkin scenario to one Jest `it('should ...')` test case.
4. A feature is **done** when all its scenarios pass as tests.

## User Stories

| ID | Title | Feature File | Service |
|---|---|---|---|
| US-001 | Register a new patient | `features/patients/US-001-register-patient.feature` | patient-service |
| US-002 | Manage patient data | `features/patients/US-002-manage-patient.feature` | patient-service |
| US-003 | Create a doctor profile | `features/doctors/US-003-create-doctor.feature` | doctor-service |
| US-004 | Manage doctor schedules | `features/doctors/US-004-manage-schedule.feature` | doctor-service |
| US-005 | Request an appointment | `features/appointments/US-005-request-appointment.feature` | appointments-service |
| US-006 | Confirm an appointment | `features/appointments/US-006-confirm-appointment.feature` | appointments-service |
| US-007 | Cancel an appointment | `features/appointments/US-007-cancel-appointment.feature` | appointments-service |

## Gherkin Conventions

- **Feature:** One per user story — named `US-XXX-short-title.feature`
- **Scenario:** One per acceptance criterion
- **Background:** Shared preconditions for all scenarios in a feature
- **Scenario Outline:** Used for data-driven scenarios (multiple input sets)
- **Given:** System state before the action
- **When:** The action performed (usually an HTTP call)
- **Then:** The expected outcome (status code, response body, side effect)

## Traceability

```
US-001 (Gherkin)
  └── CreatePatientUseCase (implementation)
        └── create-patient.use-case.spec.ts (tests)
              └── SonarCloud coverage report
```
