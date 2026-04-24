import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import {
  AppointmentConfirmationEmail,
  IEmailNotificationPort,
} from '../../application/ports/email-notification.port';

/**
 * Nodemailer adapter for sending appointment confirmation emails.
 * Uses Ethereal test accounts when SMTP_USER/SMTP_PASS are not provided.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-20
 */
@Injectable()
export class NodemailerEmailAdapter implements IEmailNotificationPort {
  private readonly logger = new Logger(NodemailerEmailAdapter.name);
  private readonly transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST', 'smtp.ethereal.email'),
      port: this.configService.get<number>('SMTP_PORT', 587),
      secure: false,
      auth: {
        user: this.configService.get<string>('SMTP_USER', ''),
        pass: this.configService.get<string>('SMTP_PASS', ''),
      },
    });
  }

  async sendConfirmation(data: AppointmentConfirmationEmail): Promise<void> {
    const from = this.configService.get<string>('SMTP_FROM', 'no-reply@medisync.local');
    const appointmentDate = data.appointmentTime.toLocaleString('es-CO', {
      timeZone: 'America/Bogota',
      dateStyle: 'full',
      timeStyle: 'short',
    });

    try {
      const info = await this.transporter.sendMail({
        from,
        to: data.to,
        subject: 'Appointment Confirmed — MediSync',
        html: `
          <h2>Your appointment has been confirmed</h2>
          <p>Dear <strong>${data.patientName}</strong>,</p>
          <p>Your appointment with <strong>Dr. ${data.doctorName}</strong>
             is scheduled for <strong>${appointmentDate}</strong>.</p>
          <p>Appointment ID: <code>${data.appointmentId}</code></p>
          <p>Thank you for choosing MediSync.</p>
        `,
      });
      this.logger.log(`Confirmation email sent: ${info.messageId}`);
    } catch (error) {
      this.logger.error(`Failed to send confirmation email to ${data.to}`, (error as Error).stack);
    }
  }
}
