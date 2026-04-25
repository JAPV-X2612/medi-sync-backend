import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CompleteAppointmentUseCase } from '../../src/application/use-cases/complete-appointment/complete-appointment.use-case';
import { IAppointmentRepository } from '../../src/domain/repositories/appointment.repository';
import { IEventPublisher } from '../../src/application/ports/event-publisher.port';
import { CompleteAppointmentDto } from '../../src/application/dtos/complete-appointment.dto';
import { Appointment, AppointmentStatus } from '../../src/domain/entities/appointment.entity';
import { APPOINTMENT_COMPLETED_ROUTING_KEY } from '../../src/domain/events/appointment.events';

/**
 * Unit tests for CompleteAppointmentUseCase.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-24
 */
describe('CompleteAppointmentUseCase', () => {
  let useCase: CompleteAppointmentUseCase;
  let mockRepo: jest.Mocked<IAppointmentRepository>;
  let mockPublisher: jest.Mocked<IEventPublisher>;

  const makeConfirmedAppointment = () => {
    const appt = Appointment.request({
      patientId: 'pat-uuid-001',
      patientName: 'John Doe',
      patientEmail: 'john.doe@example.com',
      doctorId: 'doc-uuid-001',
      doctorName: 'Ana García',
      appointmentTime: new Date('2026-05-10T10:00:00Z'),
      reason: 'checkup',
    });
    appt.confirm();
    return appt;
  };

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
    useCase = new CompleteAppointmentUseCase(mockRepo as any, mockPublisher as any);
  });

  it('should complete appointment with notes, publish event, and return DTO', async () => {
    // Arrange
    const appt = makeConfirmedAppointment();
    mockRepo.findById.mockResolvedValue(appt);
    mockRepo.update.mockImplementation(async (a) => a);
    const dto = { notes: 'Patient is recovering well' } as CompleteAppointmentDto;

    // Act
    const result = await useCase.execute(appt.id, dto);

    // Assert
    expect(result.status).toBe(AppointmentStatus.COMPLETED);
    expect(result.notes).toBe('Patient is recovering well');
    expect(mockPublisher.publish).toHaveBeenCalledWith(
      APPOINTMENT_COMPLETED_ROUTING_KEY,
      expect.objectContaining({ appointmentId: appt.id }),
    );
  });

  it('should complete appointment without notes when dto has no notes', async () => {
    // Arrange
    const appt = makeConfirmedAppointment();
    mockRepo.findById.mockResolvedValue(appt);
    mockRepo.update.mockImplementation(async (a) => a);
    const dto = {} as CompleteAppointmentDto;

    // Act
    const result = await useCase.execute(appt.id, dto);

    // Assert
    expect(result.notes).toBeNull();
  });

  it('should throw NotFoundException when appointment does not exist', async () => {
    // Arrange
    mockRepo.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(useCase.execute('missing-id', {}  as CompleteAppointmentDto)).rejects.toThrow(
      NotFoundException,
    );
    expect(mockRepo.update).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException when appointment is not CONFIRMED', async () => {
    // Arrange — PENDING appointment cannot be completed
    const pendingAppt = Appointment.request({
      patientId: 'pat-uuid-001',
      patientName: 'John Doe',
      patientEmail: 'john.doe@example.com',
      doctorId: 'doc-uuid-001',
      doctorName: 'Ana García',
      appointmentTime: new Date('2026-05-10T10:00:00Z'),
      reason: 'checkup',
    });
    mockRepo.findById.mockResolvedValue(pendingAppt);

    // Act & Assert
    await expect(useCase.execute(pendingAppt.id, {} as CompleteAppointmentDto)).rejects.toThrow(
      BadRequestException,
    );
    expect(mockPublisher.publish).not.toHaveBeenCalled();
  });
});
