import axios from 'axios';

const AMADEUS_AUTH_URL = 'https://test.api.amadeus.com/v1/security/oauth2/token';
const AMADEUS_BASE_URL = 'https://test.api.amadeus.com/v2';
const AMADEUS_V1_BASE_URL = 'https://test.api.amadeus.com/v1';

let accessToken: string | null = null;
let tokenExpiry: number = 0;

async function getAccessToken(): Promise<string> {
  const now = Date.now();
  
  // Return cached token if still valid
  if (accessToken && tokenExpiry > now) {
    return accessToken;
  }

  try {
    const response = await axios.post(
      AMADEUS_AUTH_URL,
      new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: process.env.AMADEUS_API_KEY!,
        client_secret: process.env.AMADEUS_API_SECRET!,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    accessToken = response.data.access_token;
    tokenExpiry = now + (response.data.expires_in * 1000) - 60000; 
    
    console.log('✅ Amadeus authentication successful');
    return accessToken!;
  } catch (error: any) {
    console.error('❌ Amadeus authentication failed:', error.response?.data || error.message);
    throw new Error('Authentication failed. Please check your API credentials.');
  }
}

export async function searchFlights(params: any) {
  const token = await getAccessToken();

  try {
    const response = await axios.get(`${AMADEUS_BASE_URL}/shopping/flight-offers`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        ...params,
        currencyCode: params.currencyCode || 'USD',
        max: params.max || 50,
      },
      timeout: 30000, 
    });

    console.log(`✅ Found ${response.data.data?.length || 0} flights`);
    return response.data;
  } catch (error: any) {
    console.error('❌ Flight search error:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      // Token expired, clear it and retry once
      accessToken = null;
      tokenExpiry = 0;
      throw new Error('Authentication expired. Please try again.');
    }
    
    if (error.response?.status === 400) {
      const errorMsg = error.response.data?.errors?.[0]?.detail || 'Invalid search parameters';
      throw new Error(errorMsg);
    }
    
    throw new Error(error.response?.data?.errors?.[0]?.detail || 'Failed to search flights');
  }
}

export async function searchLocations(keyword: string) {
  const token = await getAccessToken();

  try {
    const response = await axios.get(`${AMADEUS_V1_BASE_URL}/reference-data/locations`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        keyword,
        subType: 'AIRPORT,CITY',
        'page[limit]': 10,
      },
      timeout: 10000, 
    });

    console.log(`✅ Found ${response.data.data?.length || 0} locations for "${keyword}"`);
    return response.data.data || [];
  } catch (error: any) {
    console.error('❌ Location search error:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      // Token expired, clear it
      accessToken = null;
      tokenExpiry = 0;
      throw new Error('Authentication expired. Please try again.');
    }
    
    // Return empty array instead of throwing for location search
    // This prevents autocomplete from breaking
    return [];
  }
}

export async function getAirlineName(code: string): Promise<string> {
  // Common airline codes mapping
  const airlines: Record<string, string> = {
    'AA': 'American Airlines',
    'UA': 'United Airlines',
    'DL': 'Delta Air Lines',
    'BA': 'British Airways',
    'LH': 'Lufthansa',
    'AF': 'Air France',
    'KL': 'KLM',
    'EK': 'Emirates',
    'QR': 'Qatar Airways',
    'TK': 'Turkish Airlines',
    'SQ': 'Singapore Airlines',
    'CX': 'Cathay Pacific',
    'JL': 'Japan Airlines',
    'NH': 'All Nippon Airways',
    'QF': 'Qantas',
    'VS': 'Virgin Atlantic',
    'EY': 'Etihad Airways',
    'SU': 'Aeroflot',
    'LX': 'Swiss International Air Lines',
    'OS': 'Austrian Airlines',
    'SK': 'Scandinavian Airlines',
    'AZ': 'ITA Airways',
    'TP': 'TAP Air Portugal',
    'IB': 'Iberia',
    'AC': 'Air Canada',
    'NZ': 'Air New Zealand',
    'SA': 'South African Airways',
    'KE': 'Korean Air',
    'OZ': 'Asiana Airlines',
    'PR': 'Philippine Airlines',
    'TG': 'Thai Airways',
    'VN': 'Vietnam Airlines',
    'CI': 'China Airlines',
    'BR': 'EVA Air',
  };

  return airlines[code] || code;
}