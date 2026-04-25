import { SpecialtiesController } from '../../src/presentation/http/specialties.controller';

/**
 * Unit tests for SpecialtiesController.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-24
 */
describe('SpecialtiesController', () => {
  let controller: SpecialtiesController;

  const mockCreateSpecialty = { execute: jest.fn() };
  const mockFindAllSpecialties = { execute: jest.fn() };

  const specialtyResponse = {
    id: 'spec-001',
    name: 'Cardiology',
    description: 'Heart specialist',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new SpecialtiesController(
      mockCreateSpecialty as any,
      mockFindAllSpecialties as any,
    );
  });

  it('should delegate create to CreateSpecialtyUseCase and return result', async () => {
    // Arrange
    const dto = { name: 'Cardiology', description: 'Heart specialist' };
    mockCreateSpecialty.execute.mockResolvedValue(specialtyResponse);

    // Act
    const result = await controller.create(dto as any);

    // Assert
    expect(mockCreateSpecialty.execute).toHaveBeenCalledWith(dto);
    expect(result).toBe(specialtyResponse);
  });

  it('should delegate findAll to FindAllSpecialtiesUseCase and return result', async () => {
    // Arrange
    mockFindAllSpecialties.execute.mockResolvedValue([specialtyResponse]);

    // Act
    const result = await controller.findAll();

    // Assert
    expect(mockFindAllSpecialties.execute).toHaveBeenCalled();
    expect(result).toEqual([specialtyResponse]);
  });
});
