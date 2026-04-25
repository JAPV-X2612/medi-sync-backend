import { of, throwError } from 'rxjs';
import { DoctorsProxyController } from './doctors-proxy.controller';
import { SpecialtiesProxyController } from './specialties-proxy.controller';
import { SchedulesProxyController } from './schedules-proxy.controller';

/**
 * Unit tests for doctors-service proxy controllers (doctors, specialties, schedules).
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-25
 */
describe('DoctorsProxyController', () => {
  let controller: DoctorsProxyController;
  let mockHttpService: { request: jest.Mock };
  let mockReq: any;
  let mockRes: any;

  beforeEach(() => {
    mockHttpService = { request: jest.fn() };
    const mockConfig = { get: jest.fn().mockReturnValue('http://localhost:3003') };
    controller = new DoctorsProxyController(mockHttpService as any, mockConfig as any);

    mockReq = {
      method: 'GET',
      url: '/doctors',
      path: '/doctors',
      body: {},
      headers: { 'content-type': 'application/json' },
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it('should proxy doctors root and return upstream response', async () => {
    // Arrange
    mockHttpService.request.mockReturnValue(of({ status: 200, data: [{ id: 'doc-1' }] }));

    // Act
    await controller.findAll(mockReq, mockRes);

    // Assert
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith([{ id: 'doc-1' }]);
  });

  it('should proxy doctors with path segment', async () => {
    // Arrange
    mockHttpService.request.mockReturnValue(of({ status: 200, data: { id: 'doc-1' } }));
    mockReq.path = '/doctors/doc-1';
    mockReq.url = '/doctors/doc-1';

    // Act
    await controller.findById(mockReq, mockRes);

    // Assert
    expect(mockRes.status).toHaveBeenCalledWith(200);
  });

  it('should forward upstream HTTP error status and body', async () => {
    // Arrange
    const axiosError = { response: { status: 404, data: { message: 'Doctor not found' } } };
    mockHttpService.request.mockReturnValue(throwError(() => axiosError));

    // Act
    await controller.findAll(mockReq, mockRes);

    // Assert
    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Doctor not found' });
  });

  it('should return 502 when doctor-service is unreachable', async () => {
    // Arrange
    mockHttpService.request.mockReturnValue(throwError(() => new Error('ECONNREFUSED')));

    // Act
    await controller.findAll(mockReq, mockRes);

    // Assert
    expect(mockRes.status).toHaveBeenCalledWith(502);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 502 }),
    );
  });

  it('should forward query string to upstream', async () => {
    // Arrange
    mockHttpService.request.mockReturnValue(of({ status: 200, data: [] }));
    mockReq.url = '/doctors?specialtyId=spec-1';
    mockReq.path = '/doctors';

    // Act
    await controller.findAll(mockReq, mockRes);

    // Assert
    expect(mockHttpService.request).toHaveBeenCalledWith(
      expect.objectContaining({ url: expect.stringContaining('?specialtyId=spec-1') }),
    );
  });
});

describe('SpecialtiesProxyController', () => {
  let controller: SpecialtiesProxyController;
  let mockHttpService: { request: jest.Mock };
  let mockReq: any;
  let mockRes: any;

  beforeEach(() => {
    mockHttpService = { request: jest.fn() };
    const mockConfig = { get: jest.fn().mockReturnValue('http://localhost:3003') };
    controller = new SpecialtiesProxyController(mockHttpService as any, mockConfig as any);

    mockReq = {
      method: 'GET',
      url: '/specialties',
      path: '/specialties',
      body: {},
      headers: { 'content-type': 'application/json' },
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it('should proxy specialties root', async () => {
    // Arrange
    mockHttpService.request.mockReturnValue(of({ status: 200, data: [] }));

    // Act
    await controller.findAll(mockReq, mockRes);

    // Assert
    expect(mockRes.status).toHaveBeenCalledWith(200);
  });

  it('should proxy POST specialties', async () => {
    // Arrange
    mockHttpService.request.mockReturnValue(of({ status: 201, data: { id: 'spec-1', name: 'Cardiology' } }));
    mockReq.method = 'POST';
    mockReq.body = { name: 'Cardiology' };

    // Act
    await controller.create(mockReq, mockRes);

    // Assert
    expect(mockRes.status).toHaveBeenCalledWith(201);
  });

  it('should return 502 when doctor-service is unreachable', async () => {
    // Arrange
    mockHttpService.request.mockReturnValue(throwError(() => new Error('ECONNREFUSED')));

    // Act
    await controller.findAll(mockReq, mockRes);

    // Assert
    expect(mockRes.status).toHaveBeenCalledWith(502);
  });
});

describe('SchedulesProxyController', () => {
  let controller: SchedulesProxyController;
  let mockHttpService: { request: jest.Mock };
  let mockReq: any;
  let mockRes: any;

  beforeEach(() => {
    mockHttpService = { request: jest.fn() };
    const mockConfig = { get: jest.fn().mockReturnValue('http://localhost:3003') };
    controller = new SchedulesProxyController(mockHttpService as any, mockConfig as any);

    mockReq = {
      method: 'POST',
      url: '/schedules',
      path: '/schedules',
      body: { doctorId: 'doc-1', dayOfWeek: 1, startTime: '08:00', endTime: '12:00', slotDurationMin: 30 },
      headers: { 'content-type': 'application/json' },
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it('should proxy POST schedules', async () => {
    // Arrange
    mockHttpService.request.mockReturnValue(of({ status: 201, data: { id: 'sched-1' } }));

    // Act
    await controller.create(mockReq, mockRes);

    // Assert
    expect(mockRes.status).toHaveBeenCalledWith(201);
  });

  it('should proxy DELETE schedule by id', async () => {
    // Arrange
    mockHttpService.request.mockReturnValue(of({ status: 204, data: null }));
    mockReq.method = 'DELETE';
    mockReq.path = '/schedules/sched-1';
    mockReq.url = '/schedules/sched-1';

    // Act
    await controller.remove(mockReq, mockRes);

    // Assert
    expect(mockRes.status).toHaveBeenCalledWith(204);
  });

  it('should return 502 when doctor-service is unreachable', async () => {
    // Arrange
    mockHttpService.request.mockReturnValue(throwError(() => new Error('ECONNREFUSED')));

    // Act
    await controller.create(mockReq, mockRes);

    // Assert
    expect(mockRes.status).toHaveBeenCalledWith(502);
  });
});
