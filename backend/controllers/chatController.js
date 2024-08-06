import asyncHandler from "express-async-handler";
import chatRouter from "../routes/chatRoute.js";
import userModel from "../models/userModel.js";
import chatModel from "../models/chatModel.js";

const accesschat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }

  var isChat = await chatModel
    .find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
    .populate("users", "-password")
    .populate("latestMessage");

  // Like this
  // [
  //   {
  //     "_id": "chat1",
  //     "isGroupChat": false,
  //     "users": [
  //       {
  //         "_id": "user1",
  //         "name": "Alice",
  //         "email": "alice@example.com",
  //         "pic": "alice-pic-url"
  //       },
  //       {
  //         "_id": "user2",
  //         "name": "Bob",
  //         "email": "bob@example.com",
  //         "pic": "bob-pic-url"
  //       }
  //     ],
  //     "latestMessage": {
  //       "_id": "msg1",
  //       "sender": "user2",
  //       "content": "Hello!",
  //       "timestamp": "2024-08-07T12:00:00Z"
  //     }
  //   }
  // ]

  // To this
  // [
  //   {
  //     "_id": "chat1",
  //     "isGroupChat": false,
  //     "users": [
  //       {
  //         "_id": "user1",
  //         "name": "Alice",
  //         "email": "alice@example.com",
  //         "pic": "alice-pic-url"
  //       },
  //       {
  //         "_id": "user2",
  //         "name": "Bob",
  //         "email": "bob@example.com",
  //         "pic": "bob-pic-url"
  //       }
  //     ],
  //     "latestMessage": {
  //       "_id": "msg1",
  //       "sender": {
  //         "_id": "user2",
  //         "name": "Bob",
  //         "email": "bob@example.com",
  //         "pic": "bob-pic-url"
  //       },
  //       "content": "Hello!",
  //       "timestamp": "2024-08-07T12:00:00Z"
  //     }
  //   }
  // ]
  // Populate the sender details of the latest message with name, pic, and email
  // Example output: isChat will include sender details in latestMessage
  isChat = await userModel.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createdChat = await chatModel.create(chatData);
      const FullChat = await chatModel
        .findOne({ _id: createdChat._id })
        .populate("users", "-password");

      res.status(200).send(FullChat);
    } catch (error) {
      res.status(400);
      throw new Error(errorMessage);
    }
  }
});

export { accesschat };
