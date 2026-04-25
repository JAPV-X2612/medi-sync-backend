import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

/**
 * Bootstrap for the doctor-service hybrid application.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-20
 */
async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  const rabbitmqProtocol = config.get<string>('RABBITMQ_PROTOCOL', 'amqp');
  const rabbitmqVhost   = config.get<string>('RABBITMQ_VHOST', '');
  const rabbitmqUrl = `${rabbitmqProtocol}://${config.get('RABBITMQ_USER')}:${config.get('RABBITMQ_PASS')}@${config.get('RABBITMQ_HOST')}:${config.get('RABBITMQ_PORT')}${rabbitmqVhost ? `/${rabbitmqVhost}` : ''}`;

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [rabbitmqUrl],
      queue: 'doctor-service-queue',
      queueOptions: { durable: true },
      exchange: config.get<string>('EVENTS_EXCHANGE', 'medi-sync.events'),
      exchangeType: 'topic',
      noAck: false,
      prefetchCount: 1,
    },
  });

  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
  );
  app.enableCors();

  await app.startAllMicroservices();
  await app.listen(config.get<number>('PORT', 3003));
}

bootstrap();
