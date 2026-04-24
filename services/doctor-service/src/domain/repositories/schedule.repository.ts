import { Schedule } from '../entities/schedule.entity';

export const SCHEDULE_REPOSITORY = 'SCHEDULE_REPOSITORY';

/**
 * Repository port for Schedule persistence.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-20
 */
export interface IScheduleRepository {
  save(schedule: Schedule): Promise<Schedule>;
  findById(id: string): Promise<Schedule | null>;
  findByDoctorId(doctorId: string): Promise<Schedule[]>;
  delete(id: string): Promise<void>;
  existsById(id: string): Promise<boolean>;
}
