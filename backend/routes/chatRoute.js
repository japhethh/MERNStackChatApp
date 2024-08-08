import express from "express";
import multer from "multer";

import { protect } from "../middleware/authMiddleware.js";
import {
  accesschat,
  fetchChats,
  createGroupChat,
} from "../controllers/chatController.js";

const chatRouter = express.Router();

const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

chatRouter.route("/").post(protect, accesschat);
chatRouter.route("/").get(protect, fetchChats);
chatRouter.route("/group").post(protect, createGroupChat);
// chatRouter.route("/rename").put(protect, renameGroup);
// chatRouter.route("groupRemove").put(protect, removeFromGroup);
// chatRouter.route("groupAdd").put(protect, addToGroup);

export default chatRouter;
