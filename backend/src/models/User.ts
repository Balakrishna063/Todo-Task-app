// import mongoose from "mongoose";

// const UserSchema = new mongoose.Schema({
//   username: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
// }, { timestamps: true });

// export const User = mongoose.model("User", UserSchema);
import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password?: string; // ✅ Optional for Google users
  googleId?: string; // ✅ Add googleId here
  profilePicture?: string;
}

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: {
    type: String,
    required: function () {
      return !this.googleId;
    },
  }, // ✅ Only required if not Google user
  googleId: { type: String, default: null }, // ✅ Ensure googleId exists
  profilePicture: { type: String, default: "" },
});

export const User = mongoose.model<IUser>("User", UserSchema);
