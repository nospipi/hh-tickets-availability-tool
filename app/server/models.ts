const mongoose = require("mongoose")
const { Schema, model } = mongoose
const moment = require("moment")

//-------------------------------------------------------------------------------

const ticketsAvailabilitySchema = new Schema({
  place: String,
  placedate: String,
  id: String,
  slots: [
    {
      zone: String,
      id: String,
      avail: String,
      availChange: { type: String, default: "neutral" }, // "positive"| "negative" | "neutral"
      //availChange: String,
      availChangeTimestamp: { type: String, default: new Date().toISOString() },
    },
  ],
  timestamp: {
    type: String,
    default: new Date().toISOString(),
  },
})

ticketsAvailabilitySchema.pre("save", function (next: any) {
  //@ts-ignore
  this.id = `${this.place}${this.placedate}`
  next()
})

ticketsAvailabilitySchema.pre("updateOne", async function (next: any) {
  // for each slot, we check the previous avail
  // if current avail is 0 or less, we set availChange to "neutral", no need to indicate trend if its already 0
  // if previous avail is less than current avail, we set availChange to "positive", indicating an increase in availability
  // if previous avail is more than current avail, we set availChange to "negative", indicating a decrease in availability
  // if previous avail is equal to current avail, we set availChange to "neutral", indicating no change in availability

  //@ts-ignore
  const prev = this.getQuery()
  //@ts-ignore
  const prevDoc = await this.model.findOne(prev).lean()
  //@ts-ignore
  const update = this.getUpdate()

  for (let slot of update.slots) {
    const prevSlot = prevDoc.slots.find((s: any) => s.id === slot.id)
    const prevAvailNumber = prevSlot.avail.replace(/\D/g, "")
    const prevParsedNumber = parseInt(prevAvailNumber, 10)
    const currAvailNumber = slot.avail.replace(/\D/g, "")
    const currParsedNumber = parseInt(currAvailNumber, 10)
    const prevAvailChange = prevSlot.availChange
    const prevAvailChangeTimestamp = prevSlot.availChangeTimestamp
    const prevAvailChangeExpired = moment(prevAvailChangeTimestamp).isBefore(
      moment().subtract(5, "minutes")
    )

    // Determine availChange based on availability comparison
    if (currParsedNumber === 0) {
      slot.availChange = "neutral"
      slot.availChangeTimestamp = new Date().toISOString()
    }

    if (
      prevParsedNumber < currParsedNumber //has increased
    ) {
      slot.availChange = "positive" // change is positive
      slot.availChangeTimestamp = new Date().toISOString() // update timestamp
    }

    if (
      prevParsedNumber > currParsedNumber //has decreased
    ) {
      slot.availChange = "negative" // change is negative
      slot.availChangeTimestamp = new Date().toISOString() // update timestamp
    }

    if (prevParsedNumber === currParsedNumber) {
      if (prevAvailChangeExpired) {
        console.log("Expired")
        // if previous change is more than 5 minutes old
        slot.availChange = "neutral" // reset to neutral
        slot.availChangeTimestamp = new Date().toISOString() // update timestamp
      } else {
        console.log("NOT Expired")
        // if previous change is less than 5 minutes old
        slot.availChange = prevAvailChange // keep previous change

        //dont update timestamp to keep tracking of time since last change
      }
    }
  }

  next()
})

const availabilityToolVisitorSchema = new Schema({
  ip: String,
  city: String,
  country: String,
  latitude: String,
  longitude: String,
  region: String,
  timestamp: String,
})

//--------------------------------------------------------------
mongoose.models = {}
//https://stackoverflow.com/questions/19051041/cannot-overwrite-model-once-compiled-mongoose
module.exports = {
  AvailabilityToolVisitorModel: model(
    "availability_tool_visitor",
    availabilityToolVisitorSchema
  ),

  TicketsAvailabilityModel: model(
    "tickets_availability",
    ticketsAvailabilitySchema
  ),
}
