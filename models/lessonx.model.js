const mongoose = require("mongoose");

const lessonxSchema = mongoose.Schema(
  {
    title: String,
    thumbnail: {
      type: String,
      default: "https://akm-img-a-in.tosshub.com/aajtak/2023-02/quiz_01.png",
    },
    class: String,
    subject: String,
    creator: String,
    noOfQuestions: Number,
    pointPerQuestion: Number,
    negativeMarking: { type: String, default: "No" },
    negativeMarkingPerQuestion: { type: String, default: "No" },
    totalTime: String,
    questionData: Array,
    totalPoint: Number,
    totalTime: Number,
  },
  { versionKey: false, timestamps: true }
);

const LessonxModel = mongoose.model("lessonx", lessonxSchema);

module.exports = { LessonxModel };
