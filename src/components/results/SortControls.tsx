'use client';

import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';

export type SortOption = 'price' | 'duration' | 'departure';

interface SortControlsProps {
  sortBy: SortOption;
  onSortChange: (sortBy: SortOption) => void;
  resultCount: number;
}

export default function SortControls({
  sortBy,
  onSortChange,
  resultCount,
}: SortControlsProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        mb: 2,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 2,
      }}
    >
      <Typography variant={isMobile ? 'body1' : 'h6'} fontWeight={600}>
        {resultCount} {resultCount === 1 ? 'Flight' : 'Flights'} Available
      </Typography>

      <FormControl size="small" sx={{ minWidth: isMobile ? '100%' : 180 }}>
        <InputLabel id="sort-label">Sort by</InputLabel>
        <Select
          labelId="sort-label"
          id="sort-select"
          value={sortBy}
          label="Sort by"
          onChange={(e) => onSortChange(e.target.value as SortOption)}
        >
          <MenuItem value="price">Lowest Price</MenuItem>
          <MenuItem value="duration">Shortest Duration</MenuItem>
          <MenuItem value="departure">Earliest Departure</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}