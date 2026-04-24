import { NotFoundException } from '@nestjs/common';
import { FindDoctorByIdUseCase } from '../../src/application/use-cases/find-doctor-by-id/find-doctor-by-id.use-case';
import { IDoctorRepository } from '../../src/domain/repositories/doctor.repository';
import { Doctor } from '../../src/domain/entities/doctor.entity';

/**
 * Unit tests for FindDoctorByIdUseCase.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-24
 */
describe('FindDoctorByIdUseCase', () => {
  let useCase: FindDoctorByIdUseCase;
  let mockRepo: jest.Mocked<IDoctorRepository>;

  const doctor = Doctor.create({
    firstName: 'Ana',
    lastName: 'García',
    email: 'ana.garcia@hospital.com',
    phone: '+573009876543',
    licenseNumber: 'LIC001',
    specialtyId: 'spec-uuid-001',
  });

  beforeEach(() => {
    mockRepo = {
      save: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findAll: jest.fn(),
      findBySpecialtyId: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      existsById: jest.fn(),
    };
    useCase = new FindDoctorByIdUseCase(mockRepo as any);
  });

  it('should return a DoctorResponseDto when doctor is found', async () => {
    // Arrange
    mockRepo.findById.mockResolvedValue(doctor);

    // Act
    const result = await useCase.execute(doctor.id);

    // Assert
    expect(result.id).toBe(doctor.id);
    expect(result.licenseNumber).toBe('LIC001');
    expect(mockRepo.findById).toHaveBeenCalledWith(doctor.id);
  });

  it('should throw NotFoundException when doctor does not exist', async () => {
    // Arrange
    mockRepo.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(useCase.execute('missing-id')).rejects.toThrow(NotFoundException);
    await expect(useCase.execute('missing-id')).rejects.toThrow(
      'Doctor with id "missing-id" not found',
    );
  });
});
