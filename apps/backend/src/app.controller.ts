import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Throttle } from '@nestjs/throttler';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { healthThrottlerConfig } from './common/config/throttler.config';

@ApiTags('Health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  @Throttle(healthThrottlerConfig) // More strict rate limiting for health check
  @ApiOperation({ summary: 'Get system health status' })
  @ApiResponse({
    status: 200,
    description: 'Returns the health status of the system and its dependencies',
  })
  getHealth() {
    return this.appService.getHealth();
  }
}
