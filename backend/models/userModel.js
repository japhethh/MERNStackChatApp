import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    pic: {
      type: String,
      default:
        "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.vecteezy.com%2Ffree-vector%2Fdefault-profile-picture&psig=AOvVaw34QXXjlz1-KYSBxjAHbvak&ust=1721844971276000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCJiEysrivYcDFQAAAAAdAAAAABAE",
    },
  },
  { timestamps: true }
);
// For login Purposes checking the password match in bcrypt password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Register purposes
userSchema.pre("save", async function (next) {
  if (!this.isModified) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
const userModel = mongoose.model("User", userSchema);

export default userModel;
