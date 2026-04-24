import { IsDateString, IsNotEmpty } from 'class-validator';

/**
 * Input DTO for rescheduling an appointment to a new time.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-20
 */
export class RescheduleAppointmentDto {
  @IsDateString()
  @IsNotEmpty()
  newAppointmentTime: string;
}
