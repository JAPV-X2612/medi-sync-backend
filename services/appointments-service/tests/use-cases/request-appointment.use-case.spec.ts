import { RequestAppointmentUseCase } from '../../src/application/use-cases/request-appointment/request-appointment.use-case';
import { IAppointmentRepository } from '../../src/domain/repositories/appointment.repository';
import { IEventPublisher } from '../../src/application/ports/event-publisher.port';
import { RequestAppointmentDto } from '../../src/application/dtos/request-appointment.dto';
import { AppointmentStatus } from '../../src/domain/entities/appointment.entity';
import { APPOINTMENT_REQUESTED_ROUTING_KEY } from '../../src/domain/events/appointment.events';

/**
 * Unit tests for RequestAppointmentUseCase.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-24
 */
describe('RequestAppointmentUseCase', () => {
  let useCase: RequestAppointmentUseCase;
  let mockRepo: jest.Mocked<IAppointmentRepository>;
  let mockPublisher: jest.Mocked<IEventPublisher>;

  const validDto = {
    patientId: 'pat-uuid-001',
    patientName: 'John Doe',
    patientEmail: 'john.doe@example.com',
    doctorId: 'doc-uuid-001',
    doctorName: 'Ana García',
    appointmentTime: '2026-05-10T10:00:00Z',
    reason: 'Annual checkup',
  } as RequestAppointmentDto;

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
    mockPublisher = { publish: jest.fn() };
    useCase = new RequestAppointmentUseCase(mockRepo as any, mockPublisher as any);
  });

  it('should save appointment in PENDING status, publish event, and return DTO', async () => {
    // Arrange
    mockRepo.save.mockImplementation(async (a) => a);

    // Act
    const result = await useCase.execute(validDto);

    // Assert
    expect(result.status).toBe(AppointmentStatus.PENDING);
    expect(result.patientId).toBe('pat-uuid-001');
    expect(mockRepo.save).toHaveBeenCalledTimes(1);
    expect(mockPublisher.publish).toHaveBeenCalledWith(
      APPOINTMENT_REQUESTED_ROUTING_KEY,
      expect.objectContaining({ patientId: 'pat-uuid-001' }),
    );
  });

  it('should convert appointmentTime string to a Date object', async () => {
    // Arrange
    mockRepo.save.mockImplementation(async (a) => a);

    // Act
    const result = await useCase.execute(validDto);

    // Assert
    expect(result.appointmentTime).toBeInstanceOf(Date);
    expect(result.appointmentTime.toISOString()).toContain('2026-05-10');
  });

  it('should publish event with correct appointment data', async () => {
    // Arrange
    mockRepo.save.mockImplementation(async (a) => a);

    // Act
    await useCase.execute(validDto);

    // Assert
    const [routingKey, payload] = (mockPublisher.publish as jest.Mock).mock.calls[0];
    expect(routingKey).toBe(APPOINTMENT_REQUESTED_ROUTING_KEY);
    expect((payload as any).doctorId).toBe('doc-uuid-001');
  });
});
