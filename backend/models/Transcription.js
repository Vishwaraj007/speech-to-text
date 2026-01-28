const mongoose = require("mongoose");

const transcriptionSchema = new mongoose.Schema({
  filename: { type: String, required: true }, // original file name
  path: { type: String, required: true },     // path in uploads folder
  transcription: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Transcription", transcriptionSchema);

