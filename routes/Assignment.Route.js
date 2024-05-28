const express = require("express");
const router = express.Router();

const { AssignmentModel } = require("../models/assignment.model");

const { isAuthenticated } = require("../middlewares/authenticate");

router.get("/all", async (req, res) => {
  try {
    const assignment = await AssignmentModel.find();
    res.send({ msg: "All assignments data", assignment });
  } catch (error) {
    res.status(400).send({ msg: "Something went wrong" });
  }
});

router.get("/:assignmentId", async (req, res) => {
  const { assignmentId } = req.params;
  try {
    const assignment = await AssignmentModel.find({ _id: assignmentId });
    res.send({ msg: "Single assignment data", assignment: assignment[0] });
  } catch (error) {
    res.status(400).send({ msg: "Something went wrong" });
  }
});

router.post("/create", isAuthenticated, async (req, res) => {
  try {
    const assignment = new AssignmentModel(req.body.data);
    await assignment.save();
    return res.send({ msg: "Assignment Created", assignment });
  } catch (error) {
    res.status(404).send({ msg: "Error" });
  }
});

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
