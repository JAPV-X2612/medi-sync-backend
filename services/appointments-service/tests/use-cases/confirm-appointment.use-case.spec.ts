import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ConfirmAppointmentUseCase } from '../../src/application/use-cases/confirm-appointment/confirm-appointment.use-case';
import { IAppointmentRepository } from '../../src/domain/repositories/appointment.repository';
import { IEventPublisher } from '../../src/application/ports/event-publisher.port';
import { IEmailNotificationPort } from '../../src/application/ports/email-notification.port';
import { Appointment, AppointmentStatus } from '../../src/domain/entities/appointment.entity';
import { APPOINTMENT_CONFIRMED_ROUTING_KEY } from '../../src/domain/events/appointment.events';

/**
 * Unit tests for ConfirmAppointmentUseCase.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-24
 */
describe('ConfirmAppointmentUseCase', () => {
  let useCase: ConfirmAppointmentUseCase;
  let mockRepo: jest.Mocked<IAppointmentRepository>;
  let mockPublisher: jest.Mocked<IEventPublisher>;
  let mockEmail: jest.Mocked<IEmailNotificationPort>;

  const pendingAppointment = Appointment.request({
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
    mockPublisher = { publish: jest.fn() };
    mockEmail = { sendConfirmation: jest.fn().mockResolvedValue(undefined) };
    useCase = new ConfirmAppointmentUseCase(
      mockRepo as any,
      mockPublisher as any,
      mockEmail as any,
    );
  });

  it('should confirm appointment, publish event, send confirmation email, and return DTO', async () => {
    // Arrange
    const freshPending = Appointment.request({
      patientId: 'pat-uuid-001',
      patientName: 'John Doe',
      patientEmail: 'john.doe@example.com',
      doctorId: 'doc-uuid-001',
      doctorName: 'Ana García',
      appointmentTime: new Date('2026-05-10T10:00:00Z'),
      reason: 'Annual checkup',
    });
    mockRepo.findById.mockResolvedValue(freshPending);
    mockRepo.update.mockImplementation(async (a) => a);

    // Act
    const result = await useCase.execute(freshPending.id);

    // Assert
    expect(result.status).toBe(AppointmentStatus.CONFIRMED);
    expect(mockPublisher.publish).toHaveBeenCalledWith(
      APPOINTMENT_CONFIRMED_ROUTING_KEY,
      expect.objectContaining({ patientId: 'pat-uuid-001' }),
    );
    expect(mockEmail.sendConfirmation).toHaveBeenCalledWith(
      expect.objectContaining({ to: 'john.doe@example.com' }),
    );
  });

  it('should throw NotFoundException when appointment does not exist', async () => {
    // Arrange
    mockRepo.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(useCase.execute('missing-id')).rejects.toThrow(NotFoundException);
    expect(mockRepo.update).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException when appointment status prevents confirmation', async () => {
    // Arrange — already confirmed appointment cannot be confirmed again
    const alreadyConfirmed = Appointment.request({
      patientId: 'pat-uuid-001',
      patientName: 'John Doe',
      patientEmail: 'john.doe@example.com',
      doctorId: 'doc-uuid-001',
      doctorName: 'Ana García',
      appointmentTime: new Date('2026-05-10T10:00:00Z'),
      reason: 'checkup',
    });
    alreadyConfirmed.confirm();
    mockRepo.findById.mockResolvedValue(alreadyConfirmed);

    // Act & Assert
    await expect(useCase.execute(alreadyConfirmed.id)).rejects.toThrow(BadRequestException);
    expect(mockEmail.sendConfirmation).not.toHaveBeenCalled();
  });
});
