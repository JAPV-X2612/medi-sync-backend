import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { IEventPublisher } from '../../application/ports/event-publisher.port';

export const RABBITMQ_CLIENT = 'RABBITMQ_CLIENT';

/**
 * Publishes domain events to RabbitMQ via a NestJS ClientProxy.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-20
 */
@Injectable()
export class RabbitMQEventPublisherAdapter implements IEventPublisher {
  private readonly logger = new Logger(RabbitMQEventPublisherAdapter.name);

  constructor(@Inject(RABBITMQ_CLIENT) private readonly client: ClientProxy) {}

  publish(routingKey: string, payload: unknown): void {
    this.logger.log(`Publishing event: ${routingKey}`);
    this.client.emit(routingKey, payload);
  }
}
