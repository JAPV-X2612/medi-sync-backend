import { PatientsController } from '../../src/presentation/http/patients.controller';
import { CreatePatientUseCase } from '../../src/application/use-cases/create-patient/create-patient.use-case';
import { FindPatientByIdUseCase } from '../../src/application/use-cases/find-patient-by-id/find-patient-by-id.use-case';
import { FindAllPatientsUseCase } from '../../src/application/use-cases/find-all-patients/find-all-patients.use-case';
import { UpdatePatientUseCase } from '../../src/application/use-cases/update-patient/update-patient.use-case';
import { DeletePatientUseCase } from '../../src/application/use-cases/delete-patient/delete-patient.use-case';
import { CreatePatientDto } from '../../src/application/dtos/create-patient.dto';
import { UpdatePatientDto } from '../../src/application/dtos/update-patient.dto';
import { PatientResponseDto } from '../../src/application/dtos/patient-response.dto';
import { DocumentType } from '../../src/domain/entities/patient.entity';

/**
 * Unit tests for PatientsController — verifies delegation to use cases.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-24
 */
describe('PatientsController', () => {
  let controller: PatientsController;
  let mockCreate: jest.Mocked<Pick<CreatePatientUseCase, 'execute'>>;
  let mockFindById: jest.Mocked<Pick<FindPatientByIdUseCase, 'execute'>>;
  let mockFindAll: jest.Mocked<Pick<FindAllPatientsUseCase, 'execute'>>;
  let mockUpdate: jest.Mocked<Pick<UpdatePatientUseCase, 'execute'>>;
  let mockDelete: jest.Mocked<Pick<DeletePatientUseCase, 'execute'>>;

  const sampleDto: PatientResponseDto = Object.assign(new PatientResponseDto(), {
    id: 'uuid-001',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+573001234567',
    birthDate: new Date('1990-01-15'),
    bloodType: null,
    documentNumber: '12345678',
    documentType: DocumentType.CC,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  beforeEach(() => {
    mockCreate = { execute: jest.fn() };
    mockFindById = { execute: jest.fn() };
    mockFindAll = { execute: jest.fn() };
    mockUpdate = { execute: jest.fn() };
    mockDelete = { execute: jest.fn() };

    controller = new PatientsController(
      mockCreate as unknown as CreatePatientUseCase,
      mockFindById as unknown as FindPatientByIdUseCase,
      mockFindAll as unknown as FindAllPatientsUseCase,
      mockUpdate as unknown as UpdatePatientUseCase,
      mockDelete as unknown as DeletePatientUseCase,
    );
  });

  describe('create', () => {
    it('should delegate to CreatePatientUseCase and return its result', async () => {
      // Arrange
      const dto = { firstName: 'John' } as CreatePatientDto;
      mockCreate.execute.mockResolvedValue(sampleDto);

      // Act
      const result = await controller.create(dto);

      // Assert
      expect(result).toBe(sampleDto);
      expect(mockCreate.execute).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should delegate to FindAllPatientsUseCase and return the list', async () => {
      // Arrange
      mockFindAll.execute.mockResolvedValue([sampleDto]);

      // Act
      const result = await controller.findAll();

      // Assert
      expect(result).toEqual([sampleDto]);
      expect(mockFindAll.execute).toHaveBeenCalledTimes(1);
    });
  });

  describe('findById', () => {
    it('should delegate to FindPatientByIdUseCase with the path param id', async () => {
      // Arrange
      mockFindById.execute.mockResolvedValue(sampleDto);

      // Act
      const result = await controller.findById('uuid-001');

      // Assert
      expect(result).toBe(sampleDto);
      expect(mockFindById.execute).toHaveBeenCalledWith('uuid-001');
    });
  });

  describe('update', () => {
    it('should delegate to UpdatePatientUseCase with id and dto', async () => {
      // Arrange
      const dto = { firstName: 'Jane' } as UpdatePatientDto;
      mockUpdate.execute.mockResolvedValue(sampleDto);

      // Act
      const result = await controller.update('uuid-001', dto);

      // Assert
      expect(result).toBe(sampleDto);
      expect(mockUpdate.execute).toHaveBeenCalledWith('uuid-001', dto);
    });
  });

  describe('remove', () => {
    it('should delegate to DeletePatientUseCase with the id', async () => {
      // Arrange
      mockDelete.execute.mockResolvedValue(undefined);

      // Act
      await controller.remove('uuid-001');

      // Assert
      expect(mockDelete.execute).toHaveBeenCalledWith('uuid-001');
    });
  });
});
