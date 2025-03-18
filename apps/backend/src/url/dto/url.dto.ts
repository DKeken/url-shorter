import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UrlDto {
  @ApiProperty({
    description: 'The unique identifier of the URL',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'The original URL that was shortened',
    example: 'https://example.com/long-url',
  })
  originalUrl: string;

  @ApiProperty({
    description: 'The short code for the URL',
    example: 'abc123',
  })
  shortCode: string;

  @ApiPropertyOptional({
    description: 'Custom alias for the short URL',
    example: 'my-custom-alias',
  })
  alias: string | null;

  @ApiProperty({
    description: 'Number of times the short URL has been visited',
    example: 42,
  })
  clickCount: number;

  @ApiProperty({
    description: 'Date when the short URL was created',
    example: '2023-01-01T00:00:00Z',
  })
  createdAt: Date;

  @ApiPropertyOptional({
    description: 'Date when the short URL expires',
    example: '2025-12-31T23:59:59Z',
  })
  expiresAt: Date | null;
}
