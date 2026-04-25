import { Controller, Delete, HttpCode, HttpStatus, Inject, Post, Req, Res } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

/**
 * Proxies all /schedules/** requests to the doctor-service.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-20
 */
@ApiTags('schedules')
@Controller()
export class SchedulesProxyController {
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    @Inject(ConfigService) private readonly config: ConfigService,
  ) {
    this.baseUrl = this.config.get<string>('DOCTOR_SERVICE_URL', 'http://localhost:3003');
  }

  @Post('schedules')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add a weekly schedule slot to a doctor' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['doctorId', 'dayOfWeek', 'startTime', 'endTime', 'slotDurationMin'],
      properties: {
        doctorId: { type: 'string', format: 'uuid', example: 'c3d4e5f6-a7b8-9012-cdef-123456789012' },
        dayOfWeek: { type: 'integer', minimum: 0, maximum: 6, example: 1, description: '0 = Sunday … 6 = Saturday' },
        startTime: { type: 'string', maxLength: 5, example: '08:00' },
        endTime: { type: 'string', maxLength: 5, example: '12:00' },
        slotDurationMin: { type: 'integer', minimum: 5, maximum: 480, example: 30 },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Schedule slot created.' })
  @ApiResponse({ status: 400, description: 'Validation error.' })
  @ApiResponse({ status: 404, description: 'Doctor not found.' })
  create(@Req() req: Request, @Res() res: Response): Promise<void> {
    return this.forward(req, res);
  }

  @Delete('schedules/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove a schedule slot' })
  @ApiParam({ name: 'id', description: 'Schedule UUID', example: 'd4e5f6a7-b8c9-0123-defg-234567890123' })
  @ApiResponse({ status: 204, description: 'Schedule deleted.' })
  @ApiResponse({ status: 404, description: 'Schedule not found.' })
  remove(@Req() req: Request, @Res() res: Response): Promise<void> {
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
        res.status(502).json({ statusCode: 502, message: 'Bad Gateway — doctor-service unavailable' });
      }
    }
  }
}
