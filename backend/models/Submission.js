// Schema For Submission Model
// user: Reference to the user who made the submission.
// challenge: Reference to the related challenge.
// photoUrl: Where the photo is stored.
// caption: Optional caption.
// votes: Array of user IDs who voted for this submission.
// timestamps: Automatically adds createdAt and updatedAt.


const mongoose = require('mongoose');
const challenge = require('./challenge');

const submissionSchema = new mongoose.Schema(
    {
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required : true,
        },
        challenge:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Challenge',
            required:true,
        },
        photoUrl :{
            type:String,
            required:true,
        },
        caption:{
            type:String,
        },
        votes:[
            {
                type : mongoose.Schema.Types.ObjectId,
                ref:'User',
            },
        ],
    },
    {timestamps : true}
);

module.exports = mongoose.model('Submission',submissionSchema);