import { ThrottlerModuleOptions } from '@nestjs/throttler';
import { env } from './env';

/**
 * Configuration for the global throttler
 */
export const throttlerConfig: ThrottlerModuleOptions = [
  {
    ttl: env.THROTTLE_GLOBAL_TTL,
    limit: env.THROTTLE_GLOBAL_LIMIT,
  },
];

/**
 * Configuration for specific health endpoint throttling
 */
export const healthThrottlerConfig = {
  default: {
    ttl: env.THROTTLE_HEALTH_TTL,
    limit: env.THROTTLE_HEALTH_LIMIT,
  },
};
