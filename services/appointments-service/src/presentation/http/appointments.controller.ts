import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { AppointmentResponseDto } from '../../application/dtos/appointment-response.dto';
import { CompleteAppointmentDto } from '../../application/dtos/complete-appointment.dto';
import { RequestAppointmentDto } from '../../application/dtos/request-appointment.dto';
import { RescheduleAppointmentDto } from '../../application/dtos/reschedule-appointment.dto';
import { CancelAppointmentUseCase } from '../../application/use-cases/cancel-appointment/cancel-appointment.use-case';
import { CompleteAppointmentUseCase } from '../../application/use-cases/complete-appointment/complete-appointment.use-case';
import { ConfirmAppointmentUseCase } from '../../application/use-cases/confirm-appointment/confirm-appointment.use-case';
import { FindAllAppointmentsUseCase } from '../../application/use-cases/find-all-appointments/find-all-appointments.use-case';
import { FindAppointmentByIdUseCase } from '../../application/use-cases/find-appointment-by-id/find-appointment-by-id.use-case';
import { FindAppointmentsByPatientUseCase } from '../../application/use-cases/find-appointments-by-patient/find-appointments-by-patient.use-case';
import { RequestAppointmentUseCase } from '../../application/use-cases/request-appointment/request-appointment.use-case';
import { RescheduleAppointmentUseCase } from '../../application/use-cases/reschedule-appointment/reschedule-appointment.use-case';

/**
 * HTTP controller for appointment lifecycle endpoints.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-20
 */
@Controller('appointments')
export class AppointmentsController {
  constructor(
    private readonly requestAppointment: RequestAppointmentUseCase,
    private readonly confirmAppointment: ConfirmAppointmentUseCase,
    private readonly cancelAppointment: CancelAppointmentUseCase,
    private readonly rescheduleAppointment: RescheduleAppointmentUseCase,
    private readonly completeAppointment: CompleteAppointmentUseCase,
    private readonly findAllAppointments: FindAllAppointmentsUseCase,
    private readonly findAppointmentById: FindAppointmentByIdUseCase,
    private readonly findAppointmentsByPatient: FindAppointmentsByPatientUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: RequestAppointmentDto): Promise<AppointmentResponseDto> {
    return this.requestAppointment.execute(dto);
  }

  @Get()
  findAll(): Promise<AppointmentResponseDto[]> {
    return this.findAllAppointments.execute();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<AppointmentResponseDto> {
    return this.findAppointmentById.execute(id);
  }

  @Get('patient/:patientId')
  findByPatient(
    @Param('patientId', ParseUUIDPipe) patientId: string,
  ): Promise<AppointmentResponseDto[]> {
    return this.findAppointmentsByPatient.execute(patientId);
  }

  @Patch(':id/confirm')
  confirm(@Param('id', ParseUUIDPipe) id: string): Promise<AppointmentResponseDto> {
    return this.confirmAppointment.execute(id);
  }

  @Patch(':id/cancel')
  cancel(@Param('id', ParseUUIDPipe) id: string): Promise<AppointmentResponseDto> {
    return this.cancelAppointment.execute(id);
  }

  @Put(':id/reschedule')
  reschedule(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: RescheduleAppointmentDto,
  ): Promise<AppointmentResponseDto> {
    return this.rescheduleAppointment.execute(id, dto);
  }

  @Patch(':id/complete')
  complete(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CompleteAppointmentDto,
  ): Promise<AppointmentResponseDto> {
    return this.completeAppointment.execute(id, dto);
  }

}
