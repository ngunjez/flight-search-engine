// src/components/results/FlightCard.tsx
'use client';

import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AirplanemodeActiveIcon from '@mui/icons-material/AirplanemodeActive';
import { Flight, Segment } from '@/lib/types';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

interface FlightCardProps {
  flight: Flight;
  airlineNames: { [key: string]: string };
}

export default function FlightCard({ flight, airlineNames }: FlightCardProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const formatTime = (dateTime: string) => {
    return dayjs(dateTime).format('HH:mm');
  };

  const formatDate = (dateTime: string) => {
    return dayjs(dateTime).format('MMM DD');
  };

  const formatDuration = (dur: string) => {
    const match = dur.match(/PT(\d+H)?(\d+M)?/);
    if (!match) return dur;
    
    const hours = match[1] ? parseInt(match[1]) : 0;
    const minutes = match[2] ? parseInt(match[2]) : 0;
    
    return `${hours}h ${minutes}m`;
  };

  const getStops = (segments: Segment[]) => {
    const stops = segments.length - 1;
    if (stops === 0) return 'Non-stop';
    return `${stops} stop${stops > 1 ? 's' : ''}`;
  };

  const renderItinerary = (segments: Segment[], index: number) => {
    const firstSeg = segments[0];
    const lastSeg = segments[segments.length - 1];
    const totalDuration = flight.itineraries[index].duration;

    return (
      <Box key={index} sx={{ mb: index < flight.itineraries.length - 1 ? 2 : 0 }}>
        {flight.itineraries.length > 1 && (
          <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ mb: 1, display: 'block' }}>
            {index === 0 ? 'Outbound' : 'Return'}
          </Typography>
        )}
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: isMobile ? 1 : 2, flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
          {/* Departure */}
          <Box sx={{ minWidth: isMobile ? '100%' : 100 }}>
            <Typography variant="h6" fontWeight={600}>
              {formatTime(firstSeg.departure.at)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {firstSeg.departure.iataCode}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatDate(firstSeg.departure.at)}
            </Typography>
          </Box>

          {/* Flight Path */}
          <Box sx={{ flex: 1, minWidth: isMobile ? '100%' : 150 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <Divider sx={{ flex: 1 }} />
              <AirplanemodeActiveIcon sx={{ mx: 1, fontSize: 20, color: 'primary.main' }} />
              <Divider sx={{ flex: 1 }} />
            </Box>
            <Typography variant="caption" color="text.secondary" textAlign="center" display="block">
              {formatDuration(totalDuration)} • {getStops(segments)}
            </Typography>
          </Box>

          {/* Arrival */}
          <Box sx={{ minWidth: isMobile ? '100%' : 100 }}>
            <Typography variant="h6" fontWeight={600}>
              {formatTime(lastSeg.arrival.at)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {lastSeg.arrival.iataCode}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatDate(lastSeg.arrival.at)}
            </Typography>
          </Box>
        </Box>

        {/* Airlines */}
        <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {segments.map((seg, idx) => (
            <Chip
              key={idx}
              label={airlineNames[seg.carrierCode] || seg.carrierCode}
              size="small"
              variant="outlined"
            />
          ))}
        </Box>
      </Box>
    );
  };

  return (
    <Card 
      elevation={2} 
      sx={{ 
        mb: 2,
        transition: 'all 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 4,
        },
      }}
    >
      <CardContent sx={{ p: isMobile ? 2 : 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
          <Box sx={{ flex: 1, minWidth: isMobile ? '100%' : 0 }}>
            {flight.itineraries.map((itinerary, index) => renderItinerary(itinerary.segments, index))}
          </Box>

          {/* Price & Book */}
          <Box sx={{ 
            minWidth: isMobile ? '100%' : 150, 
            textAlign: isMobile ? 'center' : 'right',
            mt: isMobile ? 2 : 0,
            ml: isMobile ? 0 : 2,
          }}>
            <Typography variant="h5" fontWeight={700} color="primary">
              ${Math.round(parseFloat(flight.price.total))}
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block">
              {flight.price.currency} • {flight.numberOfBookableSeats} seats left
            </Typography>
            <Button 
              variant="contained" 
              fullWidth 
              sx={{ mt: 2 }}
            >
              Select
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}