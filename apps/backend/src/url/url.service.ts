import { Injectable, Logger } from '@nestjs/common';
import { CreateUrlDto } from './dto/create-url.dto';
import { env } from '../common/config/env';
import {
  UrlNotFoundException,
  DuplicateShortCodeException,
  UrlAnalyticsException,
  InvalidExpirationDateException,
} from '../common/exceptions';
import {
  catchError,
  map,
  mergeMap,
  throwError,
  of,
  tap,
  Observable,
  forkJoin,
} from 'rxjs';
import { UrlRepository } from './repositories/url.repository';
import { VisitLogRepository } from './repositories/visit-log.repository';
import { ShortCodeGenerator } from './utils/short-code.generator';
import { UrlDto } from './dto/url.dto';
import { AnalyticsDto } from './dto/analytics.dto';
import { IpGeolocationService } from './services/ip-geolocation.service';

/**
 * Service for managing URL shortening operations
 */
@Injectable()
export class UrlService {
  private readonly logger = new Logger(UrlService.name);

  constructor(
    private readonly urlRepository: UrlRepository,
    private readonly visitLogRepository: VisitLogRepository,
    private readonly shortCodeGenerator: ShortCodeGenerator,
    private readonly ipGeolocationService: IpGeolocationService,
  ) {}

  /**
   * Creates a new short URL
   * @param dto - Data transfer object containing URL information
   * @returns Observable with the generated short URL
   */
  createShortUrl(dto: CreateUrlDto): Observable<string> {
    const shortCode = dto.alias || this.shortCodeGenerator.generate();

    // Validate expiration date is not in the past
    if (dto.expiresAt) {
      const expirationDate = new Date(dto.expiresAt);
      const currentDate = new Date();

      if (expirationDate < currentDate) {
        return throwError(
          () =>
            new InvalidExpirationDateException(
              'Expiration date cannot be in the past',
            ),
        );
      }
    }

    return this.urlRepository
      .create({
        originalUrl: dto.originalUrl,
        shortCode,
        alias: dto.alias || null,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
      })
      .pipe(
        map(() => `${env.BASE_URL}/url/${shortCode}`),
        catchError((error) => {
          if (error.code === '23505') {
            // PostgreSQL unique violation error code
            return throwError(
              () =>
                new DuplicateShortCodeException(dto.alias || 'generated code'),
            );
          }
          return throwError(
            () => new UrlAnalyticsException('Failed to create short URL'),
          );
        }),
      );
  }

  /**
   * Retrieves the original URL by its short code and increments visit count
   * @param shortCode - The short code to look up
   * @param visitorIp - The IP address of the visitor
   * @returns Observable with the URL information
   * @throws NotFoundException if URL is not found
   */
  getOriginalUrl(shortCode: string, visitorIp: string): Observable<UrlDto> {
    this.logger.log(`Looking up short code: ${shortCode}`);

    return this.urlRepository.findByShortCode(shortCode).pipe(
      mergeMap((urlRecord) => {
        if (urlRecord.expiresAt && urlRecord.expiresAt < new Date()) {
          this.logger.log(
            `URL with short code ${shortCode} has expired, deleting it`,
          );
          return this.deleteExpiredUrl(shortCode).pipe(
            mergeMap(() =>
              throwError(() => new UrlNotFoundException(shortCode)),
            ),
          );
        }

        this.logger.log(`Logging visit for ${shortCode}`);
        return this.visitLogRepository
          .create({
            urlLinkId: urlRecord.id,
            visitorIp,
          })
          .pipe(
            mergeMap(() =>
              this.urlRepository.incrementVisitCount(
                shortCode,
                urlRecord.clickCount,
              ),
            ),
            map(() => {
              this.logger.log(
                `Successfully processed redirect for ${shortCode}`,
              );
              return urlRecord;
            }),
          );
      }),
      catchError((error) => {
        this.logger.error(
          `Error retrieving URL for ${shortCode}: ${error.message}`,
        );
        if (error instanceof UrlNotFoundException) {
          return throwError(() => error);
        }
        return throwError(
          () => new UrlAnalyticsException('Failed to get original URL'),
        );
      }),
    );
  }

