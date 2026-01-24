const express = require("express");
const cors = require("cors");
const multer = require("multer");

const app = express();
app.use(cors());

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// Test route
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

// Upload route
app.post("/upload", upload.single("audio"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  res.json({
    message: "Audio uploaded successfully",
    fileName: req.file.filename
  });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
