import { of } from 'rxjs';
import { LoggingInterceptor } from './logging.interceptor';

/**
 * Unit tests for LoggingInterceptor.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-25
 */
describe('LoggingInterceptor', () => {
  let interceptor: LoggingInterceptor;

  beforeEach(() => {
    interceptor = new LoggingInterceptor();
  });

  it('should pass through the response without modification', (done) => {
    // Arrange
    const mockContext: any = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({ method: 'GET', url: '/doctors' }),
      }),
    };
    const mockNext: any = {
      handle: jest.fn().mockReturnValue(of({ id: 'doc-001' })),
    };

    // Act
    const result$ = interceptor.intercept(mockContext, mockNext);

    // Assert
    result$.subscribe({
      next: (value) => {
        expect(value).toEqual({ id: 'doc-001' });
      },
      complete: () => done(),
    });
  });

  it('should call the next handler', () => {
    // Arrange
    const mockContext: any = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({ method: 'POST', url: '/patients' }),
      }),
    };
    const mockNext: any = {
      handle: jest.fn().mockReturnValue(of(null)),
    };

    // Act
    interceptor.intercept(mockContext, mockNext).subscribe();

    // Assert
    expect(mockNext.handle).toHaveBeenCalledTimes(1);
  });
});