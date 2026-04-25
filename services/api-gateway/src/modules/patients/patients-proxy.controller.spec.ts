import { of, throwError } from 'rxjs';
import { PatientsProxyController } from './patients-proxy.controller';

/**
 * Unit tests for PatientsProxyController.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-25
 */
describe('PatientsProxyController', () => {
  let controller: PatientsProxyController;
  let mockHttpService: { request: jest.Mock };
  let mockReq: any;
  let mockRes: any;

  beforeEach(() => {
    mockHttpService = { request: jest.fn() };
    const mockConfig = { get: jest.fn().mockReturnValue('http://localhost:3002') };
    controller = new PatientsProxyController(mockHttpService as any, mockConfig as any);

    mockReq = {
      method: 'GET',
      url: '/patients',
      path: '/patients',
      body: {},
      headers: { 'content-type': 'application/json' },
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it('should proxy patients root and return upstream response', async () => {
    // Arrange
    mockHttpService.request.mockReturnValue(of({ status: 200, data: [{ id: 'pat-1' }] }));

    // Act
    await controller.proxyPatientsRoot(mockReq, mockRes);

    // Assert
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith([{ id: 'pat-1' }]);
  });

  it('should proxy patients with path segment', async () => {
    // Arrange
    mockHttpService.request.mockReturnValue(of({ status: 200, data: { id: 'pat-1' } }));
    mockReq.path = '/patients/pat-1';
    mockReq.url = '/patients/pat-1';

    // Act
    await controller.proxyPatients(mockReq, mockRes);

    // Assert
    expect(mockRes.status).toHaveBeenCalledWith(200);
  });

  it('should forward query string to upstream', async () => {
    // Arrange
    mockHttpService.request.mockReturnValue(of({ status: 200, data: [] }));
    mockReq.url = '/patients?page=1';
    mockReq.path = '/patients';

    // Act
    await controller.proxyPatientsRoot(mockReq, mockRes);

    // Assert
    expect(mockHttpService.request).toHaveBeenCalledWith(
      expect.objectContaining({ url: expect.stringContaining('?page=1') }),
    );
  });

  it('should forward upstream HTTP error status and body', async () => {
    // Arrange
    const axiosError = { response: { status: 404, data: { message: 'Patient not found' } } };
    mockHttpService.request.mockReturnValue(throwError(() => axiosError));

    // Act
    await controller.proxyPatientsRoot(mockReq, mockRes);

    // Assert
    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Patient not found' });
  });

  it('should return 502 when patient-service is unreachable', async () => {
    // Arrange
    mockHttpService.request.mockReturnValue(throwError(() => new Error('ECONNREFUSED')));

    // Act
    await controller.proxyPatientsRoot(mockReq, mockRes);

    // Assert
    expect(mockRes.status).toHaveBeenCalledWith(502);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 502 }),
    );
  });
});
