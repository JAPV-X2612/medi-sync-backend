import { Specialty } from '../../domain/entities/specialty.entity';

/**
 * Output DTO for specialty use cases.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-20
 */
export class SpecialtyResponseDto {
  id: string;
  name: string;
  description: string | null;

  static fromDomain(specialty: Specialty): SpecialtyResponseDto {
    return Object.assign(new SpecialtyResponseDto(), specialty.toPrimitives());
  }
}
