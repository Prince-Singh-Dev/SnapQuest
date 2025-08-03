const LessonProgress = require('../models/LessonProgress');
const Lesson = require('../models/Lesson');

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

        res.status(201).json(submission);
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