import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

interface AppointmentConfirmedPayload {
  appointmentId: string;
  patientId: string;
  doctorId: string;
  scheduledAt: string;
  confirmedAt: string;
}

/**
 * Handles incoming domain events relevant to the patient-service.
 * This controller is registered as part of the hybrid microservice transport.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-20
 */
@Controller()
export class AppointmentEventHandler {
  private readonly logger = new Logger(AppointmentEventHandler.name);

  @EventPattern('event.appointment.confirmed')
  handleAppointmentConfirmed(@Payload() data: AppointmentConfirmedPayload): void {
    this.logger.log(
      `Appointment confirmed — patient: ${data.patientId}, appointment: ${data.appointmentId}`,
    );
  }
}
