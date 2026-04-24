import { v4 as uuidv4 } from 'uuid';

/**
 * Possible lifecycle states of an appointment.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-20
 */
export enum AppointmentStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
  RESCHEDULED = 'RESCHEDULED',
}

export interface RequestAppointmentProps {
  patientId: string;
  patientName: string;
  patientEmail: string;
  doctorId: string;
  doctorName: string;
  scheduleId?: string;
  appointmentTime: Date;
  reason: string;
}

export interface AppointmentPrimitives {
  id: string;
  patientId: string;
  patientName: string;
  patientEmail: string;
  doctorId: string;
  doctorName: string;
  scheduleId: string | null;
  appointmentTime: Date;
  status: AppointmentStatus;
  reason: string;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Appointment aggregate root — manages the full lifecycle of a medical appointment.
 * Patient and doctor names are denormalized to avoid cross-service calls at read time.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-20
 */
export class Appointment {
  private constructor(
    public readonly id: string,
    public readonly patientId: string,
    public readonly patientName: string,
    public readonly patientEmail: string,
    public readonly doctorId: string,
    public readonly doctorName: string,
    public readonly scheduleId: string | null,
    public appointmentTime: Date,
    public status: AppointmentStatus,
    public reason: string,
    public notes: string | null,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {}

  static request(props: RequestAppointmentProps): Appointment {
    return new Appointment(
      uuidv4(),
      props.patientId,
      props.patientName,
      props.patientEmail,
      props.doctorId,
      props.doctorName,
      props.scheduleId ?? null,
      props.appointmentTime,
      AppointmentStatus.PENDING,
      props.reason.trim(),
      null,
      new Date(),
      new Date(),
    );
  }

  static reconstitute(primitives: AppointmentPrimitives): Appointment {
    return new Appointment(
      primitives.id,
      primitives.patientId,
      primitives.patientName,
      primitives.patientEmail,
      primitives.doctorId,
      primitives.doctorName,
      primitives.scheduleId,
      primitives.appointmentTime,
      primitives.status,
      primitives.reason,
      primitives.notes,
      primitives.createdAt,
      primitives.updatedAt,
    );
  }

  confirm(): void {
    if (this.status !== AppointmentStatus.PENDING) {
      throw new Error(`Cannot confirm an appointment with status "${this.status}"`);
    }
    this.status = AppointmentStatus.CONFIRMED;
    this.updatedAt = new Date();
  }

  cancel(): void {
    if (this.status === AppointmentStatus.COMPLETED || this.status === AppointmentStatus.CANCELLED) {
      throw new Error(`Cannot cancel an appointment with status "${this.status}"`);
    }
    this.status = AppointmentStatus.CANCELLED;
    this.updatedAt = new Date();
  }

  reschedule(newTime: Date): void {
    if (this.status === AppointmentStatus.CANCELLED || this.status === AppointmentStatus.COMPLETED) {
      throw new Error(`Cannot reschedule an appointment with status "${this.status}"`);
    }
    this.appointmentTime = newTime;
    this.status = AppointmentStatus.RESCHEDULED;
    this.updatedAt = new Date();
  }

  complete(notes?: string): void {
    if (this.status !== AppointmentStatus.CONFIRMED) {
      throw new Error(`Cannot complete an appointment with status "${this.status}"`);
    }
    this.status = AppointmentStatus.COMPLETED;
    this.notes = notes?.trim() ?? null;
    this.updatedAt = new Date();
  }

  toPrimitives(): AppointmentPrimitives {
    return {
      id: this.id,
      patientId: this.patientId,
      patientName: this.patientName,
      patientEmail: this.patientEmail,
      doctorId: this.doctorId,
      doctorName: this.doctorName,
      scheduleId: this.scheduleId,
      appointmentTime: this.appointmentTime,
      status: this.status,
      reason: this.reason,
      notes: this.notes,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
