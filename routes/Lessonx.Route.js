const express = require("express");
const router = express.Router();

//model import
const { LessonxModel } = require("../models/lessonx.model");

//middleware import
const { isAuthenticated } = require("../middlewares/authenticate");

//get all lessonx data
router.get("/all", async (req, res) => {
  try {
    const lessonsx = await LessonxModel.find();
    res.send({ msg: "All lessonsx data", lessonsx });
  } catch (error) {
    res.status(400).send({ msg: "Something went wrong" });
  }
});

//create new lessonx
router.post("/create", isAuthenticated, async (req, res) => {
  try {
    const lessonx = new LessonxModel(req.body.data);
    await lessonx.save();
    return res.send({ msg: "Lessonx Created", lessonx });
  } catch (error) {
    res.status(404).send({ msg: "Error" });
  }
});

//edit lessonx
router.patch("/:lessonxId", isAuthenticated, async (req, res) => {
  const { lessonxId } = req.params;
  const payload = req.body.data;
  try {
    const lessonx = await LessonxModel.findByIdAndUpdate({ _id: lessonxId }, payload);
    const updatedLessonx = await LessonxModel.find({ _id: lessonxId });
    res.status(200).send({ msg: "Updated Lessonx", lessonx: updatedLessonx[0] });
  } catch (err) {
    res.status(404).send({ msg: "Error" });
  }
});

//delete lessonx
router.delete("/:lessonxId", async (req, res) => {
  const { lessonxId } = req.params;
  try {
    const lessonx = await LessonxModel.findByIdAndDelete({ _id: lessonxId });
    res.status(200).send({ msg: "Deleted Lessonx" });
  } catch (error) {
    res.status(404).send({ msg: "Error" });
  }
});

module.exports = router;
