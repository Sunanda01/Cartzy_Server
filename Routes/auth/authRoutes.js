const router = require("express").Router();
const {
  registerUser,
  loginUser,
} = require("../../Controller/auth/auth-controller");

router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;
