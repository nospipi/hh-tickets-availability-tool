import { NextRequest, NextResponse } from "next/server"

// export function middleware(req: NextRequest) {
//   // Extract IP address and geo data
//   const ip = req.ip
//   const { nextUrl: url, geo } = req

//   console.log("url:", url)
//   console.log("geo:", geo)

//   // Add the IP and geo data to the request headers (optional)
//   const response = NextResponse.next()

//   response.headers.set("X-Client-IP", ip || "UNKNOWN")
//   response.headers.set("X-Client-Geo", JSON.stringify(geo) || "UNKNOWN")

//   return response
// }

export async function middleware(req: NextRequest) {
  const { nextUrl: url, geo } = req
  console.log("url:", url)
  console.log("geo:", geo)

  const country = geo?.country || "UNKNOWN"
  const city = geo?.city || "UNKNOWN"
  const region = geo?.region || "UNKNOWN"

  url.searchParams.set("country", country)
  url.searchParams.set("city", city)
  url.searchParams.set("region", region)

  //set headers for all
  return NextResponse.rewrite(url, {
    headers: {
      "x-country": country,
      "x-city": city,
      "x-region": region,
    },
  })
}

export const config = {
  matcher: "/:path*", // Apply middleware to all routes
}
