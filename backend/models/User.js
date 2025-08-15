// Creating the User Models

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Defining the schemas ( for storing the data for users in a structure )

const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true,
        unique : true,
        trim : true // Removing all the leading and trailing blank spaces fromthe user name
    },

    email:{
        type : String,
        required : true,
        unique : true,
        lowercase : true // Storing  all the emails in lowercase 
    },

    password : {
        type : String ,
        required : true,
        minlength : 6
    },

    bio:{
        type:String,
        default: '',
        trim:true,
        maxlength:500,
    },

    profilePic :{
        type:String,
        default:''
    },

    followers :  [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    }],

    badges : [String],  //Storing Earned Badges by each user seprately 

    isAdmin : {
        type: Boolean,
        default : false
    },

    perks : {
        type : Number,
        default : 0
    },

    points :{
        type : Number,
        default : 0
    },

    streak : {
        type : Number,
        default:0
    },

    createdAt : {
        type : Date,
        default:Date.now
    }
});

// Pre-Save middleware to hash the passwords
userSchema.pre('save',async function (next) {
    if(!this.isModified('password')) return next();   //Skipping if passwords are not changed

    try{
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password,salt);
        next();
    } catch(err){
        next(err);
    }
});


//Method to compare passwords for login 
userSchema.methods.matchPassword = async function ( enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
};

const User = mongoose.model('User',userSchema);

module.exports = User;