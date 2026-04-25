import { of, throwError } from 'rxjs';
import { DoctorsProxyController } from './doctors-proxy.controller';

/**
 * Unit tests for DoctorsProxyController.
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
    await controller.proxyDoctorsRoot(mockReq, mockRes);

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
    await controller.proxyDoctors(mockReq, mockRes);

    // Assert
    expect(mockRes.status).toHaveBeenCalledWith(200);
  });

  it('should proxy specialties root', async () => {
    // Arrange
    mockHttpService.request.mockReturnValue(of({ status: 200, data: [] }));
    mockReq.path = '/specialties';
    mockReq.url = '/specialties';

    // Act
    await controller.proxySpecialtiesRoot(mockReq, mockRes);

    // Assert
    expect(mockRes.status).toHaveBeenCalledWith(200);
  });

  it('should proxy specialties with path segment', async () => {
    // Arrange
    mockHttpService.request.mockReturnValue(of({ status: 200, data: { id: 'spec-1' } }));
    mockReq.path = '/specialties/spec-1';
    mockReq.url = '/specialties/spec-1';

    // Act
    await controller.proxySpecialties(mockReq, mockRes);

    // Assert
    expect(mockRes.status).toHaveBeenCalledWith(200);
  });

  it('should proxy schedules root', async () => {
    // Arrange
    mockHttpService.request.mockReturnValue(of({ status: 200, data: [] }));
    mockReq.path = '/schedules';
    mockReq.url = '/schedules';

    // Act
    await controller.proxySchedulesRoot(mockReq, mockRes);

    // Assert
    expect(mockRes.status).toHaveBeenCalledWith(200);
  });

  it('should proxy schedules with path segment', async () => {
    // Arrange
    mockHttpService.request.mockReturnValue(of({ status: 200, data: { id: 'sched-1' } }));
    mockReq.path = '/schedules/sched-1';
    mockReq.url = '/schedules/sched-1';

    // Act
    await controller.proxySchedules(mockReq, mockRes);

    // Assert
    expect(mockRes.status).toHaveBeenCalledWith(200);
  });

  it('should forward upstream HTTP error status and body', async () => {
    // Arrange
    const axiosError = { response: { status: 404, data: { message: 'Doctor not found' } } };
    mockHttpService.request.mockReturnValue(throwError(() => axiosError));

    // Act
    await controller.proxyDoctorsRoot(mockReq, mockRes);

    // Assert
    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Doctor not found' });
  });

  it('should return 502 when doctor-service is unreachable', async () => {
    // Arrange
    mockHttpService.request.mockReturnValue(throwError(() => new Error('ECONNREFUSED')));

    // Act
    await controller.proxyDoctorsRoot(mockReq, mockRes);

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
    await controller.proxyDoctorsRoot(mockReq, mockRes);

    // Assert
    expect(mockHttpService.request).toHaveBeenCalledWith(
      expect.objectContaining({ url: expect.stringContaining('?specialtyId=spec-1') }),
    );
  });
});
