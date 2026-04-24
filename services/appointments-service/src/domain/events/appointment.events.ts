/**
 * Domain events for the full appointment lifecycle.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-20
 */

export const APPOINTMENT_REQUESTED_ROUTING_KEY = 'event.appointment.requested';
export const APPOINTMENT_CONFIRMED_ROUTING_KEY = 'event.appointment.confirmed';
export const APPOINTMENT_CANCELLED_ROUTING_KEY = 'event.appointment.cancelled';
export const APPOINTMENT_RESCHEDULED_ROUTING_KEY = 'event.appointment.rescheduled';
export const APPOINTMENT_COMPLETED_ROUTING_KEY = 'event.appointment.completed';

export interface AppointmentRequestedEvent {
  appointmentId: string;
  patientId: string;
  doctorId: string;
  requestedSlot: Date;
  status: string;
  requestedAt: Date;
}

export interface AppointmentConfirmedEvent {
  appointmentId: string;
  patientId: string;
  doctorId: string;
  scheduledAt: Date;
  confirmedAt: Date;
}

export interface AppointmentCancelledEvent {
  appointmentId: string;
  patientId: string;
  doctorId: string;
  reason: string;
  cancelledAt: Date;
}

export interface AppointmentRescheduledEvent {
  appointmentId: string;
  patientId: string;
  doctorId: string;
  previousSlot: Date;
  newSlot: Date;
  rescheduledAt: Date;
}
