import { All, Controller, Inject, Req, Res } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

/**
 * Proxies all /doctors/** and /specialties/** and /schedules/** requests to the doctor-service.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-20
 */
@Controller()
export class DoctorsProxyController {
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    @Inject(ConfigService) private readonly config: ConfigService,
  ) {
    this.baseUrl = this.config.get<string>('DOCTOR_SERVICE_URL', 'http://localhost:3003');
  }

  @All('doctors/*path')
  proxyDoctors(@Req() req: Request, @Res() res: Response): Promise<void> {
    return this.forward(req, res);
  }

  @All('doctors')
  proxyDoctorsRoot(@Req() req: Request, @Res() res: Response): Promise<void> {
    return this.forward(req, res);
  }

  @All('specialties/*path')
  proxySpecialties(@Req() req: Request, @Res() res: Response): Promise<void> {
    return this.forward(req, res);
  }

  @All('specialties')
  proxySpecialtiesRoot(@Req() req: Request, @Res() res: Response): Promise<void> {
    return this.forward(req, res);
  }

  @All('schedules/*path')
  proxySchedules(@Req() req: Request, @Res() res: Response): Promise<void> {
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
