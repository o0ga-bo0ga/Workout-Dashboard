# Workout Analytics Dashboard

A modern, read-only workout analytics dashboard built with Next.js, TypeScript, and Tailwind CSS. Visualizes workout data from a Supabase PostgreSQL database with beautiful charts and metrics.

![Dashboard Preview](https://img.shields.io/badge/Next.js-14+-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3+-38B2AC?style=for-the-badge&logo=tailwind-css)

## Features

- **📊 Dashboard Stats**: Last workout, total workouts (30 days), average per week, consistency score
- **📈 Interactive Charts**: Workout volume over time (line chart) and workouts per week (bar chart)
- **📝 Workout History**: Scrollable list of recent workouts with detailed view
- **🎨 Premium Design**: Glassmorphism effects, gradient borders, smooth animations
- **📱 Responsive**: Optimized for desktop, tablet, and mobile devices
- **⚡ Fast**: Built with Next.js App Router and optimized for Vercel/Netlify

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React

## Database Schema

```sql
CREATE TABLE workouts (
  id SERIAL PRIMARY KEY,
  workout_date DATE UNIQUE,
  title TEXT,
  description TEXT,
  total_volume INTEGER,
  is_rest_day BOOLEAN,
  created_at TIMESTAMP
);
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account with a PostgreSQL database
- Workout data already populated in the database

### Installation

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd workout-analytics
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy!

### Deploy to Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start)

1. Push your code to GitHub
2. Import your repository in Netlify
3. Add environment variables in Netlify dashboard
4. Set build command: `npm run build`
5. Set publish directory: `.next`
6. Deploy!

## Project Structure

```
workout-analytics/
├── app/
│   ├── api/              # API routes
│   │   ├── dashboard/    # Dashboard stats endpoint
│   │   ├── charts/       # Chart data endpoints
│   │   └── workouts/     # Workout list and detail endpoints
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Main dashboard page
├── components/
│   ├── charts/           # Chart components (Volume, Frequency)
│   ├── ui/               # UI components (StatCard, ChartCard)
│   ├── WorkoutList.tsx   # Workout list component
│   ├── WorkoutDetail.tsx # Workout detail modal
│   ├── LoadingState.tsx  # Loading skeleton
│   └── ErrorState.tsx    # Error display
├── lib/
│   └── supabase.ts       # Supabase client
├── types/
│   └── workout.ts        # TypeScript types
└── tailwind.config.ts    # Tailwind configuration
```

## API Endpoints

- `GET /api/dashboard` - Dashboard statistics
- `GET /api/charts/volume` - Workout volume data (90 days)
- `GET /api/charts/frequency` - Workouts per week (12 weeks)
- `GET /api/workouts` - Paginated workout list
- `GET /api/workouts/[id]` - Individual workout details

## Customization

### Colors

Edit `app/globals.css` to customize the gradient background:

```css
:root {
  --gradient-start: #1e1b4b;
  --gradient-end: #0f172a;
}
```

### Charts

Modify chart components in `components/charts/` to customize appearance and behavior.

### Stats Calculation

Update API routes in `app/api/` to adjust metrics calculations.

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
