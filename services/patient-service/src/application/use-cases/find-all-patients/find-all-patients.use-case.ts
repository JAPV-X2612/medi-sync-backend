import { Inject, Injectable } from '@nestjs/common';
import {
  IPatientRepository,
  PATIENT_REPOSITORY,
} from '../../../domain/repositories/patient.repository';
import { PatientResponseDto } from '../../dtos/patient-response.dto';

/**
 * Returns all registered patients ordered by creation date descending.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-20
 */
@Injectable()
export class FindAllPatientsUseCase {
  constructor(
    @Inject(PATIENT_REPOSITORY)
    private readonly patientRepository: IPatientRepository,
  ) {}

  async execute(): Promise<PatientResponseDto[]> {
    const patients = await this.patientRepository.findAll();
    return patients.map(PatientResponseDto.fromDomain);
  }
}
