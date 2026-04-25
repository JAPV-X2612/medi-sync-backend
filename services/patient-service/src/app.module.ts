import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { PatientOrmEntity } from './infrastructure/persistence/patient.orm-entity';
import { PatientsModule } from './patients.module';

/**
 * Root application module for the patient-service.
 * Configures global providers: environment validation, database connection, and feature modules.
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
        PORT: Joi.number().default(3002),
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().default(5432),
        POSTGRES_DB: Joi.string().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASS: Joi.string().required(),
        RABBITMQ_HOST: Joi.string().required(),
        RABBITMQ_PORT: Joi.number().default(5672),
        RABBITMQ_USER: Joi.string().required(),
        RABBITMQ_PASS: Joi.string().required(),
        EVENTS_EXCHANGE: Joi.string().default('medi-sync.events'),
      }),
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('POSTGRES_HOST'),
        port: config.get<number>('POSTGRES_PORT', 5432),
        database: config.get<string>('POSTGRES_DB'),
        username: config.get<string>('POSTGRES_USER'),
        password: config.get<string>('POSTGRES_PASS'),
        entities: [PatientOrmEntity],
        synchronize:
          config.get<string>('NODE_ENV') !== 'production' ||
          config.get<string>('TYPEORM_SYNCHRONIZE') === 'true',
        logging: config.get<string>('NODE_ENV') === 'development',
      }),
    }),
    PatientsModule,
  ],
})
export class AppModule {}
