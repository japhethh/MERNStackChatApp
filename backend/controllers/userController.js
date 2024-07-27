import userModel from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password || !pic) {
    return res
      .status(400)
      .json({ success: false, message: "Please Enter all the fields" });
  }

  const userExists = await userModel.findOne({ email });
  if (userExists) {
    return res.status.json({
      success: false,
      message: "User is exist already",
    });
  }

  const user = new userModel({
    name: name,
    email: email,
    password: password,
    pic: pic,
  });

  await user.save();

  if (user) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: createToken(user._id),
    });
  } else {
    res.status(400).json({ success: false, message: "User not found" });
  }
});
const loginUser = async (req, res) => {
  const { name, email, password } = req.body;
};

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

export { registerUser, loginUser };
