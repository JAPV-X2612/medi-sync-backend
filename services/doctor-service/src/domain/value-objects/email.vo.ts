/**
 * Email value object — enforces valid email format and normalizes to lowercase.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-20
 */
export class Email {
  private static readonly PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  private constructor(public readonly value: string) {}

  static create(email: string): Email {
    const normalized = email?.toLowerCase().trim();
    if (!normalized || !Email.PATTERN.test(normalized)) {
      throw new Error(`Invalid email address: "${email}"`);
    }
    return new Email(normalized);
  }

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
