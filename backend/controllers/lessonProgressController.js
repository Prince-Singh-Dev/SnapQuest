const LessonProgress = require('../models/LessonProgress');
const Lesson = require('../models/Lesson');
const User = require('../models/User');

// @desc Submit a lesson
// @route POST/api/lessons/:lessonId/submit
// @access Private

const submitLesson = async(req,res)=>{
    const { photoUrl , caption}=req.body;
    const userId = req.user._id;
    const lessonId = req.params.lessonId;

    try{
        const lesson = await Lesson.findById(lessonId);
        if(!lesson){
            return res.status(404).json({message:'Lesson Not Found'});
        }

        const alreadySubmitted = await LessonProgress.findOne({user:userId,lessonId});
        if(alreadySubmitted){
            return res.status(400).json({ message : 'Lesson Already Submitted'});
        }

        const submission = await LessonProgress.create({
            user:userId,
            lesson:lessonId,
            photoUrl,
            caption,
            isCompleted:true,
        });

        // Updating User Stats
        const user = await User.findById(userId);
        user.points += 10;

        // Updating Perks every 50 Points
        if(user.points >= 50){
            user.perks = Math.floor(user.points/50);
        }

        //Checking total lesson completed
        const completeCount = await LessonProgress.countDocuments({user : userId, isCompleted:true});

        //Defining Badge Milestones
        const badgeMilestones = [
            {count:10,name:'Rookie'},
            {count:50,name:'Skilled'},
            {count:100,name:'Pro'},
            {count:200,name:'Master'},
        ]

        // Adding Badge if Milestone is reached
        badgeMilestones.forEach(badge =>{
            if(completedCount >= badge.count && !user.badges.includes(badge.name)){
                user.badges.push(badge.name);
            }
        });

        await user.save();

        res.status(201).json({
            message : 'Lesson Submited Successfully and rewards updated.',
            submission,
            points : user.points,
            perks : user.perks,
            badges : user.badges
        });
    } catch(err){
        console.error('Lesson Submission Error :',err.message);
        res.status(500).json({message:'Server error'});
    }
};

// @desc Get user lesson progress
// @route GET/api/lessons/progress
// @access Private

const getUserProgress = async(req,res)=>{
    try{
        const progress = await LessonProgress.find({user:req.user._id}).populate('lesson','title description');
        res.status(200).json(progress);
    } catch(err){
        console.error('Get Progress Error :',err.message);
        res.status(500).json({message:'Server Error'});
    }
};

module.exports = {
    submitLesson,
    getUserProgress,
};