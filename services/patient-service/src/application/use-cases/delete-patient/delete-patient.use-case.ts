import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  IPatientRepository,
  PATIENT_REPOSITORY,
} from '../../../domain/repositories/patient.repository';

/**
 * Deletes a patient by UUID. Throws 404 if not found.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-20
 */
@Injectable()
export class DeletePatientUseCase {
  constructor(
    @Inject(PATIENT_REPOSITORY)
    private readonly patientRepository: IPatientRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const exists = await this.patientRepository.existsById(id);
    if (!exists) {
      throw new NotFoundException(`Patient with id "${id}" not found`);
    }
    await this.patientRepository.delete(id);
  }
}
