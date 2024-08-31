import express from "express";
import { chats } from "./data/data.js";
import cors from "cors";
import { connectDB } from "./config/db.js";
import userRouter from "./routes/userRoute.js";
import chatRouter from "./routes/chatRoute.js";
import messageRouter from "./routes/messageRoute.js";
import colors from "colors";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import { Server } from "socket.io";

const app = express();

import "dotenv/config";
const PORT = process.env.PORT || 4000; // Fallback to 4000 if PORT is not defined

app.use(cors());
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.send("API is Running");
});

app.get("/api/chats", (req, res) => {
  res.send(chats);
});

app.get("/api/chat/:id", (req, res) => {
  console.log(req.params.id);
  const singleChat = chats.find((c) => c._id === req.params.id);
  res.send(singleChat);
});

app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);
app.use(notFound);
app.use(errorHandler);

// Start the HTTP server on the specified PORT and log a message when it's ready.
const server = app.listen(PORT, () => {
  console.log(`Server Started on Port http://localhost:${PORT}`.yellow.bold);
});

// Create a new Socket.IO server, attached to the HTTP server, with specific settings.
// - pingTimeout: Time in milliseconds to wait for a pong response from the client before closing the connection.
// - cors: Allows requests from specified origins (development environments).
const io = new Server(server, {
  pingTimeout: 6000, // Close connection if no response from client within 6000ms.
  cors: {
    origin: ["http://localhost:5173", "http://localhost:4000"], // Allow these origins to connect.
  },
});

// Listen for new connections from clients.
io.on("connection", (socket) => {
  console.log("connected to socket.io"); // Log when a client connects successfully.

  // Listen for a 'setup' event from the client, which sends user data.
  socket.on("setup", (userData) => {
    socket.join(userData._id); // Join the user to a room with their unique ID.
    console.log(userData.name + " ako yung owner");
    socket.emit("connected"); // Confirm the connection to the clients.
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Join room " + room);
  });

  socket.on("typing",(room) => socket.in(room).emit("typing"));
  socket.on("stop typing",(room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageReceived) => {
    var chat = newMessageReceived.chat;
    if (!chat.users) return console.log("chat.user not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageReceived.sender_id) return;
      socket.in(user._id).emit("message received", newMessageReceived);
    });

  });

  
});
