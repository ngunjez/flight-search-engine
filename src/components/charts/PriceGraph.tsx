'use client';

import { useMemo } from 'react';
import { Box, Paper, Typography, useTheme, useMediaQuery } from '@mui/material';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { Flight } from '@/lib/types';

interface PriceGraphProps {
  flights: Flight[];
  title?: string;
}

export default function PriceGraph({ flights, title = 'Price Trends' }: PriceGraphProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const chartData = useMemo(() => {
    if (!flights || flights.length === 0) return [];

    const priceRanges: { [key: string]: number } = {};
    const step = 50;

    flights.forEach((flight) => {
      const price = Math.round(parseFloat(flight.price.total));
      const rangeStart = Math.floor(price / step) * step;
      const rangeKey = `$${rangeStart}-${rangeStart + step}`;
      
      priceRanges[rangeKey] = (priceRanges[rangeKey] || 0) + 1;
    });

    return Object.entries(priceRanges)
      .map(([range, count]) => ({
        range,
        count,
        price: parseInt(range.split('-')[0].replace('$', '')),
      }))
      .sort((a, b) => a.price - b.price);
  }, [flights]);

  const avgPrice = useMemo(() => {
    if (!flights || flights.length === 0) return 0;
    const total = flights.reduce((sum, f) => sum + parseFloat(f.price.total), 0);
    return Math.round(total / flights.length);
  }, [flights]);

  const minPrice = useMemo(() => {
    if (!flights || flights.length === 0) return 0;
    return Math.min(...flights.map((f) => parseFloat(f.price.total)));
  }, [flights]);

  if (chartData.length === 0) {
    return (
      <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="text.secondary">
          No data available for price trends
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          {title}
        </Typography>
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Average Price
            </Typography>
            <Typography variant="h6" color="primary">
              ${avgPrice}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Lowest Price
            </Typography>
            <Typography variant="h6" color="success.main">
              ${Math.round(minPrice)}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Total Options
            </Typography>
            <Typography variant="h6">
              {flights.length}
            </Typography>
          </Box>
        </Box>
      </Box>

      <ResponsiveContainer width="100%" height={isMobile ? 250 : 300}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.8} />
              <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
          <XAxis
            dataKey="range"
            tick={{ fontSize: isMobile ? 10 : 12 }}
            angle={isMobile ? -45 : 0}
            textAnchor={isMobile ? 'end' : 'middle'}
            height={isMobile ? 80 : 60}
          />
          <YAxis
            label={{ value: 'Number of Flights', angle: -90, position: 'insideLeft' }}
            tick={{ fontSize: isMobile ? 10 : 12 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 8,
            }}
            formatter={(value: any) => [`${value} flights`, 'Count']}
          />
          <Area
            type="monotone"
            dataKey="count"
            stroke={theme.palette.primary.main}
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorCount)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Paper>
  );
}