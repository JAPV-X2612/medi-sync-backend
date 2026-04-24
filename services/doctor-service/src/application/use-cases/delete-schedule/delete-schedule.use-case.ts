import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IScheduleRepository, SCHEDULE_REPOSITORY } from '../../../domain/repositories/schedule.repository';

/**
 * Deletes a schedule entry by UUID.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-20
 */
@Injectable()
export class DeleteScheduleUseCase {
  constructor(
    @Inject(SCHEDULE_REPOSITORY) private readonly scheduleRepository: IScheduleRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const exists = await this.scheduleRepository.existsById(id);
    if (!exists) throw new NotFoundException(`Schedule with id "${id}" not found`);
    await this.scheduleRepository.delete(id);
  }
}
