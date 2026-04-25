import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Patch, Post, Put, Req, Res } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

/**
 * Proxies all /appointments/** requests to the appointments-service.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-20
 */
@ApiTags('appointments')
@Controller()
export class AppointmentsProxyController {
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    @Inject(ConfigService) private readonly config: ConfigService,
  ) {
    this.baseUrl = this.config.get<string>(
      'APPOINTMENTS_SERVICE_URL',
      'http://localhost:3004',
    );
  }

  @Post('appointments')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Request a new appointment' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['patientId', 'patientName', 'patientEmail', 'doctorId', 'doctorName', 'appointmentTime', 'reason'],
      properties: {
        patientId: { type: 'string', format: 'uuid', example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' },
        patientName: { type: 'string', maxLength: 200, example: 'John Doe' },
        patientEmail: { type: 'string', maxLength: 150, example: 'john.doe@email.com' },
        doctorId: { type: 'string', format: 'uuid', example: 'c3d4e5f6-a7b8-9012-cdef-123456789012' },
        doctorName: { type: 'string', maxLength: 200, example: 'Dr. Maria Garcia' },
        scheduleId: { type: 'string', format: 'uuid', example: 'd4e5f6a7-b8c9-0123-defg-234567890123' },
        appointmentTime: { type: 'string', format: 'date-time', example: '2026-05-10T09:00:00.000Z' },
        reason: { type: 'string', maxLength: 500, example: 'Annual check-up' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Appointment created with status PENDING.' })
  @ApiResponse({ status: 400, description: 'Validation error.' })
  create(@Req() req: Request, @Res() res: Response): Promise<void> {
    return this.forward(req, res);
  }

  @Get('appointments')
  @ApiOperation({ summary: 'List all appointments' })
  @ApiResponse({ status: 200, description: 'Array of appointments.' })
  findAll(@Req() req: Request, @Res() res: Response): Promise<void> {
    return this.forward(req, res);
  }

  @Get('appointments/patient/:patientId')
  @ApiOperation({ summary: "List a patient's appointments" })
  @ApiParam({ name: 'patientId', description: 'Patient UUID', example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  @ApiResponse({ status: 200, description: "Array of patient's appointments." })
  findByPatient(@Req() req: Request, @Res() res: Response): Promise<void> {
    return this.forward(req, res);
  }

  @Get('appointments/:id')
  @ApiOperation({ summary: 'Get an appointment by ID' })
  @ApiParam({ name: 'id', description: 'Appointment UUID', example: 'e5f6a7b8-c9d0-1234-efgh-345678901234' })
  @ApiResponse({ status: 200, description: 'Appointment found.' })
  @ApiResponse({ status: 404, description: 'Appointment not found.' })
  findOne(@Req() req: Request, @Res() res: Response): Promise<void> {
    return this.forward(req, res);
  }

  @Patch('appointments/:id/confirm')
  @ApiOperation({ summary: 'Confirm a PENDING appointment' })
  @ApiParam({ name: 'id', description: 'Appointment UUID', example: 'e5f6a7b8-c9d0-1234-efgh-345678901234' })
  @ApiResponse({ status: 200, description: 'Appointment confirmed. Email sent to patient.' })
  @ApiResponse({ status: 404, description: 'Appointment not found.' })
  @ApiResponse({ status: 409, description: 'Appointment is not in PENDING status.' })
  confirm(@Req() req: Request, @Res() res: Response): Promise<void> {
    return this.forward(req, res);
  }

  @Patch('appointments/:id/cancel')
  @ApiOperation({ summary: 'Cancel an appointment' })
  @ApiParam({ name: 'id', description: 'Appointment UUID', example: 'e5f6a7b8-c9d0-1234-efgh-345678901234' })
  @ApiResponse({ status: 200, description: 'Appointment cancelled.' })
  @ApiResponse({ status: 404, description: 'Appointment not found.' })
  @ApiResponse({ status: 409, description: 'Appointment cannot be cancelled from its current status.' })
  cancel(@Req() req: Request, @Res() res: Response): Promise<void> {
    return this.forward(req, res);
  }

  @Put('appointments/:id/reschedule')
  @ApiOperation({ summary: 'Reschedule a CONFIRMED appointment to a new time' })
  @ApiParam({ name: 'id', description: 'Appointment UUID', example: 'e5f6a7b8-c9d0-1234-efgh-345678901234' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['newAppointmentTime'],
      properties: {
        newAppointmentTime: { type: 'string', format: 'date-time', example: '2026-05-15T10:00:00.000Z' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Appointment rescheduled.' })
  @ApiResponse({ status: 404, description: 'Appointment not found.' })
  reschedule(@Req() req: Request, @Res() res: Response): Promise<void> {
    return this.forward(req, res);
  }

  @Patch('appointments/:id/complete')
  @ApiOperation({ summary: 'Mark an appointment as completed' })
  @ApiParam({ name: 'id', description: 'Appointment UUID', example: 'e5f6a7b8-c9d0-1234-efgh-345678901234' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        notes: { type: 'string', maxLength: 1000, example: 'Patient presented with mild fever. Prescribed ibuprofen.' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Appointment marked as completed.' })
  @ApiResponse({ status: 404, description: 'Appointment not found.' })
  complete(@Req() req: Request, @Res() res: Response): Promise<void> {
    return this.forward(req, res);
  }

  private async forward(req: Request, res: Response): Promise<void> {
    const targetUrl = `${this.baseUrl}${req.path}`;
    const queryString = req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : '';

    try {
      const response = await firstValueFrom(
        this.httpService.request({
          method: req.method as 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
          url: `${targetUrl}${queryString}`,
          data: req.body,
          headers: {
            'content-type': req.headers['content-type'] ?? 'application/json',
          },
        }),
      );
      res.status(response.status).json(response.data);
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        res.status(axiosError.response.status).json(axiosError.response.data);
      } else {
        res.status(502).json({ statusCode: 502, message: 'Bad Gateway — appointments-service unavailable' });
      }
    }
  }
}
