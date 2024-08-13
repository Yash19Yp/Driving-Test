const User = require("../models/Users");
const Appointment = require("../models/Appointment");

const updateUser = async (req, res) => {
  const validateUserInput = (input) => {
    let errorMessages = [];
    if (
      !input.firstName ||
      !input.lastName ||
      !input.age ||
      !input.licenseNumber ||
      !input.make ||
      !input.model ||
      !input.year ||
      !input.plateNumber
    ) {
      errorMessages.push("All fields are required.");
    }
    if (input.licenseNumber.length !== 8) {
      errorMessages.push("License number must be exactly 8 characters.");
    }
    return errorMessages;
  };

  try {
    const userId = req.session.userId;

    const {
      firstName,
      lastName,
      age,
      licenseNumber,
      make,
      model,
      year,
      plateNumber,
      appointmentId,
      testType,
    } = req.body;

    // Validate input
    const errorMessages = validateUserInput(req.body);
    if (errorMessages.length > 0) {
      const user = await User.findById(userId);
      return res.render(testType === "G2" ? "g2" : "g", {
        error: errorMessages.join(" "),
        success: null,
        user: user,
      });
    }

    // Check if user already exists by userId
    let user = await User.findById(userId);
    if (!user) {
      return res.render("login", { user: null, error: "User not found" });
    }

    if (testType === "G2") {
      const g2Test = user.tests.find((test) => test.testType === "G2");

      if (
        g2Test &&
        (g2Test.testResult === null || g2Test.testResult === true)
      ) {
        return res.render("g2", {
          user,
          error:
            "You cannot book a new G2 appointment as you have already booked appointment.",
          success: null,
        });
      }
    }

    user.firstName = firstName;
    user.lastName = lastName;
    user.age = age;
    user.licenseNumber = licenseNumber;
    user.car_details = {
      make,
      model,
      year,
      plateNumber,
    };

    if (appointmentId) {
      const appointment = await Appointment.findById(appointmentId);
      if (!appointment || !appointment.isTimeSlotAvailable) {
        return res.render(testType === "G2" ? "g2" : "g", {
          error: "Appointment slot not available",
          success: null,
          user: user,
        });
      }
      appointment.isTimeSlotAvailable = false;
      await appointment.save();
      user.appointment = appointmentId;

      const existingTestIndex = user.tests.findIndex(
        (test) => test.testType === testType
      );
      if (existingTestIndex !== -1) {
        user.tests[existingTestIndex].testResult = null;
        user.tests[existingTestIndex].comment = "";
      } else {
        user.tests.push({
          testType: testType,
          testResult: null,
          comment: "",
        });
      }
    }

    await user.save();

    res.render(testType === "G2" ? "g2" : "g", {
      user,
      success: "User data updated and appointment booked successfully",
      error: null,
    });
  } catch (error) {
    console.error(error);
    res.render(testType === "G2" ? "g2" : "g", {
      success: null,
      error: "Error updating user data",
    });
  }
};

const updateCarData = async (req, res) => {
  try {
    const {
      licenseNumber,
      make,
      model,
      year,
      plateNumber,
      appointmentId,
      testType,
    } = req.body;

    if (
      !licenseNumber ||
      !make ||
      !model ||
      !year ||
      !plateNumber ||
      licenseNumber.length !== 8
    ) {
      return res.render("g", {
        user: null,
        error:
          "All fields are required and license number must be 8 characters",
      });
    }

    const user = await User.findOne({ licenseNumber });

    if (user) {
      if (testType === "G") {
        const g2Test = user.tests.find(
          (test) => test.testType === "G2" && test.testResult === true
        );
        if (!g2Test) {
          return res.render("g", {
            user: user,
            error: "You need to pass the G2 test before booking a G test",
            success: null,
          });
        }

        const gTest = user.tests.find(
          (test) =>
            test.testType === "G" &&
            (test.testResult === null || test.testResult === true)
        );
        if (gTest) {
          return res.render("g", {
            user: user,
            error:
              "You already have booked appointment. You cannot book another.",
            success: null,
          });
        }
      }

      user.car_details = { make, model, year, plateNumber };

      if (appointmentId) {
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment || !appointment.isTimeSlotAvailable) {
          return res.render("g", {
            error: "Appointment slot not available",
            success: null,
            user: user,
          });
        }
        appointment.isTimeSlotAvailable = false;
        await appointment.save();
        user.appointment = appointmentId;

        const existingTestIndex = user.tests.findIndex(
          (test) => test.testType === testType
        );
        if (existingTestIndex !== -1) {
          user.tests[existingTestIndex].testResult = null;
          user.tests[existingTestIndex].comment = "";
        } else {
          user.tests.push({
            testType: testType,
            testResult: null,
            comment: "",
          });
        }
      }

      await user.save();

      res.render("g", {
        user: user,
        success: "User data updated and appointment booked successfully",
        error: null,
      });
    } else {
      res.render("g", { user: null, error: "User not found" });
    }
  } catch (error) {
    res.status(500).send("Error updating car information: " + error.message);
  }
};

// Not in Use
const findUserByLicense = async (req, res) => {
  try {
    const { licenseNumber } = req.body;

    if (!licenseNumber || licenseNumber.length !== 8) {
      return res.render("g", {
        user: null,
        error: "Invalid license number",
      });
    }

    // to find the data by the licence number
    const user = await User.findOne({ licenseNumber });

    if (user) {
      // redirecting to g page with the user data
      res.render("g", { user: user, error: null });
    } else {
      // redirecting to g page with error message
      res.render("g", { user: null, error: "No User Found" });
    }
  } catch (error) {
    // error log to get the error
    console.error("Error finding user:", error.message);
    res.status(500).send("Error finding user: " + error.message);
  }
};

module.exports = { updateUser, findUserByLicense, updateCarData };
