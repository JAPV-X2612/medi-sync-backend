import { Controller, Get, HttpCode, HttpStatus, Inject, Post, Req, Res } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

/**
 * Proxies all /specialties/** requests to the doctor-service.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-20
 */
@ApiTags('specialties')
@Controller()
export class SpecialtiesProxyController {
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    @Inject(ConfigService) private readonly config: ConfigService,
  ) {
    this.baseUrl = this.config.get<string>('DOCTOR_SERVICE_URL', 'http://localhost:3003');
  }

  @Post('specialties')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a medical specialty' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['name'],
      properties: {
        name: { type: 'string', maxLength: 100, example: 'Cardiology' },
        description: { type: 'string', maxLength: 300, example: 'Heart and cardiovascular system.' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Specialty created.' })
  @ApiResponse({ status: 400, description: 'Validation error.' })
  create(@Req() req: Request, @Res() res: Response): Promise<void> {
    return this.forward(req, res);
  }

  @Get('specialties')
  @ApiOperation({ summary: 'List all specialties' })
  @ApiResponse({ status: 200, description: 'Array of specialties.' })
  findAll(@Req() req: Request, @Res() res: Response): Promise<void> {
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
