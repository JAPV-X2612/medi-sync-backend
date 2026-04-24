import { NotFoundException } from '@nestjs/common';
import { FindPatientByIdUseCase } from '../../src/application/use-cases/find-patient-by-id/find-patient-by-id.use-case';
import { IPatientRepository } from '../../src/domain/repositories/patient.repository';
import { DocumentType, Patient } from '../../src/domain/entities/patient.entity';

/**
 * Unit tests for FindPatientByIdUseCase.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-24
 */
describe('FindPatientByIdUseCase', () => {
  let useCase: FindPatientByIdUseCase;
  let mockRepo: jest.Mocked<IPatientRepository>;

  const patient = Patient.create({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+573001234567',
    birthDate: new Date('1990-01-15'),
    documentType: DocumentType.CC,
    documentNumber: '12345678',
  });

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
    useCase = new FindPatientByIdUseCase(mockRepo as any);
  });

  it('should return a PatientResponseDto when the patient is found', async () => {
    // Arrange
    mockRepo.findById.mockResolvedValue(patient);

    // Act
    const result = await useCase.execute(patient.id);

    // Assert
    expect(result.id).toBe(patient.id);
    expect(result.email).toBe('john.doe@example.com');
    expect(mockRepo.findById).toHaveBeenCalledWith(patient.id);
  });

  it('should throw NotFoundException when patient does not exist', async () => {
    // Arrange
    mockRepo.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(useCase.execute('non-existent-id')).rejects.toThrow(NotFoundException);
    await expect(useCase.execute('non-existent-id')).rejects.toThrow(
      'Patient with id "non-existent-id" not found',
    );
  });
});
