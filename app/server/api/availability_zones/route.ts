import { NextResponse, NextRequest } from "next/server"
import moment from "moment"
const { TicketsAvailabilityModel } = require("../../models")
import connectDB from "../../db.connect"
//-------------------------------------

const ETICKETS_URL = process.env.ETICKETS_URL
const COOKIESESSION1 = process.env.COOKIESESSION1
const TAPB2BENAGENCYCREDS = process.env.TAPB2BENAGENCYCREDS
const TAPB2BGRAGENCYCREDS = process.env.TAPB2BGRAGENCYCREDS

const getAvailabilityZones = async (placedate: string, place: string) => {
  try {
    const response = await fetch(`${ETICKETS_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Cookie: `lg=1; cookiesession1=${COOKIESESSION1}; tapb2bENAgencyCreds=${TAPB2BENAGENCYCREDS}; tapb2bGRAgencyCreds=${TAPB2BGRAGENCYCREDS}; groupTicketPopup=true; cb-enabled=accepted; gpath=tapb2cGR`,
      },
      body: `placedate=${placedate}&place=${place}`,
    })
    const data = await response.json()
    return data
  } catch (error) {
    console.log("ERROR 1", error)
    return error
  }
}

export async function POST(req: NextRequest, res: NextResponse) {
  await connectDB()

  const { placedate, place } = await req.json()
  const id = `${place}${placedate}`

  if (!placedate) {
    throw new Error("Date is required")
  }

  if (!place) {
    throw new Error("Place is required")
  }

  try {
    const existingZone = await TicketsAvailabilityModel.findOne({ id })
    const existingZoneExpired = moment(existingZone?.timestamp).isBefore(
      moment().subtract(30, "seconds")
    )

    //if zone does not exist, create and return
    if (!existingZone) {
      const zones = await getAvailabilityZones(placedate, place)
      const newZone = new TicketsAvailabilityModel({
        place,
        placedate,
        slots: zones.slots,
      })

      await newZone.save()
      return NextResponse.json(zones)
    }

    //if zone exists and is fresh, return
    if (existingZone && !existingZoneExpired) {
      return NextResponse.json(existingZone)
    }

    //if zone exists but is expired (more than 30s old), refresh and return
    if (existingZone && existingZoneExpired) {
      const zones = await getAvailabilityZones(placedate, place)
      existingZone.slots = zones.slots
      existingZone.timestamp = new Date().toISOString()
      await existingZone.save()
      return NextResponse.json(existingZone)
    }
  } catch (e) {
    console.log("ERROR 2", e)
    return NextResponse.json(e)
  }
}
