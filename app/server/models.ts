const mongoose = require("mongoose")
const { Schema, model } = mongoose

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
