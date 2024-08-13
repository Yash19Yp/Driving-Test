const User = require("../models/Users");

const listCandidates = async (req, res) => {
  try {
    const userId = req.session.userId;
    const user = await User.findById(userId);

    const passFailStatus = req.query.passFail || "all";

    let query = { userType: "Driver" };
    if (passFailStatus !== "all") {
      query.passFail = passFailStatus === "true";
    }
    const candidates = await User.find(query).populate("appointment").exec();

    res.render("drivers", { user, candidates, passFailStatus });
  } catch (error) {
    console.error(error);
    res.render("drivers", {
      user: {},
      candidates: [],
      passFailStatus: "all",
      error: "Error fetching data",
    });
  }
};

module.exports = { listCandidates };
