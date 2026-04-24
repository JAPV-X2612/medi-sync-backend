import { Inject, Injectable } from '@nestjs/common';
import { Appointment } from '../../../domain/entities/appointment.entity';
import {
  APPOINTMENT_REQUESTED_ROUTING_KEY,
  AppointmentRequestedEvent,
} from '../../../domain/events/appointment.events';
import {
  APPOINTMENT_REPOSITORY,
  IAppointmentRepository,
} from '../../../domain/repositories/appointment.repository';
import { AppointmentResponseDto } from '../../dtos/appointment-response.dto';
import { RequestAppointmentDto } from '../../dtos/request-appointment.dto';
import { EVENT_PUBLISHER, IEventPublisher } from '../../ports/event-publisher.port';

/**
 * Creates a new appointment request in PENDING status and publishes an AppointmentRequested event.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-20
 */
@Injectable()
export class RequestAppointmentUseCase {
  constructor(
    @Inject(APPOINTMENT_REPOSITORY) private readonly appointmentRepository: IAppointmentRepository,
    @Inject(EVENT_PUBLISHER) private readonly eventPublisher: IEventPublisher,
  ) {}

  async execute(dto: RequestAppointmentDto): Promise<AppointmentResponseDto> {
    const appointment = Appointment.request({
      ...dto,
      appointmentTime: new Date(dto.appointmentTime),
    });

    const saved = await this.appointmentRepository.save(appointment);

    const event: AppointmentRequestedEvent = {
      appointmentId: saved.id,
      patientId: saved.patientId,
      doctorId: saved.doctorId,
      requestedSlot: saved.appointmentTime,
      status: saved.status,
      requestedAt: saved.createdAt,
    };
    this.eventPublisher.publish(APPOINTMENT_REQUESTED_ROUTING_KEY, event);

    return AppointmentResponseDto.fromDomain(saved);
  }
}
