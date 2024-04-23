const express = require("express");
const router = express.Router();

//model import
const { LessonModel } = require("../models/lesson.model");

//middleware import
const { isAuthenticated } = require("../middlewares/authenticate");

//get all lesson data
router.get("/all", async (req, res) => {
  try {
    const lessons = await LessonModel.find();
    res.send({ msg: "All lessons data", lessons });
  } catch (error) {
    res.status(400).send({ msg: "Something went wrong" });
  }
});

//create new lesson
router.post("/create", isAuthenticated, async (req, res) => {
  try {
    const lesson = new LessonModel(req.body.data);
    await lesson.save();
    return res.send({ msg: "Lesson Created", lesson });
  } catch (error) {
    res.status(404).send({ msg: "Error" });
  }
});

//edit lesson
router.patch("/:lessonId", isAuthenticated, async (req, res) => {
  const { lessonId } = req.params;
  const payload = req.body.data;
  try {
    const lesson = await LessonModel.findByIdAndUpdate({ _id: lessonId }, payload);
    const updatedLesson = await LessonModel.find({ _id: lessonId });
    res.status(200).send({ msg: "Updated Lesson", lesson: updatedLesson[0] });
  } catch (err) {
    res.status(404).send({ msg: "Error" });
  }
});

//delete lesson
router.delete("/:lessonId", async (req, res) => {
  const { lessonId } = req.params;
  try {
    const lesson = await LessonModel.findByIdAndDelete({ _id: lessonId });
    res.status(200).send({ msg: "Deleted Lesson" });
  } catch (error) {
    res.status(404).send({ msg: "Error" });
  }
});

module.exports = router;
