'use client';

import { Box, Typography } from '@mui/material';
import FlightIcon from '@mui/icons-material/Flight';
import SearchOffIcon from '@mui/icons-material/SearchOff';

interface EmptyStateProps {
  type?: 'initial' | 'no-results';
  title?: string;
  description?: string;
}

export default function EmptyState({
  type = 'initial',
  title,
  description,
}: EmptyStateProps) {
  const isInitial = type === 'initial';

  const defaultTitle = isInitial
    ? 'Search for flights to get started'
    : 'No flights found';

  const defaultDescription = isInitial
    ? 'Enter your travel details above to find the best flight options'
    : 'Try different dates, airports, or adjust your filters';

  const Icon = isInitial ? FlightIcon : SearchOffIcon;

  return (
    <Box
      sx={{
        textAlign: 'center',
        py: 8,
        px: 2,
      }}
    >
      <Icon
        sx={{
          fontSize: 80,
          color: 'text.secondary',
          mb: 2,
          opacity: 0.5,
        }}
      />
      <Typography
        variant="h5"
        color="text.secondary"
        gutterBottom
        fontWeight={600}
      >
        {title || defaultTitle}
      </Typography>
      <Typography color="text.secondary" sx={{ maxWidth: 500, mx: 'auto' }}>
        {description || defaultDescription}
      </Typography>
    </Box>
  );
}