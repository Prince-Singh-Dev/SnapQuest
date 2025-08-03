const Lesson = require('../models/Lesson');

// Creating a new lesson ( For Authorize Members only )

const createLesson = async(req,res)=>{
    try{
        const { title , description , taskType , rewardPoints }= req.body;

        const newLesson = new Lesson({title , description, taskType, rewardPoints});
        await newLesson.save();

        res.status(201).json({message:'Lesson Created',lesson:newLesson});
    } catch(err){
        console.error('Create Lesson Error :',err.message);
        res.status(500).json({message:'Server Error'});
    }
};

// Get All Active Lessons

const getActiveLessons = async(req,res)=>{
    try{
        const lessons = await Lesson.find({ isActive : true});
        res.status(200).json(lessons);
    } catch(err){
        console.error('Fetch Lessons Error :',err.message);
        res.status(500).json({message : 'Server Error'});
    }
};

module.exports = {
    createLesson,
    getActiveLessons
};