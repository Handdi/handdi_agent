# Handdi.io Agent Leaderboard Dashboard

A modern, animated React dashboard built with Next.js 14 that displays agent performance metrics from Airtable. Features real-time data visualization, beautiful animations, and a responsive design.

![Next.js](https://img.shields.io/badge/Next.js-14.2.30-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=flat-square&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.3.0-38B2AC?style=flat-square&logo=tailwind-css)
![Framer Motion](https://img.shields.io/badge/Framer%20Motion-12.23.6-FF0055?style=flat-square&logo=framer)

## 🌟 Features

- **Real-time Data**: Fetches agent data from Airtable with 24-hour caching
- **Beautiful Animations**: Smooth transitions and effects using Framer Motion
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Performance Optimized**: 
  - Lazy loading for charts
  - Skeleton loading screens
  - Optimized caching headers
  - Code splitting with dynamic imports
- **Visual Highlights**:
  - Top 3 agents with medal animations
  - Interactive pie chart with vibrant colors
  - Searchable and paginated table
  - Gradient backgrounds and shadow effects

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- An Airtable account with API access
- Your Airtable Base ID and API Key

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd handdi-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:

Run the interactive setup:
```bash
npm run setup
```

Or create `.env.local` manually:
```env
AIRTABLE_API_KEY=your_api_key_here
AIRTABLE_BASE_ID=your_base_id_here
AIRTABLE_TABLE_NAME=your_table_name_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## 📊 Airtable Configuration

Your Airtable table should have the following fields:

- **Name**: Agent's name (Text)
- **Firm**: Agency name (Text)
- **Referral Earned**: Earnings amount (Number/Currency)

The API maps these fields to:
- `Name` → `agentName`
- `Firm` → `agency`
- `Referral Earned` → `earnings`

## 🏗️ Project Structure

```
handdi-dashboard/
├── app/
│   ├── api/
│   │   └── agents/
│   │       └── route.js      # API endpoint for Airtable data
│   ├── globals.css           # Global styles
│   ├── layout.js             # Root layout
│   └── page.js               # Home page
├── components/
│   ├── Dashboard.js          # Main dashboard component
│   ├── DashboardSkeleton.js  # Loading skeleton
│   └── ChartSection.js       # Pie chart component
├── public/
│   └── logo.png              # Company logo
├── .env.local                # Environment variables (gitignored)
├── .gitignore                # Git ignore rules
├── next.config.js            # Next.js configuration
├── tailwind.config.js        # Tailwind CSS configuration
└── package.json              # Dependencies and scripts
```

## 🚀 Deployment to Vercel

### Prerequisites
1. A [Vercel account](https://vercel.com/signup)
2. Vercel CLI installed (optional): `npm i -g vercel`

### Deploy via Vercel Dashboard

1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "Import Project"
4. Select your GitHub repository
5. Configure environment variables:
   - `AIRTABLE_API_KEY`
   - `AIRTABLE_BASE_ID`
   - `AIRTABLE_TABLE_NAME`
6. Click "Deploy"

### Deploy via CLI

```bash
# Install Vercel CLI if you haven't
npm i -g vercel

# Deploy
vercel

# Follow the prompts and add environment variables when asked
```

### Environment Variables in Vercel

Add these in your Vercel project settings:
- Go to Project Settings → Environment Variables
- Add each variable for Production, Preview, and Development

## 🛡️ Security Features

- API keys stored in environment variables
- No client-side exposure of secrets
- Proper error handling without exposing sensitive data
- Updated dependencies with no critical vulnerabilities
- XSS protection through React's built-in escaping

## 🎨 Customization

### Modifying Colors
Edit the color palette in `components/ChartSection.js`:
```javascript
const COLORS = [
  '#FF6B6B', // Coral Red
  '#4ECDC4', // Turquoise
  // Add your colors here
];
```

### Changing Animation Speed
Modify animation durations in `components/Dashboard.js`:
```javascript
transition={{ duration: 0.5 }} // Change duration
```

### Adjusting Cache Duration
Edit cache settings in `app/api/agents/route.js`:
```javascript
const CACHE_DURATION = 24 * 60 * 60; // 24 hours
```

## 📦 Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) - React framework with App Router
- **UI Library**: [React 18](https://reactjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- **Animations**: [Framer Motion](https://www.framer.com/motion/) - Animation library
- **Charts**: [Recharts](https://recharts.org/) - Composable charting library
- **Icons**: [Lucide React](https://lucide.dev/) - Icon library
- **Data Source**: [Airtable](https://airtable.com/) - Cloud database

## 🧹 Project Maintenance

### Cleaning Up
The project has been optimized by removing:
- Temporary log files (`server.log`)
- Test files (`test-*.js`)
- Empty directories (`styles/`)

### File Structure
All unnecessary files have been removed. The current structure includes only essential files for the application to run.

## 🐛 Troubleshooting

### Common Issues

1. **"Airtable API key is not authorized"**
   - Verify your API key has read access to the base
   - Check if the Base ID and Table Name are correct
   - Ensure no quotes or spaces in `.env.local`

2. **"Failed to fetch agent data"**
   - Check your internet connection
   - Verify Airtable service status
   - Confirm environment variables are loaded

3. **Build errors**
   - Run `npm install` to ensure all dependencies are installed
   - Clear Next.js cache: `rm -rf .next`
   - Check Node.js version (18+ required)

## 📝 License

This project is private and proprietary.

## 🤝 Contributing

For internal team members:
1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

---

Built with ❤️ by Handdi.io Team