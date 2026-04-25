import { NotFoundException } from '@nestjs/common';
import { DeleteDoctorUseCase } from '../../src/application/use-cases/delete-doctor/delete-doctor.use-case';
import { IDoctorRepository } from '../../src/domain/repositories/doctor.repository';

/**
 * Unit tests for DeleteDoctorUseCase.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-24
 */
describe('DeleteDoctorUseCase', () => {
  let useCase: DeleteDoctorUseCase;
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
    useCase = new DeleteDoctorUseCase(mockRepo as any);
  });

  it('should call repository delete with the given id when doctor exists', async () => {
    // Arrange
    const id = 'doc-uuid-001';
    mockRepo.existsById.mockResolvedValue(true);
    mockRepo.delete.mockResolvedValue(undefined);

    // Act
    await useCase.execute(id);

    // Assert
    expect(mockRepo.existsById).toHaveBeenCalledWith(id);
    expect(mockRepo.delete).toHaveBeenCalledWith(id);
  });

  it('should throw NotFoundException when doctor does not exist', async () => {
    // Arrange
    const id = 'non-existent-id';
    mockRepo.existsById.mockResolvedValue(false);

    // Act & Assert
    await expect(useCase.execute(id)).rejects.toThrow(NotFoundException);
    await expect(useCase.execute(id)).rejects.toThrow(`Doctor with id "${id}" not found`);
    expect(mockRepo.delete).not.toHaveBeenCalled();
  });
});
