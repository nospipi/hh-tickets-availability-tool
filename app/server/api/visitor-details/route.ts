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
  console.log("request from route.js", request)
  console.log("req?.headers from route.js", req?.headers)

  // Insert the data into MongoDB

  return res.json({
    // clientIp: clientIp,
    // clientGeo: clientGeo,
    NextRequestReq: request,
    NextApiRequestReq: req,
    timestamp: moment().format("YYYY-MM-DD HH:mm:ss"),
  })
}
