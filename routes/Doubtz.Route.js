const express = require("express");
const router = express.Router();

//model import
const { DoubtzModel } = require("../models/doubtz.model");

//get all doubts data 
router.get("/all", async (req, res) => {
  try {
    const doubtz = await DoubtzModel.find();
    res.send({ msg: "All doubts data", doubtz });
  } catch (error) {
    res.status(400).send({ msg: "Something went wrong" });
  }
});

//get single doubt
router.get("/:doubtzId", async (req, res) => {
  const { doubtzId } = req.params;
  try {
    const doubtz = await DoubtzModel.find({ _id: doubtzId });
    res.send({ msg: "Single doubt data", doubtz: doubtz[0] });
  } catch (error) {
    res.status(400).send({ msg: "Something went wrong" });
  }
});

//create new doubt
router.post("/create", async (req, res) => {
  try {
    const doubtz = new DoubtzModel(req.body);
    await doubtz.save();
    return res.send({ msg: "doubt Created", doubtz });
  } catch (error) {
    res.status(404).send({ msg: "Error" });
  }
});

// add response to doubts
router.post("/add", async (req, res) => {
  try {
    const doubtz = await DoubtzModel.findById(req.body.id);
    doubtz.response.push(req.body.desc);
    await doubtz.save();
    let updatedDoubtz = await DoubtzModel.findById(req.body.id);
    return res.send({ msg: "Response added", doubtz: updatedDoubtz });
  } catch (error) {
    res.status(404).send({ msg: "Error" });
  }
});

//edit doubt
router.patch("/:doubtzId", async (req, res) => {
  const { doubtzId } = req.params;
  const payload = req.body;
  try {
    const doubtz = await DoubtzModel.findByIdAndUpdate({ _id: doubtzId }, payload);
    const updatedDoubtz = await DoubtzModel.find({ _id: doubtzId });
    res.status(200).send({ msg: "Updated doubt", doubtz: updatedDoubtz[0] });
  } catch (err) {
    res.status(404).send({ msg: "Error" });
  }
});

//delete doubt
router.delete("/:doubtzId", async (req, res) => {
  const { doubtzId } = req.params;
  try {
    const doubtz = await DoubtzModel.findByIdAndDelete({ _id: doubtzId });
    res.status(200).send({ msg: "Deleted doubt" });
  } catch (error) {
    res.status(404).send({ msg: "Error" });
  }
});

module.exports = router;
