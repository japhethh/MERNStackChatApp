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

const server = app.listen(process.env.PORT, () => {
  console.log(
    `Server Started on Port http://localhost:${process.env.PORT}`.yellow.bold
  );
});

const io = new Server(server, {
  pingTimeout: 6000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("connected to socket.io");
});
