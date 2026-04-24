/** Injection token for the event publisher port. */
export const EVENT_PUBLISHER = 'EVENT_PUBLISHER';

/**
 * Port defining the contract for publishing domain events to the message broker.
 * Infrastructure adapters (e.g., RabbitMQ) implement this interface.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-20
 */
export interface IEventPublisher {
  /** Publishes a payload to the given routing key on the events exchange. */
  publish(routingKey: string, payload: unknown): void;
}
