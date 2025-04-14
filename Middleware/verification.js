const jwt = require("jsonwebtoken");
const JWTHASHVALUE = require("../Config/config").JWTHASHVALUE;
const redis_client = require("../Utils/redisConnection");
const User = require("../Models/User");
const CustomErrorHandler = require("../Services/customErrorHandler");

async function verifyToken(req, res, next) {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else {
    return next(
      CustomErrorHandler.unAuthorized("Not authorised, no token provided")
    );
  }
  if (!token) next(CustomErrorHandler.notFound("Token Not Found"));
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
    if (!user) next(CustomErrorHandler.notFound("User Not Found"));

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

function verifyAdmin(req, res, next) {
  try {
    if (req.user && req.user.role === "admin") {
      return next();
    }
    return next(CustomErrorHandler.unAuthorized("Unauthorized user"));
  } catch (error) {
    return next(error);
  }
}
module.exports = { verifyToken, verifyAdmin };
