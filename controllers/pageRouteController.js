const User = require("../models/Users");

// Dashboard page Route
const dashboard = async (req, res) => {
  const user = (await User.findById(req.session.userId)) ?? null;

  res.render("index", { user });
};

// G page Route
const g = async (req, res) => {
  try {
    // User Authentication using user ID from session
    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.render("g", { user: null, error: "User not found" });
    }
    res.render("g", { user: user, error: null });
  } catch (err) {
    console.error(err);
    res.render("g", { user: null, error: "Error fetching user data" });
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

module.exports = { dashboard, g, g2 };
