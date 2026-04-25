import { AppController } from '../../src/app.controller';
import { AppService } from '../../src/app.service';

/**
 * Unit tests for AppController and AppService in doctor-service.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-25
 */
describe('AppService', () => {
  it('should return Hello World', () => {
    // Arrange
    const service = new AppService();

    // Act & Assert
    expect(service.getHello()).toBe('Hello World!');
  });
});

describe('AppController', () => {
  it('should delegate getHello to AppService', () => {
    // Arrange
    const service = new AppService();
    const controller = new AppController(service);

    // Act
    const result = controller.getHello();

    // Assert
    expect(result).toBe('Hello World!');
  });
});
