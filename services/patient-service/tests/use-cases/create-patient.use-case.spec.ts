import { ConflictException } from '@nestjs/common';
import { CreatePatientUseCase } from '../../src/application/use-cases/create-patient/create-patient.use-case';
import { IPatientRepository } from '../../src/domain/repositories/patient.repository';
import { IEventPublisher } from '../../src/application/ports/event-publisher.port';
import { CreatePatientDto } from '../../src/application/dtos/create-patient.dto';
import { DocumentType, Patient } from '../../src/domain/entities/patient.entity';
import { PATIENT_REGISTERED_ROUTING_KEY } from '../../src/domain/events/patient-registered.event';

/**
 * Unit tests for CreatePatientUseCase.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-24
 */
describe('CreatePatientUseCase', () => {
  let useCase: CreatePatientUseCase;
  let mockRepo: jest.Mocked<IPatientRepository>;
  let mockPublisher: jest.Mocked<IEventPublisher>;

  const validDto = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+573001234567',
    birthDate: '1990-01-15',
    documentType: DocumentType.CC,
    documentNumber: '12345678',
  } as CreatePatientDto;

  beforeEach(() => {
    mockRepo = {
      save: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      existsById: jest.fn(),
    };
    mockPublisher = { publish: jest.fn() };
    useCase = new CreatePatientUseCase(mockRepo as any, mockPublisher as any);
  });

  it('should create patient, save it, publish a domain event, and return a DTO', async () => {
    // Arrange
    mockRepo.findByEmail.mockResolvedValue(null);
    mockRepo.save.mockImplementation(async (p) => p);

    // Act
    const result = await useCase.execute(validDto);

    // Assert
    expect(result.email).toBe('john.doe@example.com');
    expect(result.firstName).toBe('John');
    expect(mockRepo.save).toHaveBeenCalledTimes(1);
    expect(mockPublisher.publish).toHaveBeenCalledWith(
      PATIENT_REGISTERED_ROUTING_KEY,
      expect.objectContaining({ email: 'john.doe@example.com' }),
    );
  });

  it('should throw ConflictException when email already exists', async () => {
    // Arrange
    const existing = Patient.create({
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+573001234567',
      birthDate: new Date('1985-03-20'),
      documentType: DocumentType.CC,
      documentNumber: '87654321',
    });
    mockRepo.findByEmail.mockResolvedValue(existing);

    // Act & Assert
    await expect(useCase.execute(validDto)).rejects.toThrow(ConflictException);
    expect(mockRepo.save).not.toHaveBeenCalled();
    expect(mockPublisher.publish).not.toHaveBeenCalled();
  });

  it('should not publish event when repository save throws', async () => {
    // Arrange
    mockRepo.findByEmail.mockResolvedValue(null);
    mockRepo.save.mockRejectedValue(new Error('DB error'));

    // Act & Assert
    await expect(useCase.execute(validDto)).rejects.toThrow('DB error');
    expect(mockPublisher.publish).not.toHaveBeenCalled();
  });

  it('should publish event with correct patient data', async () => {
    // Arrange
    mockRepo.findByEmail.mockResolvedValue(null);
    mockRepo.save.mockImplementation(async (p) => p);

    // Act
    await useCase.execute(validDto);

    // Assert
    const [routingKey, payload] = (mockPublisher.publish as jest.Mock).mock.calls[0];
    expect(routingKey).toBe(PATIENT_REGISTERED_ROUTING_KEY);
    expect((payload as any).name).toBe('John Doe');
    expect((payload as any).phone).toBe('+573001234567');
  });
});
