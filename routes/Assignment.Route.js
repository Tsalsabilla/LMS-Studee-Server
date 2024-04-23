const express = require("express");
const router = express.Router();

//model import
const { AssignmentModel } = require("../models/assignment.model");

//middleware import
const { isAuthenticated } = require("../middlewares/authenticate");

//get all assignment data route
router.get("/all", async (req, res) => {
  try {
    const assignment = await AssignmentModel.find();
    res.send({ msg: "All assignments data", assignment });
  } catch (error) {
    res.status(400).send({ msg: "Something went wrong" });
  }
});

//get single data route
router.get("/:assignmentId", async (req, res) => {
  const { assignmentId } = req.params;
  try {
    const assignment = await AssignmentModel.find({ _id: assignmentId });
    res.send({ msg: "Single assignment data", assignment: assignment[0] });
  } catch (error) {
    res.status(400).send({ msg: "Something went wrong" });
  }
});

//create new assignment route
router.post("/create", isAuthenticated, async (req, res) => {
  try {
    const assignment = new AssignmentModel(req.body.data);
    await assignment.save();
    return res.send({ msg: "Assignment Created", assignment });
  } catch (error) {
    res.status(404).send({ msg: "Error" });
  }
});

// edit assignment route
router.patch("/:assignmentId", isAuthenticated, async (req, res) => {
  const { assignmentId } = req.params;
  const payload = req.body.data;
  try {
    const assignment = await AssignmentModel.findByIdAndUpdate(
      { _id: assignmentId },
      payload
    );
    const updatedAssignment = await AssignmentModel.find({ _id: assignmentId });
    res
      .status(200)
      .send({ msg: "Updated Assignment", assignment: updatedAssignment[0] });
  } catch (err) {
    res.status(404).send({ msg: "Error" });
  }
});

//delete assignment route
router.delete("/:assignmentId", async (req, res) => {
  const { assignmentId } = req.params;
  try {
    const assignment = await AssignmentModel.findByIdAndDelete({ _id: assignmentId });
    res.status(200).send({ msg: "Deleted Assignment" });
  } catch (error) {
    res.status(404).send({ msg: "Error" });
  }
});

module.exports = router;
