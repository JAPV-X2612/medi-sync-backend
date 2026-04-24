import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  APPOINTMENT_REPOSITORY,
  IAppointmentRepository,
} from '../../../domain/repositories/appointment.repository';
import { AppointmentResponseDto } from '../../dtos/appointment-response.dto';
import { CompleteAppointmentDto } from '../../dtos/complete-appointment.dto';
import { EVENT_PUBLISHER, IEventPublisher } from '../../ports/event-publisher.port';
import { APPOINTMENT_COMPLETED_ROUTING_KEY } from '../../../domain/events/appointment.events';

/**
 * Marks a confirmed appointment as completed and publishes an AppointmentCompleted event.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-20
 */
@Injectable()
export class CompleteAppointmentUseCase {
  constructor(
    @Inject(APPOINTMENT_REPOSITORY) private readonly appointmentRepository: IAppointmentRepository,
    @Inject(EVENT_PUBLISHER) private readonly eventPublisher: IEventPublisher,
  ) {}

  async execute(id: string, dto: CompleteAppointmentDto): Promise<AppointmentResponseDto> {
    const appointment = await this.appointmentRepository.findById(id);
    if (!appointment) {
      throw new NotFoundException(`Appointment with id "${id}" not found`);
    }

    try {
      appointment.complete(dto.notes);
    } catch (error) {
      throw new BadRequestException((error as Error).message);
    }

    const updated = await this.appointmentRepository.update(appointment);

    this.eventPublisher.publish(APPOINTMENT_COMPLETED_ROUTING_KEY, {
      appointmentId: updated.id,
      patientId: updated.patientId,
      doctorId: updated.doctorId,
      completedAt: updated.updatedAt,
    });

    return AppointmentResponseDto.fromDomain(updated);
  }
}
