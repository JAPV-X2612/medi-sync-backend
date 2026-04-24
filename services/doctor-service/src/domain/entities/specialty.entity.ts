import { v4 as uuidv4 } from 'uuid';

export interface CreateSpecialtyProps {
  name: string;
  description?: string;
}

export interface SpecialtyPrimitives {
  id: string;
  name: string;
  description: string | null;
}

/**
 * Specialty entity — represents a medical specialty (e.g., Cardiology, Pediatrics).
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-20
 */
export class Specialty {
  private constructor(
    public readonly id: string,
    public name: string,
    public description: string | null,
  ) {}

  static create(props: CreateSpecialtyProps): Specialty {
    return new Specialty(uuidv4(), props.name.trim(), props.description?.trim() ?? null);
  }

  static reconstitute(primitives: SpecialtyPrimitives): Specialty {
    return new Specialty(primitives.id, primitives.name, primitives.description);
  }

  toPrimitives(): SpecialtyPrimitives {
    return { id: this.id, name: this.name, description: this.description };
  }
}
