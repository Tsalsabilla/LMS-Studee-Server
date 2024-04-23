// const express = require("express");
// const router = express.Router();

// //model import
// const { TestModel } = require("../models/test.model");
// const JavaScripQuiz = require("../models/quiz.javascript");


// //middleware import
// const { isAuthenticated } = require("../middlewares/authenticate");

// //get all test data route
// router.get("/all", async (req, res) => {
//   try {
//     const test = await TestModel.find();
//     res.send({ msg: "All tests data", test });
//   } catch (error) {
//     res.status(400).send({ msg: "Something went wrong" });
//   }
// });

// //get single data route
// router.get("/:testId", async (req, res) => {
//   const { testId } = req.params;
//   try {
//     const test = await TestModel.find({ _id: testId });
//     res.send({ msg: "Single test data", test: test[0] });
//   } catch (error) {
//     res.status(400).send({ msg: "Something went wrong" });
//   }
// });

// //create new test route
// router.post("/create", isAuthenticated, async (req, res) => {
//   try {
//     const test = new TestModel(req.body.data);
//     await test.save();
//     return res.send({ msg: "Test Created", test });
//   } catch (error) {
//     res.status(404).send({ msg: "Error" });
//   }
// });

// // edit test route
// router.patch("/:testId", isAuthenticated, async (req, res) => {
//   const { testId } = req.params;
//   const payload = req.body.data;
//   try {
//     const test = await TestModel.findByIdAndUpdate(
//       { _id: testId },
//       payload
//     );
//     const updatedTest = await TestModel.find({ _id: testId });
//     res
//       .status(200)
//       .send({ msg: "Updated Test", test: updatedTest[0] });
//   } catch (err) {
//     res.status(404).send({ msg: "Error" });
//   }
// });

// //delete test route
// router.delete("/:testId", async (req, res) => {
//   const { testId } = req.params;
//   try {
//     const test = await TestModel.findByIdAndDelete({ _id: testId });
//     res.status(200).send({ msg: "Deleted Test" });
//   } catch (error) {
//     res.status(404).send({ msg: "Error" });
//   }
// });

// router.get("/:testId", async (req, res) => {
//   res.send("hello");
// });

// router.get("/api/quiz/js", async (req, res) => {
//   try {
//     const quiz = await JavaScripQuiz.find({})
//     res.json(quiz)
//   } catch (error) {
//     console.log(error)
//   }
// });

// module.exports = router;

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

const express = require("express");
const router = express.Router();

//model import
const { TestModel } = require("../models/test.model");
const JavaScriptQuiz = require("../models/quiz.javascript");


//middleware import
const { isAuthenticated } = require("../middlewares/authenticate");

//get all test data route
router.get("/all", async (req, res) => {
  try {
    const test = await TestModel.find();
    res.send({ msg: "All tests data", test });
  } catch (error) {
    res.status(400).send({ msg: "Something went wrong" });
  }
});

//get single data route
router.get("/:testId", async (req, res) => {
  const { testId } = req.params;
  try {
    const test = await TestModel.find({ _id: testId });
    res.send({ msg: "Single test data", test: test[0] });
  } catch (error) {
    res.status(400).send({ msg: "Something went wrong" });
  }
});

//create new test route
router.post("/create", isAuthenticated, async (req, res) => {
  try {
    const test = new TestModel(req.body.data);
    await test.save();
    return res.send({ msg: "Test Created", test });
  } catch (error) {
    res.status(404).send({ msg: "Error" });
  }
});

// edit test route
router.patch("/:testId", isAuthenticated, async (req, res) => {
  const { testId } = req.params;
  const payload = req.body.data;
  try {
    const test = await TestModel.findByIdAndUpdate(
      { _id: testId },
      payload
    );
    const updatedTest = await TestModel.find({ _id: testId });
    res
      .status(200)
      .send({ msg: "Updated Test", test: updatedTest[0] });
  } catch (err) {
    res.status(404).send({ msg: "Error" });
  }
});

//delete test route
router.delete("/:testId", async (req, res) => {
  const { testId } = req.params;
  try {
    const test = await TestModel.findByIdAndDelete({ _id: testId });
    res.status(200).send({ msg: "Deleted Test" });
  } catch (error) {
    res.status(404).send({ msg: "Error" });
  }
});

router.get("/:testId", async (req, res) => {
  res.send("hello");
});

router.get("/api/quiz/js", async (req, res) => {
  try {
    const quiz = await JavaScriptQuiz.find({})
    res.json(quiz)
  } catch (error) {
    console.log(error)
  }
});

module.exports = router;
