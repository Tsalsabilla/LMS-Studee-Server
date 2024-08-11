const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = express.Router();
const nodemailer = require("nodemailer");

const { StudentModel } = require("../models/student.model");

const { isAuthenticated } = require("../middlewares/authenticate");

router.get("/all", async (req, res) => {
  try {
    const pipeline = [];

    pipeline.push({
      $match: {}
    });

    pipeline.push({
      $lookup: {
      from: "testresults",
      localField: "_id",
      foreignField: "studentId",
      as: "testResults",
      },
    });
    pipeline.push({
      $unwind: {
      path: "$testResults",
      preserveNullAndEmptyArrays: true
      },
    });
    pipeline.push({
      $group: {
      _id: "$_id",
      totalScore: { $sum: { $ifNull: ["$testResults.score", 100] } },
      name: { $first: "$name" },
      email: { $first: "$email" },
      class: { $first: "$class" },
      access: { $first: "$access" },
      createdAt: { $first: "$createdAt" },
      updatedAt: { $first: "$updatedAt" },
      }
    });

    pipeline.push({
      $sort: {
        totalScore: -1
      }
    });

    const students = await StudentModel.aggregate(pipeline);

    res.send({ message: "All students data", students });
  } catch (error) {
    res.status(400).send({ message: "Something went wrong" });
  }
});

router.post("/register", async (req, res) => {
  const { name, email, password, studentClass } = req.body;
  try {
    let user = await StudentModel.find({ email });
    if (user.length > 0) {
      return res.status(400).send({ msg: "User already registered" });
    }

    const student = new StudentModel({
      name,
      email,
      class: studentClass,
      password,
    });
    await student.save();
    let newStudent = await StudentModel.find({ email });

    res.send({
      msg: "Student Registered Successfully",
      student: newStudent[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ msg: "Student Registration failed" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const student = await StudentModel.find({ email });
    if (student.length > 0) {
      if (student[0].access == "false") {
        return res.send({ message: "Access Denied" });
      }
      if (password === student[0].password) {
        let token = jwt.sign(
                { email, name: student[0].name, userId: student[0]._id },
                process.env.secret_key,
                { expiresIn: "7d" }
              );
              res.send({
                message: "Login Successful",
                user: student[0],
                token,
              });
            }
    } else {
      res.send({ message: "Wrong credentials" });
    }
  } catch (error) {
    res.status(404).send({ message: "Error" });
  }
});

router.patch("/:studentId", isAuthenticated, async (req, res) => {
  const { studentId } = req.params;
  const payload = req.body.data;
  try {
    const student = await StudentModel.findByIdAndUpdate(
      { _id: studentId },
      payload
    );
    const updatedStudent = await StudentModel.find({ _id: studentId });
    res
      .status(200)
      .send({ msg: "Updated Student", student: updatedStudent[0] });
  } catch (error) {
    res.status(404).send({ msg: "Error" });
  }
});

router.delete("/:studentId", async (req, res) => {
  const { studentId } = req.params;
  try {
    const student = await StudentModel.findByIdAndDelete({ _id: studentId });
    res.status(200).send({ msg: "Deleted Student" });
  } catch (error) {
    res.status(400).send({ msg: "Error" });
  }
});

module.exports = router;
