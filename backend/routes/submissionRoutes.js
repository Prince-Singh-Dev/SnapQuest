const express = require('express');
const router = express.Router();
const {protect} = require('../middleware/authMiddleware');
const {
    submitChallengePhoto,
    getSubmissionByChallenge,
    getUserSubmissions
} = require('../controllers/submissionController');

//@route POST /api/submission/:chalangeId
//@desc Submit a photo for a challenge
//@access Private
router.post('/:challengeId',protect,submitChallengePhoto);

//@route GET /api/submissions/challenge/:challengeId
//@desc Get all submissions for a specific challenge
//@access Private
router.get('/challenge/:challengeId',protect,getSubmissionByChallenge);

//@route GET /api/submissions/user
//@desc Get all submissions made by logged in user
//@access Private
router.get('/user',protect,getUserSubmissions);

module.exports = router;

//How it’s wired:
// POST /api/submissions/:challengeId → Users upload their entry for a specific challenge.
// GET /api/submissions/challenge/:challengeId → Fetch all entries for one challenge (used for voting or viewing).
// GET /api/submissions/user → Fetch only the logged-in user’s submissions (for profile stats).
