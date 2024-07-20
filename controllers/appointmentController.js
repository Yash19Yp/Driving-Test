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

const bookAppointment = async (req, res) => {
  const { appointmentId } = req.body;
  const userId = req.session.userId;

  try {
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment || !appointment.isTimeSlotAvailable) {
      return res.json({
        success: false,
        message: "Appointment slot not available",
      });
    }

    appointment.isTimeSlotAvailable = false;
    await appointment.save();

    await User.findByIdAndUpdate(userId, { appointment: appointment._id });

    res.json({ success: true, message: "Appointment booked successfully" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error booking appointment" });
  }
};

module.exports = { createAppointment, getAppointmentsForDate, bookAppointment };
