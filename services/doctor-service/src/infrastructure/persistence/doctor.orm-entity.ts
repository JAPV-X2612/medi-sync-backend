import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ScheduleOrmEntity } from './schedule.orm-entity';
import { SpecialtyOrmEntity } from './specialty.orm-entity';

/**
 * TypeORM entity for the doctors table.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-20
 */
@Entity('doctors')
export class DoctorOrmEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({ name: 'first_name', length: 100 })
  firstName: string;

  @Column({ name: 'last_name', length: 100 })
  lastName: string;

  @Column({ unique: true, length: 150 })
  email: string;

  @Column({ length: 20 })
  phone: string;

  @Column({ name: 'license_number', unique: true, length: 50 })
  licenseNumber: string;

  @Column({ type: 'text', nullable: true })
  bio: string | null;

  @Column({ name: 'specialty_id', type: 'uuid' })
  specialtyId: string;

  @ManyToOne(() => SpecialtyOrmEntity, (specialty) => specialty.doctors, { nullable: false })
  @JoinColumn({ name: 'specialty_id' })
  specialty: SpecialtyOrmEntity;

  @OneToMany(() => ScheduleOrmEntity, (schedule) => schedule.doctor)
  schedules: ScheduleOrmEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
