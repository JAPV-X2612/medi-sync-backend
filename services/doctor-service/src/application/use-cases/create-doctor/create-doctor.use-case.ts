import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Doctor } from '../../../domain/entities/doctor.entity';
import {
  DOCTOR_PROFILE_CREATED_ROUTING_KEY,
  DoctorProfileCreatedEvent,
} from '../../../domain/events/doctor-profile-created.event';
import { DOCTOR_REPOSITORY, IDoctorRepository } from '../../../domain/repositories/doctor.repository';
import { ISpecialtyRepository, SPECIALTY_REPOSITORY } from '../../../domain/repositories/specialty.repository';
import { CreateDoctorDto } from '../../dtos/create-doctor.dto';
import { DoctorResponseDto } from '../../dtos/doctor-response.dto';
import { EVENT_PUBLISHER, IEventPublisher } from '../../ports/event-publisher.port';

/**
 * Creates a new doctor profile and publishes a DoctorProfileCreated domain event.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-20
 */
@Injectable()
export class CreateDoctorUseCase {
  constructor(
    @Inject(DOCTOR_REPOSITORY) private readonly doctorRepository: IDoctorRepository,
    @Inject(SPECIALTY_REPOSITORY) private readonly specialtyRepository: ISpecialtyRepository,
    @Inject(EVENT_PUBLISHER) private readonly eventPublisher: IEventPublisher,
  ) {}

  async execute(dto: CreateDoctorDto): Promise<DoctorResponseDto> {
    const specialtyExists = await this.specialtyRepository.existsById(dto.specialtyId);
    if (!specialtyExists) {
      throw new NotFoundException(`Specialty with id "${dto.specialtyId}" not found`);
    }

    const existing = await this.doctorRepository.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException(`A doctor with email "${dto.email}" already exists`);
    }

    const doctor = Doctor.create(dto);
    const saved = await this.doctorRepository.save(doctor);

    const specialty = await this.specialtyRepository.findById(saved.specialtyId);
    const event: DoctorProfileCreatedEvent = {
      doctorId: saved.id,
      name: saved.fullName,
      specialty: specialty?.name ?? '',
      createdAt: saved.createdAt,
    };
    this.eventPublisher.publish(DOCTOR_PROFILE_CREATED_ROUTING_KEY, event);

    return DoctorResponseDto.fromDomain(saved);
  }
}
