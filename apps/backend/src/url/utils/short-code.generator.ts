import { Injectable } from '@nestjs/common';
import { randomBytes } from 'node:crypto';

/**
 * Utility service for generating short codes for URLs
 */
@Injectable()
export class ShortCodeGenerator {
  /**
   * Generates a random short code
   * @param length - The length of the short code in bytes (default: 3)
   * @returns A random hexadecimal string
   */
  generate(length = 3): string {
    return randomBytes(length).toString('hex');
  }
}
