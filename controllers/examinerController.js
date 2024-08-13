const User = require("../models/Users");
const Appointment = require("../models/Appointment");

const getUsersForExaminer = async (req, res) => {
  try {
    const userId = req.session.userId;
    const user = await User.findById(userId);

    let filter = {};
    if (req.query.testType && req.query.testType !== "all") {
      filter = {
        tests: {
          $elemMatch: {
            testType: req.query.testType,
          },
        },
      };
    } else {
      filter = {
        tests: { $exists: true, $not: { $size: 0 } },
      };
    }

    const testUsers = await User.find(filter).populate("appointment").exec();

    res.render("examiner", {
      user,
      users: testUsers,
      filter: req.query.testType || "all",
    });
  } catch (error) {
    console.error(error);
    res.render("examiner", {
      user,
      users: [],
      filter: "",
      error: "Error fetching data",
    });
  }
};

const updateTestResult = async (req, res) => {
  try {
    const { userId, comment, testResult, testType } = req.body;

    if (!userId || !testType) {
      const user = await User.findById(req.session.userId);
      const testUsers = await User.find({}).populate("appointment").exec();
      return res.render("examiner", {
        user,
        users: testUsers,
        filter: req.query.testType || "all",
        error: "Invalid data submitted.",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      const testUsers = await User.find({}).populate("appointment").exec();
      return res.render("examiner", {
        user,
        users: testUsers,
        filter: req.query.testType || "all",
        error: "User not found.",
      });
    }

    const test = user.tests.find((test) => test.testType === testType);

    if (test) {
      test.comment = comment;
      test.testResult = testResult === "true";
    } else {
      const testUsers = await User.find({}).populate("appointment").exec();
      return res.render("examiner", {
        user,
        users: testUsers,
        filter: req.query.testType || "all",
        error: "Test record not found.",
      });
    }

    await user.save();

    // Render the examiner page with a success message
    const testUsers = await User.find({}).populate("appointment").exec();
    res.render("examiner", {
      user: await User.findById(req.session.userId),
      users: testUsers,
      filter: req.query.testType || "all",
      success: "Test result updated successfully.",
    });
  } catch (error) {
    console.error(error);
    const testUsers = await User.find({}).populate("appointment").exec();
    res.render("examiner", {
      user: await User.findById(req.session.userId),
      users: testUsers,
      filter: req.query.testType || "all",
      error: "Error updating test result.",
    });
  }
};

module.exports = { getUsersForExaminer, updateTestResult };
