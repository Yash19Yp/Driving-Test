const User = require("../models/Users");

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
    } = req.body;

    // Validate input
    const errorMessages = validateUserInput(req.body);
    if (errorMessages.length > 0) {
      return res.render("g2", {
        error: errorMessages.join(" "),
        success: null,
        user: req.user,
      });
    }

    // Check if user already exists by userId
    let user = await User.findById(userId);
    if (!user) {
      return res.render("login", { user: null, error: "User not found" });
    }

    // Update user data with new G2 information
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

    await user.save();

    res.render("g2", {
      user,
      success: "User data updated successfully",
      error: null,
    });
  } catch (error) {
    console.error(error);
    res.render("g2", { success: null, error: "Error updating user data" });
  }
};

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

const updateCarData = async (req, res) => {
  try {
    const { licenseNumber, make, model, year, plateNumber } = req.body;

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

    // To get the data from user collection
    const user = await User.findOne({ licenseNumber });

    if (user) {
      // updating the car date into user collection
      user.car_details = { make, model, year, plateNumber };
      await user.save();

      res.render("g", { user: user, error: null });
    } else {
      res.render("g", { user: null, error: "User not found" });
    }
  } catch (error) {
    res.status(500).send("Error updating car information: " + error.message);
  }
};

module.exports = { updateUser, findUserByLicense, updateCarData };
