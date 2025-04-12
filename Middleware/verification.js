const jwt = require("jsonwebtoken");
const JWTHASHVALUE = require("../Config/config").JWTHASHVALUE;
const redis_client = require("../Utils/redisConnection");
const User = require("../Models/User");

async function verifyToken(req, res, next) {
  const token = req.cookies?.token;
  if (!token)
    return res.status(401).json({
      success: false,
      msg: "Unauthorised User!",
    });

  try {
    const decoded = jwt.verify(token, JWTHASHVALUE);
    const redis_exists = await redis_client.exists(token);
    if (redis_exists) {
      const redis_data = await redis_client.get(token);
      req.user = JSON.parse(redis_data);
      return next();
    }

    // fallback if Redis doesn't have the token
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({
        success: false,
        msg: "User not found!",
      });
    }

    req.user = user;
    return next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      msg: "Unauthorised User!",
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