const { AdminModel } = require("../models/admin.model");
const { TutorModel } = require("../models/Tutor.model");
const { StudentModel } = require("../models/student.model");
const jwt = require("jsonwebtoken");

const isAdminAuthenticated = async (req, res, next) => {
  const token = req.body.token;
  if (!token) {
    return res.status(401).send({ message: "Missing Token. Access Denied" });
  }
  try {
    const decodedData = jwt.verify(token, process.env.secret_key);
    let user = await AdminModel.findOne({ email: decodedData.email });
    if (user) {
      next();
    } else {
      return res.status(401).send({ message: "Invalid Token. Access Denied" });
    }
  } catch (error) {
    return res.status(401).send({ message: error.message });
  }
};

const isTutorAuthenticated = async (req, res, next) => {
  const token = req.body.token;
  if (!token) {
    return res.status(401).send({ message: "Missing Token. Access Denied" });
  }
  try {
    const decodedData = jwt.verify(token, process.env.secret_key);
    let tutor = await TutorModel.findOne({ email: decodedData.email });
    if (tutor) {
      next();
    } else {
      return res.status(401).send({ message: "Invalid Token. Access Denied" });
    }
  } catch (error) {
    return res.status(401).send({ message: error.message });
  }
};

const isAuthenticated = async (req, res, next) => {
  const token = req.body.token;
  if (!token) {
    return res.status(401).send({ message: "Missing Token. Access Denied" });
  }
  try {
    const decodedData = jwt.verify(token, process.env.secret_key);
    let admin = await AdminModel.findOne({ email: decodedData.email });
    let tutor = await TutorModel.findOne({ email: decodedData.email });
    if (admin || tutor) {
      next();
    } else {
      return res.status(401).send({ message: "Invalid Token. Access Denied" });
    }
  } catch (error) {
    return res.status(401).send({ message: error.message });
  }
};

const isAuthenticatedUser = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).send({ message: "Missing Token. Access Denied" });
  }
  try {
    const decodedData = jwt.verify(token, process.env.secret_key);
    let admin = await AdminModel.findOne({ email: decodedData.email });
    let tutor = await TutorModel.findOne({ email: decodedData.email });
    let student = await StudentModel.findOne({ email: decodedData.email });
    if (admin || tutor || student) {
      next();
    } else {
      return res.status(401).send({ message: "Invalid Token. Access Denied" });
    }
  } catch (error) {
    return res.status(401).send({ message: error.message });
  }
};


module.exports = {
  isAdminAuthenticated,
  isTutorAuthenticated,
  isAuthenticated,
  isAuthenticatedUser,
};
