import { PatientEventHandler } from '../../../../src/infrastructure/messaging/handlers/patient-event.handler';

/**
 * Unit tests for PatientEventHandler in appointments-service.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-25
 */
describe('PatientEventHandler', () => {
  let handler: PatientEventHandler;

  beforeEach(() => {
    handler = new PatientEventHandler();
  });

  it('should handle event.patient.registered without throwing', () => {
    // Arrange
    const payload = { patientId: 'pat-001', email: 'john@example.com', name: 'John Doe' };

    // Act & Assert
    expect(() => handler.handlePatientRegistered(payload)).not.toThrow();
  });
});
