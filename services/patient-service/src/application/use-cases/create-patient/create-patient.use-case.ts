import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { Patient } from '../../../domain/entities/patient.entity';
import {
  PATIENT_REGISTERED_ROUTING_KEY,
  PatientRegisteredEvent,
} from '../../../domain/events/patient-registered.event';
import {
  IPatientRepository,
  PATIENT_REPOSITORY,
} from '../../../domain/repositories/patient.repository';
import { CreatePatientDto } from '../../dtos/create-patient.dto';
import { PatientResponseDto } from '../../dtos/patient-response.dto';
import { EVENT_PUBLISHER, IEventPublisher } from '../../ports/event-publisher.port';

/**
 * Creates a new patient profile and publishes a PatientRegistered domain event.
 * Rejects duplicate email addresses with a 409 Conflict.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-20
 */
@Injectable()
export class CreatePatientUseCase {
  constructor(
    @Inject(PATIENT_REPOSITORY)
    private readonly patientRepository: IPatientRepository,
    @Inject(EVENT_PUBLISHER)
    private readonly eventPublisher: IEventPublisher,
  ) {}

  async execute(dto: CreatePatientDto): Promise<PatientResponseDto> {
    const existing = await this.patientRepository.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException(`A patient with email "${dto.email}" already exists`);
    }

    const patient = Patient.create({
      ...dto,
      birthDate: new Date(dto.birthDate),
    });

    const saved = await this.patientRepository.save(patient);

    const event: PatientRegisteredEvent = {
      patientId: saved.id,
      name: saved.fullName,
      email: saved.email.value,
      phone: saved.phone.value,
      createdAt: saved.createdAt,
    };
    this.eventPublisher.publish(PATIENT_REGISTERED_ROUTING_KEY, event);

    return PatientResponseDto.fromDomain(saved);
  }
}
