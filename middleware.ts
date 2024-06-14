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
  const ip = req?.ip
  console.log("CHIFSA IP", ip)
  //if the project is not uploaded to vercel, you can use the header "X=Forwarded-For"
  //let ip = request.headers.get('X-Forwarded-For')
  //and the we have to use external service to extract the geo location of the ip

  //Provided by vercel
  const geo = req?.geo
  console.log("CHIFSA GEO", geo)

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
