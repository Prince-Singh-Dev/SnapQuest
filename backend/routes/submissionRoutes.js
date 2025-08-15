const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    submitToChallenge,
    getChallengeSubmissions,
    getUserSubmissions,
    voteSubmission
} = require('../controllers/submissionController');

// @route POST /api/submissions/:challengeId
// @desc Submit a photo for a challenge
// @access Private
router.post('/:challengeId', protect, submitToChallenge);

// @route GET /api/submissions/challenge/:challengeId
// @desc Get all submissions for a specific challenge (sorted by votes)
// @access Private (could be Public if needed for voting screen)
router.get('/challenge/:challengeId', protect, getChallengeSubmissions);

// @route GET /api/submissions/user
// @desc Get all submissions made by the logged-in user
// @access Private
router.get('/user', protect, getUserSubmissions);

// @route POST /api/submissions/vote/:submissionId
// @desc Vote or unvote a submission
// @access Private
router.post('/vote/:submissionId', protect, voteSubmission);

module.exports = router;
