const challenge = require('../models/challenge');
const Challenge = require('../models/challenge');
const Submission = require('../models/Submission');
const User = require('../models/User');

//Complete a Challenge , rank submission and award rewards
const completeChallenge = async (req,res) => {
    try {
        const challengeId = req.params.id;

        //finding the challenge
        const challenge = await Challenge.findById(challengeId);
        if(!challenge){
            return res.status(404).json({message : 'Challenge Not found'});
        }
        if(challenge.status === 'completed'){
            return res.status(404).json({message : 'Challenge already completed'});
        }

        //Get all Submissions for the challenge , sorted by votes (highest First)
        const submissions = await Submission.find({challenge:challengeId})
            .sort({votes:-1});
        
        if(submissions.length === 0){
            return res.status(400).json({ message : 'No submissions Found for this challenge'});
        }

        //Assigning ranks & rewards to that challengers
        const rewards = {
            1 : {points:50 , perks:5},
            2 : { points:30 , perks:3},
            3 : { points : 20 , perks :2},
        };

        let winners = [];

        for (let i=0 ; i< submissions.length && i<3 ; i++){
            const submission = submissions[i];
            const rank = i+1;

            //Updating user rewards
            const user = await User.findById(submission.user);
            if(user){
                user.points += rewards[rank].points;
                user.perks += rewards[rank].perks;
                await user.save();
            }

            //Tracking winners
            winners.push({
                user : submission.user,
                submissionId : submission._id,
                rank,
                votes : submission.votes
            });
        }

        //Updating challenge as completed
        challenge.status = 'completed';
        challenge.winners = winners;
        await challenge.save();

        res.json({
            message : 'Challenge Completed SuccessFully',
            winners
        });
    } catch (error){
        console.error(error);
        res.status(500).json({message:'Server Error'});
    }
};

module.exports = {
    completeChallenge
};