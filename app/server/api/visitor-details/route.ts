import { NextRequest, NextResponse } from "next/server"
import moment from "moment"
const mongoose = require("mongoose")

const AvailabilityToolVisitorSchema = new mongoose.Schema({
  ip: String,
  city: String,
  country: String,
  latitude: Number,
  longitude: Number,
  region: String,
  timestamp: String,
})

const AvailabilityToolVisitorModel = mongoose.model(
  "AvailabilityToolVisitor",
  AvailabilityToolVisitorSchema
)

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
      timestamp: moment().format("YYYY-MM-DD HH:mm:ss"),
    })

    const shouldSave = ip !== "UNKNOWN" && parsedGeo?.city !== "UNKNOWN"

    if (shouldSave) {
      await newVisitor.save()
      console.log("Visitor data recorded successfully")
    } else {
      console.log("Visitor data not recorded")
    }

    return NextResponse.json("Visitor data recorded successfully")
  } catch (e) {
    console.log("ERROR IN MIDDLEWARE", e)
    return NextResponse.json("Visitor data not recorded")
  }
}
