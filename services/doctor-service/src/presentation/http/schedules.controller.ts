import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { CreateScheduleDto } from '../../application/dtos/create-schedule.dto';
import { ScheduleResponseDto } from '../../application/dtos/schedule-response.dto';
import { CreateScheduleUseCase } from '../../application/use-cases/create-schedule/create-schedule.use-case';
import { DeleteScheduleUseCase } from '../../application/use-cases/delete-schedule/delete-schedule.use-case';

/**
 * REST controller for doctor schedule management.
 *
 * @authors Andrés Chavarro, Jesús Pinzón, Laura Rodríguez, Sergio Bejarano
 * @version 1.0
 * @since 2026-04-20
 */
@Controller('schedules')
export class SchedulesController {
  constructor(
    private readonly createSchedule: CreateScheduleUseCase,
    private readonly deleteSchedule: DeleteScheduleUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateScheduleDto): Promise<ScheduleResponseDto> {
    return this.createSchedule.execute(dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): Promise<void> {
    return this.deleteSchedule.execute(id);
  }
}
