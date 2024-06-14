import { NextResponse } from "next/server"
import moment from "moment"

export async function GET(request) {
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

  // Insert the data into MongoDB

  return NextResponse.json({
    ip: ip,
    geo: geo,
    timestamp: moment().format("YYYY-MM-DD HH:mm:ss"),
  })
}
