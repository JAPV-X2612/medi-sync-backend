export const EMAIL_NOTIFICATION = 'EMAIL_NOTIFICATION';

export interface AppointmentConfirmationEmail {
  to: string;
  patientName: string;
  doctorName: string;
  appointmentTime: Date;
  appointmentId: string;
}

/**
 * Port for sending appointment confirmation emails.
 * Decouples the use case from the concrete email transport (Nodemailer, SendGrid, etc.).
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-20
 */
export interface IEmailNotificationPort {
  sendConfirmation(data: AppointmentConfirmationEmail): Promise<void>;
}
