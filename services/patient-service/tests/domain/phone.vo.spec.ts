import { Phone } from '../../src/domain/value-objects/phone.vo';

/**
 * Unit tests for the Phone value object.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-24
 */
describe('Phone', () => {
  describe('create', () => {
    it('should create valid phone and strip spaces and dashes', () => {
      // Arrange
      const raw = '+57 300-123-4567';

      // Act
      const phone = Phone.create(raw);

      // Assert
      expect(phone.value).toBe('+573001234567');
    });

    it('should create phone starting with + sign', () => {
      // Arrange
      const raw = '+13005556789';

      // Act
      const phone = Phone.create(raw);

      // Assert
      expect(phone.value).toBe('+13005556789');
    });

    it('should create phone without + sign', () => {
      // Arrange
      const raw = '3001234567';

      // Act
      const phone = Phone.create(raw);

      // Assert
      expect(phone.value).toBe('3001234567');
    });

    it('should strip parentheses and dots', () => {
      // Arrange
      const raw = '(300)123.4567';

      // Act
      const phone = Phone.create(raw);

      // Assert
      expect(phone.value).toBe('3001234567');
    });

    it('should throw when phone starts with 0', () => {
      // Arrange
      const invalid = '0123456789';

      // Act & Assert
      expect(() => Phone.create(invalid)).toThrow('Invalid phone number');
    });

    it('should throw when phone has too few digits', () => {
      // Arrange
      const invalid = '123';

      // Act & Assert
      expect(() => Phone.create(invalid)).toThrow('Invalid phone number');
    });

    it('should throw when phone is empty', () => {
      // Arrange
      const invalid = '';

      // Act & Assert
      expect(() => Phone.create(invalid)).toThrow('Invalid phone number');
    });
  });

  describe('fromRaw', () => {
    it('should reconstruct phone bypassing validation', () => {
      // Arrange
      const raw = '+573001234567';

      // Act
      const phone = Phone.fromRaw(raw);

      // Assert
      expect(phone.value).toBe(raw);
    });
  });

  describe('toString', () => {
    it('should return the stored phone value', () => {
      // Arrange
      const phone = Phone.create('+573001234567');

      // Act & Assert
      expect(phone.toString()).toBe('+573001234567');
    });
  });
});
