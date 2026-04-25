import { HttpException, HttpStatus } from '@nestjs/common';
import { HttpExceptionFilter } from './http-exception.filter';

/**
 * Unit tests for HttpExceptionFilter.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-25
 */
describe('HttpExceptionFilter', () => {
  let filter: HttpExceptionFilter;
  let mockResponse: { status: jest.Mock; json: jest.Mock };
  let mockRequest: { method: string; url: string };
  let mockHost: any;

  beforeEach(() => {
    filter = new HttpExceptionFilter();
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockRequest = { method: 'GET', url: '/test' };
    mockHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: jest.fn().mockReturnValue(mockResponse),
        getRequest: jest.fn().mockReturnValue(mockRequest),
      }),
    };
  });

  it('should use status and message from HttpException', () => {
    // Arrange
    const exception = new HttpException('Not Found', HttpStatus.NOT_FOUND);

    // Act
    filter.catch(exception, mockHost);

    // Assert
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 404 }),
    );
  });

  it('should use 500 and generic message for non-HttpException errors', () => {
    // Arrange
    const exception = new Error('Unexpected crash');

    // Act
    filter.catch(exception, mockHost);

    // Assert
    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 500,
        message: 'Internal server error',
      }),
    );
  });

  it('should include request path and timestamp in response body', () => {
    // Arrange
    const exception = new HttpException('Bad Request', HttpStatus.BAD_REQUEST);

    // Act
    filter.catch(exception, mockHost);

    // Assert
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        path: '/test',
        timestamp: expect.any(String),
      }),
    );
  });
});