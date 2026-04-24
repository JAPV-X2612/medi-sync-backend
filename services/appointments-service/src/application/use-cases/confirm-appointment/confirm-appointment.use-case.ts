import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  APPOINTMENT_CONFIRMED_ROUTING_KEY,
  AppointmentConfirmedEvent,
} from '../../../domain/events/appointment.events';
import {
  APPOINTMENT_REPOSITORY,
  IAppointmentRepository,
} from '../../../domain/repositories/appointment.repository';
import { AppointmentResponseDto } from '../../dtos/appointment-response.dto';
import { EMAIL_NOTIFICATION, IEmailNotificationPort } from '../../ports/email-notification.port';
import { EVENT_PUBLISHER, IEventPublisher } from '../../ports/event-publisher.port';

/**
 * Confirms a pending appointment, sends a confirmation email, and publishes an AppointmentConfirmed event.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-20
 */
@Injectable()
export class ConfirmAppointmentUseCase {
  constructor(
    @Inject(APPOINTMENT_REPOSITORY) private readonly appointmentRepository: IAppointmentRepository,
    @Inject(EVENT_PUBLISHER) private readonly eventPublisher: IEventPublisher,
    @Inject(EMAIL_NOTIFICATION) private readonly emailNotification: IEmailNotificationPort,
  ) {}

  async execute(id: string): Promise<AppointmentResponseDto> {
    const appointment = await this.appointmentRepository.findById(id);
    if (!appointment) {
      throw new NotFoundException(`Appointment with id "${id}" not found`);
    }

    try {
      appointment.confirm();
    } catch (error) {
      throw new BadRequestException((error as Error).message);
    }

    const updated = await this.appointmentRepository.update(appointment);

    const event: AppointmentConfirmedEvent = {
      appointmentId: updated.id,
      patientId: updated.patientId,
      doctorId: updated.doctorId,
      scheduledAt: updated.appointmentTime,
      confirmedAt: updated.updatedAt,
    };
    this.eventPublisher.publish(APPOINTMENT_CONFIRMED_ROUTING_KEY, event);

    await this.emailNotification.sendConfirmation({
      to: updated.patientEmail,
      patientName: updated.patientName,
      doctorName: updated.doctorName,
      appointmentTime: updated.appointmentTime,
      appointmentId: updated.id,
    });

    return AppointmentResponseDto.fromDomain(updated);
  }
}
