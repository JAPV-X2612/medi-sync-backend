import { Inject, Injectable } from '@nestjs/common';
import { ISpecialtyRepository, SPECIALTY_REPOSITORY } from '../../../domain/repositories/specialty.repository';
import { SpecialtyResponseDto } from '../../dtos/specialty-response.dto';

/**
 * Returns all available medical specialties.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-20
 */
@Injectable()
export class FindAllSpecialtiesUseCase {
  constructor(
    @Inject(SPECIALTY_REPOSITORY) private readonly specialtyRepository: ISpecialtyRepository,
  ) {}

  async execute(): Promise<SpecialtyResponseDto[]> {
    const specialties = await this.specialtyRepository.findAll();
    return specialties.map(SpecialtyResponseDto.fromDomain);
  }
}
