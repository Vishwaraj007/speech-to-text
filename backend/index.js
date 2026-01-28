// index.js (backend)
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const multer = require("multer");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Multer setup
const upload = multer({ dest: "uploads/" });

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected ✅"))
  .catch(err => console.error("MongoDB error ❌", err));

// ---------------------------


// Root route for testing
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// Existing file upload route
app.post("/upload", upload.single("audio"), (req, res) => {
  res.json({ message: "File uploaded ✅", file: req.file });
});

// ---------------------------
// Step 4: Deepgram transcription route
app.post("/transcribe", upload.single("audio"), async (req, res) => {
  try {
    const audioPath = path.resolve(req.file.path);
    const audioData = fs.readFileSync(audioPath);

    const response = await axios({
      method: "post",
      url: "https://api.deepgram.com/v1/listen",
      headers: {
        Authorization: `Token ${process.env.DEEPGRAM_API_KEY}`,
        "Content-Type": "audio/wav", // or audio/mpeg
      },
      data: audioData,
    });

    const transcription = response.data?.results?.channels[0]?.alternatives[0]?.transcript || "";

    res.json({
      message: "Transcription successful ✅",
      transcription,
    });
  } catch (error) {
    console.error("Transcription error ❌", error.message);
    res.status(500).json({ error: "Transcription failed" });
  }
});

// Start backend
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running 🚀 : http://localhost:${PORT}`);
});
