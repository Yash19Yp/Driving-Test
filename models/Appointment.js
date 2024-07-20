const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AppointmentSchema = new Schema({
  date: { type: String, required: true },
  time: { type: String, required: true },
  isTimeSlotAvailable: { type: Boolean, default: true },
});

const Appointment = mongoose.model("Appointment", AppointmentSchema);
module.exports = Appointment;
