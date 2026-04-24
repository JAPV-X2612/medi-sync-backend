import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doctor, DoctorPrimitives } from '../../domain/entities/doctor.entity';
import { IDoctorRepository } from '../../domain/repositories/doctor.repository';
import { DoctorOrmEntity } from './doctor.orm-entity';

/**
 * TypeORM adapter implementing the IDoctorRepository port.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-20
 */
@Injectable()
export class DoctorTypeOrmRepository implements IDoctorRepository {
  constructor(
    @InjectRepository(DoctorOrmEntity)
    private readonly ormRepository: Repository<DoctorOrmEntity>,
  ) {}

  async save(doctor: Doctor): Promise<Doctor> {
    const saved = await this.ormRepository.save(this.toOrm(doctor));
    return this.toDomain(saved);
  }

  async findById(id: string): Promise<Doctor | null> {
    const orm = await this.ormRepository.findOne({ where: { id } });
    return orm ? this.toDomain(orm) : null;
  }

  async findByEmail(email: string): Promise<Doctor | null> {
    const orm = await this.ormRepository.findOne({
      where: { email: email.toLowerCase().trim() },
    });
    return orm ? this.toDomain(orm) : null;
  }

  async findAll(): Promise<Doctor[]> {
    const orms = await this.ormRepository.find({ order: { createdAt: 'DESC' } });
    return orms.map((orm) => this.toDomain(orm));
  }

  async findBySpecialtyId(specialtyId: string): Promise<Doctor[]> {
    const orms = await this.ormRepository.find({
      where: { specialtyId },
      order: { createdAt: 'DESC' },
    });
    return orms.map((orm) => this.toDomain(orm));
  }

  async update(doctor: Doctor): Promise<Doctor> {
    const saved = await this.ormRepository.save(this.toOrm(doctor));
    return this.toDomain(saved);
  }

  async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }

  async existsById(id: string): Promise<boolean> {
    return this.ormRepository.existsBy({ id });
  }

  private toDomain(orm: DoctorOrmEntity): Doctor {
    const primitives: DoctorPrimitives = {
      id: orm.id,
      firstName: orm.firstName,
      lastName: orm.lastName,
      email: orm.email,
      phone: orm.phone,
      licenseNumber: orm.licenseNumber,
      bio: orm.bio,
      specialtyId: orm.specialtyId,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    };
    return Doctor.reconstitute(primitives);
  }

  private toOrm(domain: Doctor): DoctorOrmEntity {
    return Object.assign(new DoctorOrmEntity(), domain.toPrimitives());
  }
}
