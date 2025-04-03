import express from "express";
import Image from "../models/Image";

const router = express.Router();

// Upload image
router.post("/upload", async (req, res) => {
  try {
    const { imageData } = req.body;
    const newImage = new Image({ imageData });
    await newImage.save();
    res.status(201).json({ message: "Image uploaded successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error uploading image" });
  }
});

// Get all images
router.get("/images", async (req, res) => {
  try {
    const images = await Image.find();
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: "Error fetching images" });
  }
});

router.delete("/images/:id", async (req:any, res:any) => {
  try {
    const imageId = req.params.id;
    const image = await Image.findByIdAndDelete(imageId);

    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }
    
     res.status(200).json({ message: "Image deleted successfully" });

  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting image" });
  }
});

export default router;
