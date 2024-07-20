const isDriver = (req, res, next) => {
  if (req.session.userId && req.session.userType === "Driver") {
    return next();
  }
  res.redirect("/login");
};

const isAdmin = (req, res, next) => {
  if (req.session.userId && req.session.userType === "Admin") {
    return next();
  }
  res.redirect("/login");
};

module.exports = { isDriver, isAdmin };
