import { Inject, Injectable } from '@nestjs/common';
import {
  APPOINTMENT_REPOSITORY,
  IAppointmentRepository,
} from '../../../domain/repositories/appointment.repository';
import { AppointmentResponseDto } from '../../dtos/appointment-response.dto';

/**
 * Returns all appointments ordered by creation date descending.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-20
 */
@Injectable()
export class FindAllAppointmentsUseCase {
  constructor(
    @Inject(APPOINTMENT_REPOSITORY) private readonly appointmentRepository: IAppointmentRepository,
  ) {}

  async execute(): Promise<AppointmentResponseDto[]> {
    const appointments = await this.appointmentRepository.findAll();
    return appointments.map(AppointmentResponseDto.fromDomain);
  }
}
