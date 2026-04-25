import { FindAllAppointmentsUseCase } from '../../src/application/use-cases/find-all-appointments/find-all-appointments.use-case';
import { IAppointmentRepository } from '../../src/domain/repositories/appointment.repository';
import { Appointment, AppointmentStatus } from '../../src/domain/entities/appointment.entity';

/**
 * Unit tests for FindAllAppointmentsUseCase.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-24
 */
describe('FindAllAppointmentsUseCase', () => {
  let useCase: FindAllAppointmentsUseCase;
  let mockRepo: jest.Mocked<IAppointmentRepository>;

  const makeAppointment = (patientId: string, time: string) =>
    Appointment.request({
      patientId,
      patientName: 'John Doe',
      patientEmail: 'john.doe@example.com',
      doctorId: 'doc-uuid-001',
      doctorName: 'Ana García',
      appointmentTime: new Date(time),
      reason: 'checkup',
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
    useCase = new FindAllAppointmentsUseCase(mockRepo as any);
  });

  it('should return an array of AppointmentResponseDto for all appointments', async () => {
    // Arrange
    const appointments = [
      makeAppointment('pat-001', '2026-05-10T09:00:00Z'),
      makeAppointment('pat-002', '2026-05-11T10:00:00Z'),
    ];
    mockRepo.findAll.mockResolvedValue(appointments);

    // Act
    const result = await useCase.execute();

    // Assert
    expect(result).toHaveLength(2);
    expect(result[0].patientId).toBe('pat-001');
    expect(result[1].patientId).toBe('pat-002');
    expect(result.every((r) => r.status === AppointmentStatus.PENDING)).toBe(true);
  });

  it('should return an empty array when no appointments exist', async () => {
    // Arrange
    mockRepo.findAll.mockResolvedValue([]);

    // Act
    const result = await useCase.execute();

    // Assert
    expect(result).toEqual([]);
  });
});
