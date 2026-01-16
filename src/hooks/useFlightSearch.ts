import { useState, useCallback } from 'react';
import axios from 'axios';
import { Flight } from '@/lib/types';

interface SearchParams {
  originLocationCode: string;
  destinationLocationCode: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
  travelClass: string;
}

interface UseFlightSearchReturn {
  flights: Flight[];
  isLoading: boolean;
  error: string | null;
  searchFlights: (params: SearchParams) => Promise<void>;
  clearResults: () => void;
}

export function useFlightSearch(): UseFlightSearchReturn {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchFlights = useCallback(async (params: SearchParams) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get('/api/flights', { params });
      
      if (response.data.data && response.data.data.length > 0) {
        setFlights(response.data.data);
        setError(null);
      } else {
        setFlights([]);
        setError('No flights found for your search criteria. Try different dates or locations.');
      }
    } catch (err: any) {
      console.error('Search error:', err);
      setError(err.response?.data?.error || 'Failed to search flights. Please try again.');
      setFlights([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setFlights([]);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    flights,
    isLoading,
    error,
    searchFlights,
    clearResults,
  };
}