import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient, PatientPrimitives } from '../../domain/entities/patient.entity';
import { IPatientRepository } from '../../domain/repositories/patient.repository';
import { PatientOrmEntity } from './patient.orm-entity';

/**
 * TypeORM adapter that implements the IPatientRepository port.
 * Handles mapping between domain entities and ORM entities.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-20
 */
@Injectable()
export class PatientTypeOrmRepository implements IPatientRepository {
  constructor(
    @InjectRepository(PatientOrmEntity)
    private readonly ormRepository: Repository<PatientOrmEntity>,
  ) {}

  async save(patient: Patient): Promise<Patient> {
    const orm = this.toOrm(patient);
    const saved = await this.ormRepository.save(orm);
    return this.toDomain(saved);
  }

  async findById(id: string): Promise<Patient | null> {
    const orm = await this.ormRepository.findOne({ where: { id } });
    return orm ? this.toDomain(orm) : null;
  }

  async findByEmail(email: string): Promise<Patient | null> {
    const orm = await this.ormRepository.findOne({
      where: { email: email.toLowerCase().trim() },
    });
    return orm ? this.toDomain(orm) : null;
  }

  async findAll(): Promise<Patient[]> {
    const orms = await this.ormRepository.find({
      order: { createdAt: 'DESC' },
    });
    return orms.map((orm) => this.toDomain(orm));
  }

  async update(patient: Patient): Promise<Patient> {
    const orm = this.toOrm(patient);
    const saved = await this.ormRepository.save(orm);
    return this.toDomain(saved);
  }

  async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }

  async existsById(id: string): Promise<boolean> {
    return this.ormRepository.existsBy({ id });
  }

  private toDomain(orm: PatientOrmEntity): Patient {
    const primitives: PatientPrimitives = {
      id: orm.id,
      firstName: orm.firstName,
      lastName: orm.lastName,
      email: orm.email,
      phone: orm.phone,
      birthDate: orm.birthDate,
      bloodType: orm.bloodType,
      documentNumber: orm.documentNumber,
      documentType: orm.documentType,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    };
    return Patient.reconstitute(primitives);
  }

  private toOrm(domain: Patient): PatientOrmEntity {
    const primitives = domain.toPrimitives();
    return Object.assign(new PatientOrmEntity(), primitives);
  }
}
