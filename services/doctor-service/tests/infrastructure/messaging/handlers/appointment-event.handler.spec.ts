import { AppointmentEventHandler } from '../../../../src/infrastructure/messaging/handlers/appointment-event.handler';

/**
 * Unit tests for AppointmentEventHandler in doctor-service.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-25
 */
describe('AppointmentEventHandler (doctor-service)', () => {
  let handler: AppointmentEventHandler;

  beforeEach(() => {
    handler = new AppointmentEventHandler();
  });

  it('should handle appointment.requested event without throwing', () => {
    // Arrange
    const payload = {
      appointmentId: 'appt-001',
      patientId: 'pat-001',
      doctorId: 'doc-001',
      requestedSlot: '2026-05-10T10:00:00Z',
    };

    // Act & Assert
    expect(() => handler.handleAppointmentRequested(payload)).not.toThrow();
  });
});
