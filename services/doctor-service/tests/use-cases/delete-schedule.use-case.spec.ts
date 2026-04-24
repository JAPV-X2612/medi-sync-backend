import { NotFoundException } from '@nestjs/common';
import { DeleteScheduleUseCase } from '../../src/application/use-cases/delete-schedule/delete-schedule.use-case';
import { IScheduleRepository } from '../../src/domain/repositories/schedule.repository';

/**
 * Unit tests for DeleteScheduleUseCase.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-24
 */
describe('DeleteScheduleUseCase', () => {
  let useCase: DeleteScheduleUseCase;
  let mockRepo: jest.Mocked<IScheduleRepository>;

  beforeEach(() => {
    mockRepo = {
      save: jest.fn(),
      findById: jest.fn(),
      findByDoctorId: jest.fn(),
      delete: jest.fn(),
      existsById: jest.fn(),
    };
    useCase = new DeleteScheduleUseCase(mockRepo as any);
  });

  it('should call repository delete when schedule exists', async () => {
    // Arrange
    const id = 'sched-uuid-001';
    mockRepo.existsById.mockResolvedValue(true);
    mockRepo.delete.mockResolvedValue(undefined);

    // Act
    await useCase.execute(id);

    // Assert
    expect(mockRepo.existsById).toHaveBeenCalledWith(id);
    expect(mockRepo.delete).toHaveBeenCalledWith(id);
  });

  it('should throw NotFoundException when schedule does not exist', async () => {
    // Arrange
    const id = 'non-existent-id';
    mockRepo.existsById.mockResolvedValue(false);

    // Act & Assert
    await expect(useCase.execute(id)).rejects.toThrow(NotFoundException);
    await expect(useCase.execute(id)).rejects.toThrow(`Schedule with id "${id}" not found`);
    expect(mockRepo.delete).not.toHaveBeenCalled();
  });
});
