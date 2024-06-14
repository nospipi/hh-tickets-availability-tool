import { NextRequest, NextResponse } from "next/server"

export const middleware = async (req: NextRequest) => {
  const ip = req?.ip
  const geo = req?.geo

  return NextResponse.next({
    headers: {
      "X-Client-IP": ip || "UNKNOWN",
      "X-Client-Geo": JSON.stringify(geo) || "{city: UNKNOWN}",
    },
  })
}

export const config = {
  matcher: "/:path*", // Apply middleware to all routes
}
