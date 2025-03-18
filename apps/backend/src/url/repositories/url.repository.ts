import { Injectable, Logger } from '@nestjs/common';
import { urlLinks, UrlLink } from '@app/database/schema';
import { db } from '@app/database/db';
import { eq, lt } from '@app/database';
import { from, map, Observable, throwError, catchError, tap } from 'rxjs';
import {
  UrlNotFoundException,
  UrlAnalyticsException,
} from '../../common/exceptions';

export interface CreateUrlParams {
  originalUrl: string;
  shortCode: string;
  alias: string | null;
  expiresAt: Date | null;
}

/**
 * Repository for URL database operations
 */
@Injectable()
export class UrlRepository {
  private readonly logger = new Logger(UrlRepository.name);

  /**
   * Creates a new URL record
   * @param params - URL creation parameters
   * @returns Observable for completion
   */
  create(params: CreateUrlParams): Observable<void> {
    return from(
      db.insert(urlLinks).values({
        originalUrl: params.originalUrl,
        shortCode: params.shortCode,
        alias: params.alias,
        expiresAt: params.expiresAt,
      }),
    ).pipe(map(() => void 0));
  }

  /**
   * Finds a URL record by its short code
   * @param shortCode - The short code to look up
   * @returns Observable with the URL record
   * @throws UrlNotFoundException if URL is not found
   */
  findByShortCode(shortCode: string): Observable<UrlLink> {
    return from(
      db.select().from(urlLinks).where(eq(urlLinks.shortCode, shortCode)),
    ).pipe(
      map((result) => {
        if (result.length === 0) {
          throw new UrlNotFoundException(shortCode);
        }
        return result[0] as UrlLink;
      }),
    );
  }

  /**
   * Deletes a URL record by its short code
   * @param shortCode - The short code to delete
   * @returns Observable for completion
   * @throws UrlNotFoundException if URL is not found
   */
  deleteByShortCode(shortCode: string): Observable<void> {
    return from(
      db.delete(urlLinks).where(eq(urlLinks.shortCode, shortCode)),
    ).pipe(
      tap((result) => {
        if (!result) {
          throw new UrlNotFoundException(shortCode);
        }
      }),
      map(() => void 0),
    );
  }

  /**
   * Increments the visit count for a URL
   * @param shortCode - The short code to update
   * @param currentVisitCount - The current visit count
   * @returns Observable for completion
   */
  incrementVisitCount(
    shortCode: string,
    currentVisitCount: number,
  ): Observable<void> {
    return from(
      db
        .update(urlLinks)
        .set({ clickCount: currentVisitCount + 1 })
        .where(eq(urlLinks.shortCode, shortCode)),
    ).pipe(
      map(() => void 0),
      catchError(() =>
        throwError(
          () => new UrlAnalyticsException('Failed to increment visit count'),
        ),
      ),
    );
  }

  /**
   * Deletes all expired URLs
   * @returns Observable with the number of deleted records
   */
  deleteExpired(): Observable<number> {
    const now = new Date();

    return from(db.delete(urlLinks).where(lt(urlLinks.expiresAt, now))).pipe(
      map((result) => result as unknown as number),
    );
  }
}
