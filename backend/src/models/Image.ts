import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema({
  imageData: { type: String, required: true },
});

export default mongoose.model("Image", ImageSchema);
