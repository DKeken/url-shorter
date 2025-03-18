import { ApiProperty } from '@nestjs/swagger';

export class GeolocationDto {
  @ApiProperty({
    description: 'Country name',
    example: 'United States',
  })
  country: string;

  @ApiProperty({
    description: 'Country code',
    example: 'US',
  })
  countryCode: string;

  @ApiProperty({
    description: 'City name',
    example: 'New York',
  })
  city: string;

  @ApiProperty({
    description: 'Region name',
    example: 'New York',
  })
  regionName: string;

  @ApiProperty({
    description: 'Latitude',
    example: 40.7128,
  })
  lat: number;

  @ApiProperty({
    description: 'Longitude',
    example: -74.006,
  })
  lon: number;
}

export class GeoPointDto {
  @ApiProperty({
    description: 'Latitude',
    example: 40.7128,
  })
  lat: number;

  @ApiProperty({
    description: 'Longitude',
    example: -74.006,
  })
  lon: number;

  @ApiProperty({
    description: 'Weight (number of visits)',
    example: 5,
  })
  weight: number;
}

export class GeoCountryStatsDto {
  @ApiProperty({
    description: 'Country code',
    example: 'US',
  })
  countryCode: string;

  @ApiProperty({
    description: 'Country name',
    example: 'United States',
  })
  country: string;

  @ApiProperty({
    description: 'Number of visits',
    example: 42,
  })
  count: number;

  @ApiProperty({
    description: 'Percentage of total visits',
    example: 75,
  })
  percentage: number;
}

export class GeoCityStatsDto {
  @ApiProperty({
    description: 'City name',
    example: 'New York',
  })
  city: string;

  @ApiProperty({
    description: 'Country name',
    example: 'United States',
  })
  country: string;

  @ApiProperty({
    description: 'Country code',
    example: 'US',
  })
  countryCode: string;

  @ApiProperty({
    description: 'Number of visits',
    example: 15,
  })
  count: number;

  @ApiProperty({
    description: 'Latitude',
    example: 40.7128,
  })
  lat: number;

  @ApiProperty({
    description: 'Longitude',
    example: -74.006,
  })
  lon: number;
}

export class GeoTimeSeriesDto {
  @ApiProperty({
    description: 'Date',
    example: '2023-07-01',
  })
  date: string;

  @ApiProperty({
    description: 'Number of visits',
    example: 8,
  })
  count: number;
}

export class VisitDto {
  @ApiProperty({
    description: 'IP address of the visitor',
    example: '192.168.1.1',
  })
  ip: string;

  @ApiProperty({
    description: 'Date and time of the visit',
    example: '2023-01-01T10:30:00Z',
  })
  visitedAt: Date;

  @ApiProperty({
    description: 'Geolocation information',
    type: GeolocationDto,
  })
  geolocation: GeolocationDto;
}

export class AnalyticsDto {
  @ApiProperty({
    description: 'Total number of visits to the URL',
    example: 42,
  })
  visitCount: number;

  @ApiProperty({
    description: 'Recent visits to the URL',
    type: [VisitDto],
  })
  recentVisits: VisitDto[];

  @ApiProperty({
    description: 'Number of unique countries',
    example: 5,
  })
  uniqueCountries: number;

  @ApiProperty({
    description: 'Number of unique cities',
    example: 10,
  })
  uniqueCities: number;

  @ApiProperty({
    description: 'Map visualization points',
    type: [GeoPointDto],
  })
  mapPoints: GeoPointDto[];

  @ApiProperty({
    description: 'Country statistics',
    type: [GeoCountryStatsDto],
  })
  countriesStats: GeoCountryStatsDto[];

  @ApiProperty({
    description: 'City statistics',
    type: [GeoCityStatsDto],
  })
  citiesStats: GeoCityStatsDto[];

  @ApiProperty({
    description: 'Time series data for charts',
    type: [GeoTimeSeriesDto],
  })
  timeSeriesData: GeoTimeSeriesDto[];
}
