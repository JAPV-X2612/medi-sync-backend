import { DocumentType, Patient, PatientPrimitives } from '../../src/domain/entities/patient.entity';

/**
 * Unit tests for the Patient aggregate root.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-24
 */
describe('Patient', () => {
  const baseProps = {
    firstName: '  John  ',
    lastName: '  Doe  ',
    email: 'john.doe@example.com',
    phone: '+573001234567',
    birthDate: new Date('1990-01-15'),
    documentType: DocumentType.CC,
    documentNumber: '12345678',
  };

  describe('create', () => {
    it('should generate a UUID and trim whitespace from names', () => {
      // Arrange / Act
      const patient = Patient.create(baseProps);

      // Assert
      expect(patient.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
      expect(patient.firstName).toBe('John');
      expect(patient.lastName).toBe('Doe');
    });

    it('should set bloodType to null when not provided', () => {
      // Arrange / Act
      const patient = Patient.create(baseProps);

      // Assert
      expect(patient.bloodType).toBeNull();
    });

    it('should set bloodType when provided', () => {
      // Arrange / Act
      const patient = Patient.create({ ...baseProps, bloodType: 'O+' });

      // Assert
      expect(patient.bloodType).toBe('O+');
    });

    it('should normalize email to lowercase via Email value object', () => {
      // Arrange / Act
      const patient = Patient.create({ ...baseProps, email: 'JOHN@EXAMPLE.COM' });

      // Assert
      expect(patient.email.value).toBe('john@example.com');
    });

    it('should throw when email is invalid', () => {
      // Arrange / Act / Assert
      expect(() => Patient.create({ ...baseProps, email: 'not-an-email' })).toThrow();
    });

    it('should throw when phone is invalid', () => {
      // Arrange / Act / Assert
      expect(() => Patient.create({ ...baseProps, phone: '0' })).toThrow();
    });

    it('should set createdAt and updatedAt to current time', () => {
      // Arrange
      const before = new Date();

      // Act
      const patient = Patient.create(baseProps);

      // Assert
      expect(patient.createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(patient.updatedAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
    });
  });

  describe('reconstitute', () => {
    it('should rebuild patient from stored primitives without re-validating', () => {
      // Arrange
      const original = Patient.create(baseProps);
      const primitives: PatientPrimitives = original.toPrimitives();

      // Act
      const reconstituted = Patient.reconstitute(primitives);

      // Assert
      expect(reconstituted.id).toBe(original.id);
      expect(reconstituted.email.value).toBe(original.email.value);
      expect(reconstituted.phone.value).toBe(original.phone.value);
      expect(reconstituted.documentType).toBe(DocumentType.CC);
    });
  });

  describe('update', () => {
    it('should trim and apply firstName and lastName changes', () => {
      // Arrange
      const patient = Patient.create(baseProps);

      // Act
      patient.update({ firstName: '  Jane  ', lastName: '  Smith  ' });

      // Assert
      expect(patient.firstName).toBe('Jane');
      expect(patient.lastName).toBe('Smith');
    });

    it('should re-validate and update the phone number', () => {
      // Arrange
      const patient = Patient.create(baseProps);

      // Act
      patient.update({ phone: '+13005556789' });

      // Assert
      expect(patient.phone.value).toBe('+13005556789');
    });

    it('should throw when updated phone is invalid', () => {
      // Arrange
      const patient = Patient.create(baseProps);

      // Act & Assert
      expect(() => patient.update({ phone: 'bad' })).toThrow();
    });

    it('should update bloodType', () => {
      // Arrange
      const patient = Patient.create(baseProps);

      // Act
      patient.update({ bloodType: 'AB-' });

      // Assert
      expect(patient.bloodType).toBe('AB-');
    });

    it('should refresh updatedAt after any update', () => {
      // Arrange
      const patient = Patient.create(baseProps);
      const before = patient.updatedAt;

      // Act
      patient.update({ firstName: 'NewName' });

      // Assert
      expect(patient.updatedAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
    });

    it('should not change fields that were not provided', () => {
      // Arrange
      const patient = Patient.create(baseProps);
      const originalLastName = patient.lastName;
      const originalPhone = patient.phone.value;

      // Act
      patient.update({ firstName: 'OnlyFirst' });

      // Assert
      expect(patient.lastName).toBe(originalLastName);
      expect(patient.phone.value).toBe(originalPhone);
    });
  });

  describe('toPrimitives', () => {
    it('should return a flat object with string email and phone', () => {
      // Arrange
      const patient = Patient.create(baseProps);

      // Act
      const primitives = patient.toPrimitives();

      // Assert
      expect(typeof primitives.email).toBe('string');
      expect(typeof primitives.phone).toBe('string');
      expect(primitives.id).toBe(patient.id);
      expect(primitives.documentType).toBe(DocumentType.CC);
    });
  });

  describe('fullName', () => {
    it('should concatenate firstName and lastName with a space', () => {
      // Arrange
      const patient = Patient.create(baseProps);

      // Act & Assert
      expect(patient.fullName).toBe('John Doe');
    });
  });
});
