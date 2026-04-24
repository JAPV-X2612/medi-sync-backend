import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DOCTOR_REPOSITORY, IDoctorRepository } from '../../../domain/repositories/doctor.repository';
import { DoctorResponseDto } from '../../dtos/doctor-response.dto';
import { UpdateDoctorDto } from '../../dtos/update-doctor.dto';

/**
 * Applies a partial update to an existing doctor profile.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-20
 */
@Injectable()
export class UpdateDoctorUseCase {
  constructor(
    @Inject(DOCTOR_REPOSITORY) private readonly doctorRepository: IDoctorRepository,
  ) {}

  async execute(id: string, dto: UpdateDoctorDto): Promise<DoctorResponseDto> {
    const doctor = await this.doctorRepository.findById(id);
    if (!doctor) {
      throw new NotFoundException(`Doctor with id "${id}" not found`);
    }
    doctor.update(dto);
    const updated = await this.doctorRepository.update(doctor);
    return DoctorResponseDto.fromDomain(updated);
  }
}
