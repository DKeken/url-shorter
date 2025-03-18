import { Injectable, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';
import type { Cache } from 'cache-manager';
import { db } from '@app/database/db';
import { sql } from 'drizzle-orm';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async getHealth(): Promise<{
    status: string;
    connections: {
      redis: string;
      database: string;
    };
    timestamp: Date;
  }> {
    this.logger.log('Health check requested');

    let redisStatus = 'error';
    let dbStatus = 'error';

    try {
      // Check Redis connection
      this.logger.debug('Checking Redis connection');
      await this.cacheManager.set('health_check', 'ok', 1000);
      const redisResult = await this.cacheManager.get('health_check');
      if (redisResult === 'ok') {
        redisStatus = 'ok';
        this.logger.log('Redis connection successful');
      }
    } catch (error) {
      redisStatus = `error: ${error.message}`;
      this.logger.error(`Redis connection failed: ${error.message}`);
    }

    try {
      // Check database connection by executing a simple query
      this.logger.debug('Checking database connection');
      await db.execute(sql`SELECT 1`);
      dbStatus = 'ok';
      this.logger.log('Database connection successful');
    } catch (error) {
      dbStatus = `error: ${error.message}`;
      this.logger.error(`Database connection failed: ${error.message}`);
    }

    // Determine overall status based on connections
    const overallStatus =
      redisStatus === 'ok' && dbStatus === 'ok' ? 'ok' : 'degraded';

    this.logger.log('Health check completed');
    return {
      status: overallStatus,
      connections: {
        redis: redisStatus,
        database: dbStatus,
      },
      timestamp: new Date(),
    };
  }
}
