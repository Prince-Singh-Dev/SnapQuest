// Lesson Model to display details like : title , description , TaskType , rewards and Active date ....

const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
    title:{
        type : String,
        required : true
    },
    description : {
        type : String,
        required:true
    },
    taskType:{
        type : String,
        enum:['photo','text','quiz'],
        default: 'photo'
    },
    rewardPoints:{
        type:Number,
        default:10
    },
    isActive : {
        type:Boolean,
        default:true
    }
},{timestamps : true});

module.exports = mongoose.model('Lesson',lessonSchema);