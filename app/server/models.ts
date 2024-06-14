const mongoose = require("mongoose")
const { Schema, model } = mongoose

//-------------------------------------------------------------------------------

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

module.exports = {
  AvailabilityToolVisitorModel: model(
    "availability_tool_visitor",
    availabilityToolVisitorSchema
  ),
}
