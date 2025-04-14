const router = require("express").Router();
const {
  registerUser,
  loginUser,
  logoutUser,
  checkAuth,
} = require("../../Controller/auth/auth-controller");
const { verifyToken } = require("../../Middleware/verification");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", verifyToken, logoutUser);
router.get("/check-auth", verifyToken, checkAuth);

module.exports = router;
