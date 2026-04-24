import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

/**
 * Listens for doctor lifecycle events from the doctor-service.
 * Reserved for future projections or cache invalidation logic.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-20
 */
@Controller()
export class DoctorEventHandler {
  private readonly logger = new Logger(DoctorEventHandler.name);

  @EventPattern('event.doctor.profile-created')
  handleDoctorProfileCreated(@Payload() payload: unknown): void {
    this.logger.log(`Received event.doctor.profile-created: ${JSON.stringify(payload)}`);
  }
}
