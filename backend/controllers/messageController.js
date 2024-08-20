import asyncHandler from "express-async-handler";
import messageModel from "../models/messageModel.js";

const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

try {
  const message = await messageModel.create(newMessage);

} catch (error) {
  
}
});

export { sendMessage };
