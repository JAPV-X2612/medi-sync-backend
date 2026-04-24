import { Inject, Injectable } from '@nestjs/common';
import { DOCTOR_REPOSITORY, IDoctorRepository } from '../../../domain/repositories/doctor.repository';
import { DoctorResponseDto } from '../../dtos/doctor-response.dto';

/**
 * Returns all doctor profiles ordered by creation date descending.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-20
 */
@Injectable()
export class FindAllDoctorsUseCase {
  constructor(
    @Inject(DOCTOR_REPOSITORY) private readonly doctorRepository: IDoctorRepository,
  ) {}

  async execute(): Promise<DoctorResponseDto[]> {
    const doctors = await this.doctorRepository.findAll();
    return doctors.map(DoctorResponseDto.fromDomain);
  }
}
