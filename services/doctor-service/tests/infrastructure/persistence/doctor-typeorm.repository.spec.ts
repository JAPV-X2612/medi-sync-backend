import { DoctorTypeOrmRepository } from '../../../src/infrastructure/persistence/doctor-typeorm.repository';

/**
 * Unit tests for DoctorTypeOrmRepository adapter.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-24
 */
describe('DoctorTypeOrmRepository', () => {
  let repo: DoctorTypeOrmRepository;
  let mockOrmRepo: {
    save: jest.Mock;
    findOne: jest.Mock;
    find: jest.Mock;
    delete: jest.Mock;
    existsBy: jest.Mock;
  };

  const ormDoctor = {
    id: 'doc-001',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    licenseNumber: 'LIC-001',
    bio: null,
    specialtyId: 'spec-001',
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  };

  beforeEach(() => {
    mockOrmRepo = {
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      delete: jest.fn(),
      existsBy: jest.fn(),
    };
    repo = new DoctorTypeOrmRepository(mockOrmRepo as any);
  });

  describe('findById', () => {
    it('should return null when doctor not found', async () => {
      // Arrange
      mockOrmRepo.findOne.mockResolvedValue(null);

      // Act
      const result = await repo.findById('missing-id');

      // Assert
      expect(result).toBeNull();
    });

    it('should return Doctor domain object when found', async () => {
      // Arrange
      mockOrmRepo.findOne.mockResolvedValue(ormDoctor);

      // Act
      const result = await repo.findById('doc-001');

      // Assert
      expect(result).not.toBeNull();
      expect(result!.id).toBe('doc-001');
      expect(result!.firstName).toBe('John');
    });
  });

  describe('findByEmail', () => {
    it('should return null when email not found', async () => {
      // Arrange
      mockOrmRepo.findOne.mockResolvedValue(null);

      // Act
      const result = await repo.findByEmail('notfound@example.com');

      // Assert
      expect(result).toBeNull();
    });

    it('should return Doctor domain object when email found', async () => {
      // Arrange
      mockOrmRepo.findOne.mockResolvedValue(ormDoctor);

      // Act
      const result = await repo.findByEmail('john@example.com');

      // Assert
      expect(result).not.toBeNull();
      expect(result!.email.value).toBe('john@example.com');
    });
  });
});
