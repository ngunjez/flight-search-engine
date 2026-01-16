# ✈️ FlightSearch Engine

A modern, responsive flight search application built with Next.js, TypeScript, and Material-UI. Features real-time filtering, live price graphs, and a polished user experience.

## 🚀 Features

### Core Functionality
- **Advanced Search**: Search flights by origin, destination, dates, passengers, and travel class
- **Location Autocomplete**: Smart airport/city search with real-time suggestions
- **Complex Filtering**: Filter by price range, stops, airlines simultaneously
- **Live Price Graph**: Visual price trends that update in real-time with filters
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop

### Technical Highlights
- **Server-side API Integration**: Amadeus Self-Service API (Test environment)
- **Real-time Data Updates**: Instant filter application without page reloads
- **Type-Safe**: Full TypeScript implementation
- **Modern UI**: Material-UI components with custom theming
- **Performance Optimized**: Efficient data processing and rendering

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- Amadeus API credentials (free from [developers.amadeus.com](https://developers.amadeus.com))

## 🛠️ Installation

### 1. Clone & Install

```bash
# Create project
npx create-next-app@latest flight-search-engine --typescript --tailwind --app
cd flight-search-engine

# Install dependencies
npm install @mui/material @emotion/react @emotion/styled
npm install @mui/x-date-pickers dayjs
npm install @mui/icons-material
npm install recharts axios
npm install @mui/material-nextjs
```

### 2. Configure Environment Variables

Create `.env.local` in the root directory:

```env
AMADEUS_API_KEY=your_api_key_here
AMADEUS_API_SECRET=your_api_secret_here
NEXT_PUBLIC_API_URL=/api/flights
```

**Get Amadeus Credentials:**
1. Sign up at [Amadeus for Developers](https://developers.amadeus.com/register)
2. Create a new app in the dashboard
3. Copy the API Key and API Secret
4. Use the **Test** environment credentials

### 3. Project Structure

```
flight-search-engine/
├── src/
│   ├── app/
│   │   ├── page.tsx                 # Main page
│   │   ├── layout.tsx               # Theme & layout
│   │   └── api/
│   │       └── flights/
│   │           └── route.ts         # API route
│   ├── components/
│   │   ├── search/
│   │   │   ├── SearchForm.tsx
│   │   │   └── LocationAutocomplete.tsx
│   │   ├── results/
│   │   │   └── FlightCard.tsx
│   │   ├── filters/
│   │   │   └── FilterPanel.tsx
│   │   └── charts/
│   │       └── PriceGraph.tsx
│   └── lib/
│       ├── amadeus.ts              # API client
│       └── types.ts                # TypeScript types
├── .env.local
└── package.json
```

### 4. Add the Code Files


1. **types.ts** → `src/lib/types.ts`
2. **amadeus.ts** → `src/lib/amadeus.ts`
3. **route.ts** → `src/app/api/flights/route.ts`
4. **SearchForm.tsx** → `src/components/search/SearchForm.tsx`
5. **LocationAutocomplete.tsx** → `src/components/search/LocationAutocomplete.tsx`
6. **FilterPanel.tsx** → `src/components/filters/FilterPanel.tsx`
7. **PriceGraph.tsx** → `src/components/charts/PriceGraph.tsx`
8. **FlightCard.tsx** → `src/components/results/FlightCard.tsx`
9. **page.tsx** → `src/app/page.tsx`
10. **layout.tsx** → `src/app/layout.tsx`

### 5. Run Development Server

```bash
yarn dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub:**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin your-repo-url
git push -u origin main
```

2. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Add environment variables:
     - `AMADEUS_API_KEY`
     - `AMADEUS_API_SECRET`
     - `NEXT_PUBLIC_API_URL` = `/api/flights`
   - Click "Deploy"

3. **site will be live at:** `https://your-project.vercel.app`



## 🧪 Testing the Application

### Test Searches

1. **New York to London**
   - Origin: JFK or NYC
   - Destination: LON or LHR
   - Date: 2 weeks from today

2. **Los Angeles to Tokyo**
   - Origin: LAX
   - Destination: NRT or TYO
   - Date: Next month

3. **Miami to Paris**
   - Origin: MIA
   - Destination: CDG or PAR
   - Date: 3 weeks from today

## 📊 Performance Optimization

- **Memoization**: Used `useMemo` for expensive computations
- **Debouncing**: Location search debounced to reduce API calls
- **Efficient Filtering**: Client-side filtering for instant updates
- **Code Splitting**: Next.js automatic code splitting
- **Optimized Rendering**: React keys and proper component structure

## 🐛 Troubleshooting

### API Authentication Fails
- Verify credentials in `.env.local`
- Check you're using **Test** environment keys
- Restart dev server after changing env vars

### No Flights Found
- Try popular routes (NYC-LON, LAX-TYO)
- Check dates are in the future
- Verify API quota hasn't been exceeded

### Autocomplete Not Working
- Check network tab for API calls
- Verify `/api/flights?action=locations` endpoint
- Try clearing browser cache

## 📝 Code Quality

- **Clean Code**: Descriptive variable names, proper comments
- **Reusable Components**: Modular, single-responsibility components
- **Type Safety**: Comprehensive TypeScript interfaces
- **Error Handling**: Try-catch blocks with user feedback
- **Responsive**: Mobile-first approach

## 🎯 Meets All Requirements

✅ Search & Results with clear display
✅ Live Price Graph (Recharts) updating in real-time
✅ Complex Filtering (Stops + Price + Airline) 
✅ Responsive Design (Mobile + Desktop)
✅ Clean, well-structured code
✅ TypeScript throughout
✅ Material-UI components
✅ Production-ready deployment

## 📞 Support

For questions or issues:
- Check the Amadeus [documentation](https://developers.amadeus.com/self-service)
- Review Next.js [docs](https://nextjs.org/docs)
- Material-UI [documentation](https://mui.com/)

---

Built using Next.js, TypeScript, and Material-UI# flight-search-engine
