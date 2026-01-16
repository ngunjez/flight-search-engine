
export interface FlightSearchParams {
  originLocationCode: string;
  destinationLocationCode: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
  children?: number;
  infants?: number;
  travelClass?: 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST';
  currencyCode?: string;
  max?: number;
}

export interface Location {
  iataCode: string;
  name: string;
  cityName: string;
  countryName: string;
}

export interface Price {
  currency: string;
  total: string;
  base: string;
  grandTotal: string;
}

export interface Segment {
  departure: {
    iataCode: string;
    terminal?: string;
    at: string;
  };
  arrival: {
    iataCode: string;
    terminal?: string;
    at: string;
  };
  carrierCode: string;
  number: string;
  aircraft: {
    code: string;
  };
  duration: string;
  numberOfStops: number;
}

export interface Itinerary {
  duration: string;
  segments: Segment[];
}

export interface Flight {
  id: string;
  source: string;
  instantTicketingRequired: boolean;
  nonHomogeneous: boolean;
  oneWay: boolean;
  lastTicketingDate: string;
  numberOfBookableSeats: number;
  itineraries: Itinerary[];
  price: Price;
  pricingOptions: {
    fareType: string[];
    includedCheckedBagsOnly: boolean;
  };
  validatingAirlineCodes: string[];
  travelerPricings: any[];
}

export interface FilterState {
  priceRange: [number, number];
  maxPrice: number;
  stops: number[];
  airlines: string[];
  departureTimeRange: [number, number];
}

export interface ChartDataPoint {
  date: string;
  price: number;
  flights: number;
}