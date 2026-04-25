import { Schedule, SchedulePrimitives } from '../../src/domain/entities/schedule.entity';

/**
 * Unit tests for the Schedule entity — validates dayOfWeek and slotDurationMin boundaries.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-24
 */
describe('Schedule', () => {
  const baseProps = {
    doctorId: 'doc-uuid-001',
    dayOfWeek: 1,
    startTime: '08:00',
    endTime: '17:00',
    slotDurationMin: 30,
  };

  describe('create', () => {
    it('should generate a UUID for valid props', () => {
      // Arrange / Act
      const schedule = Schedule.create(baseProps);

      // Assert
      expect(schedule.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
      expect(schedule.dayOfWeek).toBe(1);
      expect(schedule.slotDurationMin).toBe(30);
    });

    it('should accept Sunday (dayOfWeek = 0)', () => {
      // Arrange / Act
      const schedule = Schedule.create({ ...baseProps, dayOfWeek: 0 });

      // Assert
      expect(schedule.dayOfWeek).toBe(0);
    });

    it('should accept Saturday (dayOfWeek = 6)', () => {
      // Arrange / Act
      const schedule = Schedule.create({ ...baseProps, dayOfWeek: 6 });

      // Assert
      expect(schedule.dayOfWeek).toBe(6);
    });

    it('should accept minimum slot duration (5 minutes)', () => {
      // Arrange / Act
      const schedule = Schedule.create({ ...baseProps, slotDurationMin: 5 });

      // Assert
      expect(schedule.slotDurationMin).toBe(5);
    });

    it('should accept maximum slot duration (480 minutes)', () => {
      // Arrange / Act
      const schedule = Schedule.create({ ...baseProps, slotDurationMin: 480 });

      // Assert
      expect(schedule.slotDurationMin).toBe(480);
    });

    it('should throw when dayOfWeek is below 0', () => {
      // Arrange / Act / Assert
      expect(() => Schedule.create({ ...baseProps, dayOfWeek: -1 })).toThrow(
        'dayOfWeek must be between 0 (Sunday) and 6 (Saturday)',
      );
    });

    it('should throw when dayOfWeek is above 6', () => {
      // Arrange / Act / Assert
      expect(() => Schedule.create({ ...baseProps, dayOfWeek: 7 })).toThrow(
        'dayOfWeek must be between 0 (Sunday) and 6 (Saturday)',
      );
    });

    it('should throw when slotDurationMin is below 5', () => {
      // Arrange / Act / Assert
      expect(() => Schedule.create({ ...baseProps, slotDurationMin: 4 })).toThrow(
        'slotDurationMin must be between 5 and 480 minutes',
      );
    });

    it('should throw when slotDurationMin is above 480', () => {
      // Arrange / Act / Assert
      expect(() => Schedule.create({ ...baseProps, slotDurationMin: 481 })).toThrow(
        'slotDurationMin must be between 5 and 480 minutes',
      );
    });
  });

  describe('reconstitute', () => {
    it('should rebuild schedule from stored primitives without validation', () => {
      // Arrange
      const primitives: SchedulePrimitives = {
        id: 'sched-uuid-001',
        doctorId: 'doc-uuid-001',
        dayOfWeek: 3,
        startTime: '09:00',
        endTime: '18:00',
        slotDurationMin: 60,
      };

      // Act
      const schedule = Schedule.reconstitute(primitives);

      // Assert
      expect(schedule.id).toBe('sched-uuid-001');
      expect(schedule.dayOfWeek).toBe(3);
      expect(schedule.slotDurationMin).toBe(60);
    });
  });

  describe('toPrimitives', () => {
    it('should return a flat object with all schedule fields', () => {
      // Arrange
      const schedule = Schedule.create(baseProps);

      // Act
      const primitives = schedule.toPrimitives();

      // Assert
      expect(primitives.doctorId).toBe('doc-uuid-001');
      expect(primitives.startTime).toBe('08:00');
      expect(primitives.endTime).toBe('17:00');
    });
  });
});
