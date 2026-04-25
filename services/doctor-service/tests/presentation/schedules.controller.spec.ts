import { SchedulesController } from '../../src/presentation/http/schedules.controller';

/**
 * Unit tests for SchedulesController.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-24
 */
describe('SchedulesController', () => {
  let controller: SchedulesController;

  const mockCreateSchedule = { execute: jest.fn() };
  const mockDeleteSchedule = { execute: jest.fn() };

  const scheduleResponse = {
    id: 'sched-001',
    doctorId: 'doc-001',
    dayOfWeek: 1,
    startTime: '08:00',
    endTime: '12:00',
    slotDurationMin: 30,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new SchedulesController(
      mockCreateSchedule as any,
      mockDeleteSchedule as any,
    );
  });

  it('should delegate create to CreateScheduleUseCase and return result', async () => {
    // Arrange
    const dto = {
      doctorId: 'doc-001',
      dayOfWeek: 1,
      startTime: '08:00',
      endTime: '12:00',
      slotDurationMin: 30,
    };
    mockCreateSchedule.execute.mockResolvedValue(scheduleResponse);

    // Act
    const result = await controller.create(dto as any);

    // Assert
    expect(mockCreateSchedule.execute).toHaveBeenCalledWith(dto);
    expect(result).toBe(scheduleResponse);
  });

  it('should delegate remove to DeleteScheduleUseCase and return undefined', async () => {
    // Arrange
    const id = 'sched-001';
    mockDeleteSchedule.execute.mockResolvedValue(undefined);

    // Act
    const result = await controller.remove(id);

    // Assert
    expect(mockDeleteSchedule.execute).toHaveBeenCalledWith(id);
    expect(result).toBeUndefined();
  });
});
