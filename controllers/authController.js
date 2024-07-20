const User = require("../models/Users");
const bcrypt = require("bcrypt");

// Login page Route
const getLogin = (req, res) => {
  res.render("login", { user: null, error: null });
};

// Signup page Route
const getSignup = (req, res) => {
  res.render("signup", { user: null, error: null });
};

// To login user
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    // Compare Passwords
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch || !user) {
      return res.render("login", {
        user: null,
        error: "Invalid username or password",
      });
    }

    // Store Data into session
    req.session.userId = user._id;
    req.session.userType = user.userType;

    // Redirect to Dashboard
    res.redirect("/");
  } catch (error) {
    res.render("login", { user: null, error: "Error logging in" });
  }
};

// To signup user
const signupUser = async (req, res) => {
  const { username, password, repeatedPassword, userType } = req.body;

  if (password !== repeatedPassword) {
    return res.render("signup", {
      user: null,
      error: "Passwords do not match",
    });
  }

  try {
    const newUser = new User({
      username,
      password,
      userType,
    });

    await newUser.save();
    res.render("login", { user: null, error: null });
  } catch (error) {
    res.render("signup", { user: null, error: "Error creating user" });
  }
};

// Destroy session and logout user
const logoutUser = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      return res.redirect("/");
    }
    res.redirect("/login");
  });
};

module.exports = { getLogin, loginUser, getSignup, signupUser, logoutUser };
