import { IsOptional, IsString, MaxLength } from 'class-validator';

/**
 * Input DTO for marking an appointment as completed.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-20
 */
export class CompleteAppointmentDto {
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  notes?: string;
}
