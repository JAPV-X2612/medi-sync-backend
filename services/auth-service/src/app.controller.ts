import { Controller, Get } from '@nestjs/common';

/**
 * Auth-service stub — authentication is out of scope for this release.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-20
 */
@Controller()
export class AppController {
  @Get('health')
  health(): { status: string } {
    return { status: 'auth-service: not yet implemented' };
  }
}
