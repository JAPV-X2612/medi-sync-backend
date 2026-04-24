/**
 * Domain event emitted when a new doctor profile is successfully created.
 * Consumed by appointments-service to build local projections.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-20
 */
export interface DoctorProfileCreatedEvent {
  doctorId: string;
  name: string;
  specialty: string;
  createdAt: Date;
}

export const DOCTOR_PROFILE_CREATED_ROUTING_KEY = 'event.doctor.profile-created';
