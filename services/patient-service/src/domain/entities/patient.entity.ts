import { v4 as uuidv4 } from 'uuid';
import { Email } from '../value-objects/email.vo';
import { Phone } from '../value-objects/phone.vo';

/**
 * Supported document type identifiers for patients.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-20
 */
export enum DocumentType {
  CC = 'CC',
  TI = 'TI',
  CE = 'CE',
  PASSPORT = 'PASSPORT',
}

export interface CreatePatientProps {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: Date;
  bloodType?: string;
  documentNumber: string;
  documentType: DocumentType;
}

export interface UpdatePatientProps {
  firstName?: string;
  lastName?: string;
  phone?: string;
  bloodType?: string;
}

export interface PatientPrimitives {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: Date;
  bloodType: string | null;
  documentNumber: string;
  documentType: DocumentType;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Patient aggregate root — encapsulates all patient identity and profile data.
 * No framework or ORM dependencies; pure domain logic.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-20
 */
export class Patient {
  private constructor(
    public readonly id: string,
    public firstName: string,
    public lastName: string,
    public readonly email: Email,
    public phone: Phone,
    public birthDate: Date,
    public bloodType: string | null,
    public documentNumber: string,
    public documentType: DocumentType,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {}

  /** Factory — validates and creates a new Patient with a generated UUID. */
  static create(props: CreatePatientProps): Patient {
    return new Patient(
      uuidv4(),
      props.firstName.trim(),
      props.lastName.trim(),
      Email.create(props.email),
      Phone.create(props.phone),
      props.birthDate,
      props.bloodType ?? null,
      props.documentNumber.trim(),
      props.documentType,
      new Date(),
      new Date(),
    );
  }

  /** Reconstitutes a Patient from persisted primitives without re-running creation validations. */
  static reconstitute(primitives: PatientPrimitives): Patient {
    return new Patient(
      primitives.id,
      primitives.firstName,
      primitives.lastName,
      Email.fromRaw(primitives.email),
      Phone.fromRaw(primitives.phone),
      primitives.birthDate,
      primitives.bloodType,
      primitives.documentNumber,
      primitives.documentType,
      primitives.createdAt,
      primitives.updatedAt,
    );
  }

  /** Applies a partial update and refreshes the updatedAt timestamp. */
  update(props: UpdatePatientProps): void {
    if (props.firstName !== undefined) this.firstName = props.firstName.trim();
    if (props.lastName !== undefined) this.lastName = props.lastName.trim();
    if (props.phone !== undefined) this.phone = Phone.create(props.phone);
    if (props.bloodType !== undefined) this.bloodType = props.bloodType;
    this.updatedAt = new Date();
  }

  /** Returns a plain object representation for persistence or serialization. */
  toPrimitives(): PatientPrimitives {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email.value,
      phone: this.phone.value,
      birthDate: this.birthDate,
      bloodType: this.bloodType,
      documentNumber: this.documentNumber,
      documentType: this.documentType,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
