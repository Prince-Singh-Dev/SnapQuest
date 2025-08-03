const mongoose = require('mongoose');

const lessonProgressSchema = new mongoose.Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    lessonId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson',
        required: true
    },
    submission:{
        type:String, //Can be a File URL or text Based
        required:true
    },
    status:{
        type:String,
        enum:['pending','approved','rejected'],
        default:'pending'
    },
    perksEarned:{
        type:Number,
        default:0
    },
    submitteddAt:{
        type:Date,
        default:Date.now
    }
});

module.exports = mongoose.model('LessonProgress',lessonProgressSchema);