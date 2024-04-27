const express = require("express");
const router = express.Router();

//model import
const { ScratchModel } = require("../models/scratch.model");

//middleware import
const { isAuthenticated } = require("../middlewares/authenticate");

//get all scratch data
router.get("/all", async (req, res) => {
  try {
    const scratchs = await ScratchModel.find();
    res.send({ msg: "All scratchs data", scratchs });
  } catch (error) {
    res.status(400).send({ msg: "Something went wrong" });
  }
});

//get single scratch
router.get("/:scratchId", async (req, res) => {
  const { scratchId } = req.params;
  try {
    const scratch = await ScratchModel.find({ _id: scratchId });
    res.send({ msg: "Single scratch data", scratch: scratch[0] });
  } catch (error) {
    res.status(400).send({ msg: "Something went wrong" });
  }
});

//create new scratch
router.post("/create", isAuthenticated, async (req, res) => {
  try {
    const scratch = new ScratchModel(req.body.data);
    await scratch.save();
    return res.send({ msg: "Scratch Created", scratch });
  } catch (error) {
    res.status(404).send({ msg: "Error" });
  }
});

// add response to scratchs
router.post("/add", async (req, res) => {
  try {
    const scratch = await ScratchModel.findById(req.body.id);
    scratch.response.push(req.body.desc);
    await scratch.save();
    let updatedScratch = await ScratchModel.findById(req.body.id);
    return res.send({ msg: "Response added", scratch: updatedScratch });
  } catch (error) {
    res.status(404).send({ msg: "Error" });
  }
});

//edit scratch
router.patch("/:scratchId", isAuthenticated, async (req, res) => {
  const { scratchId } = req.params;
  const payload = req.body.data;
  try {
    const scratch = await ScratchModel.findByIdAndUpdate({ _id: scratchId }, payload);
    const updatedScratch = await ScratchModel.find({ _id: scratchId });
    res.status(200).send({ msg: "Updated Scratch", scratch: updatedScratch[0] });
  } catch (err) {
    res.status(404).send({ msg: "Error" });
  }
});

//delete scratch
router.delete("/:scratchId", async (req, res) => {
  const { scratchId } = req.params;
  try {
    const scratch = await ScratchModel.findByIdAndDelete({ _id: scratchId });
    res.status(200).send({ msg: "Deleted Scratch" });
  } catch (error) {
    res.status(404).send({ msg: "Error" });
  }
});

module.exports = router;
