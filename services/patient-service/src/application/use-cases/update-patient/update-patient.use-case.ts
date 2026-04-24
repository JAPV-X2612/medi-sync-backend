import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  IPatientRepository,
  PATIENT_REPOSITORY,
} from '../../../domain/repositories/patient.repository';
import { PatientResponseDto } from '../../dtos/patient-response.dto';
import { UpdatePatientDto } from '../../dtos/update-patient.dto';

/**
 * Applies a partial update to an existing patient profile. Throws 404 if not found.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-20
 */
@Injectable()
export class UpdatePatientUseCase {
  constructor(
    @Inject(PATIENT_REPOSITORY)
    private readonly patientRepository: IPatientRepository,
  ) {}

  async execute(id: string, dto: UpdatePatientDto): Promise<PatientResponseDto> {
    const patient = await this.patientRepository.findById(id);
    if (!patient) {
      throw new NotFoundException(`Patient with id "${id}" not found`);
    }

    patient.update(dto);
    const updated = await this.patientRepository.update(patient);
    return PatientResponseDto.fromDomain(updated);
  }
}
