import { IsInt, IsNotEmpty, IsString, IsUUID, Max, MaxLength, Min } from 'class-validator';

/**
 * Input DTO for the create-schedule use case.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-20
 */
export class CreateScheduleDto {
  @IsUUID()
  @IsNotEmpty()
  doctorId: string;

  /** 0 = Sunday, 1 = Monday … 6 = Saturday */
  @IsInt()
  @Min(0)
  @Max(6)
  dayOfWeek: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(5)
  startTime: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(5)
  endTime: string;

  @IsInt()
  @Min(5)
  @Max(480)
  slotDurationMin: number;
}
