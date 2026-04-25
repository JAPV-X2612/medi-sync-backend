import { AppointmentsController } from '../../src/presentation/http/appointments.controller';
import { AppointmentStatus } from '../../src/domain/entities/appointment.entity';

/**
 * Unit tests for AppointmentsController.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-24
 */
describe('AppointmentsController', () => {
  let controller: AppointmentsController;

  const mockRequestAppointment = { execute: jest.fn() };
  const mockConfirmAppointment = { execute: jest.fn() };
  const mockCancelAppointment = { execute: jest.fn() };
  const mockRescheduleAppointment = { execute: jest.fn() };
  const mockCompleteAppointment = { execute: jest.fn() };
  const mockFindAllAppointments = { execute: jest.fn() };
  const mockFindAppointmentById = { execute: jest.fn() };
  const mockFindAppointmentsByPatient = { execute: jest.fn() };

  const appointmentResponse = {
    id: 'appt-001',
    patientId: 'pat-001',
    patientName: 'John Doe',
    patientEmail: 'john@example.com',
    doctorId: 'doc-001',
    doctorName: 'Ana García',
    scheduleId: null,
    appointmentTime: new Date('2026-05-10T10:00:00Z'),
    status: AppointmentStatus.PENDING,
    reason: 'Checkup',
    notes: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new AppointmentsController(
      mockRequestAppointment as any,
      mockConfirmAppointment as any,
      mockCancelAppointment as any,
      mockRescheduleAppointment as any,
      mockCompleteAppointment as any,
      mockFindAllAppointments as any,
      mockFindAppointmentById as any,
      mockFindAppointmentsByPatient as any,
    );
  });

  it('should delegate create to RequestAppointmentUseCase and return result', async () => {
    // Arrange
    const dto = { patientId: 'pat-001', doctorId: 'doc-001', appointmentTime: '2026-05-10T10:00:00Z', reason: 'Checkup' };
    mockRequestAppointment.execute.mockResolvedValue(appointmentResponse);

    // Act
    const result = await controller.create(dto as any);

    // Assert
    expect(mockRequestAppointment.execute).toHaveBeenCalledWith(dto);
    expect(result).toBe(appointmentResponse);
  });

  it('should delegate findAll to FindAllAppointmentsUseCase and return result', async () => {
    // Arrange
    mockFindAllAppointments.execute.mockResolvedValue([appointmentResponse]);

    // Act
    const result = await controller.findAll();

    // Assert
    expect(mockFindAllAppointments.execute).toHaveBeenCalled();
    expect(result).toEqual([appointmentResponse]);
  });

  it('should delegate findOne to FindAppointmentByIdUseCase and return result', async () => {
    // Arrange
    mockFindAppointmentById.execute.mockResolvedValue(appointmentResponse);

    // Act
    const result = await controller.findOne('appt-001');

    // Assert
    expect(mockFindAppointmentById.execute).toHaveBeenCalledWith('appt-001');
    expect(result).toBe(appointmentResponse);
  });

  it('should delegate findByPatient to FindAppointmentsByPatientUseCase and return result', async () => {
    // Arrange
    mockFindAppointmentsByPatient.execute.mockResolvedValue([appointmentResponse]);

    // Act
    const result = await controller.findByPatient('pat-001');

    // Assert
    expect(mockFindAppointmentsByPatient.execute).toHaveBeenCalledWith('pat-001');
    expect(result).toEqual([appointmentResponse]);
  });

  it('should delegate confirm to ConfirmAppointmentUseCase and return result', async () => {
    // Arrange
    const confirmed = { ...appointmentResponse, status: AppointmentStatus.CONFIRMED };
    mockConfirmAppointment.execute.mockResolvedValue(confirmed);

    // Act
    const result = await controller.confirm('appt-001');

    // Assert
    expect(mockConfirmAppointment.execute).toHaveBeenCalledWith('appt-001');
    expect(result.status).toBe(AppointmentStatus.CONFIRMED);
  });

  it('should delegate cancel to CancelAppointmentUseCase and return result', async () => {
    // Arrange
    const cancelled = { ...appointmentResponse, status: AppointmentStatus.CANCELLED };
    mockCancelAppointment.execute.mockResolvedValue(cancelled);

    // Act
    const result = await controller.cancel('appt-001');

    // Assert
    expect(mockCancelAppointment.execute).toHaveBeenCalledWith('appt-001');
    expect(result.status).toBe(AppointmentStatus.CANCELLED);
  });

  it('should delegate reschedule to RescheduleAppointmentUseCase and return result', async () => {
    // Arrange
    const dto = { appointmentTime: '2026-05-20T10:00:00Z' };
    const rescheduled = { ...appointmentResponse, status: AppointmentStatus.RESCHEDULED };
    mockRescheduleAppointment.execute.mockResolvedValue(rescheduled);

    // Act
    const result = await controller.reschedule('appt-001', dto as any);

    // Assert
    expect(mockRescheduleAppointment.execute).toHaveBeenCalledWith('appt-001', dto);
    expect(result.status).toBe(AppointmentStatus.RESCHEDULED);
  });

  it('should delegate complete to CompleteAppointmentUseCase and return result', async () => {
    // Arrange
    const dto = { notes: 'Patient improved' };
    const completed = { ...appointmentResponse, status: AppointmentStatus.COMPLETED };
    mockCompleteAppointment.execute.mockResolvedValue(completed);

    // Act
    const result = await controller.complete('appt-001', dto as any);

    // Assert
    expect(mockCompleteAppointment.execute).toHaveBeenCalledWith('appt-001', dto);
    expect(result.status).toBe(AppointmentStatus.COMPLETED);
  });
});
