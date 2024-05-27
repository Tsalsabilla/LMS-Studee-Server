const mongoose = require('mongoose');

const javascriptQuizSchema = new mongoose.Schema({
  testId: String,
  question: String,
  imageUrl: String,
  options: Array,
  correctAnswer: String,
}, { timestamps: true });

const JavaScriptQuiz = mongoose.model('JavaScriptQuiz', javascriptQuizSchema, 'javascript');

module.exports = JavaScriptQuiz;