  /**
   * Retrieves URL information without incrementing visit count
   * @param shortCode - The short code to look up
   * @returns Observable with the URL information
   * @throws NotFoundException if URL is not found
   */
  getUrlInfo(shortCode: string): Observable<UrlDto> {
    return this.urlRepository.findByShortCode(shortCode).pipe(
      map((urlRecord) => ({
        id: urlRecord.id,
        shortCode: urlRecord.shortCode,
        alias: urlRecord.alias,
        originalUrl: urlRecord.originalUrl,
        createdAt: urlRecord.createdAt,
        clickCount: urlRecord.clickCount,
        expiresAt: urlRecord.expiresAt,
      })),
      catchError((error) => {
        if (error instanceof UrlNotFoundException) {
          return throwError(() => error);
        }
        return throwError(
          () => new UrlAnalyticsException('Failed to get URL information'),
        );
      }),
    );
  }

  /**
   * Deletes a URL record by its short code
   * @param shortCode - The short code to delete
   * @returns Observable for completion
   */
  deleteUrl(shortCode: string): Observable<void> {
    return this.urlRepository.deleteByShortCode(shortCode).pipe(
      catchError((error) => {
        if (error instanceof UrlNotFoundException) {
          return throwError(() => error);
        }
        return throwError(
          () => new UrlAnalyticsException('Failed to delete URL'),
        );
      }),
    );
  }

  /**
   * Deletes an expired URL record by its short code
   * @param shortCode - The short code to delete
   * @returns Observable for completion
   */
  private deleteExpiredUrl(shortCode: string): Observable<void> {
    return this.urlRepository.deleteByShortCode(shortCode).pipe(
      catchError(() => {
        // Just log error but don't throw to prevent blocking the redirect flow
        this.logger.error(
          `Failed to delete expired URL with code: ${shortCode}`,
        );
        return of(void 0);
      }),
    );
  }

  /**
   * Retrieves analytics information for a URL
   * @param shortCode - The short code to get analytics for
   * @returns Observable with visit count and recent visits
   * @throws NotFoundException if URL is not found
   */
  getUrlAnalytics(shortCode: string): Observable<AnalyticsDto> {
    return this.urlRepository.findByShortCode(shortCode).pipe(
      mergeMap((urlRecord) => {
        // Get recent visits
        const recentVisitsObs = this.visitLogRepository.findRecentVisits(
          urlRecord.id,
          20,
        );

        // Get time series data
        const timeSeriesObs = this.visitLogRepository.countVisitsPerDay(
          urlRecord.id,
          7,
        );

        return forkJoin({
          recentVisits: recentVisitsObs,
          timeSeries: timeSeriesObs,
        }).pipe(
          mergeMap(({ recentVisits, timeSeries }) => {
            // Get geolocation for each visit
            const geolocationRequests = recentVisits.map((visit) =>
              this.ipGeolocationService.getGeolocation(visit.visitorIp).pipe(
                map((geo) => ({
                  visit,
                  geo,
                })),
              ),
            );

            return forkJoin(geolocationRequests).pipe(
              map((results) => {
                const visitsWithGeo = results.map(({ visit, geo }) => ({
                  ip: visit.visitorIp,
                  visitedAt: visit.visitedAt,
                  geolocation: {
                    country: geo.country,
                    countryCode: geo.countryCode,
                    city: geo.city,
                    regionName: geo.regionName,
                    lat: geo.lat,
                    lon: geo.lon,
                  },
                }));

                // Calculate unique countries and cities
                const uniqueCountries = new Set(
                  visitsWithGeo
                    .map((v) => v.geolocation.country)
                    .filter((c) => c !== 'Unknown'),
                ).size;
                const uniqueCities = new Set(
                  visitsWithGeo
                    .map((v) => v.geolocation.city)
                    .filter((c) => c !== ''),
                ).size;

                // Get all geolocations for visualization
                const allGeolocations = results.map(({ geo }) => geo);

                // Generate analytics data for visualizations (except time series)
                const visualizationData =
                  this.ipGeolocationService.generateAnalyticsData(
                    allGeolocations,
                  );

                return {
                  visitCount: urlRecord.clickCount,
                  recentVisits: visitsWithGeo.slice(0, 5), // Only return the 5 most recent visits
                  uniqueCountries,
                  uniqueCities,
                  mapPoints: visualizationData.mapPoints,
                  countriesStats: visualizationData.countriesStats,
                  citiesStats: visualizationData.citiesStats,
                  // Use real time series data instead of generated data
                  timeSeriesData: timeSeries,
                };
              }),
            );
          }),
        );
      }),
      catchError((error) => {
        if (error instanceof UrlNotFoundException) {
          return throwError(() => error);
        }
        return throwError(
          () => new UrlAnalyticsException('Failed to get URL analytics'),
        );
      }),
    );
  }
}
