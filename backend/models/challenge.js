// Challenge Model

const mongoose = require('mongoose');
const Submission = require('./Submission');

const challengeSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true
    },

    description:{
        type : String
    },
    startDate : {
        type:Date,
        required:true
    },
    endDate : {
        type:Date,
        required : true
    },
    entryPerkCost:{
        type : Number,
        default:10
    },
    rewardPoints : {
        type:Number,
        default :100
    },
    rewardPerks:{
        type:Number,
        default:1
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required:true
    },
    status:{
        type : String,
        enum : ['active','completed'],
        default:'active'
    },
    winners : [
        {
            user : {type : mongoose.Schema.Types.ObjectId,ref:'User'},
            submissionId : {type : mongoose.Schema.Types.ObjectId,ref:'Submission'},
            rank : Number,
            votes : Number
        }
    ]
},{timestamps:true});

module.exports = mongoose.model('Challenge',challengeSchema);