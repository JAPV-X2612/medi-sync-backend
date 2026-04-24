/**
 * Phone value object — normalizes and validates an international phone number.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-20
 */
export class Phone {
  private static readonly PATTERN = /^\+?[1-9]\d{6,14}$/;

  private constructor(public readonly value: string) {}

  static create(phone: string): Phone {
    const normalized = phone?.replace(/[\s\-().]/g, '') ?? '';
    if (!normalized || !Phone.PATTERN.test(normalized)) {
      throw new Error(`Invalid phone number: "${phone}"`);
    }
    return new Phone(normalized);
  }

  static fromRaw(value: string): Phone {
    return new Phone(value);
  }

  toString(): string {
    return this.value;
  }
}
