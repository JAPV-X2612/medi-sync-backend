import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  APPOINTMENT_REPOSITORY,
  IAppointmentRepository,
} from '../../../domain/repositories/appointment.repository';
import { AppointmentResponseDto } from '../../dtos/appointment-response.dto';

/**
 * Retrieves a single appointment by UUID.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-20
 */
@Injectable()
export class FindAppointmentByIdUseCase {
  constructor(
    @Inject(APPOINTMENT_REPOSITORY) private readonly appointmentRepository: IAppointmentRepository,
  ) {}

  async execute(id: string): Promise<AppointmentResponseDto> {
    const appointment = await this.appointmentRepository.findById(id);
    if (!appointment) {
      throw new NotFoundException(`Appointment with id "${id}" not found`);
    }
    return AppointmentResponseDto.fromDomain(appointment);
  }
}
