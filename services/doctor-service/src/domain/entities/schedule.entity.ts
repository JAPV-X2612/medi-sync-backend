import { v4 as uuidv4 } from 'uuid';

export interface CreateScheduleProps {
  doctorId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  slotDurationMin: number;
}

export interface SchedulePrimitives {
  id: string;
  doctorId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  slotDurationMin: number;
}

/**
 * Schedule entity — represents a doctor's weekly availability block.
 * dayOfWeek: 0=Sunday, 1=Monday … 6=Saturday.
 * Times are stored as "HH:MM" strings in 24-hour format.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-20
 */
export class Schedule {
  private constructor(
    public readonly id: string,
    public readonly doctorId: string,
    public dayOfWeek: number,
    public startTime: string,
    public endTime: string,
    public slotDurationMin: number,
  ) {}

  static create(props: CreateScheduleProps): Schedule {
    if (props.dayOfWeek < 0 || props.dayOfWeek > 6) {
      throw new Error(`dayOfWeek must be between 0 (Sunday) and 6 (Saturday)`);
    }
    if (props.slotDurationMin < 5 || props.slotDurationMin > 480) {
      throw new Error(`slotDurationMin must be between 5 and 480 minutes`);
    }
    return new Schedule(
      uuidv4(),
      props.doctorId,
      props.dayOfWeek,
      props.startTime,
      props.endTime,
      props.slotDurationMin,
    );
  }

  static reconstitute(primitives: SchedulePrimitives): Schedule {
    return new Schedule(
      primitives.id,
      primitives.doctorId,
      primitives.dayOfWeek,
      primitives.startTime,
      primitives.endTime,
      primitives.slotDurationMin,
    );
  }

  toPrimitives(): SchedulePrimitives {
    return {
      id: this.id,
      doctorId: this.doctorId,
      dayOfWeek: this.dayOfWeek,
      startTime: this.startTime,
      endTime: this.endTime,
      slotDurationMin: this.slotDurationMin,
    };
  }
}
