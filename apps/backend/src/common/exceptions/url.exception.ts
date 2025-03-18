import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';

export class UrlNotFoundException extends BaseException {
  constructor(shortCode: string) {
    super(
      `URL with short code "${shortCode}" not found`,
      HttpStatus.NOT_FOUND,
      'URL Not Found',
    );
  }
}

export class InvalidUrlException extends BaseException {
  constructor(url: string) {
    super(`Invalid URL format: ${url}`, HttpStatus.BAD_REQUEST, 'Invalid URL');
  }
}

export class DuplicateShortCodeException extends BaseException {
  constructor(shortCode: string) {
    super(
      `Short code "${shortCode}" is already in use`,
      HttpStatus.CONFLICT,
      'Duplicate Short Code',
    );
  }
}

export class UrlAnalyticsException extends BaseException {
  constructor(message: string) {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR, 'URL Analytics Error');
  }
}

export class InvalidExpirationDateException extends BaseException {
  constructor(message: string) {
    super(message, HttpStatus.BAD_REQUEST, 'Invalid Expiration Date');
  }
}
