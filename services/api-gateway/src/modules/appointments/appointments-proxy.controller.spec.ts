import { of, throwError } from 'rxjs';
import { AppointmentsProxyController } from './appointments-proxy.controller';

/**
 * Unit tests for AppointmentsProxyController.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-25
 */
describe('AppointmentsProxyController', () => {
  let controller: AppointmentsProxyController;
  let mockHttpService: { request: jest.Mock };
  let mockReq: any;
  let mockRes: any;

  beforeEach(() => {
    mockHttpService = { request: jest.fn() };
    const mockConfig = { get: jest.fn().mockReturnValue('http://localhost:3004') };
    controller = new AppointmentsProxyController(mockHttpService as any, mockConfig as any);

    mockReq = {
      method: 'GET',
      url: '/appointments',
      path: '/appointments',
      body: {},
      headers: { 'content-type': 'application/json' },
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it('should proxy appointments root and return upstream response', async () => {
    // Arrange
    mockHttpService.request.mockReturnValue(of({ status: 200, data: [{ id: 'appt-1' }] }));

    // Act
    await controller.findAll(mockReq, mockRes);

    // Assert
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith([{ id: 'appt-1' }]);
  });

  it('should proxy appointments with path segment', async () => {
    // Arrange
    mockHttpService.request.mockReturnValue(of({ status: 200, data: { id: 'appt-1' } }));
    mockReq.path = '/appointments/appt-1';
    mockReq.url = '/appointments/appt-1';

    // Act
    await controller.findOne(mockReq, mockRes);

    // Assert
    expect(mockRes.status).toHaveBeenCalledWith(200);
  });

  it('should forward query string to upstream', async () => {
    // Arrange
    mockHttpService.request.mockReturnValue(of({ status: 200, data: [] }));
    mockReq.url = '/appointments?status=PENDING';
    mockReq.path = '/appointments';

    // Act
    await controller.findAll(mockReq, mockRes);

    // Assert
    expect(mockHttpService.request).toHaveBeenCalledWith(
      expect.objectContaining({ url: expect.stringContaining('?status=PENDING') }),
    );
  });

  it('should forward upstream HTTP error status and body', async () => {
    // Arrange
    const axiosError = { response: { status: 404, data: { message: 'Not Found' } } };
    mockHttpService.request.mockReturnValue(throwError(() => axiosError));

    // Act
    await controller.findAll(mockReq, mockRes);

    // Assert
    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Not Found' });
  });

  it('should return 502 when appointments-service is unreachable', async () => {
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
});
