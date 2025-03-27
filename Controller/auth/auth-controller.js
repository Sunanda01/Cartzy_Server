const User = require("../../Models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const SaltLevel = require("../../Config/config").SALT_LEVEL;
const JWTHASHVALUE = require("../../Config/config").JWTHASHVALUE;
const JWTTOKENEXPIRY = require("../../Config/config").JWTTOKENEXPIRY;

const registerUser = async (req, res) => {
  const { userName, email, password } = req.body;
  try {
    existUser = await User.findOne({ email });
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
    console.error(err);
    res.status(500).json({ success: false, msg: "Some Error Occured" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const checkUser = await User.findOne({ email });
    if (!checkUser) {
      return res.json({ success: false, msg: "User Not Found" });
    }
    const checkPassword = await bcrypt.compare(password, checkUser.password);
    if (!checkPassword) {
      return res.json({ success: false, msg: "Incorrect password!!!!" });
    }
    const token = jwt.sign(
      {
        id: checkUser._id,
        userName: checkUser.userName,
        email: checkUser.email,
        role: checkUser.role,
      },
      JWTHASHVALUE,
      { expiresIn: JWTTOKENEXPIRY }
    );
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: false,
      })
      .json({
        success: true,
        msg: "Logged In Successfully",
        user: {
          id: checkUser._id,
          userName: checkUser.userName,
          email: checkUser.email,
          role: checkUser.role,
        },
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: "Some Error Occured" });
  }
};

const checkAuth=async(req,res)=>{
    const user=req.user;
    res.status(200).json({
        success:true,
        msg:"Authenticated User",
        user
    })
}

const logoutUser = async (req, res) => {
  res.clearCookie("token").json({
    success: true,
    msg: "Logged Out Successfully!",
  });
};

module.exports = { registerUser, loginUser, logoutUser, checkAuth };