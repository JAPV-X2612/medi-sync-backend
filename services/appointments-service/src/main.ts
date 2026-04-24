import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

/**
 * Bootstraps the appointments-service as a hybrid app:
 * HTTP server for REST endpoints + RabbitMQ consumer for domain events.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-20
 */
async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  const rabbitmqUser = config.get<string>('RABBITMQ_USER', 'guest');
  const rabbitmqPass = config.get<string>('RABBITMQ_PASS', 'guest');
  const rabbitmqHost = config.get<string>('RABBITMQ_HOST', 'localhost');
  const rabbitmqPort = config.get<number>('RABBITMQ_PORT', 5672);
  const exchange = config.get<string>('EVENTS_EXCHANGE', 'medi-sync.events');

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://${rabbitmqUser}:${rabbitmqPass}@${rabbitmqHost}:${rabbitmqPort}`],
      queue: 'appointments-service-queue',
      exchange,
      exchangeType: 'topic',
      routingKey: 'event.patient.# event.doctor.#',
      noAck: false,
      prefetchCount: 1,
      queueOptions: { durable: true },
    },
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors();

  await app.startAllMicroservices();
  await app.listen(config.get<number>('PORT', 3004));
}

bootstrap();
