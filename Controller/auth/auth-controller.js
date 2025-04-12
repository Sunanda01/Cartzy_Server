const User = require("../../Models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const SaltLevel = require("../../Config/config").SALT_LEVEL;
const JWTHASHVALUE = require("../../Config/config").JWTHASHVALUE;
const JWTTOKENEXPIRY = require("../../Config/config").JWTTOKENEXPIRY;
const {
  registerValidationSchema,
  loginValidationSchema,
} = require("../../Validators");
// const redis_client = require("../../Utils/redisConnection");
const registerUser = async (req, res) => {
  try {
    await registerValidationSchema.validateAsync(req.body);
    const { userName, email, password } = req.body;

    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.json({ success: false, msg: "User Already Exists" });
    }
    const Salt = await bcrypt.genSalt(Number(SaltLevel));
    const hashPassword = await bcrypt.hash(password, Salt);
    const newUser = new User({
      userName,
      email,
      password: hashPassword,
    });
    await newUser.save();
    res
      .status(200)
      .json({ success: true, msg: "User Registered Successfully" });
  } catch (err) {
    if (err.isJoi) {
      return res
        .status(400)
        .json({ success: false, msg: err.details[0].message });
    }
    res.status(500).json({ success: false, msg: "Some Error Occured" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const checkUser = await User.findOne({ email });
    if (!checkUser)
      return res.json({
        success: false,
        msg: "User doesn't exists! Please register first",
      });

    const checkPasswordMatch = await bcrypt.compare(
      password,
      checkUser.password
    );
    if (!checkPasswordMatch)
      return res.json({
        success: false,
        msg: "Incorrect password! Please try again",
      });

    const token = jwt.sign(
      {
        id: checkUser._id,
        role: checkUser.role,
        email: checkUser.email,
        userName: checkUser.userName,
      },
      JWTHASHVALUE,
      { expiresIn: JWTTOKENEXPIRY }
    );

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "Lax",
        maxAge: 86400000, // 1 day
      })
      .json({
        success: true,
        msg: "Logged in successfully",
        user: {
          email: checkUser.email,
          role: checkUser.role,
          id: checkUser._id,
          userName: checkUser.userName,
        },
      });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      msg: "Some error occurred",
    });
  }
};

const checkAuth = async (req, res) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    msg: "Authenticated User",
    user,
  });
};

const logoutUser = async (req, res) => {
  res.clearCookie("token").json({
    success: true,
    msg: "Logged Out Successfully!",
  });
};

module.exports = { registerUser, loginUser, logoutUser, checkAuth };
