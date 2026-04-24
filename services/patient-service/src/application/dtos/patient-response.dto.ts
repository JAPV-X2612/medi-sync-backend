import { Patient } from '../../domain/entities/patient.entity';

/**
 * Output DTO returned by all patient use cases.
 * Maps domain primitives to a serializable response shape.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-20
 */
export class PatientResponseDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: Date;
  bloodType: string | null;
  documentNumber: string;
  documentType: string;
  createdAt: Date;
  updatedAt: Date;

  /** Maps a Patient domain entity to the response DTO. */
  static fromDomain(patient: Patient): PatientResponseDto {
    return Object.assign(new PatientResponseDto(), patient.toPrimitives());
  }
}
