import { NextRequest, NextResponse } from "next/server"
import { NextApiRequest, NextApiResponse } from "next"
import moment from "moment"

export async function GET(
  request: NextRequest,
  req: NextApiRequest,
  res: NextApiResponse
) {
  //Provided by vercel
  const ip = request.ip
  //if the project is not uploaded to vercel, you can use the header "X=Forwarded-For"
  //let ip = request.headers.get('X-Forwarded-For')
  //and the we have to use external service to extract the geo location of the ip

  //Provided by vercel
  const geo = request.geo

  // Prepare the visitor data
  //   const visitorData = {
  //     ip,
  //     geo,
  //     timestamp: moment().format("YYYY-MM-DD HH:mm:ss"),
  //   }

  // const clientIp = req.headers["X-Client-IP"] as string
  // const clientGeo = JSON.parse((req.headers["X-Client-Geo"] as string) || "{}")

  // Insert the data into MongoDB

  return NextResponse.json({
    ip: ip,
    geo: geo,
    // clientIp: clientIp,
    // clientGeo: clientGeo,
    timestamp: moment().format("YYYY-MM-DD HH:mm:ss"),
  })
}
