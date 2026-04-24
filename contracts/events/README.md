# Event Contracts

Shared event contracts for the Medi-Sync microservices ecosystem.

## Naming Convention

### Domain Events
Pattern: `event.<aggregate>.<action>`

Domain events represent facts that have already happened. They are published to the
`medi-sync.events` exchange (type: `topic`) and can be consumed by any interested service.

### Commands
Pattern: `command.<service>.<action>`

Commands represent intent — a request for a specific service to perform an action.
They are sent to the `medi-sync.commands` exchange (type: `direct`) and have a single owner.

## Base Envelope

All messages share this envelope structure:

```json
{
  "eventId": "uuid-v4",
  "timestamp": "ISO-8601",
  "version": "1.0.0",
  "source": "service-name",
  "correlationId": "optional-uuid",
  "payload": {}
}
```

## Files

- `domain-events.json` — Catalog of all domain events in the system
- `commands.json` — Catalog of all commands in the system
