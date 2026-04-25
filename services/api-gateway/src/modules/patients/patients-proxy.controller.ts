import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Inject, Param, Post, Put, Req, Res } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

/**
 * Proxies all /patients/** requests to the patient-service.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-20
 */
@ApiTags('patients')
@Controller()
export class PatientsProxyController {
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    @Inject(ConfigService) private readonly config: ConfigService,
  ) {
    this.baseUrl = this.config.get<string>('PATIENT_SERVICE_URL', 'http://localhost:3002');
  }

  @Post('patients')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new patient' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['firstName', 'lastName', 'email', 'phone', 'birthDate', 'documentNumber', 'documentType'],
      properties: {
        firstName: { type: 'string', maxLength: 100, example: 'John' },
        lastName: { type: 'string', maxLength: 100, example: 'Doe' },
        email: { type: 'string', maxLength: 150, example: 'john.doe@email.com' },
        phone: { type: 'string', maxLength: 20, example: '+57-300-123-4567' },
        birthDate: { type: 'string', format: 'date', example: '1990-06-15' },
        bloodType: { type: 'string', maxLength: 5, example: 'O+' },
        documentNumber: { type: 'string', maxLength: 20, example: '1234567890' },
        documentType: { type: 'string', enum: ['CC', 'TI', 'CE', 'PASSPORT'], example: 'CC' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Patient created successfully.' })
  @ApiResponse({ status: 400, description: 'Validation error.' })
  @ApiResponse({ status: 409, description: 'Email already registered.' })
  create(@Req() req: Request, @Res() res: Response): Promise<void> {
    return this.forward(req, res);
  }

  @Get('patients')
  @ApiOperation({ summary: 'List all patients' })
  @ApiResponse({ status: 200, description: 'Array of patients.' })
  findAll(@Req() req: Request, @Res() res: Response): Promise<void> {
    return this.forward(req, res);
  }

  @Get('patients/:id')
  @ApiOperation({ summary: 'Get a patient by ID' })
  @ApiParam({ name: 'id', description: 'Patient UUID', example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  @ApiResponse({ status: 200, description: 'Patient found.' })
  @ApiResponse({ status: 404, description: 'Patient not found.' })
  findById(@Req() req: Request, @Res() res: Response): Promise<void> {
    return this.forward(req, res);
  }

  @Put('patients/:id')
  @ApiOperation({ summary: 'Update patient data' })
  @ApiParam({ name: 'id', description: 'Patient UUID', example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        firstName: { type: 'string', maxLength: 100, example: 'John' },
        lastName: { type: 'string', maxLength: 100, example: 'Doe' },
        phone: { type: 'string', maxLength: 20, example: '+57-300-123-4567' },
        bloodType: { type: 'string', maxLength: 5, example: 'A+' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Patient updated.' })
  @ApiResponse({ status: 404, description: 'Patient not found.' })
  update(@Req() req: Request, @Res() res: Response): Promise<void> {
    return this.forward(req, res);
  }

  @Delete('patients/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove a patient' })
  @ApiParam({ name: 'id', description: 'Patient UUID', example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  @ApiResponse({ status: 204, description: 'Patient deleted.' })
  @ApiResponse({ status: 404, description: 'Patient not found.' })
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
        res.status(502).json({ statusCode: 502, message: 'Bad Gateway — patient-service unavailable' });
      }
    }
  }
}
