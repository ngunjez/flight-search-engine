'use client';

import { useState, useEffect } from 'react';
import { Autocomplete, TextField, CircularProgress, Box, Typography } from '@mui/material';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import axios from 'axios';
import { Location } from '@/lib/types';

interface LocationAutocompleteProps {
  label: string;
  value: Location | null;
  onChange: (location: Location | null) => void;
  placeholder?: string;
}

export default function LocationAutocomplete({
  label,
  value,
  onChange,
  placeholder,
}: LocationAutocompleteProps) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (inputValue.length < 2) {
      setOptions([]);
      setError(null);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await axios.get('/api/flights', {
          params: {
            action: 'locations',
            keyword: inputValue,
          },
          timeout: 10000, 
        });

        const locations = (response.data.data || []).map((loc: any) => ({
          iataCode: loc.iataCode,
          name: loc.name,
          cityName: loc.address?.cityName || loc.name,
          countryName: loc.address?.countryName || '',
        }));

        setOptions(locations);
        
        if (locations.length === 0) {
          setError('No airports found. Try a different search.');
        }
      } catch (err: any) {
        console.error('Location search error:', err);
        setError('Unable to search locations. Please try again.');
        setOptions([]);
      } finally {
        setLoading(false);
      }
    }, 300); 

    return () => clearTimeout(timer);
  }, [inputValue]);

  return (
    <Autocomplete
      fullWidth
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      value={value}
      onChange={(_, newValue) => {
        onChange(newValue);
        setError(null);
      }}
      inputValue={inputValue}
      onInputChange={(_, newInputValue) => {
        setInputValue(newInputValue);
      }}
      options={options}
      loading={loading}
      getOptionLabel={(option) => 
        `${option.cityName} (${option.iataCode})`
      }
      isOptionEqualToValue={(option, value) => option.iataCode === value.iataCode}
      noOptionsText={
        loading 
          ? 'Searching...' 
          : error 
          ? error 
          : inputValue.length < 2 
          ? 'Type at least 2 characters' 
          : 'No airports found'
      }
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          error={!!error}
          helperText={error}
          sx={{ bgcolor: 'white', borderRadius: 1 }}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      renderOption={(props, option) => (
        <Box component="li" {...props} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FlightTakeoffIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
          <Box>
            <Typography variant="body1">
              {option.cityName} ({option.iataCode})
            </Typography>
            {option.name && option.name !== option.cityName && (
              <Typography variant="caption" color="text.secondary">
                {option.name}
              </Typography>
            )}
          </Box>
        </Box>
      )}
    />
  );
}