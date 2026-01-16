import { Box, Container, Typography } from '@mui/material';
import FlightIcon from '@mui/icons-material/Flight';

export default function Header() {
  return (
    <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 3, mb: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FlightIcon sx={{ fontSize: 32 }} />
          <Typography variant="h4" fontWeight={700}>
            FlightSearch
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
          Find the best flights at the best prices
        </Typography>
      </Container>
    </Box>
  );
}