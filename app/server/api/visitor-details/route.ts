import { NextRequest, NextResponse } from "next/server"
import moment from "moment"
//@ts-ignore
import { AvailabilityToolVisitorModel } from "getaways-projects-common-files/models/models.js"

export const GET = async (req: NextRequest) => {
  const ip = req?.headers.get("X-Client-IP")
  const geo = req?.headers.get("X-Client-Geo") || "{city: UNKNOWN}"
  const parsedGeo = JSON.parse(geo)

  try {
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
      console.log("Visitor data recorded successfully")
    } else {
      console.log("Visitor data not recorded")
    }

    return NextResponse.json("Visitor data logged successfully")
  } catch (e) {
    console.log("ERROR IN MIDDLEWARE", e)
  }
}
