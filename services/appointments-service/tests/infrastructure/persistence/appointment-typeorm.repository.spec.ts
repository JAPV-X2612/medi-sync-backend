import { AppointmentTypeOrmRepository } from '../../../src/infrastructure/persistence/appointment-typeorm.repository';
import { Appointment, AppointmentStatus } from '../../../src/domain/entities/appointment.entity';

/**
 * Unit tests for AppointmentTypeOrmRepository adapter.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-24
 */
describe('AppointmentTypeOrmRepository', () => {
  let repo: AppointmentTypeOrmRepository;
  let mockOrmRepo: {
    save: jest.Mock;
    findOneBy: jest.Mock;
    find: jest.Mock;
    delete: jest.Mock;
    existsBy: jest.Mock;
  };

  const ormAppointment = {
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
    createdAt: new Date('2026-04-24'),
    updatedAt: new Date('2026-04-24'),
  };

  beforeEach(() => {
    mockOrmRepo = {
      save: jest.fn(),
      findOneBy: jest.fn(),
      find: jest.fn(),
      delete: jest.fn(),
      existsBy: jest.fn(),
    };
    repo = new AppointmentTypeOrmRepository(mockOrmRepo as any);
  });

  describe('save', () => {
    it('should persist and return domain Appointment', async () => {
      // Arrange
      const appointment = Appointment.request({
        patientId: 'pat-001',
        patientName: 'John Doe',
        patientEmail: 'john@example.com',
        doctorId: 'doc-001',
        doctorName: 'Ana García',
        appointmentTime: new Date('2026-05-10T10:00:00Z'),
        reason: 'Checkup',
      });
      mockOrmRepo.save.mockResolvedValue({ ...ormAppointment, id: appointment.id });

      // Act
      const result = await repo.save(appointment);

      // Assert
      expect(mockOrmRepo.save).toHaveBeenCalled();
      expect(result).toBeInstanceOf(Appointment);
      expect(result.patientId).toBe('pat-001');
    });
  });

  describe('findById', () => {
    it('should return null when appointment not found', async () => {
      // Arrange
      mockOrmRepo.findOneBy.mockResolvedValue(null);

      // Act
      const result = await repo.findById('missing-id');

      // Assert
      expect(result).toBeNull();
    });

    it('should return domain Appointment when found', async () => {
      // Arrange
      mockOrmRepo.findOneBy.mockResolvedValue(ormAppointment);

      // Act
      const result = await repo.findById('appt-001');

      // Assert
      expect(result).not.toBeNull();
      expect(result!.id).toBe('appt-001');
      expect(result!.patientId).toBe('pat-001');
      expect(result!.status).toBe(AppointmentStatus.PENDING);
    });
  });

  describe('findAll', () => {
    it('should return array of domain appointments ordered by createdAt', async () => {
      // Arrange
      mockOrmRepo.find.mockResolvedValue([ormAppointment]);

      // Act
      const result = await repo.findAll();

      // Assert
      expect(mockOrmRepo.find).toHaveBeenCalledWith({ order: { createdAt: 'DESC' } });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('appt-001');
    });

    it('should return empty array when no appointments exist', async () => {
      // Arrange
      mockOrmRepo.find.mockResolvedValue([]);

      // Act
      const result = await repo.findAll();

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('findByPatientId', () => {
    it('should return appointments for given patient', async () => {
      // Arrange
      mockOrmRepo.find.mockResolvedValue([ormAppointment]);

      // Act
      const result = await repo.findByPatientId('pat-001');

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].patientId).toBe('pat-001');
    });

    it('should return empty array when patient has no appointments', async () => {
      // Arrange
      mockOrmRepo.find.mockResolvedValue([]);

      // Act
      const result = await repo.findByPatientId('pat-no-appts');

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('findByDoctorId', () => {
    it('should return appointments for given doctor', async () => {
      // Arrange
      mockOrmRepo.find.mockResolvedValue([ormAppointment]);

      // Act
      const result = await repo.findByDoctorId('doc-001');

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].doctorId).toBe('doc-001');
    });

    it('should return empty array when doctor has no appointments', async () => {
      // Arrange
      mockOrmRepo.find.mockResolvedValue([]);

      // Act
      const result = await repo.findByDoctorId('doc-no-appts');

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('update', () => {
    it('should update and return domain Appointment', async () => {
      // Arrange
      const appointment = Appointment.reconstitute(ormAppointment);
      const confirmed = { ...ormAppointment, status: AppointmentStatus.CONFIRMED };
      mockOrmRepo.save.mockResolvedValue(confirmed);

      // Act
      const result = await repo.update(appointment);

      // Assert
      expect(mockOrmRepo.save).toHaveBeenCalled();
      expect(result).toBeInstanceOf(Appointment);
    });
  });

  describe('delete', () => {
    it('should call ormRepository.delete with given id', async () => {
      // Arrange
      mockOrmRepo.delete.mockResolvedValue({ affected: 1 });

      // Act
      await repo.delete('appt-001');

      // Assert
      expect(mockOrmRepo.delete).toHaveBeenCalledWith('appt-001');
    });
  });

  describe('existsById', () => {
    it('should return true when appointment exists', async () => {
      // Arrange
      mockOrmRepo.existsBy.mockResolvedValue(true);

      // Act
      const result = await repo.existsById('appt-001');

      // Assert
      expect(result).toBe(true);
    });

    it('should return false when appointment does not exist', async () => {
      // Arrange
      mockOrmRepo.existsBy.mockResolvedValue(false);

      // Act
      const result = await repo.existsById('missing-id');

      // Assert
      expect(result).toBe(false);
    });
  });
});
