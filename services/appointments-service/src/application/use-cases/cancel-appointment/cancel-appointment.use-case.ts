import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  APPOINTMENT_CANCELLED_ROUTING_KEY,
  AppointmentCancelledEvent,
} from '../../../domain/events/appointment.events';
import {
  APPOINTMENT_REPOSITORY,
  IAppointmentRepository,
} from '../../../domain/repositories/appointment.repository';
import { AppointmentResponseDto } from '../../dtos/appointment-response.dto';
import { EVENT_PUBLISHER, IEventPublisher } from '../../ports/event-publisher.port';

/**
 * Cancels an appointment and publishes an AppointmentCancelled event.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-20
 */
@Injectable()
export class CancelAppointmentUseCase {
  constructor(
    @Inject(APPOINTMENT_REPOSITORY) private readonly appointmentRepository: IAppointmentRepository,
    @Inject(EVENT_PUBLISHER) private readonly eventPublisher: IEventPublisher,
  ) {}

  async execute(id: string): Promise<AppointmentResponseDto> {
    const appointment = await this.appointmentRepository.findById(id);
    if (!appointment) {
      throw new NotFoundException(`Appointment with id "${id}" not found`);
    }

    try {
      appointment.cancel();
    } catch (error) {
      throw new BadRequestException((error as Error).message);
    }

    const updated = await this.appointmentRepository.update(appointment);

    const event: AppointmentCancelledEvent = {
      appointmentId: updated.id,
      patientId: updated.patientId,
      doctorId: updated.doctorId,
      reason: 'Cancelled by user',
      cancelledAt: updated.updatedAt,
    };
    this.eventPublisher.publish(APPOINTMENT_CANCELLED_ROUTING_KEY, event);

    return AppointmentResponseDto.fromDomain(updated);
  }
}
