import userModel from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import cloudinary from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
import fs from "fs";
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
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

  let picURL = "";
  if (req.file) {
    try {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "profile_images",
      });
      fs.unlinkSync(req.file.path);
      picURL = result.secure_url;
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Image upload failed",
      });
    }
  }

  const user = new userModel({
    name: name,
    email: email,
    password: password,
    pic: picURL,
  });

  await user.save();

  if (user) {
    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        pic: user.pic,
        token: createToken(user._id),
      },
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

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        pic: user.pic,
        token: createToken(user._id),
      },
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }
});
// Api Users
const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await userModel
    .find(keyword)
    .find({ _id: { $ne: req.user.id } });
  res.send(users);

  console.log(keyword);
  res.status(200).json({ success: false, message: keyword });
});

export { registerUser, loginUser, authUser, allUsers };
