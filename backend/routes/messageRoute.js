import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { allMessages, sendMessage } from "../controllers/messageController.js";

const messageRouter = express.Router();

messageRouter.route("/").post(protect,sendMessage);
messageRouter.route("/:chatId").get(protect, allMessages);

export default messageRouter;
