import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

/**
 * Input DTO for the create-specialty use case.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-20
 */
export class CreateSpecialtyDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(300)
  description?: string;
}
