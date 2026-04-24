import { Inject, Injectable } from '@nestjs/common';
import { Specialty } from '../../../domain/entities/specialty.entity';
import { ISpecialtyRepository, SPECIALTY_REPOSITORY } from '../../../domain/repositories/specialty.repository';
import { CreateSpecialtyDto } from '../../dtos/create-specialty.dto';
import { SpecialtyResponseDto } from '../../dtos/specialty-response.dto';

/**
 * Creates a new medical specialty.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-20
 */
@Injectable()
export class CreateSpecialtyUseCase {
  constructor(
    @Inject(SPECIALTY_REPOSITORY) private readonly specialtyRepository: ISpecialtyRepository,
  ) {}

  async execute(dto: CreateSpecialtyDto): Promise<SpecialtyResponseDto> {
    const specialty = Specialty.create(dto);
    const saved = await this.specialtyRepository.save(specialty);
    return SpecialtyResponseDto.fromDomain(saved);
  }
}
