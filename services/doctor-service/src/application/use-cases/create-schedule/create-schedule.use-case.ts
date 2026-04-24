import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Schedule } from '../../../domain/entities/schedule.entity';
import { DOCTOR_REPOSITORY, IDoctorRepository } from '../../../domain/repositories/doctor.repository';
import { IScheduleRepository, SCHEDULE_REPOSITORY } from '../../../domain/repositories/schedule.repository';
import { CreateScheduleDto } from '../../dtos/create-schedule.dto';
import { ScheduleResponseDto } from '../../dtos/schedule-response.dto';

/**
 * Creates a new availability schedule entry for a doctor.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-20
 */
@Injectable()
export class CreateScheduleUseCase {
  constructor(
    @Inject(DOCTOR_REPOSITORY) private readonly doctorRepository: IDoctorRepository,
    @Inject(SCHEDULE_REPOSITORY) private readonly scheduleRepository: IScheduleRepository,
  ) {}

  async execute(dto: CreateScheduleDto): Promise<ScheduleResponseDto> {
    const doctorExists = await this.doctorRepository.existsById(dto.doctorId);
    if (!doctorExists) {
      throw new NotFoundException(`Doctor with id "${dto.doctorId}" not found`);
    }

    const schedule = Schedule.create(dto);
    const saved = await this.scheduleRepository.save(schedule);
    return ScheduleResponseDto.fromDomain(saved);
  }
}
