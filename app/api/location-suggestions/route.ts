// Location Suggestions API Route

import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const input = searchParams.get('input')

  if (!input) {
    return NextResponse.json({ error: 'Invalid input parameter' }, { status: 400 })
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
        input
      )}&components=country:bd&key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}`
    )

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    // console.error('Error fetching location suggestions:', error)
    return NextResponse.json({ error: 'Failed to fetch location suggestions' }, { status: 500 })
  }
}

