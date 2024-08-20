import express from "express";
import { protect } from "../middleware/authMiddleware";

const messageRouter = express.Router();

// messageRouter.route("/").get(protect,sendMessage);
// messageRouter.route("/:chatId").get(protect, allMessages);

export default messageRouter;
