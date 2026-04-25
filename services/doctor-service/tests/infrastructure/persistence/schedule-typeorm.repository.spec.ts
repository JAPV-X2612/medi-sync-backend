import { ScheduleTypeOrmRepository } from '../../../src/infrastructure/persistence/schedule-typeorm.repository';

/**
 * Unit tests for ScheduleTypeOrmRepository adapter.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-24
 */
describe('ScheduleTypeOrmRepository', () => {
  let repo: ScheduleTypeOrmRepository;
  let mockOrmRepo: {
    save: jest.Mock;
    findOne: jest.Mock;
    find: jest.Mock;
    delete: jest.Mock;
    existsBy: jest.Mock;
  };

  const ormSchedule = {
    id: 'sched-001',
    doctorId: 'doc-001',
    dayOfWeek: 1,
    startTime: '08:00',
    endTime: '12:00',
    slotDurationMin: 30,
  };

  beforeEach(() => {
    mockOrmRepo = {
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      delete: jest.fn(),
      existsBy: jest.fn(),
    };
    repo = new ScheduleTypeOrmRepository(mockOrmRepo as any);
  });

  describe('findById', () => {
    it('should return null when schedule not found', async () => {
      // Arrange
      mockOrmRepo.findOne.mockResolvedValue(null);

      // Act
      const result = await repo.findById('missing-id');

      // Assert
      expect(result).toBeNull();
    });

    it('should return Schedule domain object when found', async () => {
      // Arrange
      mockOrmRepo.findOne.mockResolvedValue(ormSchedule);

      // Act
      const result = await repo.findById('sched-001');

      // Assert
      expect(result).not.toBeNull();
      expect(result!.id).toBe('sched-001');
      expect(result!.dayOfWeek).toBe(1);
    });
  });
});
