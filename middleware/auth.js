const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const config = require("config");
const jwtSecret = config.jwtSecret;

const auth = async (req, res, next) => {
  try {
    const token = req.header("authorization");
    const decoded = jwt.verify(token, jwtSecret);
    const admin = await Admin.findById(decoded._id);
    if (!admin) throw new Error();
    req.admin = admin;
    next();
  } catch (e) {
    res.status(401).send({ status: false, message: "Please authenticate" });
  }
};

module.exports = auth;
