import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EVENT_PUBLISHER } from './application/ports/event-publisher.port';
import { CreatePatientUseCase } from './application/use-cases/create-patient/create-patient.use-case';
import { DeletePatientUseCase } from './application/use-cases/delete-patient/delete-patient.use-case';
import { FindAllPatientsUseCase } from './application/use-cases/find-all-patients/find-all-patients.use-case';
import { FindPatientByIdUseCase } from './application/use-cases/find-patient-by-id/find-patient-by-id.use-case';
import { UpdatePatientUseCase } from './application/use-cases/update-patient/update-patient.use-case';
import { PATIENT_REPOSITORY } from './domain/repositories/patient.repository';
import { AppointmentEventHandler } from './infrastructure/messaging/handlers/appointment-event.handler';
import {
  RABBITMQ_CLIENT,
  RabbitMQEventPublisherAdapter,
} from './infrastructure/messaging/rabbitmq-event-publisher.adapter';
import { PatientOrmEntity } from './infrastructure/persistence/patient.orm-entity';
import { PatientTypeOrmRepository } from './infrastructure/persistence/patient-typeorm.repository';
import { PatientsController } from './presentation/http/patients.controller';

/**
 * Feature module that aggregates all patient-related providers, controllers, and adapters.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-20
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([PatientOrmEntity]),
    ClientsModule.registerAsync([
      {
        name: RABBITMQ_CLIENT,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [
              `amqp://${config.get('RABBITMQ_USER')}:${config.get('RABBITMQ_PASS')}@${config.get('RABBITMQ_HOST')}:${config.get('RABBITMQ_PORT')}`,
            ],
            queue: config.get<string>('EVENTS_EXCHANGE', 'medi-sync.events'),
            queueOptions: { durable: true },
            exchange: config.get<string>('EVENTS_EXCHANGE', 'medi-sync.events'),
            exchangeType: 'topic',
            noAck: false,
          },
        }),
      },
    ]),
  ],
  controllers: [PatientsController, AppointmentEventHandler],
  providers: [
    CreatePatientUseCase,
    FindPatientByIdUseCase,
    FindAllPatientsUseCase,
    UpdatePatientUseCase,
    DeletePatientUseCase,
    { provide: PATIENT_REPOSITORY, useClass: PatientTypeOrmRepository },
    { provide: EVENT_PUBLISHER, useClass: RabbitMQEventPublisherAdapter },
  ],
})
export class PatientsModule {}
