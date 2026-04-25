import { RabbitMQEventPublisherAdapter } from '../../../src/infrastructure/messaging/rabbitmq-event-publisher.adapter';

/**
 * Unit tests for RabbitMQEventPublisherAdapter.
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
    const routingKey = 'event.doctor.profile-created';
    const payload = { doctorId: 'doc-001', name: 'Ana García' };

    // Act
    adapter.publish(routingKey, payload);

    // Assert
    expect(mockClient.emit).toHaveBeenCalledWith(routingKey, payload);
  });

  it('should emit with any serializable payload', () => {
    // Arrange
    const routingKey = 'event.doctor.updated';
    const payload = { id: 'doc-002', specialty: 'Cardiology' };

    // Act
    adapter.publish(routingKey, payload);

    // Assert
    expect(mockClient.emit).toHaveBeenCalledTimes(1);
    expect(mockClient.emit).toHaveBeenCalledWith(routingKey, payload);
  });
});
