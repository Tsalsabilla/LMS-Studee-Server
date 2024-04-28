const mongoose = require("mongoose");

const testSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    class: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    creator: {
        type: String,
        required: true
    },
    fileUrl: {
        type: String,
        required: true
    },
    fileType: {
        type: String,
        required: true
    },
    thumbnailUrl: {
        type: String,
        required: true
    },
    size: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// define for student data 
const studentSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    access: {
        type: String,
        default: "true"
    },
    class: {
        type: String,
        required: true
    },
    userType: {
        type: String,
        default: "Student"
    },
    premium: {
        type: String,
        default: "false"
    },
    totalPoints: { type: Number, default: 0 },
    totalScratch: { type: Number, default: 0 },
    averageTime: { type: Number, default: 0 },
    scratchIds: [{ type: String }],
    scratchDetails: [{ type: Object }]

});

const testResultSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true
    },
    testId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Test",
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const TestResult = mongoose.model("testResult", testResultSchema);
const Test = mongoose.model("Test", testSchema);
const Student = mongoose.model("Student", studentSchema);

module.exports = {TestResult, Test, Student};