const User = require("../models/Users");
const Appointment = require("../models/Appointment");

const getUsersForExaminer = async (req, res) => {
  try {
    const userId = req.session.userId;
    const user = await User.findById(userId);

    const filter = req.query.testType ? { testType: req.query.testType } : {};

    const testUsers = await User.find(filter).populate("appointment").exec();
    res.render("examiner", {
      user,
      users: testUsers,
      filter: req.query.testType || "",
    });
  } catch (error) {
    console.error(error);
    res.render("examiner", {
      users: [],
      filter: "",
      error: "Error fetching data",
    });
  }
};

const updateTestResult = async (req, res) => {
  try {
    const { userId, comment, passFail } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.json({ success: false, error: "User not found" });
    }

    user.comment = comment;
    user.passFail = passFail;

    await user.save();

    const testUsers = await User.find({}).populate("appointment").exec();

    res.render("examiner", {
      user,
      users: testUsers,
      message: "Test result updated successfully",
    });

    // res.json({ success: true, message: "Test result updated successfully" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, error: "Error updating test result" });
  }
};

module.exports = { getUsersForExaminer, updateTestResult };
