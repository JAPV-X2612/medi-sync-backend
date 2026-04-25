import { NodemailerEmailAdapter } from '../../../src/infrastructure/notifications/nodemailer-email.adapter';
import * as nodemailer from 'nodemailer';

jest.mock('nodemailer');

/**
 * Unit tests for NodemailerEmailAdapter.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-25
 */
describe('NodemailerEmailAdapter', () => {
  let adapter: NodemailerEmailAdapter;
  let mockSendMail: jest.Mock;

  const confirmationData = {
    to: 'patient@example.com',
    patientName: 'John Doe',
    doctorName: 'Ana García',
    appointmentTime: new Date('2026-05-10T10:00:00Z'),
    appointmentId: 'appt-001',
  };

  beforeEach(() => {
    mockSendMail = jest.fn();
    (nodemailer.createTransport as jest.Mock).mockReturnValue({ sendMail: mockSendMail });
    const mockConfig = {
      get: jest.fn().mockImplementation((_key: string, defaultVal: unknown) => defaultVal),
    };
    adapter = new NodemailerEmailAdapter(mockConfig as any);
  });

  it('should send confirmation email to the correct recipient', async () => {
    // Arrange
    mockSendMail.mockResolvedValue({ messageId: 'msg-001' });

    // Act
    await adapter.sendConfirmation(confirmationData);

    // Assert
    expect(mockSendMail).toHaveBeenCalledWith(
      expect.objectContaining({ to: 'patient@example.com' }),
    );
  });

  it('should swallow SMTP errors and not propagate them', async () => {
    // Arrange
    mockSendMail.mockRejectedValue(new Error('SMTP connection refused'));

    // Act & Assert
    await expect(adapter.sendConfirmation(confirmationData)).resolves.toBeUndefined();
  });
});