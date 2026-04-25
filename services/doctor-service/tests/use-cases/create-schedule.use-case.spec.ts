import { NotFoundException } from '@nestjs/common';
import { CreateScheduleUseCase } from '../../src/application/use-cases/create-schedule/create-schedule.use-case';
import { IDoctorRepository } from '../../src/domain/repositories/doctor.repository';
import { IScheduleRepository } from '../../src/domain/repositories/schedule.repository';
import { Schedule } from '../../src/domain/entities/schedule.entity';

/**
 * Unit tests for CreateScheduleUseCase.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-24
 */
describe('CreateScheduleUseCase', () => {
  let useCase: CreateScheduleUseCase;
  let mockDoctorRepo: jest.Mocked<IDoctorRepository>;
  let mockScheduleRepo: jest.Mocked<IScheduleRepository>;

  const validDto = {
    doctorId: 'doc-uuid-001',
    dayOfWeek: 1,
    startTime: '08:00',
    endTime: '17:00',
    slotDurationMin: 30,
  };

  beforeEach(() => {
    mockDoctorRepo = {
      save: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findAll: jest.fn(),
      findBySpecialtyId: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      existsById: jest.fn(),
    };
    mockScheduleRepo = {
      save: jest.fn(),
      findById: jest.fn(),
      findByDoctorId: jest.fn(),
      delete: jest.fn(),
      existsById: jest.fn(),
    };
    useCase = new CreateScheduleUseCase(mockDoctorRepo as any, mockScheduleRepo as any);
  });

  it('should create schedule, save it, and return a ScheduleResponseDto', async () => {
    // Arrange
    mockDoctorRepo.existsById.mockResolvedValue(true);
    mockScheduleRepo.save.mockImplementation(async (s) => s);

    // Act
    const result = await useCase.execute(validDto);

    // Assert
    expect(result.dayOfWeek).toBe(1);
    expect(result.slotDurationMin).toBe(30);
    expect(mockScheduleRepo.save).toHaveBeenCalledTimes(1);
  });

  it('should call repository save with a Schedule domain object', async () => {
    // Arrange
    mockDoctorRepo.existsById.mockResolvedValue(true);
    mockScheduleRepo.save.mockImplementation(async (s) => s);

    // Act
    await useCase.execute(validDto);

    // Assert
    const savedArg = (mockScheduleRepo.save as jest.Mock).mock.calls[0][0];
    expect(savedArg).toBeInstanceOf(Schedule);
  });

  it('should throw NotFoundException when doctor does not exist', async () => {
    // Arrange
    mockDoctorRepo.existsById.mockResolvedValue(false);

    // Act & Assert
    await expect(useCase.execute(validDto)).rejects.toThrow(NotFoundException);
    await expect(useCase.execute(validDto)).rejects.toThrow(
      `Doctor with id "${validDto.doctorId}" not found`,
    );
    expect(mockScheduleRepo.save).not.toHaveBeenCalled();
  });
});
