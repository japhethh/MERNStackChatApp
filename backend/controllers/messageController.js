import asyncHandler from "express-async-handler";
import messageModel from "../models/messageModel.js";
import userModel from "../models/userModel.js";
import chatModel from "../models/chatModel.js";

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
    var message = await messageModel.create(newMessage);

    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await userModel.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    await chatModel.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message._id,
    });

    res.json(message);
  } catch (error) {
    res.status(400);

    throw new Error(error.message);
  }
});

const allMessages = asyncHandler(async (req, res) => {
  try {
    var messages = await messageModel
      .find({
        chat: req.params.chatId,
      })
      .populate("sender", "name pic email")
      .populate("chat");

    messages = await userModel.populate(messages, {
      path: "chat.users",
      select: "name pic email",
    });

    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

export { sendMessage, allMessages };
