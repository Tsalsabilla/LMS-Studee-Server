const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = express.Router();
const nodemailer = require("nodemailer");

//model import
const { StudentModel } = require("../models/student.model");

//middleware import
const { isAuthenticated } = require("../middlewares/authenticate");

//gel all students data
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
      totalScore: { $sum: { $ifNull: ["$testResults.score", 0] } },
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

// register new students
router.post("/register", async (req, res) => {
  const { name, email, password, studentClass } = req.body;
  try {
    let user = await StudentModel.find({ email });
    if (user.length > 0) {
      // return res.send({ msg: "User already registered" });
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

    // bcrypt.hash(
    //   password,
    //   +process.env.Salt_rounds,
    //   async (err, secure_password) => {
    //     if (err) {
    //       console.log(err);
    //     } else {
    //       const student = new StudentModel({
    //         name,
    //         email,
    //         class: req.body.data.class,
    //         password: secure_password,
    //       });
    //       await student.save();
    //       let newStudent = await StudentModel.find({ email });

    //       const transporter = nodemailer.createTransport({
    //         service: "gmail",
    //         auth: {
    //           user: "agrawaljoy1@gmail.com",
    //           pass: "nsziioprjzwcodlm",
    //         },
    //       });

    //       const mailOptions = {
    //         from: "agrawaljoy1@gmail.com",
    //         to: email,
    //         subject: "Account ID and Password",
    //         text: `Welcome to Studee, Congratulations,Your account has been created successfully.This is your User type : Student and Password : ${password}  `,
    //       };

    //       transporter.sendMail(mailOptions, (error, info) => {
    //         if (error) {
    //           return res.send({ msg: "error" });
    //         }
    //         res.send({ msg: "Password sent" });
    //       });

    //       res.send({
    //         msg: "Student Registered Successfully",
    //         student: newStudent[0],
    //       });
    //     }
    //   }
    // );
  } catch (err) {
    // res.status(404).send({ msg: "Student Registration failed" });
    console.error(err); // Log the error for debugging purposes
    res.status(500).send({ msg: "Student Registration failed" });
  }
});

//student login
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
      // bcrypt.compare(password, student[0].password, (err, results) => {
      //   if (results) {
      //     let token = jwt.sign(
      //       { email, name: student[0].name },
      //       process.env.secret_key,
      //       { expiresIn: "7d" }
      //     );
      //     res.send({
      //       message: "Login Successful",
      //       user: student[0],
      //       token,
      //     });
      //   } else {
      //     res.status(201).send({ message: "Wrong credentials" });
      //   }
      // });
    } else {
      res.send({ message: "Wrong credentials" });
    }
  } catch (error) {
    res.status(404).send({ message: "Error" });
  }
});

//edit student
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

//delete student
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
