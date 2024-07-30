import express from "express";
import multer from "multer";
import {
  registerUser,
  authUser,
  allUsers,
} from "../controllers/userController.js";
import {protect} from "../middleware/authMiddleware.js";

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
userRouter
  .route("/")
  .post(upload.single("image"), registerUser)
  .get(protect, allUsers);

export default userRouter;
