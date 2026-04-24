import { FindAllDoctorsUseCase } from '../../src/application/use-cases/find-all-doctors/find-all-doctors.use-case';
import { IDoctorRepository } from '../../src/domain/repositories/doctor.repository';
import { Doctor } from '../../src/domain/entities/doctor.entity';

/**
 * Unit tests for FindAllDoctorsUseCase.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-24
 */
describe('FindAllDoctorsUseCase', () => {
  let useCase: FindAllDoctorsUseCase;
  let mockRepo: jest.Mocked<IDoctorRepository>;

  const baseProps = {
    firstName: 'Ana',
    lastName: 'García',
    email: 'ana.garcia@hospital.com',
    phone: '+573009876543',
    licenseNumber: 'LIC001',
    specialtyId: 'spec-uuid-001',
  };

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
    useCase = new FindAllDoctorsUseCase(mockRepo as any);
  });

  it('should return an array of DoctorResponseDto for all doctors', async () => {
    // Arrange
    const doctors = [
      Doctor.create({ ...baseProps, email: 'doctor1@hospital.com', licenseNumber: 'LIC001' }),
      Doctor.create({ ...baseProps, email: 'doctor2@hospital.com', licenseNumber: 'LIC002' }),
    ];
    mockRepo.findAll.mockResolvedValue(doctors);

    // Act
    const result = await useCase.execute();

    // Assert
    expect(result).toHaveLength(2);
    expect(result[0].licenseNumber).toBe('LIC001');
    expect(result[1].licenseNumber).toBe('LIC002');
  });

  it('should return an empty array when no doctors exist', async () => {
    // Arrange
    mockRepo.findAll.mockResolvedValue([]);

    // Act
    const result = await useCase.execute();

    // Assert
    expect(result).toEqual([]);
  });
});
