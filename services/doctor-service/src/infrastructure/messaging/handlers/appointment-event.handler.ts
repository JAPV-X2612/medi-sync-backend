import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

interface AppointmentRequestedPayload {
  appointmentId: string;
  patientId: string;
  doctorId: string;
  requestedSlot: string;
}

/**
 * Handles incoming appointment domain events relevant to the doctor-service.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-20
 */
@Controller()
export class AppointmentEventHandler {
  private readonly logger = new Logger(AppointmentEventHandler.name);

  @EventPattern('event.appointment.requested')
  handleAppointmentRequested(@Payload() data: AppointmentRequestedPayload): void {
    this.logger.log(
      `Appointment requested for doctor ${data.doctorId}, appointment: ${data.appointmentId}`,
    );
  }
}
