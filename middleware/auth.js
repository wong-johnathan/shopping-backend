const jwt = require("jsonwebtoken");
const User = require("../models/User");
const config = require("config");
const jwtSecret = config.jwtSecret;

const auth = async (req, res, next) => {
  try {
    const token = req.header("authorization");
    const decoded = jwt.verify(token, jwtSecret);
    const user = await User.findById(decoded._id);
    if (!user) throw new Error();
    req.user = user;
    next();
  } catch (e) {
    res.status(401).send({ status: false, message: "Please authenticate" });
  }
};

module.exports = auth;
