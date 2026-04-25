import { FindAllSpecialtiesUseCase } from '../../src/application/use-cases/find-all-specialties/find-all-specialties.use-case';
import { ISpecialtyRepository } from '../../src/domain/repositories/specialty.repository';
import { Specialty } from '../../src/domain/entities/specialty.entity';

/**
 * Unit tests for FindAllSpecialtiesUseCase.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-24
 */
describe('FindAllSpecialtiesUseCase', () => {
  let useCase: FindAllSpecialtiesUseCase;
  let mockRepo: jest.Mocked<ISpecialtyRepository>;

  beforeEach(() => {
    mockRepo = {
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      existsById: jest.fn(),
    };
    useCase = new FindAllSpecialtiesUseCase(mockRepo as any);
  });

  it('should return an array of SpecialtyResponseDto for all specialties', async () => {
    // Arrange
    const specialties = [
      Specialty.create({ name: 'Cardiology', description: 'Heart specialist' }),
      Specialty.create({ name: 'Neurology', description: 'Brain and nervous system' }),
    ];
    mockRepo.findAll.mockResolvedValue(specialties);

    // Act
    const result = await useCase.execute();

    // Assert
    expect(result).toHaveLength(2);
    expect(result[0].name).toBe('Cardiology');
    expect(result[1].name).toBe('Neurology');
  });

  it('should return an empty array when no specialties exist', async () => {
    // Arrange
    mockRepo.findAll.mockResolvedValue([]);

    // Act
    const result = await useCase.execute();

    // Assert
    expect(result).toEqual([]);
  });
});
