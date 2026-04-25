import { AppController } from '../../src/app.controller';

/**
 * Unit tests for AppController (health endpoint) in patient-service.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-25
 */
describe('AppController', () => {
  let controller: AppController;

  beforeEach(() => {
    controller = new AppController();
  });

  it('should return ok status for patient-service', () => {
    // Act
    const result = controller.health();

    // Assert
    expect(result.status).toBe('ok');
    expect(result.service).toBe('patient-service');
  });
});