const mongoose = require("mongoose");

const doubtzSchema = mongoose.Schema(
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

const DoubtzModel = mongoose.model("doubtz", doubtzSchema);

module.exports = { DoubtzModel };
