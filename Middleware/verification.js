const jwt = require("jsonwebtoken");
const JWTHASHVALUE = require("../Config/config").JWTHASHVALUE;

function verifyToken(req, res, next) {
  const token = req.cookies?.token;
  if (!token)
    return res.status(401).json({
      success: false,
      msg: "Unauthorised User!",
    });
  else {
    try {
      jwt.verify(token, JWTHASHVALUE, function (err, user) {
        if (err) {
          return res.status(401).json({
            success: false,
            msg: "Token Invalid!",
          });
        }
        req.user = user;
        next();
      });
    } catch (err) {
      return res.status(401).json({
        success: false,
        msg: "Unauthorised User!",
      });
    }
  }
}

function verifyAdmin(req, res, next) {
  try {
    
    if (req.user.role === "admin") {
      return next();
    }
    return res.status(401).json({ success: false, msg: "Unauthorized User" });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, msg: "Internal server Error" });
  }
}

module.exports = { verifyToken, verifyAdmin };
