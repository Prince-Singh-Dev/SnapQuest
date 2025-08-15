const asyncHandler = require('express-async-handler');
const Challenge = require('../models/challenge');
const Lesson = require('../models/Lesson');
const Submission = require('../models/Submission');
const User = require('../models/User');

// Creating a new Challenge
const createChallenge = asyncHandler(async (req,res) => {
    const {title , description , deadline , rewardPoints , rewardPerks } = req.body;

    if(!title || !description || !deadline){
        res.status(400);
        throw new Error('Please fill all required Fields');
    }

    const challenge = await Challenge.create({
        title,
        description,
        deadline,
        rewardPoints : rewardPoints||0,
        rewardPerks : rewardPerks||0,
        createdBy : req.user._id
    });

    res.status(201).json(challenge);
});

//Get all challenges ( access for admin view only )

const getAllChallenges = asyncHandler(async (req,res) => {
    const challenges = await Challenge.find().sort({ createdAt : -1});
    res.status(200).json(challenges);
});

//Delete a Challenge
const deleteChallenge = asyncHandler(async (req,res)=>{
    const challenge = await Challenge.findById(req.params.id);

    if(!challenge){
        res.status(404);
        throw new Error('Challenge Not Found');
    }

    await challenge.deleteOne();
    res.status(200).json({ message : 'Challenge removed successfully'});
});

// Viewing all users
const getAllUsers = asyncHandler(async(req,res)=>{
    const users = await User.find().select('-password').sort({createdAt:-1});
    res.status(200).json(users);
});

//Deleting a User
const deleteUser = asyncHandler(async(req,res)=>{
    const user = await User.findById(req.params.id);

    if(!user){
        res.status(404);
        throw new Error('User not found');
    }

    await user.deleteOne();
    res.status(200).json({message:'User deleted SuccessFully'});
});

//Viweing all submissions
const getAllSubmissions = asyncHandler(async(req,res) => {
    const submissions = await Submission.find()
        .populate('user','name email')
        .populate('challenge','title');
    res.status(200).json(submissions);
});

module.exports = {
    createChallenge,
    getAllChallenges,
    deleteChallenge,
    getAllUsers,
    deleteUser,
    getAllSubmissions
};