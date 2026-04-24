import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  APPOINTMENT_REPOSITORY,
} from './domain/repositories/appointment.repository';
import { EMAIL_NOTIFICATION } from './application/ports/email-notification.port';
import { EVENT_PUBLISHER } from './application/ports/event-publisher.port';
import { CancelAppointmentUseCase } from './application/use-cases/cancel-appointment/cancel-appointment.use-case';
import { CompleteAppointmentUseCase } from './application/use-cases/complete-appointment/complete-appointment.use-case';
import { ConfirmAppointmentUseCase } from './application/use-cases/confirm-appointment/confirm-appointment.use-case';
import { FindAllAppointmentsUseCase } from './application/use-cases/find-all-appointments/find-all-appointments.use-case';
import { FindAppointmentByIdUseCase } from './application/use-cases/find-appointment-by-id/find-appointment-by-id.use-case';
import { FindAppointmentsByPatientUseCase } from './application/use-cases/find-appointments-by-patient/find-appointments-by-patient.use-case';
import { RequestAppointmentUseCase } from './application/use-cases/request-appointment/request-appointment.use-case';
import { RescheduleAppointmentUseCase } from './application/use-cases/reschedule-appointment/reschedule-appointment.use-case';
import { AppointmentOrmEntity } from './infrastructure/persistence/appointment.orm-entity';
import { AppointmentTypeOrmRepository } from './infrastructure/persistence/appointment-typeorm.repository';
import {
  RABBITMQ_CLIENT,
  RabbitMQEventPublisherAdapter,
} from './infrastructure/messaging/rabbitmq-event-publisher.adapter';
import { NodemailerEmailAdapter } from './infrastructure/notifications/nodemailer-email.adapter';
import { PatientEventHandler } from './infrastructure/messaging/handlers/patient-event.handler';
import { DoctorEventHandler } from './infrastructure/messaging/handlers/doctor-event.handler';
import { AppointmentsController } from './presentation/http/appointments.controller';

/**
 * Feature module for appointment management.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-20
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([AppointmentOrmEntity]),
    ClientsModule.registerAsync([
      {
        name: RABBITMQ_CLIENT,
        imports: [ConfigModule],
        useFactory: (config: ConfigService) => {
          const user = config.get<string>('RABBITMQ_USER', 'guest');
          const pass = config.get<string>('RABBITMQ_PASS', 'guest');
          const host = config.get<string>('RABBITMQ_HOST', 'localhost');
          const port = config.get<number>('RABBITMQ_PORT', 5672);
          const exchange = config.get<string>('EVENTS_EXCHANGE', 'medi-sync.events');
          return {
            transport: Transport.RMQ,
            options: {
              urls: [`amqp://${user}:${pass}@${host}:${port}`],
              queue: 'appointments-service-publisher',
              exchange,
              exchangeType: 'topic',
              noAck: true,
            },
          };
        },
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [AppointmentsController, PatientEventHandler, DoctorEventHandler],
  providers: [
    RequestAppointmentUseCase,
    ConfirmAppointmentUseCase,
    CancelAppointmentUseCase,
    RescheduleAppointmentUseCase,
    CompleteAppointmentUseCase,
    FindAllAppointmentsUseCase,
    FindAppointmentByIdUseCase,
    FindAppointmentsByPatientUseCase,
    { provide: APPOINTMENT_REPOSITORY, useClass: AppointmentTypeOrmRepository },
    { provide: EVENT_PUBLISHER, useClass: RabbitMQEventPublisherAdapter },
    { provide: EMAIL_NOTIFICATION, useClass: NodemailerEmailAdapter },
  ],
})
export class AppointmentsModule {}
