const User = require("../models/Users");

// Dashboard page Route
const dashboard = async (req, res) => {
  const user = (await User.findById(req.session.userId)) ?? null;

  res.render("index", { user });
};

const drivers = async (req, res) => {
  const user = (await User.findById(req.session.userId)) ?? null;

  res.render("drivers", { user, candidates: [], passFailStatus: "all" });
};

const appointment = async (req, res) => {
  const user = (await User.findById(req.session.userId)) ?? null;

  res.render("appointment", { user });
};

// G page Route
const g = async (req, res) => {
  try {
    // User Authentication using user ID from session
    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.render("g", {
        user: null,
        success: null,
        error: "User not found",
      });
    }
    res.render("g", { user: user, success: null, error: null });
  } catch (err) {
    console.error(err);
    res.render("g", {
      user: null,
      success: null,
      error: "Error fetching user data",
    });
  }
};

// G2 page Route
const g2 = async (req, res) => {
  try {
    // User Authentication using user ID from session
    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.render("g2", {
        user: null,
        success: null,
        error: "User not found",
      });
    }

    res.render("g2", { user, error: null, success: null });
  } catch (error) {
    res.render("g2", {
      user: null,
      success: null,
      error: "Error fetching user data",
    });
  }
};

const examinerDashboard = async (req, res) => {
  const user = await User.findById(req.session.userId);
  res.render("examiner", { user });
};

module.exports = { dashboard, g, g2, appointment, examinerDashboard, drivers };
