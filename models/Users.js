const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const TestRecordSchema = new Schema({
  testType: { type: String, required: true },
  testResult: { type: Boolean, default: null },
  comment: { type: String, default: "" },
});

// User Collection Schema
const UserSchema = new Schema({
  firstName: { type: String, default: "default" },
  lastName: { type: String, default: "default" },
  licenseNumber: { type: String, default: "default" },
  age: { type: Number, default: 0 },
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  userType: { type: String, default: "Driver" },
  car_details: {
    make: { type: String, default: "default" },
    model: { type: String, default: "default" },
    year: { type: Number, default: 0 },
    plateNumber: { type: String, default: "default" },
  },
  appointment: {
    type: Schema.Types.ObjectId,
    ref: "Appointment",
    default: null,
  },
  tests: [TestRecordSchema], // Array to store test records
});

UserSchema.pre("save", async function (next) {
  const user = this;
  // Encrypt Password before saving to the database
  try {
    if (user.isModified("password")) {
      user.password = await bcrypt.hash(user.password, 10);
    }
    next();
  } catch (error) {
    console.error(error);
    next(error);
  }
});

const User = mongoose.model("User", UserSchema);

// exporting user model
module.exports = User;
