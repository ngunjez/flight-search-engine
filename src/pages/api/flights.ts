// src/pages/api/flights.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { searchFlights, searchLocations } from '@/lib/amadeus';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { action } = req.query;

    // Location search endpoint
    if (action === 'locations') {
      const keyword = req.query.keyword as string;
      
      if (!keyword || keyword.trim().length === 0) {
        return res.status(400).json({ error: 'Keyword is required' });
      }

      if (keyword.trim().length < 2) {
        return res.status(400).json({ error: 'Keyword must be at least 2 characters' });
      }

      try {
        const locations = await searchLocations(keyword.trim());
        return res.status(200).json({ data: locations });
      } catch (error: any) {
        console.error('Location API error:', error);
        return res.status(500).json({ 
          error: 'Failed to search locations',
          message: error.message 
        });
      }
    }

    // Flight search endpoint
    const params = {
      originLocationCode: req.query.originLocationCode as string,
      destinationLocationCode: req.query.destinationLocationCode as string,
      departureDate: req.query.departureDate as string,
      returnDate: req.query.returnDate as string | undefined,
      adults: req.query.adults as string || '1',
      children: req.query.children as string || '0',
      travelClass: req.query.travelClass as string || 'ECONOMY',
      currencyCode: req.query.currencyCode as string || 'USD',
      max: req.query.max as string || '50',
    };

    // Validate required parameters
    if (!params.originLocationCode || !params.destinationLocationCode || !params.departureDate) {
      return res.status(400).json({ 
        error: 'Missing required parameters',
        required: ['originLocationCode', 'destinationLocationCode', 'departureDate']
      });
    }

    // Validate IATA codes (should be 3 letters)
    const iataRegex = /^[A-Z]{3}$/i;
    if (!iataRegex.test(params.originLocationCode)) {
      return res.status(400).json({ error: 'Invalid origin airport code' });
    }
    if (!iataRegex.test(params.destinationLocationCode)) {
      return res.status(400).json({ error: 'Invalid destination airport code' });
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(params.departureDate)) {
      return res.status(400).json({ error: 'Invalid departure date format. Use YYYY-MM-DD' });
    }
    if (params.returnDate && !dateRegex.test(params.returnDate)) {
      return res.status(400).json({ error: 'Invalid return date format. Use YYYY-MM-DD' });
    }

    try {
      const results = await searchFlights(params);
      return res.status(200).json(results);
    } catch (error: any) {
      console.error('Flight search API error:', error);
      return res.status(500).json({ 
        error: 'Failed to search flights',
        message: error.message 
      });
    }
  } catch (error: any) {
    console.error('API Route Error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message || 'An unexpected error occurred',
    });
  }
}