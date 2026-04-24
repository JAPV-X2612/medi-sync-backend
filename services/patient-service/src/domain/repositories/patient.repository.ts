import { Patient } from '../entities/patient.entity';

/** Injection token for the patient repository port. */
export const PATIENT_REPOSITORY = 'PATIENT_REPOSITORY';

/**
 * Repository port (interface) for Patient persistence.
 * Defines the contract that any infrastructure adapter must fulfill.
 * Use cases depend on this interface, never on concrete implementations.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-20
 */
export interface IPatientRepository {
  /** Persists a new patient and returns the saved entity. */
  save(patient: Patient): Promise<Patient>;

  /** Returns the patient with the given UUID, or null if not found. */
  findById(id: string): Promise<Patient | null>;

  /** Returns the patient with the given email, or null if not found. */
  findByEmail(email: string): Promise<Patient | null>;

  /** Returns all patients ordered by creation date descending. */
  findAll(): Promise<Patient[]>;

  /** Persists changes to an existing patient and returns the updated entity. */
  update(patient: Patient): Promise<Patient>;

  /** Removes the patient with the given UUID. */
  delete(id: string): Promise<void>;

  /** Returns true if a patient with the given UUID exists. */
  existsById(id: string): Promise<boolean>;
}
