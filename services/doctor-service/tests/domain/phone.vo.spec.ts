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
    it('should create valid phone and strip dashes and spaces', () => {
      // Arrange
      const raw = '+57 310-456-7890';

      // Act
      const phone = Phone.create(raw);

      // Assert
      expect(phone.value).toBe('+573104567890');
    });

    it('should accept phone without country code prefix', () => {
      // Arrange
      const raw = '3104567890';

      // Act
      const phone = Phone.create(raw);

      // Assert
      expect(phone.value).toBe('3104567890');
    });

    it('should throw when phone starts with 0', () => {
      // Arrange
      const invalid = '0123456789';

      // Act & Assert
      expect(() => Phone.create(invalid)).toThrow('Invalid phone number');
    });

    it('should throw when phone has too few digits', () => {
      // Arrange
      const invalid = '1234';

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
      const raw = '+573104567890';

      // Act
      const phone = Phone.fromRaw(raw);

      // Assert
      expect(phone.value).toBe(raw);
    });
  });

  describe('toString', () => {
    it('should return the stored phone value', () => {
      // Arrange
      const phone = Phone.create('+573104567890');

      // Act & Assert
      expect(phone.toString()).toBe('+573104567890');
    });
  });
});
