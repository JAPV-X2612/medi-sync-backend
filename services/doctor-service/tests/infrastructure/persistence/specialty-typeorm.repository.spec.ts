import { SpecialtyTypeOrmRepository } from '../../../src/infrastructure/persistence/specialty-typeorm.repository';

/**
 * Unit tests for SpecialtyTypeOrmRepository adapter.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-24
 */
describe('SpecialtyTypeOrmRepository', () => {
  let repo: SpecialtyTypeOrmRepository;
  let mockOrmRepo: {
    save: jest.Mock;
    findOne: jest.Mock;
    find: jest.Mock;
    existsBy: jest.Mock;
  };

  const ormSpecialty = {
    id: 'spec-001',
    name: 'Cardiology',
    description: 'Heart specialist',
  };

  beforeEach(() => {
    mockOrmRepo = {
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      existsBy: jest.fn(),
    };
    repo = new SpecialtyTypeOrmRepository(mockOrmRepo as any);
  });

  describe('findById', () => {
    it('should return null when specialty not found', async () => {
      // Arrange
      mockOrmRepo.findOne.mockResolvedValue(null);

      // Act
      const result = await repo.findById('missing-id');

      // Assert
      expect(result).toBeNull();
    });

    it('should return Specialty domain object when found', async () => {
      // Arrange
      mockOrmRepo.findOne.mockResolvedValue(ormSpecialty);

      // Act
      const result = await repo.findById('spec-001');

      // Assert
      expect(result).not.toBeNull();
      expect(result!.id).toBe('spec-001');
      expect(result!.name).toBe('Cardiology');
    });
  });
});
