import {
  IsString,
  IsOptional,
  IsUrl,
  MaxLength,
  IsDateString,
  IsNotEmpty,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUrlDto {
  @ApiProperty({
    description: 'The original URL to be shortened',
    example: 'https://example.com/long-url',
  })
  @IsUrl({
    protocols: ['http', 'https'],
    require_protocol: true,
  })
  @IsNotEmpty()
  originalUrl: string;

  @ApiPropertyOptional({
    description: 'Custom alias for the short URL (max 20 characters)',
    example: 'my-custom-alias',
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  @Matches(/^[a-zA-Z0-9_-]+$/, {
    message:
      'Custom alias can only contain letters, numbers, underscores and hyphens',
  })
  alias?: string;

  @ApiPropertyOptional({
    description: 'Expiration date for the short URL',
    example: '2025-12-31T23:59:59Z',
  })
  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}
