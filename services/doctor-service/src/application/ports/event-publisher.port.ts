export const EVENT_PUBLISHER = 'EVENT_PUBLISHER';

/**
 * Port defining the contract for publishing domain events to the message broker.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-20
 */
export interface IEventPublisher {
  publish(routingKey: string, payload: unknown): void;
}
