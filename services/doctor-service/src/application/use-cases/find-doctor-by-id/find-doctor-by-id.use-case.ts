import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DOCTOR_REPOSITORY, IDoctorRepository } from '../../../domain/repositories/doctor.repository';
import { DoctorResponseDto } from '../../dtos/doctor-response.dto';

/**
 * Retrieves a single doctor by UUID. Throws 404 if not found.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-20
 */
@Injectable()
export class FindDoctorByIdUseCase {
  constructor(
    @Inject(DOCTOR_REPOSITORY) private readonly doctorRepository: IDoctorRepository,
  ) {}

  async execute(id: string): Promise<DoctorResponseDto> {
    const doctor = await this.doctorRepository.findById(id);
    if (!doctor) {
      throw new NotFoundException(`Doctor with id "${id}" not found`);
    }
    return DoctorResponseDto.fromDomain(doctor);
  }
}
