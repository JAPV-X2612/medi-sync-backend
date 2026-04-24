import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { CreateSpecialtyDto } from '../../application/dtos/create-specialty.dto';
import { SpecialtyResponseDto } from '../../application/dtos/specialty-response.dto';
import { CreateSpecialtyUseCase } from '../../application/use-cases/create-specialty/create-specialty.use-case';
import { FindAllSpecialtiesUseCase } from '../../application/use-cases/find-all-specialties/find-all-specialties.use-case';

/**
 * REST controller for medical specialty management.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-20
 */
@Controller('specialties')
export class SpecialtiesController {
  constructor(
    private readonly createSpecialty: CreateSpecialtyUseCase,
    private readonly findAllSpecialties: FindAllSpecialtiesUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateSpecialtyDto): Promise<SpecialtyResponseDto> {
    return this.createSpecialty.execute(dto);
  }

  @Get()
  findAll(): Promise<SpecialtyResponseDto[]> {
    return this.findAllSpecialties.execute();
  }
}
