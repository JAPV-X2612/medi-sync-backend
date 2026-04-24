import { NotFoundException } from '@nestjs/common';
import { UpdateDoctorUseCase } from '../../src/application/use-cases/update-doctor/update-doctor.use-case';
import { IDoctorRepository } from '../../src/domain/repositories/doctor.repository';
import { UpdateDoctorDto } from '../../src/application/dtos/update-doctor.dto';
import { Doctor } from '../../src/domain/entities/doctor.entity';

/**
 * Unit tests for UpdateDoctorUseCase.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-24
 */
describe('UpdateDoctorUseCase', () => {
  let useCase: UpdateDoctorUseCase;
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
    useCase = new UpdateDoctorUseCase(mockRepo as any);
  });

  it('should update doctor fields and return updated DoctorResponseDto', async () => {
    // Arrange
    mockRepo.findById.mockResolvedValue(doctor);
    mockRepo.update.mockImplementation(async (d) => d);
    const dto = { firstName: 'Maria', bio: 'Experienced pediatrician' } as UpdateDoctorDto;

    // Act
    const result = await useCase.execute(doctor.id, dto);

    // Assert
    expect(result.firstName).toBe('Maria');
    expect(result.bio).toBe('Experienced pediatrician');
    expect(mockRepo.update).toHaveBeenCalledTimes(1);
  });

  it('should throw NotFoundException when doctor does not exist', async () => {
    // Arrange
    mockRepo.findById.mockResolvedValue(null);
    const dto = { firstName: 'Maria' } as UpdateDoctorDto;

    // Act & Assert
    await expect(useCase.execute('missing-id', dto)).rejects.toThrow(NotFoundException);
    expect(mockRepo.update).not.toHaveBeenCalled();
  });
});
