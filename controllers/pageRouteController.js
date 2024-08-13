const User = require("../models/Users");

// Dashboard page Route
const dashboard = async (req, res) => {
  const user = (await User.findById(req.session.userId)) ?? null;

  res.render("index", { user });
};

const drivers = async (req, res) => {
  try {
    const user = (await User.findById(req.session.userId)) ?? null;

    const resultStatus = req.query.testResult || "all";
    let filter = {};

    if (resultStatus !== "all") {
      filter = {
        tests: {
          $elemMatch: {
            testResult: resultStatus === "true",
          },
        },
      };
    }

    const candidates = await User.find(filter).populate("appointment").exec();

    res.render("drivers", { user, candidates, resultStatus });
  } catch (error) {
    console.error(error);
    res.render("drivers", {
      user: null,
      candidates: [],
      resultStatus: "all",
      error: "Error fetching candidates.",
    });
  }
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

module.exports = { dashboard, g, g2, appointment, drivers };
