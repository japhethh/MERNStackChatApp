import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose
      .connect(
        "mongodb+srv://helloworld32130:Jcwdlove@cluster0.uq2qpga.mongodb.net/Fuck"
      )
      .then(() => console.log("Db connected".green.underline));
  } catch (error) {
    console.log(`Error is ${error.message}`)
  }
};
