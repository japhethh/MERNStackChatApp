import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import asyncHandler from "express-async-handler";

const protect = asyncHandler(async (req, res, next) => {
  let token = "";
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1]; // Fixed split issue

      // Decode token to get user ID
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await userModel.findById(decoded.id).select("-password");
      
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed");
      console.log(error);
    }
  } else {
    // Handle case when token is not provided
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

export { protect };
