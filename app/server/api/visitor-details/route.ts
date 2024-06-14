import { NextRequest, NextResponse } from "next/server"
import moment from "moment"
//@ts-ignore
import { AvailabilityToolVisitorModel } from "getaways-projects-common-files/models/models.js"

export async function GET(req: NextRequest) {
  const ip = req?.headers.get("X-Client-IP")
  const geo = req?.headers.get("X-Client-Geo")

  console.log("WWWWWWWWWWWWWWWW IP", ip)
  console.log("WWWWWWWWWWWWWWWW GEO", geo)

  // // Insert the data into MongoDB
  //   const newVisitor = new AvailabilityToolVisitorModel({
  //     ip,
  //     city: geo?.city,
  //     country: geo?.country,
  //     latitude: geo?.latitude,
  //     longitude: geo?.longitude,
  //     region: geo?.region,
  //     timestamp: new Date().toISOString(),
  //   })

  //   await newVisitor.save()

  return NextResponse.json("Visitor data logged successfully")
}
