import express from "express";
import multer from "multer";
import {
  loginUser,
  registerUser,
  authUser,
} from "../controllers/userController.js";

const userRouter = express.Router();
// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}`);
  },
});
const upload = multer({ storage: storage });
userRouter.post("/login", authUser);
userRouter.post("/register", upload.single("image"), registerUser);

export default userRouter;
