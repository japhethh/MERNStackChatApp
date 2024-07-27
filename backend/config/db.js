import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose
      .connect(
        process.env.MONGODB_URL
      )
      .then(() => console.log("Db connected".green.underline));
  } catch (error) {
    console.log(`Error is ${error.message}`)
  }
};
