const express = require("express");
const router = express.Router();

//model import
const { DoubtxModel } = require("../models/doubtx.model");

//get all doubts data 
router.get("/all", async (req, res) => {
  try {
    const doubtx = await DoubtxModel.find();
    res.send({ msg: "All doubts data", doubtx });
  } catch (error) {
    res.status(400).send({ msg: "Something went wrong" });
  }
});

//get single doubt
router.get("/:doubtxId", async (req, res) => {
  const { doubtxId } = req.params;
  try {
    const doubtx = await DoubtxModel.find({ _id: doubtxId });
    res.send({ msg: "Single doubt data", doubtx: doubtx[0] });
  } catch (error) {
    res.status(400).send({ msg: "Something went wrong" });
  }
});

//create new doubt
router.post("/create", async (req, res) => {
  try {
    const doubtx = new DoubtxModel(req.body);
    await doubtx.save();
    return res.send({ msg: "doubt Created", doubtx });
  } catch (error) {
    res.status(404).send({ msg: "Error" });
  }
});

// add response to doubts
router.post("/add", async (req, res) => {
  try {
    const doubtx = await DoubtxModel.findById(req.body.id);
    doubtx.response.push(req.body.desc);
    await doubtx.save();
    let updatedDoubtx = await DoubtxModel.findById(req.body.id);
    return res.send({ msg: "Response added", doubtx: updatedDoubtx });
  } catch (error) {
    res.status(404).send({ msg: "Error" });
  }
});

//edit doubt
router.patch("/:doubtxId", async (req, res) => {
  const { doubtxId } = req.params;
  const payload = req.body;
  try {
    const doubtx = await DoubtxModel.findByIdAndUpdate({ _id: doubtxId }, payload);
    const updatedDoubtx = await DoubtxModel.find({ _id: doubtxId });
    res.status(200).send({ msg: "Updated doubt", doubtx: updatedDoubtx[0] });
  } catch (err) {
    res.status(404).send({ msg: "Error" });
  }
});

//delete doubt
router.delete("/:doubtxId", async (req, res) => {
  const { doubtxId } = req.params;
  try {
    const doubtx = await DoubtxModel.findByIdAndDelete({ _id: doubtxId });
    res.status(200).send({ msg: "Deleted doubt" });
  } catch (error) {
    res.status(404).send({ msg: "Error" });
  }
});

module.exports = router;
