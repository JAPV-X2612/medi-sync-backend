import { Inject, Injectable } from '@nestjs/common';
import { DOCTOR_REPOSITORY, IDoctorRepository } from '../../../domain/repositories/doctor.repository';
import { DoctorResponseDto } from '../../dtos/doctor-response.dto';

/**
 * Returns all doctors belonging to a given specialty.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-20
 */
@Injectable()
export class FindDoctorsBySpecialtyUseCase {
  constructor(
    @Inject(DOCTOR_REPOSITORY) private readonly doctorRepository: IDoctorRepository,
  ) {}

  async execute(specialtyId: string): Promise<DoctorResponseDto[]> {
    const doctors = await this.doctorRepository.findBySpecialtyId(specialtyId);
    return doctors.map(DoctorResponseDto.fromDomain);
  }
}
