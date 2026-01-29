// index.js (backend)
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const multer = require("multer");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const Transcription = require("./models/Transcription");


dotenv.config();

const app = express();
app.use(cors({
  origin: "*",     // allow frontend (Vercel)
  methods: ["GET", "POST"],
}));
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


app.use("/uploads", express.static("uploads"));


// ---------------------------
// Step 4: Deepgram transcription route
app.post("/transcribe", upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const audioPath = path.resolve(req.file.path);
    const audioData = fs.readFileSync(audioPath);

    const response = await axios({
      method: "post",
      url: "https://api.deepgram.com/v1/listen",
      headers: {
        Authorization: `Token ${process.env.DEEPGRAM_API_KEY}`,
        "Content-Type": "audio/wav",
      },
      data: audioData,
    });

    const transcriptionText =
      response.data?.results?.channels[0]?.alternatives[0]?.transcript || "";

    // Save to MongoDB
    const newRecord = new Transcription({
      filename: req.file.originalname,
      path: req.file.path,
      transcription: transcriptionText,
    });

    await newRecord.save();

    res.json({
      message: "Transcription successful ✅",
      transcription: transcriptionText,
    });
  } catch (error) {
    console.error("Transcription error ❌", error.message);
    res.status(500).json({ error: "Transcription failed" });
  }
});



app.get("/transcriptions", async (req, res) => {
  const allTranscriptions = await Transcription.find().sort({ createdAt: -1 });
  res.json(allTranscriptions);
});





// Start backend
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running 🚀 : {PORT}`);
});
