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
import { CreatePatientDto } from '../../application/dtos/create-patient.dto';
import { PatientResponseDto } from '../../application/dtos/patient-response.dto';
import { UpdatePatientDto } from '../../application/dtos/update-patient.dto';
import { CreatePatientUseCase } from '../../application/use-cases/create-patient/create-patient.use-case';
import { DeletePatientUseCase } from '../../application/use-cases/delete-patient/delete-patient.use-case';
import { FindAllPatientsUseCase } from '../../application/use-cases/find-all-patients/find-all-patients.use-case';
import { FindPatientByIdUseCase } from '../../application/use-cases/find-patient-by-id/find-patient-by-id.use-case';
import { UpdatePatientUseCase } from '../../application/use-cases/update-patient/update-patient.use-case';

/**
 * REST controller exposing the patient management endpoints.
 * Delegates all business logic to the corresponding use cases.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-20
 */
@Controller('patients')
export class PatientsController {
  constructor(
    private readonly createPatient: CreatePatientUseCase,
    private readonly findPatientById: FindPatientByIdUseCase,
    private readonly findAllPatients: FindAllPatientsUseCase,
    private readonly updatePatient: UpdatePatientUseCase,
    private readonly deletePatient: DeletePatientUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreatePatientDto): Promise<PatientResponseDto> {
    return this.createPatient.execute(dto);
  }

  @Get()
  findAll(): Promise<PatientResponseDto[]> {
    return this.findAllPatients.execute();
  }

  @Get(':id')
  findById(@Param('id') id: string): Promise<PatientResponseDto> {
    return this.findPatientById.execute(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdatePatientDto,
  ): Promise<PatientResponseDto> {
    return this.updatePatient.execute(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): Promise<void> {
    return this.deletePatient.execute(id);
  }
}
