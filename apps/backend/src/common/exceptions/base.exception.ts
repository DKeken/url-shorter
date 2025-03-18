import { HttpException, HttpStatus } from '@nestjs/common';

export class BaseException extends HttpException {
  constructor(
    message: string,
    status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
    error?: string,
  ) {
    super(
      {
        message,
        error: error || 'Internal Server Error',
        statusCode: status,
      },
      status,
    );
  }
}
