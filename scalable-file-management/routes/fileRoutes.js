import express from "express";
import multer from "multer";
import { Readable } from "stream";
import mongoose from "mongoose";
import auth from "../middleware/auth.js";
import File from "../models/fileModel.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Initialize GridFSBucket
let gridfsBucket;
mongoose.connection.once("open", () => {
  gridfsBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: "uploads",
  });
});

// ✅ Upload file route
router.post("/upload", auth, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const stream = Readable.from(req.file.buffer);
    const uploadStream = gridfsBucket.openUploadStream(req.file.originalname);

    stream.pipe(uploadStream)
      .on("error", (err) => {
        console.error("❌ Upload Stream Error:", err);
        return res.status(500).json({ message: "File upload failed", error: err.message });
      })
      .on("finish", async () => {
        await File.create({
          filename: req.file.originalname,
          fileId: uploadStream.id,
          uploadedBy: req.user,
        });

        console.log(`✅ File uploaded successfully: ${req.file.originalname}`);
        res.status(201).json({
          message: "✅ File uploaded successfully!",
          fileId: uploadStream.id,
          filename: req.file.originalname,
        });
      });
  } catch (error) {
    console.error("❌ Upload Error:", error);
    res.status(500).json({ message: "File upload failed", error: error.message });
  }
});

// ✅ Download file
router.get("/download/:id", auth, async (req, res) => {
  try {
    const fileId = new mongoose.Types.ObjectId(req.params.id);
    const downloadStream = gridfsBucket.openDownloadStream(fileId);
    downloadStream.on("error", () => res.status(404).json({ error: "File not found" }));
    downloadStream.pipe(res);
  } catch (err) {
    console.error("❌ Download Error:", err);
    res.status(404).json({ error: "File not found" });
  }
});

// ✅ List user files
router.get("/myfiles", auth, async (req, res) => {
  try {
    const files = await File.find({ uploadedBy: req.user }).sort({ createdAt: -1 });
    res.json(files);
  } catch (err) {
    console.error("❌ Fetch Files Error:", err);
    res.status(500).json({ message: "Error fetching files", error: err.message });
  }
});

// ✅ Delete file
router.delete("/delete/:id", auth, async (req, res) => {
  try {
    // Find the file metadata record
    const fileRecord = await File.findOne({ _id: req.params.id, uploadedBy: req.user });
    if (!fileRecord) {
      return res.status(404).json({ message: "File not found or unauthorized" });
    }

    // Delete from GridFS
    await gridfsBucket.delete(fileRecord.fileId);

    // Delete metadata
    await File.deleteOne({ _id: req.params.id });

    console.log(`🗑️ File deleted: ${fileRecord.filename}`);
    res.json({ message: "🗑️ File deleted successfully!" });
  } catch (err) {
    console.error("❌ Delete Error:", err);
    res.status(500).json({ message: "Error deleting file", error: err.message });
  }
});

export default router;
