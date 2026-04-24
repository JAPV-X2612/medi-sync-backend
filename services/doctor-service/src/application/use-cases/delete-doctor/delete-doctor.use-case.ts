import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DOCTOR_REPOSITORY, IDoctorRepository } from '../../../domain/repositories/doctor.repository';

/**
 * Deletes a doctor profile by UUID.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-20
 */
@Injectable()
export class DeleteDoctorUseCase {
  constructor(
    @Inject(DOCTOR_REPOSITORY) private readonly doctorRepository: IDoctorRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const exists = await this.doctorRepository.existsById(id);
    if (!exists) throw new NotFoundException(`Doctor with id "${id}" not found`);
    await this.doctorRepository.delete(id);
  }
}
