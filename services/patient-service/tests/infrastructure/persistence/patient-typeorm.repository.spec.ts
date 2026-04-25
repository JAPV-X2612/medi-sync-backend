import { PatientTypeOrmRepository } from '../../../src/infrastructure/persistence/patient-typeorm.repository';
import { DocumentType } from '../../../src/domain/entities/patient.entity';

/**
 * Unit tests for PatientTypeOrmRepository adapter.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-25
 */
describe('PatientTypeOrmRepository', () => {
  let repo: PatientTypeOrmRepository;
  let mockOrmRepo: {
    save: jest.Mock;
    findOne: jest.Mock;
    find: jest.Mock;
    delete: jest.Mock;
    existsBy: jest.Mock;
  };

  const ormPatient = {
    id: 'pat-001',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    birthDate: new Date('1990-01-15'),
    bloodType: 'O+',
    documentNumber: '123456789',
    documentType: DocumentType.CC,
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
    repo = new PatientTypeOrmRepository(mockOrmRepo as any);
  });

  describe('save', () => {
    it('should persist and return domain Patient', async () => {
      // Arrange
      mockOrmRepo.save.mockResolvedValue(ormPatient);

      // Act
      const result = await repo.save({
        toPrimitives: () => ormPatient,
      } as any);

      // Assert
      expect(mockOrmRepo.save).toHaveBeenCalled();
      expect(result.id).toBe('pat-001');
    });
  });

  describe('findById', () => {
    it('should return null when patient not found', async () => {
      // Arrange
      mockOrmRepo.findOne.mockResolvedValue(null);

      // Act
      const result = await repo.findById('missing-id');

      // Assert
      expect(result).toBeNull();
    });

    it('should return domain Patient when found', async () => {
      // Arrange
      mockOrmRepo.findOne.mockResolvedValue(ormPatient);

      // Act
      const result = await repo.findById('pat-001');

      // Assert
      expect(result).not.toBeNull();
      expect(result!.id).toBe('pat-001');
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

    it('should return domain Patient when email found', async () => {
      // Arrange
      mockOrmRepo.findOne.mockResolvedValue(ormPatient);

      // Act
      const result = await repo.findByEmail('john@example.com');

      // Assert
      expect(result).not.toBeNull();
      expect(result!.email.value).toBe('john@example.com');
    });
  });

  describe('findAll', () => {
    it('should return array of domain patients', async () => {
      // Arrange
      mockOrmRepo.find.mockResolvedValue([ormPatient]);

      // Act
      const result = await repo.findAll();

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('pat-001');
    });

    it('should return empty array when no patients exist', async () => {
      // Arrange
      mockOrmRepo.find.mockResolvedValue([]);

      // Act
      const result = await repo.findAll();

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('update', () => {
    it('should update and return domain Patient', async () => {
      // Arrange
      mockOrmRepo.save.mockResolvedValue(ormPatient);

      // Act
      const result = await repo.update({
        toPrimitives: () => ormPatient,
      } as any);

      // Assert
      expect(mockOrmRepo.save).toHaveBeenCalled();
      expect(result.id).toBe('pat-001');
    });
  });

  describe('delete', () => {
    it('should call ormRepository.delete with given id', async () => {
      // Arrange
      mockOrmRepo.delete.mockResolvedValue({ affected: 1 });

      // Act
      await repo.delete('pat-001');

      // Assert
      expect(mockOrmRepo.delete).toHaveBeenCalledWith('pat-001');
    });
  });

  describe('existsById', () => {
    it('should return true when patient exists', async () => {
      // Arrange
      mockOrmRepo.existsBy.mockResolvedValue(true);

      // Act
      const result = await repo.existsById('pat-001');

      // Assert
      expect(result).toBe(true);
    });

    it('should return false when patient does not exist', async () => {
      // Arrange
      mockOrmRepo.existsBy.mockResolvedValue(false);

      // Act
      const result = await repo.existsById('missing-id');

      // Assert
      expect(result).toBe(false);
    });
  });
});