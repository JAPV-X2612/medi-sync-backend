import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { DoctorOrmEntity } from './doctor.orm-entity';

/**
 * TypeORM entity for the specialties table.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-20
 */
@Entity('specialties')
export class SpecialtyOrmEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({ unique: true, length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @OneToMany(() => DoctorOrmEntity, (doctor) => doctor.specialty)
  doctors: DoctorOrmEntity[];
}
