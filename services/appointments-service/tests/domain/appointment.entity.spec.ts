import {
  Appointment,
  AppointmentPrimitives,
  AppointmentStatus,
} from '../../src/domain/entities/appointment.entity';

/**
 * Unit tests for the Appointment aggregate root — covers all lifecycle transitions.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-24
 */
describe('Appointment', () => {
  const baseProps = {
    patientId: 'pat-uuid-001',
    patientName: 'John Doe',
    patientEmail: 'john.doe@example.com',
    doctorId: 'doc-uuid-001',
    doctorName: 'Ana García',
    appointmentTime: new Date('2026-05-10T10:00:00Z'),
    reason: '  Annual checkup  ',
  };

  describe('request', () => {
    it('should create appointment with PENDING status and trim reason', () => {
      // Arrange / Act
      const appt = Appointment.request(baseProps);

      // Assert
      expect(appt.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
      expect(appt.status).toBe(AppointmentStatus.PENDING);
      expect(appt.reason).toBe('Annual checkup');
    });

    it('should set scheduleId to null when not provided', () => {
      // Arrange / Act
      const appt = Appointment.request(baseProps);

      // Assert
      expect(appt.scheduleId).toBeNull();
    });

    it('should set scheduleId when provided', () => {
      // Arrange / Act
      const appt = Appointment.request({ ...baseProps, scheduleId: 'sched-001' });

      // Assert
      expect(appt.scheduleId).toBe('sched-001');
    });

    it('should set notes to null on creation', () => {
      // Arrange / Act
      const appt = Appointment.request(baseProps);

      // Assert
      expect(appt.notes).toBeNull();
    });
  });

  describe('reconstitute', () => {
    it('should rebuild appointment from stored primitives', () => {
      // Arrange
      const original = Appointment.request(baseProps);
      const primitives: AppointmentPrimitives = original.toPrimitives();

      // Act
      const reconstituted = Appointment.reconstitute(primitives);

      // Assert
      expect(reconstituted.id).toBe(original.id);
      expect(reconstituted.status).toBe(AppointmentStatus.PENDING);
      expect(reconstituted.patientId).toBe('pat-uuid-001');
    });
  });

  describe('confirm', () => {
    it('should transition PENDING to CONFIRMED', () => {
      // Arrange
      const appt = Appointment.request(baseProps);

      // Act
      appt.confirm();

      // Assert
      expect(appt.status).toBe(AppointmentStatus.CONFIRMED);
    });

    it('should throw when confirming a non-PENDING appointment', () => {
      // Arrange
      const appt = Appointment.request(baseProps);
      appt.confirm();

      // Act & Assert
      expect(() => appt.confirm()).toThrow(
        `Cannot confirm an appointment with status "${AppointmentStatus.CONFIRMED}"`,
      );
    });
  });

  describe('cancel', () => {
    it('should transition PENDING to CANCELLED', () => {
      // Arrange
      const appt = Appointment.request(baseProps);

      // Act
      appt.cancel();

      // Assert
      expect(appt.status).toBe(AppointmentStatus.CANCELLED);
    });

    it('should transition CONFIRMED to CANCELLED', () => {
      // Arrange
      const appt = Appointment.request(baseProps);
      appt.confirm();

      // Act
      appt.cancel();

      // Assert
      expect(appt.status).toBe(AppointmentStatus.CANCELLED);
    });

    it('should throw when already CANCELLED', () => {
      // Arrange
      const appt = Appointment.request(baseProps);
      appt.cancel();

      // Act & Assert
      expect(() => appt.cancel()).toThrow(
        `Cannot cancel an appointment with status "${AppointmentStatus.CANCELLED}"`,
      );
    });

    it('should throw when appointment is COMPLETED', () => {
      // Arrange
      const appt = Appointment.request(baseProps);
      appt.confirm();
      appt.complete();

      // Act & Assert
      expect(() => appt.cancel()).toThrow(
        `Cannot cancel an appointment with status "${AppointmentStatus.COMPLETED}"`,
      );
    });
  });

  describe('reschedule', () => {
    it('should update appointmentTime and set status to RESCHEDULED', () => {
      // Arrange
      const appt = Appointment.request(baseProps);
      const newTime = new Date('2026-05-15T14:00:00Z');

      // Act
      appt.reschedule(newTime);

      // Assert
      expect(appt.status).toBe(AppointmentStatus.RESCHEDULED);
      expect(appt.appointmentTime).toEqual(newTime);
    });

    it('should throw when rescheduling a CANCELLED appointment', () => {
      // Arrange
      const appt = Appointment.request(baseProps);
      appt.cancel();

      // Act & Assert
      expect(() => appt.reschedule(new Date())).toThrow(
        `Cannot reschedule an appointment with status "${AppointmentStatus.CANCELLED}"`,
      );
    });

    it('should throw when rescheduling a COMPLETED appointment', () => {
      // Arrange
      const appt = Appointment.request(baseProps);
      appt.confirm();
      appt.complete();

      // Act & Assert
      expect(() => appt.reschedule(new Date())).toThrow(
        `Cannot reschedule an appointment with status "${AppointmentStatus.COMPLETED}"`,
      );
    });
  });

  describe('complete', () => {
    it('should transition CONFIRMED to COMPLETED with optional notes', () => {
      // Arrange
      const appt = Appointment.request(baseProps);
      appt.confirm();

      // Act
      appt.complete('Patient showed improvement');

      // Assert
      expect(appt.status).toBe(AppointmentStatus.COMPLETED);
      expect(appt.notes).toBe('Patient showed improvement');
    });

    it('should set notes to null when not provided', () => {
      // Arrange
      const appt = Appointment.request(baseProps);
      appt.confirm();

      // Act
      appt.complete();

      // Assert
      expect(appt.notes).toBeNull();
    });

    it('should trim whitespace from notes', () => {
      // Arrange
      const appt = Appointment.request(baseProps);
      appt.confirm();

      // Act
      appt.complete('  Trimmed notes  ');

      // Assert
      expect(appt.notes).toBe('Trimmed notes');
    });

    it('should throw when appointment is not CONFIRMED', () => {
      // Arrange
      const appt = Appointment.request(baseProps);

      // Act & Assert
      expect(() => appt.complete()).toThrow(
        `Cannot complete an appointment with status "${AppointmentStatus.PENDING}"`,
      );
    });
  });

  describe('toPrimitives', () => {
    it('should return a flat object with all appointment fields', () => {
      // Arrange
      const appt = Appointment.request(baseProps);

      // Act
      const primitives = appt.toPrimitives();

      // Assert
      expect(primitives.patientId).toBe('pat-uuid-001');
      expect(primitives.doctorName).toBe('Ana García');
      expect(primitives.status).toBe(AppointmentStatus.PENDING);
      expect(primitives.notes).toBeNull();
    });
  });
});
