import { Controller, Get } from '@nestjs/common';

/**
 * Root health-check controller for the patient-service.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-20
 */
@Controller()
export class AppController {
  @Get('health')
  health(): { status: string; service: string } {
    return { status: 'ok', service: 'patient-service' };
  }
}
