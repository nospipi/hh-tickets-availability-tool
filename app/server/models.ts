const moment = require("moment");
const mongoose = require("mongoose");
import { Schema, model } from "mongoose";

//-------------------------------------------------------------------------------

export type Slot = {
  id: string;
  avail: number;
  availChange: "positive" | "negative" | "neutral";
  availChangeTimestamp: string;
  zone: string;
};

type TicketAvailability = {
  place: string;
  placedate: string;
  id: string;
  timestamp: string;
  avail: number;
  availChange: "positive" | "negative" | "neutral";
  slots: Slot[];
};

const ticketsAvailabilitySchema = Schema<TicketAvailability>;
const TicketsAvailability = new ticketsAvailabilitySchema({
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
});

TicketsAvailability.pre("save", function (next: any) {
  this.id = `${this.place}${this.placedate}`;
  next();
});

TicketsAvailability.pre("updateOne", async function (next: any) {
  // for each slot, we check the previous avail
  // if current avail is 0 or less, we set availChange to "neutral", no need to indicate trend if its already 0
  // if previous avail is less than current avail, we set availChange to "positive", indicating an increase in availability
  // if previous avail is more than current avail, we set availChange to "negative", indicating a decrease in availability
  // if previous avail is equal to current avail, we set availChange to "neutral", indicating no change in availability

  const prev = this.getQuery();
  const prevDoc = await this.model.findOne(prev).lean<TicketAvailability>();
  const update = this.getUpdate() as { slots: Slot[] };

  if (prevDoc && update) {
    for (let slot of update.slots) {
      const prevSlot = prevDoc.slots.find((s: any) => s.id === slot.id);

      if (!prevSlot) {
        continue;
      }
      const prevAvailNumber = prevSlot.avail.toString().replace(/\D/g, "");
      const prevParsedNumber = parseInt(prevAvailNumber, 10);
      const currAvailNumber = slot.avail.toString().replace(/\D/g, "");
      const currParsedNumber = parseInt(currAvailNumber, 10);
      const prevAvailChange = prevSlot.availChange;
      const prevAvailChangeTimestamp = prevSlot.availChangeTimestamp;
      const prevAvailChangeExpired = moment(prevAvailChangeTimestamp).isBefore(
        moment().subtract(5, "minutes")
      );

      // Determine availChange based on availability comparison
      if (currParsedNumber === 0) {
        slot.availChange = "neutral";
        slot.availChangeTimestamp = new Date().toISOString();
      }

      if (
        prevParsedNumber < currParsedNumber //has increased
      ) {
        slot.availChange = "positive"; // change is positive
        slot.availChangeTimestamp = new Date().toISOString(); // update timestamp
      }

      if (
        prevParsedNumber > currParsedNumber //has decreased
      ) {
        slot.availChange = "negative"; // change is negative
        slot.availChangeTimestamp = new Date().toISOString(); // update timestamp
      }

      if (prevParsedNumber === currParsedNumber) {
        if (prevAvailChangeExpired) {
          slot.availChange = "neutral"; // reset to neutral
          slot.availChangeTimestamp = new Date().toISOString(); // update timestamp
        } else {
          slot.availChange = prevAvailChange; // keep previous change

          //dont update timestamp to keep tracking of time since last change
        }
      }
    }
  }

  next();
});

const availabilityToolVisitorSchema = Schema;
const AvailabilityToolVisitor = new availabilityToolVisitorSchema({
  ip: String,
  city: String,
  country: String,
  latitude: String,
  longitude: String,
  region: String,
  timestamp: String,
});

//--------------------------------------------------------------

//https://stackoverflow.com/questions/62440264/mongoose-nextjs-model-is-not-defined-cannot-overwrite-model-once-compiled
const AvailabilityToolVisitorModel =
  mongoose.models.availability_tool_visitor ||
  model("availability_tool_visitor", AvailabilityToolVisitor);
const TicketsAvailabilityModel =
  mongoose.models.tickets_availability ||
  model<TicketAvailability>("tickets_availability", TicketsAvailability);

export { AvailabilityToolVisitorModel, TicketsAvailabilityModel };
