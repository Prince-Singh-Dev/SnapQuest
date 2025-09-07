const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Submission = require('../models/Submission');
const Challenge = require('../models/challenge');

// @desc Submit to challenge
const submitToChallenge = asyncHandler(async (req, res) => {
    const { challengeId } = req.params;
    const { photo } = req.body; // This will be file path if using Multer

    // Validate challenge exists
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
        res.status(404);
        throw new Error('Challenge not found');
    }

    // Check if user already submitted
    const alreadySubmitted = await Submission.findOne({
        challenge: challengeId,
        user: req.user._id
    });

    if (alreadySubmitted) {
        res.status(400);
        throw new Error('You have already submitted to this challenge');
    }

    // Create submission
    const submission = await Submission.create({
        challenge: challengeId,
        user: req.user._id,
        photo
    });

    res.status(201).json(submission);
});

// @desc Get all submissions for a challenge (sorted by votes)
const getChallengeSubmissions = asyncHandler(async (req, res) => {
    const { challengeId } = req.params;

    const submissions = await Submission.aggregate([
        { $match: { challenge: new mongoose.Types.ObjectId(challengeId) } },
        { $addFields: { voteCount: { $size: "$votes" } } },
        { $sort: { voteCount: -1, createdAt: 1 } },
        {
            $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "userDetails"
            }
        },
        { $unwind: "$userDetails" },
        {
            $project: {
                _id: 1,
                photo: 1,
                challenge: 1,
                voteCount: 1,
                createdAt: 1,
                "userDetails._id": 1,
                "userDetails.name": 1,
                "userDetails.profilePic": 1
            }
        }
    ]);

    res.json(submissions);
});

// @desc Get all submissions of the logged-in user
const getUserSubmissions = asyncHandler(async (req, res) => {
    const submissions = await Submission.find({ user: req.user._id })
        .populate('challenge', 'title deadline')
        .sort({ createdAt: -1 });

    res.json(submissions);
});

// @desc Vote or unvote a submission
const voteSubmission = asyncHandler(async (req, res) => {
    const { submissionId } = req.params;

    const submission = await Submission.findById(submissionId);
    if (!submission) {
        res.status(404);
        throw new Error('Submission not found');
    }

    const alreadyVoted = submission.votes.includes(req.user._id);

    if (alreadyVoted) {
        // Unvote
        submission.votes = submission.votes.filter(
            (vote) => vote.toString() !== req.user._id.toString()
        );
    } else {
        // Add vote
        submission.votes.push(req.user._id);
    }

    await submission.save();

    res.json({
        submissionId: submission._id,
        votes: submission.votes.length,
        message: alreadyVoted ? 'Vote removed' : 'Vote added'
    });
});

module.exports = {
    submitToChallenge,
    getChallengeSubmissions,
    getUserSubmissions,
    voteSubmission
};
