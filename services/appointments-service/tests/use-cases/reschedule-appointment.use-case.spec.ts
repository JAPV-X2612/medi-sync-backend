import { BadRequestException, NotFoundException } from '@nestjs/common';
import { RescheduleAppointmentUseCase } from '../../src/application/use-cases/reschedule-appointment/reschedule-appointment.use-case';
import { IAppointmentRepository } from '../../src/domain/repositories/appointment.repository';
import { IEventPublisher } from '../../src/application/ports/event-publisher.port';
import { RescheduleAppointmentDto } from '../../src/application/dtos/reschedule-appointment.dto';
import { Appointment, AppointmentStatus } from '../../src/domain/entities/appointment.entity';
import { APPOINTMENT_RESCHEDULED_ROUTING_KEY } from '../../src/domain/events/appointment.events';

/**
 * Unit tests for RescheduleAppointmentUseCase.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-24
 */
describe('RescheduleAppointmentUseCase', () => {
  let useCase: RescheduleAppointmentUseCase;
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

  const rescheduleDto = { newAppointmentTime: '2026-05-15T14:00:00Z' } as RescheduleAppointmentDto;

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
    useCase = new RescheduleAppointmentUseCase(mockRepo as any, mockPublisher as any);
  });

  it('should reschedule appointment, publish event, and return DTO with new time', async () => {
    // Arrange
    const appt = makeAppointment();
    mockRepo.findById.mockResolvedValue(appt);
    mockRepo.update.mockImplementation(async (a) => a);

    // Act
    const result = await useCase.execute(appt.id, rescheduleDto);

    // Assert
    expect(result.status).toBe(AppointmentStatus.RESCHEDULED);
    expect(result.appointmentTime.toISOString()).toContain('2026-05-15');
    expect(mockPublisher.publish).toHaveBeenCalledWith(
      APPOINTMENT_RESCHEDULED_ROUTING_KEY,
      expect.objectContaining({ appointmentId: appt.id }),
    );
  });

  it('should throw NotFoundException when appointment does not exist', async () => {
    // Arrange
    mockRepo.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(useCase.execute('missing-id', rescheduleDto)).rejects.toThrow(NotFoundException);
    expect(mockRepo.update).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException when appointment cannot be rescheduled', async () => {
    // Arrange — cancelled appointment cannot be rescheduled
    const appt = makeAppointment();
    appt.cancel();
    mockRepo.findById.mockResolvedValue(appt);

    // Act & Assert
    await expect(useCase.execute(appt.id, rescheduleDto)).rejects.toThrow(BadRequestException);
    expect(mockPublisher.publish).not.toHaveBeenCalled();
  });
});
