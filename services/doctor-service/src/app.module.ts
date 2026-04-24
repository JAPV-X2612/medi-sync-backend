import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { DoctorsModule } from './doctors.module';
import { DoctorOrmEntity } from './infrastructure/persistence/doctor.orm-entity';
import { ScheduleOrmEntity } from './infrastructure/persistence/schedule.orm-entity';
import { SpecialtyOrmEntity } from './infrastructure/persistence/specialty.orm-entity';

/**
 * Root application module for the doctor-service.
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
        PORT: Joi.number().default(3003),
        NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
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
        entities: [DoctorOrmEntity, SpecialtyOrmEntity, ScheduleOrmEntity],
        synchronize: config.get<string>('NODE_ENV') !== 'production',
        logging: config.get<string>('NODE_ENV') === 'development',
      }),
    }),
    DoctorsModule,
  ],
})
export class AppModule {}
