import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    pic: {
      type: String,
      required: true,
      default:
        "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.vecteezy.com%2Ffree-vector%2Fdefault-profile-picture&psig=AOvVaw34QXXjlz1-KYSBxjAHbvak&ust=1721844971276000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCJiEysrivYcDFQAAAAAdAAAAABAE",
    },
  },
  { timesTamps: true }
);
const userModel = mongoose.model("User", userSchema);

export default userModel;
