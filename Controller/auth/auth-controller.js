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
const redis_client = require("../../Utils/redisConnection");
const customErrorHandler = require("../../Services/customErrorHandler");

const registerUser = async (req, res, next) => {
  try {
    await registerValidationSchema.validateAsync(req.body);
    const { userName, email, password } = req.body;

    const existUser = await User.findOne({ email });
    if (existUser) {
      return next(customErrorHandler.alreadyExist("User Already Exists"));
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
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  await loginValidationSchema.validateAsync(req.body);
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
      return next(
        customErrorHandler.wrongCredentials(
          "Incorrect password! Please try again"
        )
      );

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

    await redis_client.set(
      token,
      JSON.stringify({
        id: checkUser._id,
        userName: checkUser.userName,
        email: checkUser.email,
        role: checkUser.role,
      }),
      "EX",
      1800
    );

    res
      // .cookie("token", token, {
      //   httpOnly: true,
      //   secure: false,
      //   sameSite: "None",
      //   maxAge: 7 * 24 * 60 * 60 * 1000,
      // })
      .json({
        success: true,
        msg: "Logged in successfully",
        user: {
          email: checkUser.email,
          role: checkUser.role,
          id: checkUser._id,
          userName: checkUser.userName,
        },
        token,
      });
  } catch (error) {
    next(error);
  }
};

const checkAuth = async (req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    msg: "Authenticated User",
    user,
  });
};

const logoutUser = async (req, res, next) => {
  res.clearCookie("token").json({
    success: true,
    msg: "Logged Out Successfully!",
  });
};

module.exports = { registerUser, loginUser, logoutUser, checkAuth };
