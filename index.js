//imports
require("dotenv").config();
const express = require("express");
const app = express();
//const { connection } = require("./configs/db");
const cors = require("cors");
const mongoose = require("mongoose");
// mongoose.set("strictQuery", false);

mongoose.connect(process.env.dbURL)
.then(() => {
  console.log("Connected MongoDB");
})
.catch((err) => {
  console.error("Connection error", err);
  process.exit();
});

//port
const PORT = process.env.port || 8080;

//routes imports
const adminRouter = require("./routes/Admins.Route");
const studentRouter = require("./routes/Student.Route");
const tutorRouter = require("./routes/Tutor.Route");
const scratchRouter = require("./routes/Scratch.Route");
const lessonRouter = require("./routes/Lesson.Route");
const contentRouter = require("./routes/Content.Route");
const assignmentRouter = require("./routes/Assignment.Route");
const testRouter = require("./routes/Test.Route");
const DoubtRouter = require("./routes/Doubt.Route");
const DashboardRouter = require("./routes/Dashboard.Route");
const TestResultRouter = require("./routes/TestResult.Route");
// const quiz = require('./routes/quiz')

app.use(express.text());
app.use(express.json());
app.use(cors());
// app.use(cors({
//   origin: 'https://lms-studee-client-production.up.railway.app',
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   credentials: true
// }));

//routes
app.get("/", (req, res) => {
  res.send("Home Route");
});
app.use("/admin", adminRouter);
app.use("/tutor", tutorRouter);
app.use("/student", studentRouter);
app.use("/scratch", scratchRouter);
app.use("/lesson", lessonRouter);
app.use("/content", contentRouter);
app.use("/assignment", assignmentRouter);
app.use("/test", testRouter);
app.use("/doubt", DoubtRouter);
app.use("/dashboard", DashboardRouter);
app.use("/test-result", TestResultRouter);
// app.use(quiz)

//app listening
app.listen(PORT, async () => {
  console.log(`Listening at port ${PORT}`);
});
