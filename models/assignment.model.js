const mongoose = require("mongoose");

const assignmentSchema = mongoose.Schema(
  {
    title: String,
    class: Number,
    subject: String,
    type: String,
    creator: String,
    fileUrl: String,
    fileType: String,
    thumbnailUrl: String,
    size: String,
  },
  { versionKey: false, timestamps: true }
);

const AssignmentModel = mongoose.model("assignment", assignmentSchema);

module.exports = { AssignmentModel };
