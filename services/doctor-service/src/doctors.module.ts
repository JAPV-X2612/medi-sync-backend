import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EVENT_PUBLISHER } from './application/ports/event-publisher.port';
import { CreateDoctorUseCase } from './application/use-cases/create-doctor/create-doctor.use-case';
import { CreateScheduleUseCase } from './application/use-cases/create-schedule/create-schedule.use-case';
import { CreateSpecialtyUseCase } from './application/use-cases/create-specialty/create-specialty.use-case';
import { DeleteDoctorUseCase } from './application/use-cases/delete-doctor/delete-doctor.use-case';
import { DeleteScheduleUseCase } from './application/use-cases/delete-schedule/delete-schedule.use-case';
import { FindAllDoctorsUseCase } from './application/use-cases/find-all-doctors/find-all-doctors.use-case';
import { FindAllSpecialtiesUseCase } from './application/use-cases/find-all-specialties/find-all-specialties.use-case';
import { FindDoctorByIdUseCase } from './application/use-cases/find-doctor-by-id/find-doctor-by-id.use-case';
import { FindDoctorsBySpecialtyUseCase } from './application/use-cases/find-doctors-by-specialty/find-doctors-by-specialty.use-case';
import { FindSchedulesByDoctorUseCase } from './application/use-cases/find-schedules-by-doctor/find-schedules-by-doctor.use-case';
import { UpdateDoctorUseCase } from './application/use-cases/update-doctor/update-doctor.use-case';
import { DOCTOR_REPOSITORY } from './domain/repositories/doctor.repository';
import { SCHEDULE_REPOSITORY } from './domain/repositories/schedule.repository';
import { SPECIALTY_REPOSITORY } from './domain/repositories/specialty.repository';
import { AppointmentEventHandler } from './infrastructure/messaging/handlers/appointment-event.handler';
import {
  RABBITMQ_CLIENT,
  RabbitMQEventPublisherAdapter,
} from './infrastructure/messaging/rabbitmq-event-publisher.adapter';
import { DoctorOrmEntity } from './infrastructure/persistence/doctor.orm-entity';
import { DoctorTypeOrmRepository } from './infrastructure/persistence/doctor-typeorm.repository';
import { ScheduleOrmEntity } from './infrastructure/persistence/schedule.orm-entity';
import { ScheduleTypeOrmRepository } from './infrastructure/persistence/schedule-typeorm.repository';
import { SpecialtyOrmEntity } from './infrastructure/persistence/specialty.orm-entity';
import { SpecialtyTypeOrmRepository } from './infrastructure/persistence/specialty-typeorm.repository';
import { DoctorsController } from './presentation/http/doctors.controller';
import { SchedulesController } from './presentation/http/schedules.controller';
import { SpecialtiesController } from './presentation/http/specialties.controller';

/**
 * Feature module aggregating all doctor, specialty, and schedule providers.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-20
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([DoctorOrmEntity, SpecialtyOrmEntity, ScheduleOrmEntity]),
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
            noAck: true,
          },
        }),
      },
    ]),
  ],
  controllers: [DoctorsController, SpecialtiesController, SchedulesController, AppointmentEventHandler],
  providers: [
    CreateDoctorUseCase,
    FindDoctorByIdUseCase,
    FindAllDoctorsUseCase,
    FindDoctorsBySpecialtyUseCase,
    UpdateDoctorUseCase,
    DeleteDoctorUseCase,
    CreateSpecialtyUseCase,
    FindAllSpecialtiesUseCase,
    CreateScheduleUseCase,
    FindSchedulesByDoctorUseCase,
    DeleteScheduleUseCase,
    { provide: DOCTOR_REPOSITORY, useClass: DoctorTypeOrmRepository },
    { provide: SPECIALTY_REPOSITORY, useClass: SpecialtyTypeOrmRepository },
    { provide: SCHEDULE_REPOSITORY, useClass: ScheduleTypeOrmRepository },
    { provide: EVENT_PUBLISHER, useClass: RabbitMQEventPublisherAdapter },
  ],
})
export class DoctorsModule {}
