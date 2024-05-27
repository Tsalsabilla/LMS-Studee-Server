
const express = require('express');

const router = express.Router();

const {TestResult} = require('../models/testResult.model');

const { isAuthenticatedUser } = require("../middlewares/authenticate");

const jwt = require('jsonwebtoken');

function getUserIdFromToken(token) {
    const secretKey = process.env.secret_key;

    try {
        const decodedToken = jwt.verify(token, secretKey);
        const userId = decodedToken.userId;
        return userId;
    } catch (err) {
        console.error('Error decoding token:', err);
        throw new Error('Failed to extract userId from token');
    }
}

module.exports = { getUserIdFromToken };

router.post('/', isAuthenticatedUser,  async (req, res) => {
    try {
        const testResult = req.body;
        const { authorization } = req.headers;
        if (authorization && authorization.startsWith("Bearer ")) {
            const token = authorization.slice(7);
            const userId = getUserIdFromToken(token);
            testResult.payload.studentId = userId;
        } else {
            throw new Error("Invalid authorization header");
        }
        const newTestResult = new TestResult(testResult.payload);
        await newTestResult.save();
        res.status(200).json({
            code: 200,
            status: 'OK',
            data: newTestResult,
            message: 'Test result stored successfully'
        });
    } catch (err) {
        console.error('Error storing test result:', err);
        res.status(500).json({ message: 'Failed to store test result' });
    }
});

router.get('/', async (req, res) => {
    try {
        let query = {};
        const {studentId} = req.query;

        let userId = null;
        const { authorization } = req.headers;
        if (authorization && authorization.startsWith("Bearer ")) {
            const token = authorization.slice(7);
            userId = getUserIdFromToken(token);
        }

        if (studentId !== userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        
        if (studentId) {
            query.studentId = studentId;
        }

        const testResult = await TestResult.find(query).populate('testId').populate('studentId');

        if (!testResult) {
            return res.status(404).json({ message: 'Test result not found' });
        }
        res.status(200).json({
            code: 200,
            status: 'OK',
            data: testResult,
            message: 'Test result retrived successfully'
        });
    } catch (err) {
        console.error('Error retrieving test result:', err);
        res.status(500).json({ message: 'Failed to retrieve test result' });
    }
});

module.exports = router;
