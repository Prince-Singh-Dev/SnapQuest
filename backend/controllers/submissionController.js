const Submission = require('../models/Submission');
const Challenge = require('../models/challenge');

// @desc Submit a photo to a challenge
// @route POST /api/challenge/:challengeId/submit
// @access Private

const submitToChallenge = async (req,res) =>{
    const {photoUrl , caption} = req.body;
    const userId = req.user._id;
    const challengeId = req.params.challengeId;

    try{
        //Checking if challenge exists or not
        const challenge = await Challenge.findById(challengeId);
        if(!challenge){
            return res.status(404).json({message : 'Challenge not found'});
        }

        // Checking If challenge is already submitted or not
        const existingSubmission = await Submission.findOne({user:userId,challenge:challengeId});
        if(existingSubmission){
            return res.status(404).json({message:'You have already Submitted to this Challenge'});
        }

        const submission = await Submission.create({
            user:userId,
            challenge:challengeId,
            photoUrl,
            caption,
        });

        res.status(201).json(submission);
    } catch(err){
        console.error('Submission Error :',err.message);
        res.status(500).json({message:'Server error'});
    }
};

// @desc Vote on a submission
// @route POST /api/submission/:submissionId/vote
// @access Private

const voteSubmission = async (req,res) =>{
    const userId = req.user._id;
    const submissionId = req.params.submissionId;

    try{
        const submission = await Submission.findById(submissionId);

        if(!submission){
            return res.status(404).json({message:'Submission not found'});
        }

        const hasVoted = submission.votes.includes(userId);

        if(hasVoted){
            //Unvote
            submission.votes.pull(userId);
        } else{
            //Vote
            submission.votes.push(userId);
        }

        await submission.save();

        res.status(200).json({
            message:hasVoted ? 'Vote Removed':'Voted SuccessFully',
            totalVotes : submission.votes.length
        });
    } catch(err){
        console.error('Voting Error : ', err.message);
        res.status(500).json({message:'Server Error'});
    }
};

//@desc Get all Submissions for a challenge
//@route GET/api/challenges/:challengesId/submissions
//@access Public

const getChallengeSubmissions = async(req,res) =>{
    const challengeId = req.params.challengeId;

    try{
        const submissions = await Submission.find({challenge:challengeId})
            .populate('user','username')
            .sort({votes:-1});  //Sorting By highest Votes
        res.status(200).json(submissions);
    } catch(err){
        console.error('Fetch Submission Error:',err.message);
        res.status(500).json({message:'Server Error'});
    }
};

module.exports = {
    submitToChallenge,
    voteSubmission,
    getChallengeSubmissions,
};