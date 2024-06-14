import { NextRequest, NextResponse } from "next/server"
import moment from "moment"

export async function GET(req: NextRequest) {
  //Provided by vercel
  const ip = req?.ip
  //if the project is not uploaded to vercel, you can use the header "X=Forwarded-For"
  //let ip = request.headers.get('X-Forwarded-For')
  //and the we have to use external service to extract the geo location of the ip

  //Provided by vercel
  const geo = req?.geo

  // Prepare the visitor data
  //   const visitorData = {
  //     ip,
  //     geo,
  //     timestamp: moment().format("YYYY-MM-DD HH:mm:ss"),
  //   }
  console.log("NextRequest IP", ip)
  console.log("NextRequest GEO", geo)
  console.log("NextRequest HEADER IP", req?.headers)
  console.log("NextRequest HEADER IP", req?.headers.get("X-Client-IP"))
  console.log("NextRequest HEADER GEO", req?.headers.get("X-Client-Geo"))

  // Insert the data into MongoDB

  return NextResponse.json({ message: "Hello - GET" }, { status: 200 })
}
