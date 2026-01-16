import { useState, useMemo, useCallback, useEffect } from 'react';
import { Flight, FilterState } from '@/lib/types';

interface UseFiltersReturn {
  filters: FilterState;
  filteredFlights: Flight[];
  updateFilters: (newFilters: Partial<FilterState>) => void;
  resetFilters: () => void;
  availableAirlines: string[];
}

export function useFilters(flights: Flight[], airlineNames: { [key: string]: string }): UseFiltersReturn {
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 5000],
    maxPrice: 5000,
    stops: [],
    airlines: [],
    departureTimeRange: [0, 24],
  });

  // Update max price when flights change
  useEffect(() => {
    if (flights.length > 0) {
      const maxFlightPrice = Math.max(...flights.map((f) => parseFloat(f.price.total)));
      const roundedMax = Math.ceil(maxFlightPrice / 100) * 100;
      
      setFilters((prev) => ({
        ...prev,
        maxPrice: roundedMax,
        priceRange: [0, roundedMax],
      }));
    }
  }, [flights]);

  // Get available airlines
  const availableAirlines = useMemo(() => {
    const airlines = new Set<string>();
    flights.forEach((flight) => {
      flight.itineraries.forEach((itinerary) => {
        itinerary.segments.forEach((segment) => {
          airlines.add(airlineNames[segment.carrierCode] || segment.carrierCode);
        });
      });
    });
    return Array.from(airlines).sort();
  }, [flights, airlineNames]);

  // Filter flights based on current filter state
  const filteredFlights = useMemo(() => {
    let result = [...flights];

    // Price filter
    result = result.filter((flight) => {
      const price = parseFloat(flight.price.total);
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });

    // Stops filter
    if (filters.stops.length > 0) {
      result = result.filter((flight) => {
        const stops = flight.itineraries[0].segments.length - 1;
        const normalizedStops = stops >= 2 ? 2 : stops;
        return filters.stops.includes(normalizedStops);
      });
    }

    // Airlines filter
    if (filters.airlines.length > 0) {
      result = result.filter((flight) => {
        const flightAirlines = flight.itineraries.flatMap((itin) =>
          itin.segments.map((seg) => airlineNames[seg.carrierCode] || seg.carrierCode)
        );
        return flightAirlines.some((airline) => filters.airlines.includes(airline));
      });
    }

    return result;
  }, [flights, filters, airlineNames]);

  const updateFilters = useCallback((newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      priceRange: [0, filters.maxPrice],
      maxPrice: filters.maxPrice,
      stops: [],
      airlines: [],
      departureTimeRange: [0, 24],
    });
  }, [filters.maxPrice]);

  return {
    filters,
    filteredFlights,
    updateFilters,
    resetFilters,
    availableAirlines,
  };
}