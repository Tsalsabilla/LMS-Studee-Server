const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = express.Router();
const nodemailer = require("nodemailer");

const { TutorModel } = require("../models/Tutor.model");

const { isAdminAuthenticated } = require("../middlewares/authenticate");

router.get("/all", async (req, res) => {
  try {
    const tutors = await TutorModel.find();
    res.send({ message: "All tutor data", tutors });
  } catch (error) {
    res.status(400).send({ message: "Something went wrong" });
  }
});

router.post("/register", isAdminAuthenticated, async (req, res) => {
  const { name, email, password, subject } = req.body.data;
  try {
    let user = await TutorModel.find({ email });
    if (user.length > 0) {
      return res.status(400).send({ msg: "User already registered" });
    }

    const tutor = new TutorModel({
              name,
              email,
              subject,
              password,
            });
            await tutor.save();
            let newTutor = await TutorModel.find({ email });

            res.send({
                      msg: "Tutor Registered Successfully",
                      tutor: newTutor[0],
                    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ msg: "Tutor Registration failed" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const tutor = await TutorModel.find({ email });
    if (tutor.length > 0) {
      if (tutor[0].access == "false") {
        return res.send({ message: "Access Denied" });
      }
      if (password === tutor[0].password) {
      let token = jwt.sign(
              { email, name: tutor[0].name },
              process.env.secret_key,
              { expiresIn: "7d" }
            );
            res.send({
              message: "Login Successful",
              user: tutor[0],
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

router.patch("/:tutorId", isAdminAuthenticated, async (req, res) => {
  const { tutorId } = req.params;
  const payload = req.body.data;
  try {
    const tutor = await TutorModel.findByIdAndUpdate({ _id: tutorId }, payload);
    const updatedTutor = await TutorModel.find({ _id: tutorId });
    res.status(200).send({ msg: "Updated Tutor", tutor: updatedTutor[0] });
  } catch (error) {
    res.status(404).send({ msg: "Error" });
  }
});

router.delete("/:tutorId", async (req, res) => {
  const { tutorId } = req.params;
  try {
    const tutor = await TutorModel.findByIdAndDelete({ _id: tutorId });
    res.status(200).send({ msg: "Deleted Tutor" });
  } catch (error) {
    res.status(404).send({ msg: "Error" });
  }
});

module.exports = router;
