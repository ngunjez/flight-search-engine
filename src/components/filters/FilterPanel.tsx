'use client';

import {
  Box,
  Paper,
  Typography,
  Slider,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Divider,
  Chip,
  Button,
} from '@mui/material';
import { FilterState } from '@/lib/types';

interface FilterPanelProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  availableAirlines: string[];
  flightCount: number;
}

export default function FilterPanel({
  filters,
  onFilterChange,
  availableAirlines,
  flightCount,
}: FilterPanelProps) {
  const handlePriceChange = (_: Event, newValue: number | number[]) => {
    onFilterChange({
      ...filters,
      priceRange: newValue as [number, number],
    });
  };

  const handleStopChange = (stops: number) => {
    const newStops = filters.stops.includes(stops)
      ? filters.stops.filter((s) => s !== stops)
      : [...filters.stops, stops];
    
    onFilterChange({
      ...filters,
      stops: newStops,
    });
  };

  const handleAirlineChange = (airline: string) => {
    const newAirlines = filters.airlines.includes(airline)
      ? filters.airlines.filter((a) => a !== airline)
      : [...filters.airlines, airline];
    
    onFilterChange({
      ...filters,
      airlines: newAirlines,
    });
  };

  const handleReset = () => {
    onFilterChange({
      priceRange: [0, filters.maxPrice],
      maxPrice: filters.maxPrice,
      stops: [],
      airlines: [],
      departureTimeRange: [0, 24],
    });
  };

  const activeFilterCount = 
    (filters.stops.length > 0 ? 1 : 0) +
    (filters.airlines.length > 0 ? 1 : 0) +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < filters.maxPrice ? 1 : 0);

  return (
    <Paper elevation={2} sx={{ p: 3, position: 'sticky', top: 20 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" fontWeight={600}>
          Filters
        </Typography>
        {activeFilterCount > 0 && (
          <Button size="small" onClick={handleReset}>
            Reset ({activeFilterCount})
          </Button>
        )}
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {flightCount} flights found
      </Typography>

      {/* Price Range */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          Price Range
        </Typography>
        <Slider
          value={filters.priceRange}
          onChange={handlePriceChange}
          valueLabelDisplay="auto"
          min={0}
          max={filters.maxPrice}
          valueLabelFormat={(value) => `$${value}`}
          sx={{ mt: 2 }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            ${filters.priceRange[0]}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ${filters.priceRange[1]}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Stops */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          Stops
        </Typography>
        <FormGroup>
          {[0, 1, 2].map((stops) => (
            <FormControlLabel
              key={stops}
              control={
                <Checkbox
                  checked={filters.stops.includes(stops)}
                  onChange={() => handleStopChange(stops)}
                />
              }
              label={
                stops === 0 
                  ? 'Non-stop' 
                  : stops === 1 
                  ? '1 stop' 
                  : '2+ stops'
              }
            />
          ))}
        </FormGroup>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Airlines */}
      <Box>
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          Airlines
        </Typography>
        <FormGroup>
          {availableAirlines.slice(0, 8).map((airline) => (
            <FormControlLabel
              key={airline}
              control={
                <Checkbox
                  checked={filters.airlines.includes(airline)}
                  onChange={() => handleAirlineChange(airline)}
                />
              }
              label={airline}
            />
          ))}
        </FormGroup>
        {availableAirlines.length > 8 && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            +{availableAirlines.length - 8} more airlines
          </Typography>
        )}
      </Box>

      {/* Active Filters */}
      {activeFilterCount > 0 && (
        <>
          <Divider sx={{ my: 3 }} />
          <Box>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Active Filters
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
              {filters.stops.map((stops) => (
                <Chip
                  key={`stops-${stops}`}
                  label={stops === 0 ? 'Non-stop' : `${stops} stop${stops > 1 ? 's' : ''}`}
                  onDelete={() => handleStopChange(stops)}
                  size="small"
                />
              ))}
              {filters.airlines.map((airline) => (
                <Chip
                  key={airline}
                  label={airline}
                  onDelete={() => handleAirlineChange(airline)}
                  size="small"
                />
              ))}
            </Box>
          </Box>
        </>
      )}
    </Paper>
  );
}