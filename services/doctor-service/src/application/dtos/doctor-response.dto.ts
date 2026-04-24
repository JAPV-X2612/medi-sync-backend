import { Doctor } from '../../domain/entities/doctor.entity';

/**
 * Output DTO for all doctor use cases.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-20
 */
export class DoctorResponseDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  licenseNumber: string;
  bio: string | null;
  specialtyId: string;
  createdAt: Date;
  updatedAt: Date;

  static fromDomain(doctor: Doctor): DoctorResponseDto {
    return Object.assign(new DoctorResponseDto(), doctor.toPrimitives());
  }
}
