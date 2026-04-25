import { FindDoctorsBySpecialtyUseCase } from '../../src/application/use-cases/find-doctors-by-specialty/find-doctors-by-specialty.use-case';
import { IDoctorRepository } from '../../src/domain/repositories/doctor.repository';
import { Doctor } from '../../src/domain/entities/doctor.entity';

/**
 * Unit tests for FindDoctorsBySpecialtyUseCase.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-24
 */
describe('FindDoctorsBySpecialtyUseCase', () => {
  let useCase: FindDoctorsBySpecialtyUseCase;
  let mockRepo: jest.Mocked<IDoctorRepository>;

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
    useCase = new FindDoctorsBySpecialtyUseCase(mockRepo as any);
  });

  it('should return doctors filtered by specialtyId', async () => {
    // Arrange
    const specialtyId = 'spec-uuid-001';
    const doctors = [
      Doctor.create({
        firstName: 'Ana',
        lastName: 'García',
        email: 'ana@hospital.com',
        phone: '+573009876543',
        licenseNumber: 'LIC001',
        specialtyId,
      }),
    ];
    mockRepo.findBySpecialtyId.mockResolvedValue(doctors);

    // Act
    const result = await useCase.execute(specialtyId);

    // Assert
    expect(result).toHaveLength(1);
    expect(result[0].specialtyId).toBe(specialtyId);
    expect(mockRepo.findBySpecialtyId).toHaveBeenCalledWith(specialtyId);
  });

  it('should return an empty array when no doctors match the specialty', async () => {
    // Arrange
    mockRepo.findBySpecialtyId.mockResolvedValue([]);

    // Act
    const result = await useCase.execute('spec-no-match');

    // Assert
    expect(result).toEqual([]);
  });
});
