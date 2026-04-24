import { Inject, Injectable } from '@nestjs/common';
import { IScheduleRepository, SCHEDULE_REPOSITORY } from '../../../domain/repositories/schedule.repository';
import { ScheduleResponseDto } from '../../dtos/schedule-response.dto';

/**
 * Returns all schedule entries for a given doctor.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-20
 */
@Injectable()
export class FindSchedulesByDoctorUseCase {
  constructor(
    @Inject(SCHEDULE_REPOSITORY) private readonly scheduleRepository: IScheduleRepository,
  ) {}

  async execute(doctorId: string): Promise<ScheduleResponseDto[]> {
    const schedules = await this.scheduleRepository.findByDoctorId(doctorId);
    return schedules.map(ScheduleResponseDto.fromDomain);
  }
}
