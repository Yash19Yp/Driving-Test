const Appointment = require("../models/Appointment");
const User = require("../models/Users");

const createAppointment = async (req, res) => {
  const { date, slots } = req.body;

  try {
    const existingAppointments = await Appointment.find({
      date,
      time: { $in: slots },
    });

    if (existingAppointments.length > 0) {
      return res.json({
        success: false,
        message: "Selected slots are already booked",
      });
    }

    const appointments = slots.map((slot) => ({
      date,
      time: slot,
      isTimeSlotAvailable: true,
    }));
    await Appointment.insertMany(appointments);

    res.json({ success: true, message: "Appointments created successfully" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error creating appointments" });
  }
};

const getAppointmentsForDate = async (req, res) => {
  const { date } = req.query;

  try {
    const appointments = await Appointment.find({
      date,
      isTimeSlotAvailable: true,
    });
    res.json({ success: true, appointments });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error fetching appointments" });
  }
};

module.exports = { createAppointment, getAppointmentsForDate };
