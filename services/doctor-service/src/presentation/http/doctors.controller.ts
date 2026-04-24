import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateDoctorDto } from '../../application/dtos/create-doctor.dto';
import { DoctorResponseDto } from '../../application/dtos/doctor-response.dto';
import { ScheduleResponseDto } from '../../application/dtos/schedule-response.dto';
import { UpdateDoctorDto } from '../../application/dtos/update-doctor.dto';
import { CreateDoctorUseCase } from '../../application/use-cases/create-doctor/create-doctor.use-case';
import { DeleteDoctorUseCase } from '../../application/use-cases/delete-doctor/delete-doctor.use-case';
import { FindAllDoctorsUseCase } from '../../application/use-cases/find-all-doctors/find-all-doctors.use-case';
import { FindDoctorByIdUseCase } from '../../application/use-cases/find-doctor-by-id/find-doctor-by-id.use-case';
import { FindDoctorsBySpecialtyUseCase } from '../../application/use-cases/find-doctors-by-specialty/find-doctors-by-specialty.use-case';
import { FindSchedulesByDoctorUseCase } from '../../application/use-cases/find-schedules-by-doctor/find-schedules-by-doctor.use-case';
import { UpdateDoctorUseCase } from '../../application/use-cases/update-doctor/update-doctor.use-case';

/**
 * REST controller for doctor profile management.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-20
 */
@Controller('doctors')
export class DoctorsController {
  constructor(
    private readonly createDoctor: CreateDoctorUseCase,
    private readonly findDoctorById: FindDoctorByIdUseCase,
    private readonly findAllDoctors: FindAllDoctorsUseCase,
    private readonly findDoctorsBySpecialty: FindDoctorsBySpecialtyUseCase,
    private readonly updateDoctor: UpdateDoctorUseCase,
    private readonly deleteDoctor: DeleteDoctorUseCase,
    private readonly findSchedulesByDoctor: FindSchedulesByDoctorUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateDoctorDto): Promise<DoctorResponseDto> {
    return this.createDoctor.execute(dto);
  }

  @Get()
  findAll(): Promise<DoctorResponseDto[]> {
    return this.findAllDoctors.execute();
  }

  @Get('specialty/:specialtyId')
  findBySpecialty(@Param('specialtyId') specialtyId: string): Promise<DoctorResponseDto[]> {
    return this.findDoctorsBySpecialty.execute(specialtyId);
  }

  @Get(':id')
  findById(@Param('id') id: string): Promise<DoctorResponseDto> {
    return this.findDoctorById.execute(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateDoctorDto): Promise<DoctorResponseDto> {
    return this.updateDoctor.execute(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): Promise<void> {
    return this.deleteDoctor.execute(id);
  }

  @Get(':id/schedules')
  getSchedules(@Param('id') id: string): Promise<ScheduleResponseDto[]> {
    return this.findSchedulesByDoctor.execute(id);
  }
}
