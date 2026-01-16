'use client';

import { Box, Card, CardContent, Skeleton } from '@mui/material';

interface FlightSkeletonProps {
  count?: number;
}

export default function FlightSkeleton({ count = 3 }: FlightSkeletonProps) {
  return (
    <Box>
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} elevation={2} sx={{ mb: 2 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
              {/* Left side - Flight details */}
              <Box sx={{ flex: 1 }}>
                {/* Outbound flight */}
                <Box sx={{ mb: 2 }}>
                  <Skeleton variant="text" width={100} height={20} sx={{ mb: 1 }} />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box>
                      <Skeleton variant="text" width={60} height={32} />
                      <Skeleton variant="text" width={40} height={20} />
                    </Box>
                    <Skeleton variant="rectangular" width={150} height={2} />
                    <Box>
                      <Skeleton variant="text" width={60} height={32} />
                      <Skeleton variant="text" width={40} height={20} />
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                    <Skeleton variant="rounded" width={80} height={24} />
                    <Skeleton variant="rounded" width={100} height={24} />
                  </Box>
                </Box>

                {/* Return flight (50% chance to show) */}
                {index % 2 === 0 && (
                  <Box>
                    <Skeleton variant="text" width={100} height={20} sx={{ mb: 1 }} />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box>
                        <Skeleton variant="text" width={60} height={32} />
                        <Skeleton variant="text" width={40} height={20} />
                      </Box>
                      <Skeleton variant="rectangular" width={150} height={2} />
                      <Box>
                        <Skeleton variant="text" width={60} height={32} />
                        <Skeleton variant="text" width={40} height={20} />
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                      <Skeleton variant="rounded" width={80} height={24} />
                    </Box>
                  </Box>
                )}
              </Box>

              {/* Right side - Price */}
              <Box sx={{ minWidth: 150, textAlign: 'right' }}>
                <Skeleton variant="text" width={100} height={40} sx={{ ml: 'auto' }} />
                <Skeleton variant="text" width={120} height={20} sx={{ ml: 'auto', mb: 2 }} />
                <Skeleton variant="rectangular" width="100%" height={40} sx={{ borderRadius: 1 }} />
              </Box>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}