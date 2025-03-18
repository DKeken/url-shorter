export interface GeoLocationData {
  country: string;
  countryCode: string;
  city: string;
  regionName: string;
  lat: number;
  lon: number;
}

export interface VisitData {
  ip: string;
  visitedAt: string;
  geolocation: GeoLocationData;
}

export interface CountryStats {
  country: string;
  countryCode: string;
  count: number;
  percentage: number;
}

export interface CityStats {
  city: string;
  country: string;
  countryCode: string;
  count: number;
  lat: number;
  lon: number;
}

export interface MapPoint {
  lat: number;
  lon: number;
  weight: number;
}

export interface TimeSeriesData {
  date: string;
  count: number;
}

export interface SavedUrl {
  shortCode: string;
  originalUrl: string;
  createdAt: string;
  fullShortUrl: string;
  analytics?: {
    clickCount: number;
    recentVisits: VisitData[];
    uniqueCountries: number;
    uniqueCities: number;
    mapPoints: MapPoint[];
    countriesStats: CountryStats[];
    citiesStats: CityStats[];
    timeSeriesData: TimeSeriesData[];
  };
}
