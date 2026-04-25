import { Doctor, DoctorPrimitives } from '../../src/domain/entities/doctor.entity';

/**
 * Unit tests for the Doctor aggregate root.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-24
 */
describe('Doctor', () => {
  const baseProps = {
    firstName: '  Ana  ',
    lastName: '  García  ',
    email: 'ana.garcia@hospital.com',
    phone: '+573009876543',
    licenseNumber: '  LIC001  ',
    specialtyId: 'spec-uuid-001',
  };

  describe('create', () => {
    it('should generate a UUID and trim whitespace from names and license', () => {
      // Arrange / Act
      const doctor = Doctor.create(baseProps);

      // Assert
      expect(doctor.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
      expect(doctor.firstName).toBe('Ana');
      expect(doctor.lastName).toBe('García');
      expect(doctor.licenseNumber).toBe('LIC001');
    });

    it('should set bio to null when not provided', () => {
      // Arrange / Act
      const doctor = Doctor.create(baseProps);

      // Assert
      expect(doctor.bio).toBeNull();
    });

    it('should trim and set bio when provided', () => {
      // Arrange / Act
      const doctor = Doctor.create({ ...baseProps, bio: '  Cardiologist with 10 years  ' });

      // Assert
      expect(doctor.bio).toBe('Cardiologist with 10 years');
    });

    it('should normalize email to lowercase', () => {
      // Arrange / Act
      const doctor = Doctor.create({ ...baseProps, email: 'ANA@HOSPITAL.COM' });

      // Assert
      expect(doctor.email.value).toBe('ana@hospital.com');
    });

    it('should throw when email is invalid', () => {
      // Arrange / Act / Assert
      expect(() => Doctor.create({ ...baseProps, email: 'not-an-email' })).toThrow();
    });

    it('should throw when phone is invalid', () => {
      // Arrange / Act / Assert
      expect(() => Doctor.create({ ...baseProps, phone: '0' })).toThrow();
    });
  });

  describe('reconstitute', () => {
    it('should rebuild doctor from stored primitives without re-validating', () => {
      // Arrange
      const original = Doctor.create(baseProps);
      const primitives: DoctorPrimitives = original.toPrimitives();

      // Act
      const reconstituted = Doctor.reconstitute(primitives);

      // Assert
      expect(reconstituted.id).toBe(original.id);
      expect(reconstituted.email.value).toBe(original.email.value);
      expect(reconstituted.licenseNumber).toBe(original.licenseNumber);
    });
  });

  describe('update', () => {
    it('should trim and apply firstName, lastName and bio changes', () => {
      // Arrange
      const doctor = Doctor.create(baseProps);

      // Act
      doctor.update({ firstName: '  Maria  ', lastName: '  Lopez  ', bio: 'Pediatrician' });

      // Assert
      expect(doctor.firstName).toBe('Maria');
      expect(doctor.lastName).toBe('Lopez');
      expect(doctor.bio).toBe('Pediatrician');
    });

    it('should update specialtyId', () => {
      // Arrange
      const doctor = Doctor.create(baseProps);

      // Act
      doctor.update({ specialtyId: 'spec-uuid-new' });

      // Assert
      expect(doctor.specialtyId).toBe('spec-uuid-new');
    });

    it('should refresh updatedAt after any update', () => {
      // Arrange
      const doctor = Doctor.create(baseProps);
      const before = doctor.updatedAt;

      // Act
      doctor.update({ firstName: 'Updated' });

      // Assert
      expect(doctor.updatedAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
    });

    it('should not change fields that were not provided', () => {
      // Arrange
      const doctor = Doctor.create(baseProps);
      const originalLastName = doctor.lastName;

      // Act
      doctor.update({ firstName: 'OnlyFirst' });

      // Assert
      expect(doctor.lastName).toBe(originalLastName);
    });
  });

  describe('toPrimitives', () => {
    it('should return a flat object with string email and phone', () => {
      // Arrange
      const doctor = Doctor.create(baseProps);

      // Act
      const primitives = doctor.toPrimitives();

      // Assert
      expect(typeof primitives.email).toBe('string');
      expect(typeof primitives.phone).toBe('string');
      expect(primitives.specialtyId).toBe('spec-uuid-001');
    });
  });

  describe('fullName', () => {
    it('should concatenate firstName and lastName with a space', () => {
      // Arrange
      const doctor = Doctor.create(baseProps);

      // Act & Assert
      expect(doctor.fullName).toBe('Ana García');
    });
  });
});
