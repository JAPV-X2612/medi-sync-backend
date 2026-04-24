/**
 * Domain event emitted when a new patient is successfully registered.
 * Consumed by appointments-service to build local projections.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-20
 */
export interface PatientRegisteredEvent {
  patientId: string;
  name: string;
  email: string;
  phone: string;
  createdAt: Date;
}

export const PATIENT_REGISTERED_ROUTING_KEY = 'event.patient.registered';
