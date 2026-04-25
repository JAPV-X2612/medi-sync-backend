import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Inject, Post, Put, Req, Res } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

/**
 * Proxies all /doctors/** requests to the doctor-service.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-20
 */
@ApiTags('doctors')
@Controller()
export class DoctorsProxyController {
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    @Inject(ConfigService) private readonly config: ConfigService,
  ) {
    this.baseUrl = this.config.get<string>('DOCTOR_SERVICE_URL', 'http://localhost:3003');
  }

  @Post('doctors')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a doctor profile' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['firstName', 'lastName', 'email', 'phone', 'licenseNumber', 'specialtyId'],
      properties: {
        firstName: { type: 'string', maxLength: 100, example: 'Maria' },
        lastName: { type: 'string', maxLength: 100, example: 'Garcia' },
        email: { type: 'string', maxLength: 150, example: 'maria.garcia@clinic.com' },
        phone: { type: 'string', maxLength: 20, example: '+57-310-987-6543' },
        licenseNumber: { type: 'string', maxLength: 50, example: 'MED-2024-001' },
        bio: { type: 'string', maxLength: 500, example: 'Cardiologist with 10 years of experience.' },
        specialtyId: { type: 'string', format: 'uuid', example: 'b2c3d4e5-f6a7-8901-bcde-f12345678901' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Doctor profile created.' })
  @ApiResponse({ status: 400, description: 'Validation error.' })
  @ApiResponse({ status: 404, description: 'Specialty not found.' })
  create(@Req() req: Request, @Res() res: Response): Promise<void> {
    return this.forward(req, res);
  }

  @Get('doctors')
  @ApiOperation({ summary: 'List all doctors' })
  @ApiResponse({ status: 200, description: 'Array of doctor profiles.' })
  findAll(@Req() req: Request, @Res() res: Response): Promise<void> {
    return this.forward(req, res);
  }

  @Get('doctors/specialty/:specialtyId')
  @ApiOperation({ summary: 'List doctors by specialty' })
  @ApiParam({ name: 'specialtyId', description: 'Specialty UUID', example: 'b2c3d4e5-f6a7-8901-bcde-f12345678901' })
  @ApiResponse({ status: 200, description: 'Array of doctors in the given specialty.' })
  @ApiResponse({ status: 404, description: 'Specialty not found.' })
  findBySpecialty(@Req() req: Request, @Res() res: Response): Promise<void> {
    return this.forward(req, res);
  }

  @Get('doctors/:id')
  @ApiOperation({ summary: 'Get a doctor by ID' })
  @ApiParam({ name: 'id', description: 'Doctor UUID', example: 'c3d4e5f6-a7b8-9012-cdef-123456789012' })
  @ApiResponse({ status: 200, description: 'Doctor profile found.' })
  @ApiResponse({ status: 404, description: 'Doctor not found.' })
  findById(@Req() req: Request, @Res() res: Response): Promise<void> {
    return this.forward(req, res);
  }

  @Put('doctors/:id')
  @ApiOperation({ summary: 'Update a doctor profile' })
  @ApiParam({ name: 'id', description: 'Doctor UUID', example: 'c3d4e5f6-a7b8-9012-cdef-123456789012' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        firstName: { type: 'string', maxLength: 100, example: 'Maria' },
        lastName: { type: 'string', maxLength: 100, example: 'Garcia' },
        phone: { type: 'string', maxLength: 20, example: '+57-310-987-6543' },
        bio: { type: 'string', maxLength: 500, example: 'Updated biography.' },
        specialtyId: { type: 'string', format: 'uuid', example: 'b2c3d4e5-f6a7-8901-bcde-f12345678901' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Doctor profile updated.' })
  @ApiResponse({ status: 404, description: 'Doctor not found.' })
  update(@Req() req: Request, @Res() res: Response): Promise<void> {
    return this.forward(req, res);
  }

  @Delete('doctors/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove a doctor profile' })
  @ApiParam({ name: 'id', description: 'Doctor UUID', example: 'c3d4e5f6-a7b8-9012-cdef-123456789012' })
  @ApiResponse({ status: 204, description: 'Doctor deleted.' })
  @ApiResponse({ status: 404, description: 'Doctor not found.' })
  remove(@Req() req: Request, @Res() res: Response): Promise<void> {
    return this.forward(req, res);
  }

  @Get('doctors/:id/schedules')
  @ApiOperation({ summary: "List a doctor's schedules" })
  @ApiParam({ name: 'id', description: 'Doctor UUID', example: 'c3d4e5f6-a7b8-9012-cdef-123456789012' })
  @ApiResponse({ status: 200, description: 'Array of schedule slots.' })
  @ApiResponse({ status: 404, description: 'Doctor not found.' })
  getSchedules(@Req() req: Request, @Res() res: Response): Promise<void> {
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
