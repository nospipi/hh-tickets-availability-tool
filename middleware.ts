import { NextRequest, NextResponse } from "next/server"

// const availabilityToolVisitorSchema = new Schema({
//   ip: String,
//   city: String,
//   country: String,
//   latitude: String,
//   longitude: String,
//   region: String,
//   timestamp: String,
// })

export const middleware = async (req: NextRequest) => {
  const ip = req?.ip
  const geo = req?.geo

  //set headers for all
  return NextResponse.next({
    headers: {
      "X-Client-IP": ip || "UNKNOWN",
      "X-Client-Geo": JSON.stringify(geo) || "UNKNOWN",
    },
  })
}

export const config = {
  matcher: "/:path*", // Apply middleware to all routes
}
