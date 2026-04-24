import { Schedule } from '../../domain/entities/schedule.entity';

/**
 * Output DTO for schedule use cases.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-20
 */
export class ScheduleResponseDto {
  id: string;
  doctorId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  slotDurationMin: number;

  static fromDomain(schedule: Schedule): ScheduleResponseDto {
    return Object.assign(new ScheduleResponseDto(), schedule.toPrimitives());
  }
}
