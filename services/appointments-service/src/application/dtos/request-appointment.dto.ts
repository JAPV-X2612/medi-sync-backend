import { IsDateString, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

/**
 * Input DTO for requesting a new appointment.
 * Patient and doctor names are included to avoid cross-service calls at email-send time.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-20
 */
export class RequestAppointmentDto {
  @IsUUID()
  @IsNotEmpty()
  patientId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  patientName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  patientEmail: string;

  @IsUUID()
  @IsNotEmpty()
  doctorId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  doctorName: string;

  @IsUUID()
  @IsOptional()
  scheduleId?: string;

  @IsDateString()
  @IsNotEmpty()
  appointmentTime: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  reason: string;
}
