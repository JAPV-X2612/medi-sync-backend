import { v4 as uuidv4 } from 'uuid';
import { Email } from '../value-objects/email.vo';
import { Phone } from '../value-objects/phone.vo';

export interface CreateDoctorProps {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  licenseNumber: string;
  bio?: string;
  specialtyId: string;
}

export interface UpdateDoctorProps {
  firstName?: string;
  lastName?: string;
  phone?: string;
  bio?: string;
  specialtyId?: string;
}

export interface DoctorPrimitives {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  licenseNumber: string;
  bio: string | null;
  specialtyId: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Doctor aggregate root — encapsulates all doctor identity, profile, and specialty data.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-20
 */
export class Doctor {
  private constructor(
    public readonly id: string,
    public firstName: string,
    public lastName: string,
    public readonly email: Email,
    public phone: Phone,
    public readonly licenseNumber: string,
    public bio: string | null,
    public specialtyId: string,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {}

  static create(props: CreateDoctorProps): Doctor {
    return new Doctor(
      uuidv4(),
      props.firstName.trim(),
      props.lastName.trim(),
      Email.create(props.email),
      Phone.create(props.phone),
      props.licenseNumber.trim(),
      props.bio?.trim() ?? null,
      props.specialtyId,
      new Date(),
      new Date(),
    );
  }

  static reconstitute(primitives: DoctorPrimitives): Doctor {
    return new Doctor(
      primitives.id,
      primitives.firstName,
      primitives.lastName,
      Email.fromRaw(primitives.email),
      Phone.fromRaw(primitives.phone),
      primitives.licenseNumber,
      primitives.bio,
      primitives.specialtyId,
      primitives.createdAt,
      primitives.updatedAt,
    );
  }

  update(props: UpdateDoctorProps): void {
    if (props.firstName !== undefined) this.firstName = props.firstName.trim();
    if (props.lastName !== undefined) this.lastName = props.lastName.trim();
    if (props.phone !== undefined) this.phone = Phone.create(props.phone);
    if (props.bio !== undefined) this.bio = props.bio?.trim() ?? null;
    if (props.specialtyId !== undefined) this.specialtyId = props.specialtyId;
    this.updatedAt = new Date();
  }

  toPrimitives(): DoctorPrimitives {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email.value,
      phone: this.phone.value,
      licenseNumber: this.licenseNumber,
      bio: this.bio,
      specialtyId: this.specialtyId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
