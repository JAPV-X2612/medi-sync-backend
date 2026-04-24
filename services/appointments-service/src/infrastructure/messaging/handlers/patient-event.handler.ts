import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

/**
 * Listens for patient lifecycle events from the patient-service.
 * Reserved for future projections or cache invalidation logic.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-20
 */
@Controller()
export class PatientEventHandler {
  private readonly logger = new Logger(PatientEventHandler.name);

  @EventPattern('event.patient.registered')
  handlePatientRegistered(@Payload() payload: unknown): void {
    this.logger.log(`Received event.patient.registered: ${JSON.stringify(payload)}`);
  }
}
