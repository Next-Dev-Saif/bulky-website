import { NextResponse } from "next/server";

/**
 * GET /api/maps/distance-matrix
 * Server-side proxy for Google Directions API.
 * Uses the same endpoint as the mobile app's getDrivingDistance utility.
 * Browser fetch is blocked by CORS so all calls go through this server route.
 *
 * Query params:
 *   - origins: "lat,lng"   (pickup)
 *   - destinations: "lat,lng" (dropoff)
 *
 * Returns: { distanceKm, durationMin }
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const origins = searchParams.get("origins");
  const destinations = searchParams.get("destinations");

  if (!origins || !destinations) {
    return NextResponse.json(
      { error: "origins and destinations are required" },
      { status: 400 }
    );
  }

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Google Maps API key not configured" },
      { status: 500 }
    );
  }

  // Exact same Directions API call as mobile app getDrivingDistance()
  const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origins}&destination=${destinations}&key=${apiKey}`;

  try {
    const res = await fetch(url);
    const json = await res.json();

    if (json.routes?.length > 0) {
      const leg = json.routes[0].legs[0];
      return NextResponse.json({
        distanceKm: leg.distance.value / 1000,
        durationMin: leg.duration.value / 60,
      });
    }

    return NextResponse.json(
      { error: "No routes found", status: json.status },
      { status: 404 }
    );
  } catch (error) {
    console.error("Directions API proxy error:", error);
    return NextResponse.json(
      { error: "Failed to fetch from Google Directions API" },
      { status: 502 }
    );
  }
}
