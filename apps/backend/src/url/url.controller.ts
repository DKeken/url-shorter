import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  BadRequestException,
  NotFoundException,
  Redirect,
  Logger,
  Req,
  Header,
} from '@nestjs/common';
import { UrlService } from './url.service';
import { CreateUrlDto } from './dto/create-url.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiProduces,
} from '@nestjs/swagger';
import {
  UrlNotFoundException,
  DuplicateShortCodeException,
  InvalidUrlException,
  InvalidExpirationDateException,
} from '../common/exceptions';
import { Observable, catchError, map } from 'rxjs';
import type { Request } from 'express';
import { UrlDto } from './dto/url.dto';
import { AnalyticsDto } from './dto/analytics.dto';

@ApiTags('URL')
@Controller('url')
@ApiProduces('application/json')
export class UrlController {
  private readonly logger = new Logger(UrlController.name);

  constructor(private readonly urlService: UrlService) {}

  @Post('shorten')
  @ApiOperation({ summary: 'Create a short URL' })
  @ApiResponse({ status: 201, description: 'URL successfully shortened' })
  @ApiResponse({
    status: 400,
    description: 'Invalid URL format or expiration date',
  })
  @ApiResponse({ status: 409, description: 'Short code already in use' })
  @ApiConsumes('application/json')
  @Header('Content-Type', 'application/json')
  createShortUrl(@Body() createUrlDto: CreateUrlDto): Observable<string> {
    return this.urlService.createShortUrl(createUrlDto).pipe(
      catchError((error) => {
        if (error instanceof DuplicateShortCodeException) {
          throw new BadRequestException(error.message);
        }
        if (error instanceof InvalidUrlException) {
          throw new BadRequestException(error.message);
        }
        if (error instanceof InvalidExpirationDateException) {
          throw new BadRequestException(error.message);
        }
        throw error;
      }),
    );
  }

  @Get(':shortCode')
  @ApiOperation({ summary: 'Get original URL and redirect' })
  @ApiResponse({ status: 302, description: 'Redirect to original URL' })
  @ApiResponse({ status: 404, description: 'URL not found' })
  @Redirect()
  getOriginalUrl(
    @Param('shortCode') shortCode: string,
    @Req() request: Request,
  ): Observable<{ url: string }> {
    this.logger.log(`Redirecting short code: ${shortCode}`);

    const visitorIp = request.ip || request.socket.remoteAddress || '0.0.0.0';

    return this.urlService.getOriginalUrl(shortCode, visitorIp).pipe(
      map((urlRecord) => {
        this.logger.log(`Found original URL: ${urlRecord.originalUrl}`);
        return { url: urlRecord.originalUrl };
      }),
      catchError((error) => {
        this.logger.error(
          `Error redirecting short code ${shortCode}: ${error.message}`,
        );
        if (error instanceof UrlNotFoundException) {
          throw new NotFoundException(error.message);
        }
        throw error;
      }),
    );
  }

  @Get('info/:shortCode')
  @ApiOperation({ summary: 'Get URL information' })
  @ApiResponse({
    status: 200,
    description: 'URL information retrieved',
    type: UrlDto,
  })
  @ApiResponse({ status: 404, description: 'URL not found' })
  @Header('Content-Type', 'application/json')
  getUrlInfo(@Param('shortCode') shortCode: string): Observable<UrlDto> {
    return this.urlService.getUrlInfo(shortCode).pipe(
      catchError((error) => {
        if (error instanceof UrlNotFoundException) {
          throw new NotFoundException(error.message);
        }
        throw error;
      }),
    );
  }

  @Delete('delete/:shortCode')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a short URL' })
  @ApiResponse({ status: 204, description: 'URL successfully deleted' })
  @ApiResponse({ status: 404, description: 'URL not found' })
  deleteUrl(@Param('shortCode') shortCode: string): Observable<void> {
    return this.urlService.deleteUrl(shortCode).pipe(
      catchError((error) => {
        if (error instanceof UrlNotFoundException) {
          throw new NotFoundException(error.message);
        }
        throw error;
      }),
    );
  }

  @Get('analytics/:shortCode')
  @ApiOperation({ summary: 'Get URL analytics' })
  @ApiResponse({
    status: 200,
    description: 'URL analytics retrieved',
    type: AnalyticsDto,
  })
  @ApiResponse({ status: 404, description: 'URL not found' })
  @Header('Content-Type', 'application/json')
  getUrlAnalytics(
    @Param('shortCode') shortCode: string,
  ): Observable<AnalyticsDto> {
    return this.urlService.getUrlAnalytics(shortCode).pipe(
      catchError((error) => {
        if (error instanceof UrlNotFoundException) {
          throw new NotFoundException(error.message);
        }
        throw error;
      }),
    );
  }
}
