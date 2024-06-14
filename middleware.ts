import { NextRequest, NextResponse } from "next/server"

export function middleware(request: NextRequest) {
  // Extract IP address and geo data
  const ip = request.ip
  const geo = request.geo

  // Add the IP and geo data to the request headers (optional)
  const response = NextResponse.next()

  response.headers.set("X-Client-IP", ip || "UNKNOWN")
  response.headers.set("X-Client-Geo", JSON.stringify(geo) || "UNKNOWN")

  return response
}

export const config = {
  matcher: "/:path*", // Apply middleware to all routes
}
