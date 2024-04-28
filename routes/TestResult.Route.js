
const express = require('express');

const router = express.Router();

const {TestResult} = require('../models/testResult.model');

// POST /test-results
router.post('/', async (req, res) => {
    try {
        // Get the test result data from the request body
        const testResult = req.body;

        // Create a new instance of TestResultModel
        const newTestResult = new TestResult(testResult);

        // Save the test result to the database
        await newTestResult.save();

        // Send a response indicating success
        res.status(200).json({ message: 'Test result stored successfully' });
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
        const studentId = req.query.studentId;
        
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
        res.status(200).json(testResult);
    } catch (err) {
        console.error('Error retrieving test result:', err);
        res.status(500).json({ message: 'Failed to retrieve test result' });
    }
});

module.exports = router;
