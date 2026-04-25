import { CreateSpecialtyUseCase } from '../../src/application/use-cases/create-specialty/create-specialty.use-case';
import { ISpecialtyRepository } from '../../src/domain/repositories/specialty.repository';
import { CreateSpecialtyDto } from '../../src/application/dtos/create-specialty.dto';
import { Specialty } from '../../src/domain/entities/specialty.entity';

/**
 * Unit tests for CreateSpecialtyUseCase.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-24
 */
describe('CreateSpecialtyUseCase', () => {
  let useCase: CreateSpecialtyUseCase;
  let mockRepo: jest.Mocked<ISpecialtyRepository>;

  beforeEach(() => {
    mockRepo = {
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      existsById: jest.fn(),
    };
    useCase = new CreateSpecialtyUseCase(mockRepo as any);
  });

  it('should create a specialty, save it, and return a SpecialtyResponseDto', async () => {
    // Arrange
    const dto = { name: 'Cardiology', description: 'Heart specialist' } as CreateSpecialtyDto;
    mockRepo.save.mockImplementation(async (s) => s);

    // Act
    const result = await useCase.execute(dto);

    // Assert
    expect(result.name).toBe('Cardiology');
    expect(result.description).toBe('Heart specialist');
    expect(mockRepo.save).toHaveBeenCalledTimes(1);
    expect(typeof result.id).toBe('string');
  });

  it('should set description to null when not provided in dto', async () => {
    // Arrange
    const dto = { name: 'Pediatrics' } as CreateSpecialtyDto;
    mockRepo.save.mockImplementation(async (s) => s);

    // Act
    const result = await useCase.execute(dto);

    // Assert
    expect(result.description).toBeNull();
  });

  it('should call repository save with a Specialty domain object', async () => {
    // Arrange
    const dto = { name: 'Neurology' } as CreateSpecialtyDto;
    mockRepo.save.mockImplementation(async (s) => s);

    // Act
    await useCase.execute(dto);

    // Assert
    const savedArg = (mockRepo.save as jest.Mock).mock.calls[0][0];
    expect(savedArg).toBeInstanceOf(Specialty);
  });
});
