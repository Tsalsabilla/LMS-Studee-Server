const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = express.Router();
const nodemailer = require("nodemailer");

const { AdminModel } = require("../models/admin.model");

const {
  isAdminAuthenticated,
} = require("../middlewares/authenticate");

router.get("/all", async (req, res) => {
  try {
    const admins = await AdminModel.find();
    res.send({ message: "All admins data", admins });
  } catch (error) {
    res.status(400).send({ message: "Something went wrong" });
  }
});

router.post("/register", isAdminAuthenticated, async (req, res) => {
  const { name, email, password } = req.body.data;
  try {
    let user = await AdminModel.find({ email });
    if (user.length > 0) {
      return res.status(400).send({ msg: "User already registered" });
    }

    const admin = new AdminModel({
      name,
      email,
      password,
    });

    await admin.save();
    let newAdmin = await AdminModel.find({ email });

    res.send({
      msg: "Admin Registered Successfully",
      admin: newAdmin[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ msg: "Admin Registration failed" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await AdminModel.find({ email });
    if (admin.length > 0) {
      if (admin[0].access == "false") {
        return res.send({ message: "Access Denied" });
      }
      if (password === admin[0].password) {
        let token = jwt.sign(
          { email, name: admin[0].name },
          process.env.secret_key,
          { expiresIn: "7d" }
        );
        res.send({
          message: "Login Successful",
          user: admin[0],
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

router.patch("/:adminId", isAdminAuthenticated, async (req, res) => {
  const { adminId } = req.params;
  const payload = req.body.data;
  try {
    const admin = await AdminModel.findByIdAndUpdate({ _id: adminId }, payload);
    const updatedAdmin = await AdminModel.find({ _id: adminId });
    res.status(200).send({ msg: "Updated Admin", admin: updatedAdmin[0] });
  } catch (err) {
    res.status(404).send({ msg: "Error" });
  }
});

//delete admin route
router.delete("/:adminId", async (req, res) => {
  const { adminId } = req.params;
  try {
    const admin = await AdminModel.findByIdAndDelete({ _id: adminId });
    res.status(200).send({ msg: "Deleted Admin" });
  } catch (error) {
    res.status(404).send({ msg: "Error" });
  }
});

module.exports = router;
