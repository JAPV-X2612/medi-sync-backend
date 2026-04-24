import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  IPatientRepository,
  PATIENT_REPOSITORY,
} from '../../../domain/repositories/patient.repository';
import { PatientResponseDto } from '../../dtos/patient-response.dto';

/**
 * Retrieves a single patient by UUID. Throws 404 if not found.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-20
 */
@Injectable()
export class FindPatientByIdUseCase {
  constructor(
    @Inject(PATIENT_REPOSITORY)
    private readonly patientRepository: IPatientRepository,
  ) {}

  async execute(id: string): Promise<PatientResponseDto> {
    const patient = await this.patientRepository.findById(id);
    if (!patient) {
      throw new NotFoundException(`Patient with id "${id}" not found`);
    }
    return PatientResponseDto.fromDomain(patient);
  }
}
