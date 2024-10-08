const mongoose = require("mongoose");

const studentSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    access: {
      type: String,
      default: "true",
    },
    class: {
      type: String,
      required: true,
    },
    userType: {
      type: String,
      default: "Student",
    },
    premium: {
      type: String,
      default: "false",
    },
    totalPoints: { type: Number, default: 0 },
    totalScratch: { type: Number, default: 0 },
    averageTime: { type: Number, default: 0 },
    scratchIds: [{ type: String }],
    scratchDetails: [{ type: Object }],
    totalScore: { type: Number, default: 0 }, //sasa
  },
  { versionKey: false, timestamps: true }
);

const StudentModel = mongoose.model("student", studentSchema);

module.exports = { StudentModel };
