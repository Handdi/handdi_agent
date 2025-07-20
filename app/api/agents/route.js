import Airtable from 'airtable';
import { NextResponse } from 'next/server';

// Initialize Airtable configuration
let base;
try {
  if (!process.env.AIRTABLE_API_KEY || !process.env.AIRTABLE_BASE_ID) {
    throw new Error('Missing Airtable configuration');
  }
  base = new Airtable({
    apiKey: process.env.AIRTABLE_API_KEY
  }).base(process.env.AIRTABLE_BASE_ID);
} catch (error) {
  console.error('Airtable initialization error:', error);
}

// Cache configuration - 24 hours in seconds
const CACHE_DURATION = 24 * 60 * 60;
const STALE_WHILE_REVALIDATE = 60 * 60; // 1 hour

export async function GET() {
  try {
    // Check if environment variables are loaded
    if (!process.env.AIRTABLE_API_KEY || !process.env.AIRTABLE_BASE_ID || !process.env.AIRTABLE_TABLE_NAME) {
      console.error('Missing environment variables:', {
        hasApiKey: !!process.env.AIRTABLE_API_KEY,
        hasBaseId: !!process.env.AIRTABLE_BASE_ID,
        hasTableName: !!process.env.AIRTABLE_TABLE_NAME
      });
      return NextResponse.json(
        { error: 'Server configuration error - Missing environment variables' },
        { status: 500 }
      );
    }

    if (!base) {
      console.error('Airtable base not initialized');
      return NextResponse.json(
        { error: 'Server configuration error - Airtable not initialized' },
        { status: 500 }
      );
    }

    // Fetch all records from Airtable
    const records = await base(process.env.AIRTABLE_TABLE_NAME)
      .select({
        view: 'Grid view'
      })
      .all();

    // Transform the records into our desired format
    const agents = records.map(record => {
      const fields = record.fields || {};
      return {
        agentName: fields.Name || '',
        agency: fields.Firm || '',
        earnings: parseFloat(fields['Referral Earned'] || 0) || 0
      };
    });

    // Sort by earnings (descending) and add rank
    const sortedAgents = agents
      .sort((a, b) => b.earnings - a.earnings)
      .map((agent, index) => ({
        ...agent,
        rank: index + 1
      }));

    // Return the response with cache headers
    return NextResponse.json(
      { 
        agents: sortedAgents,
        lastUpdated: new Date().toISOString()
      },
      {
        headers: {
          'Cache-Control': `public, s-maxage=${CACHE_DURATION}, stale-while-revalidate=${STALE_WHILE_REVALIDATE}`,
          'CDN-Cache-Control': `max-age=${CACHE_DURATION}`,
          'X-Content-Type-Options': 'nosniff',
        },
      }
    );

  } catch (error) {
    // Log the error for debugging
    console.error('Error fetching agents from Airtable:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      statusCode: error.statusCode,
      error: error.error
    });
    
    // Return error response
    return NextResponse.json(
      { 
        error: 'Failed to fetch agent data',
        message: error.message,
        details: error.error || 'Unknown error'
      },
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-store', // Don't cache errors
        },
      }
    );
  }
} 