import { ConflictException, NotFoundException } from '@nestjs/common';
import { CreateDoctorUseCase } from '../../src/application/use-cases/create-doctor/create-doctor.use-case';
import { IDoctorRepository } from '../../src/domain/repositories/doctor.repository';
import { ISpecialtyRepository } from '../../src/domain/repositories/specialty.repository';
import { IEventPublisher } from '../../src/application/ports/event-publisher.port';
import { CreateDoctorDto } from '../../src/application/dtos/create-doctor.dto';
import { Doctor } from '../../src/domain/entities/doctor.entity';
import { Specialty } from '../../src/domain/entities/specialty.entity';
import { DOCTOR_PROFILE_CREATED_ROUTING_KEY } from '../../src/domain/events/doctor-profile-created.event';

/**
 * Unit tests for CreateDoctorUseCase.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-24
 */
describe('CreateDoctorUseCase', () => {
  let useCase: CreateDoctorUseCase;
  let mockDoctorRepo: jest.Mocked<IDoctorRepository>;
  let mockSpecialtyRepo: jest.Mocked<ISpecialtyRepository>;
  let mockPublisher: jest.Mocked<IEventPublisher>;

  const validDto = {
    firstName: 'Ana',
    lastName: 'García',
    email: 'ana.garcia@hospital.com',
    phone: '+573009876543',
    licenseNumber: 'LIC001',
    specialtyId: 'spec-uuid-001',
  } as CreateDoctorDto;

  const cardiology = Specialty.create({ name: 'Cardiology' });

  beforeEach(() => {
    mockDoctorRepo = {
      save: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findAll: jest.fn(),
      findBySpecialtyId: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      existsById: jest.fn(),
    };
    mockSpecialtyRepo = {
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      existsById: jest.fn(),
    };
    mockPublisher = { publish: jest.fn() };
    useCase = new CreateDoctorUseCase(
      mockDoctorRepo as any,
      mockSpecialtyRepo as any,
      mockPublisher as any,
    );
  });

  it('should create doctor, publish event, and return DoctorResponseDto', async () => {
    // Arrange
    mockSpecialtyRepo.existsById.mockResolvedValue(true);
    mockDoctorRepo.findByEmail.mockResolvedValue(null);
    mockDoctorRepo.save.mockImplementation(async (d) => d);
    mockSpecialtyRepo.findById.mockResolvedValue(cardiology);

    // Act
    const result = await useCase.execute(validDto);

    // Assert
    expect(result.licenseNumber).toBe('LIC001');
    expect(result.specialtyId).toBe('spec-uuid-001');
    expect(mockDoctorRepo.save).toHaveBeenCalledTimes(1);
    expect(mockPublisher.publish).toHaveBeenCalledWith(
      DOCTOR_PROFILE_CREATED_ROUTING_KEY,
      expect.objectContaining({ specialty: 'Cardiology' }),
    );
  });

  it('should throw NotFoundException when specialty does not exist', async () => {
    // Arrange
    mockSpecialtyRepo.existsById.mockResolvedValue(false);

    // Act & Assert
    await expect(useCase.execute(validDto)).rejects.toThrow(NotFoundException);
    expect(mockDoctorRepo.save).not.toHaveBeenCalled();
  });

  it('should throw ConflictException when email is already registered', async () => {
    // Arrange
    mockSpecialtyRepo.existsById.mockResolvedValue(true);
    const existing = Doctor.create({ ...validDto, documentNumber: undefined as any });
    mockDoctorRepo.findByEmail.mockResolvedValue(existing);

    // Act & Assert
    await expect(useCase.execute(validDto)).rejects.toThrow(ConflictException);
    expect(mockDoctorRepo.save).not.toHaveBeenCalled();
  });

  it('should use empty string for specialty name when specialty not found after save', async () => {
    // Arrange
    mockSpecialtyRepo.existsById.mockResolvedValue(true);
    mockDoctorRepo.findByEmail.mockResolvedValue(null);
    mockDoctorRepo.save.mockImplementation(async (d) => d);
    mockSpecialtyRepo.findById.mockResolvedValue(null);

    // Act
    await useCase.execute(validDto);

    // Assert
    const [, payload] = (mockPublisher.publish as jest.Mock).mock.calls[0];
    expect((payload as any).specialty).toBe('');
  });
});
