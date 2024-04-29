
const express = require('express');

const router = express.Router();

const {TestResult} = require('../models/testResult.model');

//middleware import
const { isAuthenticatedUser } = require("../middlewares/authenticate");

const jwt = require('jsonwebtoken');

// Function to extract userId from token
function getUserIdFromToken(token) {
    // Implement your logic here to extract the userId from the token
    // For example, if the token is a JWT, you can decode it and extract the userId from the payload
    // Return the userId
    // Here's an example implementation using JWT decoding library like jsonwebtoken:
    const secretKey = process.env.secret_key; // Replace with your actual secret key

    try {
        // Verify and decode the token
        const decodedToken = jwt.verify(token, secretKey);
        // Extract the userId from the decoded token
        const userId = decodedToken.userId;
        // Return the userId
        return userId;
    } catch (err) {
        console.error('Error decoding token:', err);
        throw new Error('Failed to extract userId from token');
    }
}

module.exports = { getUserIdFromToken };

// POST /test-results
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

// GET /test-results/:id
router.get('/', async (req, res) => {
    try {
        let query = {};
        // Get the student ID from the query parameters
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

        // Find the test result in the database by student ID
        const testResult = await TestResult.find(query).populate('testId').populate('studentId');


        // Check if the test result exists
        if (!testResult) {
            return res.status(404).json({ message: 'Test result not found' });
        }
        // Send the test result as the response
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
