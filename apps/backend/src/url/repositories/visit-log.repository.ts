import { Injectable } from '@nestjs/common';
import { visitLogs, VisitLog } from '@app/database/schema';
import { db } from '@app/database/db';
import { eq, desc, and, gte, lte } from '@app/database';
import { from, map, Observable } from 'rxjs';

export interface CreateVisitLogParams {
  urlLinkId: number;
  visitorIp: string;
}

export interface DateRangeParams {
  startDate: Date;
  endDate: Date;
}

/**
 * Repository for visit log database operations
 */
@Injectable()
export class VisitLogRepository {
  /**
   * Creates a new visit log record
   * @param params - Visit log creation parameters
   * @returns Observable for completion
   */
  create(params: CreateVisitLogParams): Observable<void> {
    return from(
      db.insert(visitLogs).values({
        urlLinkId: params.urlLinkId,
        visitorIp: params.visitorIp,
      }),
    ).pipe(map(() => void 0));
  }

  /**
   * Finds recent visits for a URL
   * @param urlLinkId - The URL link ID
   * @param limit - Maximum number of records to return
   * @returns Observable with recent visit logs
   */
  findRecentVisits(urlLinkId: number, limit = 5): Observable<VisitLog[]> {
    return from(
      db
        .select()
        .from(visitLogs)
        .where(eq(visitLogs.urlLinkId, urlLinkId))
        .orderBy(desc(visitLogs.visitedAt))
        .limit(limit),
    ).pipe(map((results) => results as VisitLog[]));
  }

  /**
   * Finds visits for a URL within a date range
   * @param urlLinkId - The URL link ID
   * @param dateRange - Date range parameters
   * @returns Observable with visit logs in the date range
   */
  findVisitsInDateRange(
    urlLinkId: number,
    dateRange: DateRangeParams,
  ): Observable<VisitLog[]> {
    return from(
      db
        .select()
        .from(visitLogs)
        .where(
          and(
            eq(visitLogs.urlLinkId, urlLinkId),
            gte(visitLogs.visitedAt, dateRange.startDate),
            lte(visitLogs.visitedAt, dateRange.endDate),
          ),
        )
        .orderBy(desc(visitLogs.visitedAt)),
    ).pipe(map((results) => results as VisitLog[]));
  }

  /**
   * Counts visits per day for a URL within a date range
   * @param urlLinkId - The URL link ID
   * @param days - Number of days to look back
   * @returns Observable with daily visit counts
   */
  countVisitsPerDay(
    urlLinkId: number,
    days = 7,
  ): Observable<{ date: string; count: number }[]> {
    // Calculate the start date (n days ago)
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days + 1);
    startDate.setHours(0, 0, 0, 0);

    return this.findVisitsInDateRange(urlLinkId, {
      startDate,
      endDate,
    }).pipe(
      map((visits) => {
        // Initialize the result with zeros for each day
        const result: Record<string, number> = {};

        // Initialize all dates in the range with 0 count
        for (let i = 0; i < days; i++) {
          const date = new Date(startDate);
          date.setDate(date.getDate() + i);
          const dateStr = date.toISOString().split('T')[0];
          result[dateStr] = 0;
        }

        // Count visits per day
        visits.forEach((visit) => {
          const dateStr = new Date(visit.visitedAt).toISOString().split('T')[0];
          if (result[dateStr] !== undefined) {
            result[dateStr]++;
          }
        });

        // Convert to array format
        return Object.entries(result)
          .map(([date, count]) => ({
            date,
            count,
          }))
          .sort((a, b) => a.date.localeCompare(b.date));
      }),
    );
  }
}
