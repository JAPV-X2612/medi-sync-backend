import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Matches,
} from 'class-validator';
import { DocumentType } from '../../domain/entities/patient.entity';

/**
 * Input DTO for the create-patient use case.
 * Validated at the HTTP boundary via NestJS ValidationPipe.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-20
 */
export class CreatePatientDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  phone: string;

  @IsDateString()
  @IsNotEmpty()
  birthDate: string;

  @IsString()
  @IsOptional()
  @MaxLength(5)
  bloodType?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  documentNumber: string;

  @IsEnum(DocumentType)
  @IsNotEmpty()
  documentType: DocumentType;
}
