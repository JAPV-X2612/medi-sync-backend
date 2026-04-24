import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  APPOINTMENT_RESCHEDULED_ROUTING_KEY,
  AppointmentRescheduledEvent,
} from '../../../domain/events/appointment.events';
import {
  APPOINTMENT_REPOSITORY,
  IAppointmentRepository,
} from '../../../domain/repositories/appointment.repository';
import { AppointmentResponseDto } from '../../dtos/appointment-response.dto';
import { RescheduleAppointmentDto } from '../../dtos/reschedule-appointment.dto';
import { EVENT_PUBLISHER, IEventPublisher } from '../../ports/event-publisher.port';

/**
 * Reschedules an appointment to a new date/time.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-20
 */
@Injectable()
export class RescheduleAppointmentUseCase {
  constructor(
    @Inject(APPOINTMENT_REPOSITORY) private readonly appointmentRepository: IAppointmentRepository,
    @Inject(EVENT_PUBLISHER) private readonly eventPublisher: IEventPublisher,
  ) {}

  async execute(id: string, dto: RescheduleAppointmentDto): Promise<AppointmentResponseDto> {
    const appointment = await this.appointmentRepository.findById(id);
    if (!appointment) {
      throw new NotFoundException(`Appointment with id "${id}" not found`);
    }

    const previousSlot = appointment.appointmentTime;
    const newSlot = new Date(dto.newAppointmentTime);

    try {
      appointment.reschedule(newSlot);
    } catch (error) {
      throw new BadRequestException((error as Error).message);
    }

    const updated = await this.appointmentRepository.update(appointment);

    const event: AppointmentRescheduledEvent = {
      appointmentId: updated.id,
      patientId: updated.patientId,
      doctorId: updated.doctorId,
      previousSlot,
      newSlot,
      rescheduledAt: updated.updatedAt,
    };
    this.eventPublisher.publish(APPOINTMENT_RESCHEDULED_ROUTING_KEY, event);

    return AppointmentResponseDto.fromDomain(updated);
  }
}
