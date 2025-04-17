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
    const { error } = registerValidationSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    // await registerValidationSchema.validateAsync(req.body);
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
    const payload = {
      user: {
        id: newUser._id,
        role: newUser.role,
        email: newUser.email,
        userName: newUser.userName,
      },
    };
    const token = jwt.sign(payload, JWTHASHVALUE, {
      expiresIn: JWTTOKENEXPIRY,
    });
    await redis_client.set(
      token,
      JSON.stringify({
        id: newUser._id,
        userName: newUser.userName,
        email: newUser.email,
        role: newUser.role,
      }),
      "EX",
      1800
    );
    return res.status(200).json({
      success: true,
      msg: "User Registered Successfully",
      token,
      data: {
        id: newUser._id,
        userName: newUser.userName,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    return next(error);
  }
};

const loginUser = async (req, res, next) => {
  // await loginValidationSchema.validateAsync(req.body);
  const { error } = loginValidationSchema.validate(req.body);
  if (error) {
    return next(error);
  }
  const { email, password } = req.body;
  try {
    const checkUser = await User.findOne({ email });
    if (!checkUser)
      return res.status(401).json({
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

    const payload = {
      user: {
        id: checkUser._id,
        role: checkUser.role,
        email: checkUser.email,
        userName: checkUser.userName,
      },
    };
    const token = jwt.sign(payload, JWTHASHVALUE, {
      expiresIn: JWTTOKENEXPIRY,
    });
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

    return res.json({
      success: true,
      msg: "Logged in successfully",
      token,
      data: {
        id: checkUser._id,
        userName: checkUser.userName,
        email: checkUser.email,
        role: checkUser.role,
      },
    });
  } catch (error) {
    return next(error);
  }
};

const checkAuth = async (req, res, next) => {
  try {
    const user = req.user;
    return res.status(200).json({
      success: true,
      msg: "Authenticated User",
      user,
    });
  } catch (err) {
    return next(err);
  }
};

const logoutUser = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      msg: "Logged Out Successfully!",
    });
  } catch (err) {
    return next(err);
  }
};

module.exports = { registerUser, loginUser, logoutUser, checkAuth };
