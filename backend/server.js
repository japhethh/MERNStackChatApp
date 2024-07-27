import express from "express";
import { chats } from "./data/data.js";
import cors from "cors";
import { connectDB } from "./config/db.js";
import userRouter from './routes/userRoute.js'
import colors from 'colors'
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

app.use("/api/user",userRouter)

app.listen(process.env.PORT, () => {
  console.log(`Server Started on Port http://localhost:${process.env.PORT}`.yellow.bold);
});
