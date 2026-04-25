import { DoctorEventHandler } from '../../../../src/infrastructure/messaging/handlers/doctor-event.handler';

/**
 * Unit tests for DoctorEventHandler in appointments-service.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-25
 */
describe('DoctorEventHandler', () => {
  let handler: DoctorEventHandler;

  beforeEach(() => {
    handler = new DoctorEventHandler();
  });

  it('should handle event.doctor.profile-created without throwing', () => {
    // Arrange
    const payload = { doctorId: 'doc-001', name: 'Ana García', specialty: 'Cardiology' };

    // Act & Assert
    expect(() => handler.handleDoctorProfileCreated(payload)).not.toThrow();
  });
});
