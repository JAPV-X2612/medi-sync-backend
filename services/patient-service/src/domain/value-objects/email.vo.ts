/**
 * Email value object — enforces valid email format and normalizes to lowercase.
 * Immutable by design; equality is based on string value.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-20
 */
export class Email {
  private static readonly PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  private constructor(public readonly value: string) {}

  /** Validates and creates a new Email. Throws if the format is invalid. */
  static create(email: string): Email {
    const normalized = email?.toLowerCase().trim();
    if (!normalized || !Email.PATTERN.test(normalized)) {
      throw new Error(`Invalid email address: "${email}"`);
    }
    return new Email(normalized);
  }

  /** Reconstructs an Email from a stored value without re-validating. */
  static fromRaw(value: string): Email {
    return new Email(value);
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
