// const mongoose = require('mongoose');

// const javascriptQuizSchema = new mongoose.Schema({
//   testId: String,
//   question: String,
//   imageUrl: String,
//   options: Array,
//   correctAnswer: String,
// }, {timestamps:true});

// const JavaScripQuiz = mongoose.model('JavaScripQuiz', javascriptQuizSchema, 'javascript');

// module.exports = JavaScripQuiz;

// const mongoose = require('mongoose');

// const javascriptQuizSchema = new mongoose.Schema({
//   testId: String,
//   question: String,
//   imageUrl: String,
//   options: Array,
//   correctAnswer: String,
// }, {timestamps:true});

// const JavaScripQuiz = mongoose.model('JavaScripQuiz', javascriptQuizSchema, 'javascript');

// module.exports = JavaScripQuiz;

const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  text: String,
  imageUrl: String
});

const javascriptQuizSchema = new mongoose.Schema({
  testId: String,
  question: String,
  imageUrl: String,
  options: [optionSchema], // Menggunakan schema terpisah untuk setiap opsi
  correctAnswer: String,
}, { timestamps: true });

const JavaScriptQuiz = mongoose.model('JavaScriptQuiz', javascriptQuizSchema, 'javascript');

module.exports = JavaScriptQuiz;
