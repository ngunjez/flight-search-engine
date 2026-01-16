'use client';

import { Box, Alert } from '@mui/material';
import FlightCard from './FlightCard';
import { Flight } from '@/lib/types';

interface FlightListProps {
  flights: Flight[];
  airlineNames: { [key: string]: string };
  isLoading?: boolean;
  emptyMessage?: string;
}

export default function FlightList({
  flights,
  airlineNames,
  isLoading = false,
  emptyMessage = 'No flights match your filters. Try adjusting your criteria.',
}: FlightListProps) {
  if (isLoading) {
    return null; 
  }

  if (!flights || flights.length === 0) {
    return (
      <Alert severity="info" sx={{ mb: 2 }}>
        {emptyMessage}
      </Alert>
    );
  }

  return (
    <Box>
      {flights.map((flight) => (
        <FlightCard
          key={flight.id}
          flight={flight}
          airlineNames={airlineNames}
        />
      ))}
    </Box>
  );
}