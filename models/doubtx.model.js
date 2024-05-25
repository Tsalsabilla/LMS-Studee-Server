const mongoose = require("mongoose");

const doubtxSchema = mongoose.Schema(
  {
    studentId: String,
    name: String,
    title: String,
    description: String,
    class: Number,
    subject: String,
    fileUrl: String,
    fileType: String,
    thumbnailUrl: String,
    size: String,
    resolved: { type: String, default: "No" },
    response: [{ type: String }],
  },
  { versionKey: false, timestamps: true }
);

const DoubtxModel = mongoose.model("doubtx", doubtxSchema);

module.exports = { DoubtxModel };
