import { FindSchedulesByDoctorUseCase } from '../../src/application/use-cases/find-schedules-by-doctor/find-schedules-by-doctor.use-case';
import { IScheduleRepository } from '../../src/domain/repositories/schedule.repository';
import { Schedule } from '../../src/domain/entities/schedule.entity';

/**
 * Unit tests for FindSchedulesByDoctorUseCase.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-24
 */
describe('FindSchedulesByDoctorUseCase', () => {
  let useCase: FindSchedulesByDoctorUseCase;
  let mockRepo: jest.Mocked<IScheduleRepository>;

  beforeEach(() => {
    mockRepo = {
      save: jest.fn(),
      findById: jest.fn(),
      findByDoctorId: jest.fn(),
      delete: jest.fn(),
      existsById: jest.fn(),
    };
    useCase = new FindSchedulesByDoctorUseCase(mockRepo as any);
  });

  it('should return ScheduleResponseDto array for the given doctor', async () => {
    // Arrange
    const doctorId = 'doc-uuid-001';
    const schedules = [
      Schedule.create({ doctorId, dayOfWeek: 1, startTime: '08:00', endTime: '12:00', slotDurationMin: 30 }),
      Schedule.create({ doctorId, dayOfWeek: 3, startTime: '14:00', endTime: '18:00', slotDurationMin: 60 }),
    ];
    mockRepo.findByDoctorId.mockResolvedValue(schedules);

    // Act
    const result = await useCase.execute(doctorId);

    // Assert
    expect(result).toHaveLength(2);
    expect(result[0].dayOfWeek).toBe(1);
    expect(result[1].dayOfWeek).toBe(3);
    expect(mockRepo.findByDoctorId).toHaveBeenCalledWith(doctorId);
  });

  it('should return an empty array when doctor has no schedules', async () => {
    // Arrange
    mockRepo.findByDoctorId.mockResolvedValue([]);

    // Act
    const result = await useCase.execute('doc-no-schedules');

    // Assert
    expect(result).toEqual([]);
  });
});
