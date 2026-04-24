import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Specialty, SpecialtyPrimitives } from '../../domain/entities/specialty.entity';
import { ISpecialtyRepository } from '../../domain/repositories/specialty.repository';
import { SpecialtyOrmEntity } from './specialty.orm-entity';

/**
 * TypeORM adapter implementing the ISpecialtyRepository port.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-20
 */
@Injectable()
export class SpecialtyTypeOrmRepository implements ISpecialtyRepository {
  constructor(
    @InjectRepository(SpecialtyOrmEntity)
    private readonly ormRepository: Repository<SpecialtyOrmEntity>,
  ) {}

  async save(specialty: Specialty): Promise<Specialty> {
    const saved = await this.ormRepository.save(this.toOrm(specialty));
    return this.toDomain(saved);
  }

  async findById(id: string): Promise<Specialty | null> {
    const orm = await this.ormRepository.findOne({ where: { id } });
    return orm ? this.toDomain(orm) : null;
  }

  async findAll(): Promise<Specialty[]> {
    const orms = await this.ormRepository.find({ order: { name: 'ASC' } });
    return orms.map((orm) => this.toDomain(orm));
  }

  async existsById(id: string): Promise<boolean> {
    return this.ormRepository.existsBy({ id });
  }

  private toDomain(orm: SpecialtyOrmEntity): Specialty {
    const primitives: SpecialtyPrimitives = {
      id: orm.id,
      name: orm.name,
      description: orm.description,
    };
    return Specialty.reconstitute(primitives);
  }

  private toOrm(domain: Specialty): SpecialtyOrmEntity {
    return Object.assign(new SpecialtyOrmEntity(), domain.toPrimitives());
  }
}
