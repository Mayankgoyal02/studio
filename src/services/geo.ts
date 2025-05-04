/**
 * Represents a geographical location with latitude and longitude coordinates.
 */
export interface Location {
  /**
   * The latitude of the location.
   */
  lat: number;
  /**
   * The longitude of the location.
   */
  lng: number;
}

/**
 * Represents location information based on a query string
 */
export interface GeocodeResult {
  /**
   * The latitude of the location.
   */
  latitude: number;
  /**
   * The longitude of the location.
   */
  longitude: number;
  /**
   * The formatted address of the location.
   */
  formattedAddress: string;
}

/**
 * Asynchronously retrieves coordinates for a given query.
 *
 * @param query The search query.
 * @returns A promise that resolves to a GeocodeResult object containing coordinates and address.
 */
export async function geocode(query: string): Promise<GeocodeResult | null> {
  // TODO: Implement this by calling an API.

  return {
    latitude: 34.0522,
    longitude: -118.2437,
    formattedAddress: 'Los Angeles, CA'
  };
}
