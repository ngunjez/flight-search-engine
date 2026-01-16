'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Paper,
  TextField,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import SearchIcon from '@mui/icons-material/Search';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import dayjs, { Dayjs } from 'dayjs';
import LocationAutocomplete from './LocationAutocomplete';
import { Location } from '@/lib/types';

interface SearchFormProps {
  onSearch: (params: any) => void;
  isLoading: boolean;
}

export default function SearchForm({ onSearch, isLoading }: SearchFormProps) {
  const [origin, setOrigin] = useState<Location | null>(null);
  const [destination, setDestination] = useState<Location | null>(null);
  const [departureDate, setDepartureDate] = useState<Dayjs | null>(dayjs().add(7, 'day'));
  const [returnDate, setReturnDate] = useState<Dayjs | null>(dayjs().add(14, 'day'));
  const [tripType, setTripType] = useState<'round-trip' | 'one-way'>('round-trip');
  const [passengers, setPassengers] = useState(1);
  const [travelClass, setTravelClass] = useState('ECONOMY');

  const handleSwapLocations = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const handleSearch = () => {
    if (!origin || !destination || !departureDate) {
      alert('Please fill in all required fields');
      return;
    }

    const searchParams = {
      originLocationCode: origin.iataCode,
      destinationLocationCode: destination.iataCode,
      departureDate: departureDate.format('YYYY-MM-DD'),
      returnDate: tripType === 'round-trip' && returnDate 
        ? returnDate.format('YYYY-MM-DD') 
        : undefined,
      adults: passengers,
      travelClass,
    };

    onSearch(searchParams);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: { xs: 2, sm: 3 }, 
          borderRadius: 3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
            pointerEvents: 'none',
          },
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          {/* Trip Type Selector */}
          <Box sx={{ mb: 3 }}>
            <Typography 
              variant="caption" 
              sx={{ 
                color: 'rgba(255,255,255,0.9)', 
                fontWeight: 600,
                mb: 1,
                display: 'block',
                textTransform: 'uppercase',
                letterSpacing: 1,
              }}
            >
              Trip Type
            </Typography>
            <FormControl size="small" fullWidth sx={{ maxWidth: { xs: '100%', sm: 200 } }}>
              <Select
                value={tripType}
                onChange={(e) => setTripType(e.target.value as any)}
                sx={{ 
                  bgcolor: 'white', 
                  borderRadius: 2,
                  fontWeight: 600,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'transparent',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(102, 126, 234, 0.3)',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main',
                  },
                }}
              >
                <MenuItem value="round-trip">Round Trip</MenuItem>
                <MenuItem value="one-way">One Way</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Stack spacing={2.5}>
            {/* Location Fields */}
            <Box>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: 'rgba(255,255,255,0.9)', 
                  fontWeight: 600,
                  mb: 1,
                  display: 'block',
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                }}
              >
                Locations
              </Typography>
              <Box sx={{ display: 'flex', gap: 1.5, flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center' }}>
                <Box sx={{ flex: 1, width: '100%' }}>
                  <LocationAutocomplete
                    label="From"
                    value={origin}
                    onChange={setOrigin}
                    placeholder="Origin city or airport"
                  />
                </Box>

                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center',
                  width: { xs: '100%', md: 'auto' },
                }}>
                  <Button
                    onClick={handleSwapLocations}
                    variant="contained"
                    sx={{ 
                      minWidth: { xs: '100%', md: 48 },
                      height: 48,
                      bgcolor: 'rgba(255,255,255,0.95)',
                      color: 'primary.main',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      '&:hover': { 
                        bgcolor: 'white',
                        transform: 'rotate(180deg)',
                        transition: 'transform 0.3s ease',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <SwapHorizIcon />
                  </Button>
                </Box>

                <Box sx={{ flex: 1, width: '100%' }}>
                  <LocationAutocomplete
                    label="To"
                    value={destination}
                    onChange={setDestination}
                    placeholder="Destination city or airport"
                  />
                </Box>
              </Box>
            </Box>

            {/* Date, Passengers, Class Fields */}
            <Box>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: 'rgba(255,255,255,0.9)', 
                  fontWeight: 600,
                  mb: 1,
                  display: 'block',
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                }}
              >
                Travel Details
              </Typography>
              <Box sx={{ display: 'grid', gap: 1.5, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' } }}>
                <DatePicker
                  label="Departure"
                  value={departureDate}
                  onChange={setDepartureDate}
                  minDate={dayjs()}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      sx: { 
                        bgcolor: 'white', 
                        borderRadius: 2,
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: 'transparent',
                          },
                          '&:hover fieldset': {
                            borderColor: 'rgba(102, 126, 234, 0.3)',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: 'primary.main',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          fontWeight: 600,
                          backgroundColor: 'white',
                          px: 0.5,
                          color: 'text.primary',
                        },
                        '& .MuiInputLabel-shrink': {
                          backgroundColor: 'white',
                          px: 0.5,
                        },
                      },
                    },
                  }}
                />

                {tripType === 'round-trip' && (
                  <DatePicker
                    label="Return"
                    value={returnDate}
                    onChange={setReturnDate}
                    minDate={departureDate || dayjs()}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        sx: { 
                          bgcolor: 'white', 
                          borderRadius: 2,
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              borderColor: 'transparent',
                            },
                            '&:hover fieldset': {
                              borderColor: 'rgba(102, 126, 234, 0.3)',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: 'primary.main',
                            },
                          },
                          '& .MuiInputLabel-root': {
                            fontWeight: 600,
                            backgroundColor: 'white',
                            px: 0.5,
                            color: 'text.primary',
                          },
                          '& .MuiInputLabel-shrink': {
                            backgroundColor: 'white',
                            px: 0.5,
                          },
                        },
                      },
                    }}
                  />
                )}

                <TextField
                  fullWidth
                  type="number"
                  label="Passengers"
                  value={passengers}
                  onChange={(e) => setPassengers(Math.max(1, parseInt(e.target.value) || 1))}
                  inputProps={{ min: 1, max: 9 }}
                  sx={{ 
                    bgcolor: 'white', 
                    borderRadius: 2,
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'transparent',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(102, 126, 234, 0.3)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      fontWeight: 600,
                      backgroundColor: 'white',
                      px: 0.5,
                      color: 'text.primary',
                    },
                    '& .MuiInputLabel-shrink': {
                      backgroundColor: 'white',
                      px: 0.5,
                    },
                  }}
                />

                <FormControl fullWidth>
                  <InputLabel 
                    sx={{ 
                      fontWeight: 600,
                      backgroundColor: 'white',
                      px: 0.5,
                      color: 'text.primary',
                      '&.MuiInputLabel-shrink': {
                        backgroundColor: 'white',
                        px: 0.5,
                      },
                    }}
                  >
                    Class
                  </InputLabel>
                  <Select
                    value={travelClass}
                    onChange={(e) => setTravelClass(e.target.value)}
                    label="Class"
                    sx={{ 
                      bgcolor: 'white', 
                      borderRadius: 2,
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'transparent',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(102, 126, 234, 0.3)',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main',
                      },
                    }}
                  >
                    <MenuItem value="ECONOMY">Economy</MenuItem>
                    <MenuItem value="PREMIUM_ECONOMY">Premium Economy</MenuItem>
                    <MenuItem value="BUSINESS">Business</MenuItem>
                    <MenuItem value="FIRST">First Class</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>

            {/* Search Button */}
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleSearch}
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                py: 1.8,
                fontSize: { xs: '1rem', sm: '1.1rem' },
                fontWeight: 700,
                borderRadius: 2,
                textTransform: 'none',
                boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                '&:hover': { 
                  bgcolor: 'rgba(255,255,255,0.95)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 24px rgba(0,0,0,0.25)',
                },
                '&:active': {
                  transform: 'translateY(0)',
                },
                '&.Mui-disabled': {
                  bgcolor: 'rgba(255,255,255,0.7)',
                  color: 'rgba(102, 126, 234, 0.6)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              {isLoading ? 'Searching Flights...' : 'Search Flights'}
            </Button>
          </Stack>
        </Box>
      </Paper>
    </LocalizationProvider>
  );
}