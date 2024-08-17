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
  //     "_id": "chat1d",
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

const fetchChats = asyncHandler(async (req, res) => {
  // $elemMatch don't even care if the chatModel id is not getting the important for him is users has existing id in the users or something
  try {
    chatModel
      .find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updateAt: -1 })
      .then(async (results) => {
        results = await userModel.populate(results, {
          path: "latestMessage.sender",
          sender: "name pic email",
        });
        res.status(200).send(results);
      });
  } catch (error) {
    res.status(400);
  }
});

const createGroupChat = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please Fill all the fields" });
  }
  var users = JSON.parse(req.body.users);

  if (users.length < 2) {
    return res
      .status(400)
      .send("More than 2 users are required to form a group chat");
  }

  users.push(req.user);

  try {
    const groupChat = await chatModel.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await chatModel
      .findOne({
        _id: groupChat._id,
      })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(201).json(fullGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;

  const updatedChat = await chatModel
    .findByIdAndUpdate(
      chatId,
      {
        chatName: chatName,
      },
      {
        new: true,
      }
    )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(400);
    throw new Error("Chat Not Found");
  } else {
    res.json(updatedChat);
  }
});

const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const added = await chatModel
    .findByIdAndUpdate(
      chatId,
      {
        $push: {
          users: userId,
        },
      },
      {
        new: true,
      }
    )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!added) {
    res.status(404);
    throw new Erorr("Chat Not Found");
  } else {
    res.json(added);
  }
});

const removeGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const removed = await chatModel.findByIdAndUpdate(
    chatId,
    {
      $pull: {
        users: userId,
      },
    },
    {
      new: true,
    }
  );

  if (!removed) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(removed);
  }
});

export {
  accesschat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeGroup,
};
