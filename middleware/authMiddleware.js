const isAuthenticated = (req, res, next) => {
  if (req.session.userId && req.session.userType === "Driver") {
    return next();
  }
  res.redirect("/login");
};

module.exports = { isAuthenticated };
