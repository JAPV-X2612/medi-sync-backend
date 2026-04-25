import { Specialty, SpecialtyPrimitives } from '../../src/domain/entities/specialty.entity';

/**
 * Unit tests for the Specialty entity.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-24
 */
describe('Specialty', () => {
  describe('create', () => {
    it('should generate a UUID and trim the name', () => {
      // Arrange / Act
      const specialty = Specialty.create({ name: '  Cardiology  ' });

      // Assert
      expect(specialty.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
      expect(specialty.name).toBe('Cardiology');
    });

    it('should set description to null when not provided', () => {
      // Arrange / Act
      const specialty = Specialty.create({ name: 'Pediatrics' });

      // Assert
      expect(specialty.description).toBeNull();
    });

    it('should trim and set description when provided', () => {
      // Arrange / Act
      const specialty = Specialty.create({
        name: 'Neurology',
        description: '  Study of the nervous system  ',
      });

      // Assert
      expect(specialty.description).toBe('Study of the nervous system');
    });
  });

  describe('reconstitute', () => {
    it('should rebuild specialty from stored primitives', () => {
      // Arrange
      const primitives: SpecialtyPrimitives = {
        id: 'spec-uuid-001',
        name: 'Cardiology',
        description: 'Heart specialist',
      };

      // Act
      const specialty = Specialty.reconstitute(primitives);

      // Assert
      expect(specialty.id).toBe('spec-uuid-001');
      expect(specialty.name).toBe('Cardiology');
      expect(specialty.description).toBe('Heart specialist');
    });
  });

  describe('toPrimitives', () => {
    it('should return a flat object matching the stored values', () => {
      // Arrange
      const specialty = Specialty.create({ name: 'Oncology', description: 'Cancer treatment' });

      // Act
      const primitives = specialty.toPrimitives();

      // Assert
      expect(primitives.name).toBe('Oncology');
      expect(primitives.description).toBe('Cancer treatment');
      expect(typeof primitives.id).toBe('string');
    });
  });
});
