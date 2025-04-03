import mongoose, { Schema, Document } from "mongoose";

// Define the interface for TypeScript
export interface ITodo extends Document {
  title: string;
  description: string;
  status: "Start" | "In Progress" | "Completed";
  progress: number;
  pinned: Boolean;
}

// Define Mongoose Schema
const TodoSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ["Start", "In Progress", "Completed"],
      default: "Start",
    },
    progress: { type: Number, min: 0, max: 100, default: 0 },
    pinned: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// ✅ Correct Export
export default mongoose.model<ITodo>("Todo", TodoSchema);
