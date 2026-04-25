import { NotFoundException } from '@nestjs/common';
import { DeletePatientUseCase } from '../../src/application/use-cases/delete-patient/delete-patient.use-case';
import { IPatientRepository } from '../../src/domain/repositories/patient.repository';

/**
 * Unit tests for DeletePatientUseCase.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-24
 */
describe('DeletePatientUseCase', () => {
  let useCase: DeletePatientUseCase;
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
    useCase = new DeletePatientUseCase(mockRepo as any);
  });

  it('should call repository delete with the given id when patient exists', async () => {
    // Arrange
    const id = 'patient-uuid-001';
    mockRepo.existsById.mockResolvedValue(true);
    mockRepo.delete.mockResolvedValue(undefined);

    // Act
    await useCase.execute(id);

    // Assert
    expect(mockRepo.existsById).toHaveBeenCalledWith(id);
    expect(mockRepo.delete).toHaveBeenCalledWith(id);
  });

  it('should throw NotFoundException when patient does not exist', async () => {
    // Arrange
    const id = 'non-existent-id';
    mockRepo.existsById.mockResolvedValue(false);

    // Act & Assert
    await expect(useCase.execute(id)).rejects.toThrow(NotFoundException);
    await expect(useCase.execute(id)).rejects.toThrow(`Patient with id "${id}" not found`);
    expect(mockRepo.delete).not.toHaveBeenCalled();
  });
});
