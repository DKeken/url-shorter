import { Injectable, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';
import type { Cache } from 'cache-manager';
import { Observable, from, map } from 'rxjs';
import { firstValueFrom } from 'rxjs';
import axios from 'axios';

interface IpGeolocationResponse {
  country: string;
  countryCode: string;
  region: string;
  regionName: string;
  city: string;
  zip: string;
  lat: number;
  lon: number;
  timezone: string;
  isp: string;
  org: string;
  as: string;
  query: string;
}

export interface GeoPoint {
  lat: number;
  lon: number;
  weight: number;
}

export interface GeoCountryStats {
  countryCode: string;
  country: string;
  count: number;
  percentage: number;
}

export interface GeoCityStats {
  city: string;
  country: string;
  countryCode: string;
  count: number;
  lat: number;
  lon: number;
}

export interface GeoAnalytics {
  mapPoints: GeoPoint[];
  countriesStats: GeoCountryStats[];
  citiesStats: GeoCityStats[];
}

@Injectable()
export class IpGeolocationService {
  private readonly logger = new Logger(IpGeolocationService.name);
  private readonly CACHE_TTL = 24 * 60 * 60; // 24 hours in seconds

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  /**
   * Gets geolocation information for an IP address
   * @param ip - The IP address to look up
   * @returns Observable with geolocation information
   */
  getGeolocation(ip: string): Observable<IpGeolocationResponse> {
    return from(this.getGeolocationWithCache(ip));
  }

  /**
   * Generates analytics visualization data from an array of geolocation data
   * @param geolocations - Array of geolocation data
   * @returns Analytics data for visualizations
   */
  generateAnalyticsData(geolocations: IpGeolocationResponse[]): GeoAnalytics {
    // Filter out 'Unknown' countries
    const validGeolocations = geolocations.filter(
      (geo) => geo.country !== 'Unknown' && geo.lat !== 0 && geo.lon !== 0,
    );

    // Generate heat map points
    const mapPoints = this.generateMapPoints(validGeolocations);

    // Generate country statistics
    const countriesStats = this.generateCountryStats(validGeolocations);

    // Generate city statistics
    const citiesStats = this.generateCityStats(validGeolocations);

    return {
      mapPoints,
      countriesStats,
      citiesStats,
    };
  }

  /**
   * Generate map points for heat map visualization
   * @param geolocations - Array of geolocation data
   * @returns Array of map points with weights
   */
  private generateMapPoints(geolocations: IpGeolocationResponse[]): GeoPoint[] {
    const pointsMap = new Map<string, GeoPoint>();

    geolocations.forEach((geo) => {
      const key = `${geo.lat},${geo.lon}`;
      const existingPoint = pointsMap.get(key);

      if (existingPoint) {
        existingPoint.weight += 1;
      } else {
        pointsMap.set(key, {
          lat: geo.lat,
          lon: geo.lon,
          weight: 1,
        });
      }
    });

    return Array.from(pointsMap.values());
  }

  /**
   * Generate country statistics
   * @param geolocations - Array of geolocation data
   * @returns Array of country statistics
   */
  private generateCountryStats(
    geolocations: IpGeolocationResponse[],
  ): GeoCountryStats[] {
    const countryCount = new Map<string, { country: string; count: number }>();

    geolocations.forEach((geo) => {
      const existingCount = countryCount.get(geo.countryCode);

      if (existingCount) {
        existingCount.count += 1;
      } else {
        countryCount.set(geo.countryCode, {
          country: geo.country,
          count: 1,
        });
      }
    });

    const totalVisits = geolocations.length;

    return Array.from(countryCount.entries())
      .map(([countryCode, { country, count }]) => ({
        countryCode,
        country,
        count,
        percentage: Math.round((count / totalVisits) * 100),
      }))
      .sort((a, b) => b.count - a.count);
  }

  /**
   * Generate city statistics
   * @param geolocations - Array of geolocation data
   * @returns Array of city statistics
   */
  private generateCityStats(
    geolocations: IpGeolocationResponse[],
  ): GeoCityStats[] {
    const cityCount = new Map<string, GeoCityStats>();

    geolocations.forEach((geo) => {
      if (!geo.city) return;

      const key = `${geo.city}-${geo.countryCode}`;
      const existingCount = cityCount.get(key);

      if (existingCount) {
        existingCount.count += 1;
      } else {
        cityCount.set(key, {
          city: geo.city,
          country: geo.country,
          countryCode: geo.countryCode,
          count: 1,
          lat: geo.lat,
          lon: geo.lon,
        });
      }
    });

    return Array.from(cityCount.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Return top 10 cities
  }

  /**
   * Gets geolocation information for an IP address with caching
   * @param ip - The IP address to look up
   * @returns Promise with geolocation information
   */
  private async getGeolocationWithCache(
    ip: string,
  ): Promise<IpGeolocationResponse> {
    // Skip geolocation for localhost or private IPs
    if (this.isPrivateIP(ip)) {
      return this.getDefaultGeolocation(ip);
    }

    const cacheKey = `ip_geo:${ip}`;

    try {
      // Try to get from cache first
      const cached =
        await this.cacheManager.get<IpGeolocationResponse>(cacheKey);
      if (cached) {
        this.logger.debug(`Cache hit for IP: ${ip}`);
        return cached;
      }

      // If not in cache, fetch from API
      this.logger.debug(`Fetching geolocation for IP: ${ip}`);
      const response = await axios.get<IpGeolocationResponse>(
        `http://ip-api.com/json/${ip}?fields=country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,query`,
        {
          timeout: 3000, // 3 second timeout
        },
      );

      const data = response.data;

      // Cache the result
      await this.cacheManager.set(cacheKey, data, this.CACHE_TTL);

      return data;
    } catch (error) {
      this.logger.error(
        `Error fetching geolocation for IP ${ip}: ${error.message}`,
      );
      return this.getDefaultGeolocation(ip);
    }
  }

  /**
   * Checks if an IP address is private (localhost, etc.)
   * @param ip - The IP address to check
   * @returns True if the IP is private
   */
  private isPrivateIP(ip: string): boolean {
    return (
      ip === '127.0.0.1' ||
      ip === '::1' ||
      ip === 'localhost' ||
      ip === '0.0.0.0' ||
      ip.startsWith('192.168.') ||
      ip.startsWith('10.') ||
      ip.startsWith('172.16.')
    );
  }

  /**
   * Gets default geolocation data for an IP
   * @param ip - The IP address
   * @returns Default geolocation response
   */
  private getDefaultGeolocation(ip: string): IpGeolocationResponse {
    return {
      country: 'Unknown',
      countryCode: 'UN',
      region: '',
      regionName: '',
      city: '',
      zip: '',
      lat: 0,
      lon: 0,
      timezone: '',
      isp: '',
      org: '',
      as: '',
      query: ip,
    };
  }
}
