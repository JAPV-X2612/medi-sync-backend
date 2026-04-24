import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { AppointmentOrmEntity } from './infrastructure/persistence/appointment.orm-entity';
import { AppointmentsModule } from './appointments.module';

/**
 * Root application module for the appointments-service.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-20
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().default(3004),
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().default(5432),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        RABBITMQ_HOST: Joi.string().default('localhost'),
        RABBITMQ_PORT: Joi.number().default(5672),
        RABBITMQ_USER: Joi.string().default('guest'),
        RABBITMQ_PASS: Joi.string().default('guest'),
        EVENTS_EXCHANGE: Joi.string().default('medi-sync.events'),
        SMTP_HOST: Joi.string().default('smtp.ethereal.email'),
        SMTP_PORT: Joi.number().default(587),
        SMTP_USER: Joi.string().allow('').default(''),
        SMTP_PASS: Joi.string().allow('').default(''),
        SMTP_FROM: Joi.string().default('no-reply@medisync.local'),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('POSTGRES_HOST'),
        port: config.get<number>('POSTGRES_PORT', 5432),
        username: config.get<string>('POSTGRES_USER'),
        password: config.get<string>('POSTGRES_PASSWORD'),
        database: config.get<string>('POSTGRES_DB'),
        entities: [AppointmentOrmEntity],
        synchronize: config.get<string>('NODE_ENV') !== 'production',
        logging: config.get<string>('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),
    AppointmentsModule,
  ],
})
export class AppModule {}
