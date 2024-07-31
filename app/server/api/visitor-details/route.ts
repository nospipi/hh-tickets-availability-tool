import { NextRequest, NextResponse } from "next/server"
import moment from "moment"
import connectDB from "../../db.connect"
const { AvailabilityToolVisitorModel } = require("../..//models");

export const GET = async (req: NextRequest) => {
  const ip = req?.headers.get("X-Client-IP");
  const geo = req?.headers.get("X-Client-Geo") || "{city: UNKNOWN}";
  const parsedGeo = JSON.parse(geo);

  try {
    await connectDB();

    const shouldSave = ip !== "UNKNOWN" && parsedGeo?.city !== "UNKNOWN";

    if (shouldSave) {
      const newVisitor = new AvailabilityToolVisitorModel({
        ip: ip,
        city: parsedGeo?.city,
        country: parsedGeo?.country,
        latitude: parsedGeo?.latitude,
        longitude: parsedGeo?.longitude,
        region: parsedGeo?.region,
        timestamp: moment().format("YYYY-MM-DD HH:mm:ss"),
      });

      await newVisitor.save();
      console.log("Visitor data recorded successfully");
    } else {
      console.log("Visitor data not recorded");
    }

    return NextResponse.json("Visitor data recorded successfully");
  } catch (e) {
    console.log("ERROR GET", e);
    return NextResponse.json("Visitor data not recorded");
  }
};
