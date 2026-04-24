import { Appointment } from '../../domain/entities/appointment.entity';

/**
 * Output DTO for all appointment use cases.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-20
 */
export class AppointmentResponseDto {
  id: string;
  patientId: string;
  patientName: string;
  patientEmail: string;
  doctorId: string;
  doctorName: string;
  scheduleId: string | null;
  appointmentTime: Date;
  status: string;
  reason: string;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;

  static fromDomain(appointment: Appointment): AppointmentResponseDto {
    return Object.assign(new AppointmentResponseDto(), appointment.toPrimitives());
  }
}
