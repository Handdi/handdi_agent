# 🚀 Quick Start Guide

Get your Handdi.io Dashboard up and running in 5 minutes!

## Step 1: Navigate to the project
```bash
cd handdi-dashboard
```

## Step 2: Install dependencies
```bash
npm install
```

## Step 3: Configure Airtable (Choose one method)

### Option A: Use the setup wizard (Recommended)
```bash
npm run setup
```
Follow the prompts to enter your Airtable credentials.

### Option B: Manual setup
Create a `.env.local` file with your credentials:
```env
AIRTABLE_API_KEY=your_api_key_here
AIRTABLE_BASE_ID=your_base_id_here
AIRTABLE_TABLE_NAME=Agents
```

## Step 4: Start the development server
```bash
npm run dev
```

## Step 5: Open your browser
Navigate to [http://localhost:3000](http://localhost:3000)

## 🎉 That's it!

Your dashboard should now be running with live data from Airtable.

## Need Help?

- Check the full [README.md](README.md) for detailed documentation
- Ensure your Airtable table has the required fields: `Name`, `Firm`, `Referral Earned`
- Verify your API key has the correct permissions

## Production Deployment

Ready to go live? Build and deploy:

```bash
npm run build
npm start
```

Or deploy to Vercel with one command:
```bash
npx vercel
``` 