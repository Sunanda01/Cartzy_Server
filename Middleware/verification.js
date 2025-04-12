const jwt = require("jsonwebtoken");
const JWTHASHVALUE = require("../Config/config").JWTHASHVALUE;
// const redis_client = require("../Utils/redisConnection");
// const User = require("../Models/User");

function verifyToken(req, res, next) {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({
      success: false,
      msg: "Unauthorised User!",
    });
  }
  try {
    const user = jwt.verify(token, JWTHASHVALUE);
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      msg: "Token Invalid!",
    });
  }
}

function verifyAdmin(req, res, next) {
  try {
    if (req.user && req.user.role === "admin") {
      return next();
    }
    return res.status(401).json({ success: false, msg: "Unauthorized User" });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, msg: "Internal Server Error" });
  }
}


module.exports = { verifyToken,verifyAdmin};
