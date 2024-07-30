import userModel from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import cloudinary from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
import fs from "fs";

// Register User
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Check if all fields are provided
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Please Enter all the fields" });
  }

  // Check if the user already exists
  const userExists = await userModel.findOne({ email });
  if (userExists) {
    return res.status(400).json({
      success: false,
      message: "User already exists",
    });
  }

  let picURL = "";
  if (req.file) {
    try {
      // Upload profile picture to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "profile_images",
      });
      fs.unlinkSync(req.file.path); // Remove file from local storage
      picURL = result.secure_url;
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Image upload failed",
      });
    }
  }

  // Create new user
  const user = new userModel({
    name,
    email,
    password,
    pic: picURL,
  });

  await user.save();

  // Respond with user data if user was successfully created
  if (user) {
    res.status(201).json({
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
    res.status(400).json({ success: false, message: "User not created" });
  }
});

// authUser User
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });

  // Check if user exists and password is correct
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

// Generate JWT token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// Get all users except the current user
const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  // Find users based on keyword and exclude current user
  const users = await userModel
    .find(keyword)
    .find({ _id: { $ne: req.user._id } });

  res.status(200).json(users);
});

export { registerUser, authUser, allUsers };
