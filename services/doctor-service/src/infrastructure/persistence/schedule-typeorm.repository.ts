import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Schedule, SchedulePrimitives } from '../../domain/entities/schedule.entity';
import { IScheduleRepository } from '../../domain/repositories/schedule.repository';
import { ScheduleOrmEntity } from './schedule.orm-entity';

/**
 * TypeORM adapter implementing the IScheduleRepository port.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-20
 */
@Injectable()
export class ScheduleTypeOrmRepository implements IScheduleRepository {
  constructor(
    @InjectRepository(ScheduleOrmEntity)
    private readonly ormRepository: Repository<ScheduleOrmEntity>,
  ) {}

  async save(schedule: Schedule): Promise<Schedule> {
    const saved = await this.ormRepository.save(this.toOrm(schedule));
    return this.toDomain(saved);
  }

  async findById(id: string): Promise<Schedule | null> {
    const orm = await this.ormRepository.findOne({ where: { id } });
    return orm ? this.toDomain(orm) : null;
  }

  async findByDoctorId(doctorId: string): Promise<Schedule[]> {
    const orms = await this.ormRepository.find({
      where: { doctorId },
      order: { dayOfWeek: 'ASC', startTime: 'ASC' },
    });
    return orms.map((orm) => this.toDomain(orm));
  }

  async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }

  async existsById(id: string): Promise<boolean> {
    return this.ormRepository.existsBy({ id });
  }

  private toDomain(orm: ScheduleOrmEntity): Schedule {
    const primitives: SchedulePrimitives = {
      id: orm.id,
      doctorId: orm.doctorId,
      dayOfWeek: orm.dayOfWeek,
      startTime: orm.startTime,
      endTime: orm.endTime,
      slotDurationMin: orm.slotDurationMin,
    };
    return Schedule.reconstitute(primitives);
  }

  private toOrm(domain: Schedule): ScheduleOrmEntity {
    return Object.assign(new ScheduleOrmEntity(), domain.toPrimitives());
  }
}
