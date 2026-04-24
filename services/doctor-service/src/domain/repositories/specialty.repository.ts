import { Specialty } from '../entities/specialty.entity';

export const SPECIALTY_REPOSITORY = 'SPECIALTY_REPOSITORY';

/**
 * Repository port for Specialty persistence.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-20
 */
export interface ISpecialtyRepository {
  save(specialty: Specialty): Promise<Specialty>;
  findById(id: string): Promise<Specialty | null>;
  findAll(): Promise<Specialty[]>;
  existsById(id: string): Promise<boolean>;
}
