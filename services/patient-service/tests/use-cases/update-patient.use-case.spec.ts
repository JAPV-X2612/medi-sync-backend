import { NotFoundException } from '@nestjs/common';
import { UpdatePatientUseCase } from '../../src/application/use-cases/update-patient/update-patient.use-case';
import { IPatientRepository } from '../../src/domain/repositories/patient.repository';
import { UpdatePatientDto } from '../../src/application/dtos/update-patient.dto';
import { DocumentType, Patient } from '../../src/domain/entities/patient.entity';

/**
 * Unit tests for UpdatePatientUseCase.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-24
 */
describe('UpdatePatientUseCase', () => {
  let useCase: UpdatePatientUseCase;
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
    useCase = new UpdatePatientUseCase(mockRepo as any);
  });

  it('should update patient fields and return the updated DTO', async () => {
    // Arrange
    mockRepo.findById.mockResolvedValue(patient);
    mockRepo.update.mockImplementation(async (p) => p);
    const dto = { firstName: 'Jane', bloodType: 'A+' } as UpdatePatientDto;

    // Act
    const result = await useCase.execute(patient.id, dto);

    // Assert
    expect(result.firstName).toBe('Jane');
    expect(result.bloodType).toBe('A+');
    expect(mockRepo.update).toHaveBeenCalledTimes(1);
  });

  it('should throw NotFoundException when patient does not exist', async () => {
    // Arrange
    mockRepo.findById.mockResolvedValue(null);
    const dto = { firstName: 'Jane' } as UpdatePatientDto;

    // Act & Assert
    await expect(useCase.execute('missing-id', dto)).rejects.toThrow(NotFoundException);
    expect(mockRepo.update).not.toHaveBeenCalled();
  });
});
