import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment, AppointmentPrimitives } from '../../domain/entities/appointment.entity';
import { IAppointmentRepository } from '../../domain/repositories/appointment.repository';
import { AppointmentOrmEntity } from './appointment.orm-entity';

/**
 * TypeORM adapter for the appointment repository port.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-20
 */
@Injectable()
export class AppointmentTypeOrmRepository implements IAppointmentRepository {
  constructor(
    @InjectRepository(AppointmentOrmEntity)
    private readonly ormRepository: Repository<AppointmentOrmEntity>,
  ) {}

  async save(appointment: Appointment): Promise<Appointment> {
    const orm = this.toOrm(appointment);
    const saved = await this.ormRepository.save(orm);
    return this.toDomain(saved);
  }

  async findById(id: string): Promise<Appointment | null> {
    const orm = await this.ormRepository.findOneBy({ id });
    return orm ? this.toDomain(orm) : null;
  }

  async findAll(): Promise<Appointment[]> {
    const orms = await this.ormRepository.find({
      order: { createdAt: 'DESC' },
    });
    return orms.map((o) => this.toDomain(o));
  }

  async findByPatientId(patientId: string): Promise<Appointment[]> {
    const orms = await this.ormRepository.find({
      where: { patientId },
      order: { appointmentTime: 'DESC' },
    });
    return orms.map((o) => this.toDomain(o));
  }

  async findByDoctorId(doctorId: string): Promise<Appointment[]> {
    const orms = await this.ormRepository.find({
      where: { doctorId },
      order: { appointmentTime: 'DESC' },
    });
    return orms.map((o) => this.toDomain(o));
  }

  async update(appointment: Appointment): Promise<Appointment> {
    const orm = this.toOrm(appointment);
    const saved = await this.ormRepository.save(orm);
    return this.toDomain(saved);
  }

  async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }

  private toDomain(orm: AppointmentOrmEntity): Appointment {
    const primitives: AppointmentPrimitives = {
      id: orm.id,
      patientId: orm.patientId,
      patientName: orm.patientName,
      patientEmail: orm.patientEmail,
      doctorId: orm.doctorId,
      doctorName: orm.doctorName,
      scheduleId: orm.scheduleId,
      appointmentTime: orm.appointmentTime,
      status: orm.status,
      reason: orm.reason,
      notes: orm.notes,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    };
    return Appointment.reconstitute(primitives);
  }

  private toOrm(domain: Appointment): AppointmentOrmEntity {
    return Object.assign(new AppointmentOrmEntity(), domain.toPrimitives());
  }
}
