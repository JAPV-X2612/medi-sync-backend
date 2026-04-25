import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { AppointmentsProxyController } from './modules/appointments/appointments-proxy.controller';
import { DoctorsProxyController } from './modules/doctors/doctors-proxy.controller';
import { SchedulesProxyController } from './modules/doctors/schedules-proxy.controller';
import { SpecialtiesProxyController } from './modules/doctors/specialties-proxy.controller';
import { PatientsProxyController } from './modules/patients/patients-proxy.controller';

/**
 * Root module for the API Gateway.
 * Forwards HTTP traffic to downstream microservices via HttpService.
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
        PORT: Joi.number().default(3000),
        NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
        PATIENT_SERVICE_URL: Joi.string().required(),
        DOCTOR_SERVICE_URL: Joi.string().required(),
        APPOINTMENTS_SERVICE_URL: Joi.string().required(),
        CORS_ORIGIN: Joi.string().default('http://localhost:5173'),
      }),
    }),
    HttpModule.register({
      timeout: 10000,
      maxRedirects: 3,
    }),
  ],
  controllers: [
    PatientsProxyController,
    DoctorsProxyController,
    SpecialtiesProxyController,
    SchedulesProxyController,
    AppointmentsProxyController,
  ],
})
export class AppModule {}
