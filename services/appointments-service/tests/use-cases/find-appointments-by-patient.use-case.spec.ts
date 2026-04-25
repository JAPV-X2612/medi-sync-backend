import { FindAppointmentsByPatientUseCase } from '../../src/application/use-cases/find-appointments-by-patient/find-appointments-by-patient.use-case';
import { IAppointmentRepository } from '../../src/domain/repositories/appointment.repository';
import { Appointment } from '../../src/domain/entities/appointment.entity';

/**
 * Unit tests for FindAppointmentsByPatientUseCase.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-24
 */
describe('FindAppointmentsByPatientUseCase', () => {
  let useCase: FindAppointmentsByPatientUseCase;
  let mockRepo: jest.Mocked<IAppointmentRepository>;

  const makeAppointment = () =>
    Appointment.request({
      patientId: 'pat-uuid-001',
      patientName: 'John Doe',
      patientEmail: 'john.doe@example.com',
      doctorId: 'doc-uuid-001',
      doctorName: 'Ana García',
      appointmentTime: new Date('2026-05-10T10:00:00Z'),
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
    useCase = new FindAppointmentsByPatientUseCase(mockRepo as any);
  });

  it('should return array of AppointmentResponseDto for the given patient', async () => {
    // Arrange
    const appts = [makeAppointment(), makeAppointment()];
    mockRepo.findByPatientId.mockResolvedValue(appts);

    // Act
    const result = await useCase.execute('pat-uuid-001');

    // Assert
    expect(result).toHaveLength(2);
    expect(result[0].patientId).toBe('pat-uuid-001');
    expect(mockRepo.findByPatientId).toHaveBeenCalledWith('pat-uuid-001');
  });

  it('should return empty array when patient has no appointments', async () => {
    // Arrange
    mockRepo.findByPatientId.mockResolvedValue([]);

    // Act
    const result = await useCase.execute('pat-no-appointments');

    // Assert
    expect(result).toEqual([]);
  });
});
