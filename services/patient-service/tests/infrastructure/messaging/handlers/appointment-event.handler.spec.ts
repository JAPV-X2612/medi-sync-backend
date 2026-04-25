import { AppointmentEventHandler } from '../../../../src/infrastructure/messaging/handlers/appointment-event.handler';

/**
 * Unit tests for AppointmentEventHandler in patient-service.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-25
 */
describe('AppointmentEventHandler (patient-service)', () => {
  let handler: AppointmentEventHandler;

  beforeEach(() => {
    handler = new AppointmentEventHandler();
  });

  it('should handle appointment.confirmed event without throwing', () => {
    // Arrange
    const payload = {
      appointmentId: 'appt-001',
      patientId: 'pat-001',
      doctorId: 'doc-001',
      scheduledAt: '2026-05-10T10:00:00Z',
      confirmedAt: '2026-04-25T08:00:00Z',
    };

    // Act & Assert
    expect(() => handler.handleAppointmentConfirmed(payload)).not.toThrow();
  });
});