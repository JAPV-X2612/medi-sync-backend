import { Doctor } from '../entities/doctor.entity';

export const DOCTOR_REPOSITORY = 'DOCTOR_REPOSITORY';

/**
 * Repository port for Doctor persistence.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-20
 */
export interface IDoctorRepository {
  save(doctor: Doctor): Promise<Doctor>;
  findById(id: string): Promise<Doctor | null>;
  findByEmail(email: string): Promise<Doctor | null>;
  findAll(): Promise<Doctor[]>;
  findBySpecialtyId(specialtyId: string): Promise<Doctor[]>;
  update(doctor: Doctor): Promise<Doctor>;
  delete(id: string): Promise<void>;
  existsById(id: string): Promise<boolean>;
}
