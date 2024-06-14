import { NextRequest, NextResponse } from "next/server"
import moment from "moment"
//@ts-ignore
import { AvailabilityToolVisitorModel } from "getaways-projects-common-files/models/models.js"

export async function GET(req: NextRequest) {
  const ip = req?.headers.get("X-Client-IP")
  const geo = req?.headers.get("X-Client-Geo") || "{}"
  const parsedGeo = JSON.parse(geo)

  // // Insert the data into MongoDB
  const newVisitor = new AvailabilityToolVisitorModel({
    ip,
    city: parsedGeo?.city,
    country: parsedGeo?.country,
    latitude: parsedGeo?.latitude,
    longitude: parsedGeo?.longitude,
    region: parsedGeo?.region,
    timestamp: new Date().toISOString(),
  })

  const shouldSave = ip !== "UNKNOWN" && parsedGeo?.city !== "UNKNOWN"

  if (shouldSave) {
    await newVisitor.save()
  }

  return NextResponse.json("Visitor data logged successfully")
}
