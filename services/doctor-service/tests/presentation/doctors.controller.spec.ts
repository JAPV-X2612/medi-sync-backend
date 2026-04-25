import { DoctorsController } from '../../src/presentation/http/doctors.controller';

/**
 * Unit tests for DoctorsController.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-24
 */
describe('DoctorsController', () => {
  let controller: DoctorsController;

  const mockCreateDoctor = { execute: jest.fn() };
  const mockFindDoctorById = { execute: jest.fn() };
  const mockFindAllDoctors = { execute: jest.fn() };
  const mockFindDoctorsBySpecialty = { execute: jest.fn() };
  const mockUpdateDoctor = { execute: jest.fn() };
  const mockDeleteDoctor = { execute: jest.fn() };
  const mockFindSchedulesByDoctor = { execute: jest.fn() };

  const doctorResponse = {
    id: 'doc-001',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    licenseNumber: 'LIC-001',
    bio: null,
    specialtyId: 'spec-001',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new DoctorsController(
      mockCreateDoctor as any,
      mockFindDoctorById as any,
      mockFindAllDoctors as any,
      mockFindDoctorsBySpecialty as any,
      mockUpdateDoctor as any,
      mockDeleteDoctor as any,
      mockFindSchedulesByDoctor as any,
    );
  });

  it('should delegate create to CreateDoctorUseCase and return result', async () => {
    // Arrange
    const dto = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      licenseNumber: 'LIC-001',
      specialtyId: 'spec-001',
    };
    mockCreateDoctor.execute.mockResolvedValue(doctorResponse);

    // Act
    const result = await controller.create(dto as any);

    // Assert
    expect(mockCreateDoctor.execute).toHaveBeenCalledWith(dto);
    expect(result).toBe(doctorResponse);
  });

  it('should delegate findAll to FindAllDoctorsUseCase and return result', async () => {
    // Arrange
    mockFindAllDoctors.execute.mockResolvedValue([doctorResponse]);

    // Act
    const result = await controller.findAll();

    // Assert
    expect(mockFindAllDoctors.execute).toHaveBeenCalled();
    expect(result).toEqual([doctorResponse]);
  });

  it('should delegate findBySpecialty to FindDoctorsBySpecialtyUseCase and return result', async () => {
    // Arrange
    const specialtyId = 'spec-001';
    mockFindDoctorsBySpecialty.execute.mockResolvedValue([doctorResponse]);

    // Act
    const result = await controller.findBySpecialty(specialtyId);

    // Assert
    expect(mockFindDoctorsBySpecialty.execute).toHaveBeenCalledWith(specialtyId);
    expect(result).toEqual([doctorResponse]);
  });

  it('should delegate findById to FindDoctorByIdUseCase and return result', async () => {
    // Arrange
    const id = 'doc-001';
    mockFindDoctorById.execute.mockResolvedValue(doctorResponse);

    // Act
    const result = await controller.findById(id);

    // Assert
    expect(mockFindDoctorById.execute).toHaveBeenCalledWith(id);
    expect(result).toBe(doctorResponse);
  });

  it('should delegate update to UpdateDoctorUseCase and return result', async () => {
    // Arrange
    const id = 'doc-001';
    const dto = { firstName: 'Jane' };
    const updated = { ...doctorResponse, firstName: 'Jane' };
    mockUpdateDoctor.execute.mockResolvedValue(updated);

    // Act
    const result = await controller.update(id, dto as any);

    // Assert
    expect(mockUpdateDoctor.execute).toHaveBeenCalledWith(id, dto);
    expect(result).toBe(updated);
  });

  it('should delegate remove to DeleteDoctorUseCase and return undefined', async () => {
    // Arrange
    const id = 'doc-001';
    mockDeleteDoctor.execute.mockResolvedValue(undefined);

    // Act
    const result = await controller.remove(id);

    // Assert
    expect(mockDeleteDoctor.execute).toHaveBeenCalledWith(id);
    expect(result).toBeUndefined();
  });

  it('should delegate getSchedules to FindSchedulesByDoctorUseCase and return result', async () => {
    // Arrange
    const id = 'doc-001';
    const schedules = [{ id: 'sched-001', doctorId: id, dayOfWeek: 1, startTime: '08:00', endTime: '12:00', slotDurationMin: 30 }];
    mockFindSchedulesByDoctor.execute.mockResolvedValue(schedules);

    // Act
    const result = await controller.getSchedules(id);

    // Assert
    expect(mockFindSchedulesByDoctor.execute).toHaveBeenCalledWith(id);
    expect(result).toBe(schedules);
  });
});
