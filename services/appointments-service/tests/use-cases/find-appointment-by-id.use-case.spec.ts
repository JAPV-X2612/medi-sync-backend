import { NotFoundException } from '@nestjs/common';
import { FindAppointmentByIdUseCase } from '../../src/application/use-cases/find-appointment-by-id/find-appointment-by-id.use-case';
import { IAppointmentRepository } from '../../src/domain/repositories/appointment.repository';
import { Appointment, AppointmentStatus } from '../../src/domain/entities/appointment.entity';

/**
 * Unit tests for FindAppointmentByIdUseCase.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-24
 */
describe('FindAppointmentByIdUseCase', () => {
  let useCase: FindAppointmentByIdUseCase;
  let mockRepo: jest.Mocked<IAppointmentRepository>;

  const appointment = Appointment.request({
    patientId: 'pat-uuid-001',
    patientName: 'John Doe',
    patientEmail: 'john.doe@example.com',
    doctorId: 'doc-uuid-001',
    doctorName: 'Ana García',
    appointmentTime: new Date('2026-05-10T10:00:00Z'),
    reason: 'Annual checkup',
  });

  beforeEach(() => {
    mockRepo = {
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      findByPatientId: jest.fn(),
      findByDoctorId: jest.fn(),
      update: jest.fn(),
      existsById: jest.fn(),
    };
    useCase = new FindAppointmentByIdUseCase(mockRepo as any);
  });

  it('should return an AppointmentResponseDto when appointment is found', async () => {
    // Arrange
    mockRepo.findById.mockResolvedValue(appointment);

    // Act
    const result = await useCase.execute(appointment.id);

    // Assert
    expect(result.id).toBe(appointment.id);
    expect(result.status).toBe(AppointmentStatus.PENDING);
    expect(result.patientName).toBe('John Doe');
    expect(mockRepo.findById).toHaveBeenCalledWith(appointment.id);
  });

  it('should throw NotFoundException when appointment does not exist', async () => {
    // Arrange
    mockRepo.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(useCase.execute('missing-id')).rejects.toThrow(NotFoundException);
    await expect(useCase.execute('missing-id')).rejects.toThrow(
      'Appointment with id "missing-id" not found',
    );
  });
});
