import { FindAllPatientsUseCase } from '../../src/application/use-cases/find-all-patients/find-all-patients.use-case';
import { IPatientRepository } from '../../src/domain/repositories/patient.repository';
import { DocumentType, Patient } from '../../src/domain/entities/patient.entity';

/**
 * Unit tests for FindAllPatientsUseCase.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-24
 */
describe('FindAllPatientsUseCase', () => {
  let useCase: FindAllPatientsUseCase;
  let mockRepo: jest.Mocked<IPatientRepository>;

  beforeEach(() => {
    mockRepo = {
      save: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      existsById: jest.fn(),
    };
    useCase = new FindAllPatientsUseCase(mockRepo as any);
  });

  it('should return an array of PatientResponseDto for all patients', async () => {
    // Arrange
    const patients = [
      Patient.create({
        firstName: 'Alice',
        lastName: 'Smith',
        email: 'alice@example.com',
        phone: '+573001111111',
        birthDate: new Date('1990-01-01'),
        documentType: DocumentType.CC,
        documentNumber: '11111111',
      }),
      Patient.create({
        firstName: 'Bob',
        lastName: 'Jones',
        email: 'bob@example.com',
        phone: '+573002222222',
        birthDate: new Date('1985-06-15'),
        documentType: DocumentType.TI,
        documentNumber: '22222222',
      }),
    ];
    mockRepo.findAll.mockResolvedValue(patients);

    // Act
    const result = await useCase.execute();

    // Assert
    expect(result).toHaveLength(2);
    expect(result[0].email).toBe('alice@example.com');
    expect(result[1].email).toBe('bob@example.com');
  });

  it('should return an empty array when no patients exist', async () => {
    // Arrange
    mockRepo.findAll.mockResolvedValue([]);

    // Act
    const result = await useCase.execute();

    // Assert
    expect(result).toEqual([]);
  });
});
