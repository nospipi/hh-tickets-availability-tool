// @ts-ignore
import { NextResponse, NextRequest } from "next/server"
//-------------------------------------

// export async function GET() {
//   try {
//     const products = await ProductsModel.find({
//       isPublished: true,
//     }).sort({ index: 1 })
//     return NextResponse.json(products)
//   } catch (error) {
//     console.error(error)
//   }
// }

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
    console.log("error getAvailabilityZones fn", error)
    return error
  }
}

export async function POST(req: NextRequest, res: NextResponse) {
  const { placedate, place } = await req.json()
  //console.log("date", date)
  //IN GET = console.log("req", req.nextUrl.searchParams.get("date"))

  if (!placedate) {
    // return res.status(400).json({ error: "Date is required" })
    throw new Error("Date is required")
  }

  if (!place) {
    // return res.status(400).json({ error: "Place is required" })
    throw new Error("Place is required")
  }

  try {
    const zones = await getAvailabilityZones(placedate, place)
    return NextResponse.json(zones)
  } catch (e) {
    console.log("error async function GET", e)
    return NextResponse.json(e)
  }
}
