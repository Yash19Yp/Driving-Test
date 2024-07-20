const mongoose = require("mongoose");
const express = require("express");
const ejs = require("ejs");
const session = require("express-session");
const dotenv = require("dotenv");
const authController = require("./controllers/authController");
const userController = require("./controllers/userController");
const pageRouteController = require("./controllers/pageRouteController");
const { isAuthenticated } = require("./middleware/authMiddleware");

dotenv.config();

// Used Ejs template and public folder
const app = new express();
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// Page routes
app.get("/", pageRouteController.dashboard);
app.get("/g", isAuthenticated, pageRouteController.g);
app.get("/g2", isAuthenticated, pageRouteController.g2);
app.get("/login", authController.getLogin);
app.get("/signup", authController.getSignup);
app.get("/logout", authController.logoutUser);

// handle signup and login
app.post("/signup", authController.signupUser);
app.post("/login", authController.loginUser);

// Route to create a user and save data into collection
app.post("/update-user", userController.updateUser);

// route to fetch the data from the user collection
app.post("/find-licence", userController.findUserByLicense);

// Route to update car data
app.post("/update-car-data", userController.updateCarData);

// Creating connection with the database
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected");
  })
  .catch((error) => {
    console.error("Error: ", error);
  });

app.listen(process.env.PORT, () => {
  console.log(`App listening on port ${process.env.PORT}`);
});
