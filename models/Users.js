const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

// User Collection Schema
const UserSchema = new Schema({
  firstName: { type: String, default: "default" },
  lastName: { type: String, default: "default" },
  licenseNumber: { type: String, default: "default" },
  age: { type: Number, default: 0 },
  username: { type: String, unique: true },
  password: { type: String },
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
  testType: { type: String, default: "" },
  comment: { type: String, default: "" },
  passFail: { type: Boolean, default: null },
});

UserSchema.pre("save", async function (next) {
  const user = this;
  // Encrypt Password and licenseNumber before saving to the database
  try {
    if (user.isModified("password")) {
      user.password = await bcrypt.hash(user.password, 10);
    }

    // if (user.licenseNumber && user.licenseNumber !== "default") {
    //   const hashedLicenseNumber = await bcrypt.hash(user.licenseNumber, 10);
    //   user.licenseNumber = hashedLicenseNumber;
    // }

    next();
  } catch (error) {
    console.error(error);
    next(error);
  }
});

const User = mongoose.model("User", UserSchema);

// exporting user model
module.exports = User;
