import { RabbitMQEventPublisherAdapter } from '../../../src/infrastructure/messaging/rabbitmq-event-publisher.adapter';

/**
 * Unit tests for RabbitMQEventPublisherAdapter in patient-service.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-25
 */
describe('RabbitMQEventPublisherAdapter', () => {
  let adapter: RabbitMQEventPublisherAdapter;
  let mockClient: { emit: jest.Mock };

  beforeEach(() => {
    mockClient = { emit: jest.fn() };
    adapter = new RabbitMQEventPublisherAdapter(mockClient as any);
  });

  it('should emit the routing key and payload to the client', () => {
    // Arrange
    const routingKey = 'event.patient.registered';
    const payload = { patientId: 'pat-001', email: 'john@example.com' };

    // Act
    adapter.publish(routingKey, payload);

    // Assert
    expect(mockClient.emit).toHaveBeenCalledWith(routingKey, payload);
  });

  it('should emit once per publish call', () => {
    // Arrange
    const routingKey = 'event.patient.updated';
    const payload = { patientId: 'pat-002' };

    // Act
    adapter.publish(routingKey, payload);

    // Assert
    expect(mockClient.emit).toHaveBeenCalledTimes(1);
  });
});