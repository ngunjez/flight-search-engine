import { useState, useMemo, useEffect } from 'react';
import Head from 'next/head';
import {
  Container,
  Box,
  Typography,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  useMediaQuery,
  Stack,
} from '@mui/material';
import axios from 'axios';
import Layout from '@/components/layout/Layout';
import SearchForm from '@/components/search/SearchForm';
import FilterPanel from '@/components/filters/FilterPanel';
import FlightCard from '@/components/results/FlightCard';
import FlightSkeleton from '@/components/results/FlightSkeleton';
import EmptyState from '@/components/results/EmptyState';
import PriceGraph from '@/components/charts/PriceGraph';
import { Flight, FilterState } from '@/lib/types';

export default function Home() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [flights, setFlights] = useState<Flight[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [sortBy, setSortBy] = useState<'price' | 'duration' | 'departure'>('price');

  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 5000],
    maxPrice: 5000,
    stops: [],
    airlines: [],
    departureTimeRange: [0, 24],
  });

  // Extract airline names
  const airlineNames = useMemo(() => {
    const names: { [key: string]: string } = {};
    flights.forEach((flight) => {
      flight.itineraries.forEach((itinerary) => {
        itinerary.segments.forEach((segment) => {
          if (!names[segment.carrierCode]) {
            names[segment.carrierCode] = segment.carrierCode;
          }
        });
      });
    });
    return names;
  }, [flights]);

  // Get available airlines for filters
  const availableAirlines = useMemo(() => {
    return Object.values(airlineNames).sort();
  }, [airlineNames]);

  // Update max price when flights change
  useEffect(() => {
    if (flights.length > 0) {
      const maxFlightPrice = Math.max(...flights.map((f) => parseFloat(f.price.total)));
      setFilters((prev) => ({
        ...prev,
        maxPrice: Math.ceil(maxFlightPrice / 100) * 100,
        priceRange: [0, Math.ceil(maxFlightPrice / 100) * 100],
      }));
    }
  }, [flights]);

  // Filter and sort flights
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
        return filters.stops.includes(stops >= 2 ? 2 : stops);
      });
    }

    // Airlines filter
    if (filters.airlines.length > 0) {
      result = result.filter((flight) => {
        const flightAirlines = flight.itineraries.flatMap((itin) =>
          itin.segments.map((seg) => airlineNames[seg.carrierCode])
        );
        return flightAirlines.some((airline) => filters.airlines.includes(airline));
      });
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return parseFloat(a.price.total) - parseFloat(b.price.total);
        case 'duration':
          return a.itineraries[0].duration.localeCompare(b.itineraries[0].duration);
        case 'departure':
          return a.itineraries[0].segments[0].departure.at.localeCompare(
            b.itineraries[0].segments[0].departure.at
          );
        default:
          return 0;
      }
    });

    return result;
  }, [flights, filters, sortBy, airlineNames]);

  const handleSearch = async (searchParams: any) => {
    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const response = await axios.get('/api/flights', { params: searchParams });
      setFlights(response.data.data || []);
      
      if (!response.data.data || response.data.data.length === 0) {
        setError('No flights found for your search criteria. Try different dates or locations.');
      }
    } catch (err: any) {
      console.error('Search error:', err);
      setError(err.response?.data?.error || 'Failed to search flights. Please try again.');
      setFlights([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>FlightSearch - Find the Best Flight Deals</title>
        <meta
          name="description"
          content="Search and compare flights from hundreds of airlines to find the best deals for your next trip."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        <Container maxWidth="lg">
          {/* Search Form */}
          <Box sx={{ mb: 4 }}>
            <SearchForm onSearch={handleSearch} isLoading={isLoading} />
          </Box>

          {/* Error Message */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Loading Skeletons */}
          {isLoading && (
            <Box>
              <FlightSkeleton count={5} />
            </Box>
          )}

          {/* Results */}
          {!isLoading && hasSearched && flights.length > 0 && (
            <>
              {/* Price Graph */}
              <Box sx={{ mb: 3 }}>
                <PriceGraph flights={filteredFlights} />
              </Box>

              <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
                {/* Filters - Desktop */}
                {!isMobile && (
                  <Box sx={{ width: { md: '25%' }, flexShrink: 0 }}>
                    <FilterPanel
                      filters={filters}
                      onFilterChange={setFilters}
                      availableAirlines={availableAirlines}
                      flightCount={filteredFlights.length}
                    />
                  </Box>
                )}

                {/* Flight List */}
                <Box sx={{ flex: 1 }}>
                  {/* Sort Controls */}
                  <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                    <Typography variant="h6" fontWeight={600}>
                      {filteredFlights.length} Available {filteredFlights.length === 1 ? 'Flight' : 'Flights'}
                    </Typography>
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                      <InputLabel>Sort by</InputLabel>
                      <Select
                        value={sortBy}
                        label="Sort by"
                        onChange={(e) => setSortBy(e.target.value as any)}
                      >
                        <MenuItem value="price">Lowest Price</MenuItem>
                        <MenuItem value="duration">Shortest Duration</MenuItem>
                        <MenuItem value="departure">Earliest Departure</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>

                  {/* Mobile Filters */}
                  {isMobile && (
                    <Box sx={{ mb: 3 }}>
                      <FilterPanel
                        filters={filters}
                        onFilterChange={setFilters}
                        availableAirlines={availableAirlines}
                        flightCount={filteredFlights.length}
                      />
                    </Box>
                  )}

                  {/* Flight Cards */}
                  {filteredFlights.length > 0 ? (
                    <Stack spacing={2}>
                      {filteredFlights.map((flight) => (
                        <FlightCard
                          key={flight.id}
                          flight={flight}
                          airlineNames={airlineNames}
                        />
                      ))}
                    </Stack>
                  ) : (
                    <Alert severity="info">
                      No flights match your filters. Try adjusting your criteria.
                    </Alert>
                  )}
                </Box>
              </Box>
            </>
          )}

          {/* Empty State */}
          {!isLoading && !hasSearched && (
            <EmptyState type="initial" />
          )}
        </Container>
      </Layout>
    </>
  );
}