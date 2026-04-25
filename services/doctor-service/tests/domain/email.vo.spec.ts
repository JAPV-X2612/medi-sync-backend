import { Email } from '../../src/domain/value-objects/email.vo';

/**
 * Unit tests for the Email value object.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-24
 */
describe('Email', () => {
  describe('create', () => {
    it('should create valid email and normalize to lowercase', () => {
      // Arrange
      const raw = 'Doctor@Hospital.COM';

      // Act
      const email = Email.create(raw);

      // Assert
      expect(email.value).toBe('doctor@hospital.com');
    });

    it('should trim whitespace before validating', () => {
      // Arrange
      const raw = '  ana.garcia@medisync.com  ';

      // Act
      const email = Email.create(raw);

      // Assert
      expect(email.value).toBe('ana.garcia@medisync.com');
    });

    it('should throw when email has no @', () => {
      // Arrange
      const invalid = 'notanemail.com';

      // Act & Assert
      expect(() => Email.create(invalid)).toThrow('Invalid email address');
    });

    it('should throw when email is empty string', () => {
      // Arrange
      const invalid = '';

      // Act & Assert
      expect(() => Email.create(invalid)).toThrow('Invalid email address');
    });

    it('should throw when email is null', () => {
      // Arrange / Act / Assert
      expect(() => Email.create(null as unknown as string)).toThrow();
    });
  });

  describe('fromRaw', () => {
    it('should reconstruct email bypassing validation', () => {
      // Arrange
      const raw = 'stored@db.com';

      // Act
      const email = Email.fromRaw(raw);

      // Assert
      expect(email.value).toBe(raw);
    });
  });

  describe('equals', () => {
    it('should return true for emails with the same value', () => {
      // Arrange
      const a = Email.create('x@example.com');
      const b = Email.create('x@example.com');

      // Act & Assert
      expect(a.equals(b)).toBe(true);
    });

    it('should return false for different email addresses', () => {
      // Arrange
      const a = Email.create('a@example.com');
      const b = Email.create('b@example.com');

      // Act & Assert
      expect(a.equals(b)).toBe(false);
    });
  });

  describe('toString', () => {
    it('should return the stored email value', () => {
      // Arrange
      const email = Email.create('test@clinic.org');

      // Act & Assert
      expect(email.toString()).toBe('test@clinic.org');
    });
  });
});
