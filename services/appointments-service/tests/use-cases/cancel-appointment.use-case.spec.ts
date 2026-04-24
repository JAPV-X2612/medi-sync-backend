import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CancelAppointmentUseCase } from '../../src/application/use-cases/cancel-appointment/cancel-appointment.use-case';
import { IAppointmentRepository } from '../../src/domain/repositories/appointment.repository';
import { IEventPublisher } from '../../src/application/ports/event-publisher.port';
import { Appointment, AppointmentStatus } from '../../src/domain/entities/appointment.entity';
import { APPOINTMENT_CANCELLED_ROUTING_KEY } from '../../src/domain/events/appointment.events';

/**
 * Unit tests for CancelAppointmentUseCase.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-24
 */
describe('CancelAppointmentUseCase', () => {
  let useCase: CancelAppointmentUseCase;
  let mockRepo: jest.Mocked<IAppointmentRepository>;
  let mockPublisher: jest.Mocked<IEventPublisher>;

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
    mockPublisher = { publish: jest.fn() };
    useCase = new CancelAppointmentUseCase(mockRepo as any, mockPublisher as any);
  });

  it('should cancel appointment, publish event, and return DTO', async () => {
    // Arrange
    const appt = makeAppointment();
    mockRepo.findById.mockResolvedValue(appt);
    mockRepo.update.mockImplementation(async (a) => a);

    // Act
    const result = await useCase.execute(appt.id);

    // Assert
    expect(result.status).toBe(AppointmentStatus.CANCELLED);
    expect(mockPublisher.publish).toHaveBeenCalledWith(
      APPOINTMENT_CANCELLED_ROUTING_KEY,
      expect.objectContaining({ appointmentId: appt.id }),
    );
  });

  it('should throw NotFoundException when appointment does not exist', async () => {
    // Arrange
    mockRepo.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(useCase.execute('missing-id')).rejects.toThrow(NotFoundException);
    expect(mockRepo.update).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException when appointment cannot be cancelled', async () => {
    // Arrange — already cancelled appointment cannot be cancelled again
    const appt = makeAppointment();
    appt.cancel();
    mockRepo.findById.mockResolvedValue(appt);

    // Act & Assert
    await expect(useCase.execute(appt.id)).rejects.toThrow(BadRequestException);
    expect(mockPublisher.publish).not.toHaveBeenCalled();
  });
});
