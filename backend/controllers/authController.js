// Complete Logic behind the authentication sytem of LOgin and SignUP process

const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Function to generate JWT Tokens 
const generateToken = (userId) => {
    return jwt.sign({ id:userId } , process.env.JWT_SECRET , {
        expiresIn : '7d',  // Making sure that JWT token will be expires in next 7 days of creation
    });
};


// controls of Regitration process  
const registerUser = async (req,res)=>{
    const {username, email, password} = req.body;

    try{
        //Checking the email , if its already existing 
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({ message : "User Already Exists"});
        }

        // After checking , if No user found , then creating a new user 
        const newUser = await User.create({ username,email,password});

        //Returning the User Info with the created JWT token 
        res.status(201).json({
            _id: newUser._id,
            username:newUser.username,
            email:newUser.email,
            token : generateToken(newUser._id),
        });
    } catch (err){
        console.error('Registration Error :', err.message);
        res.status(500).json({message : 'Server Error'});
    }
};


// Controls of Login system

const loginUser = async(req,res)=>{
    const {email,password}=req.body;

    try{
        // Finding User Email
        const user = await User.findOne({email});
        if(!user) return res.status(400).json({ message : 'INVALID CREDENTIALS'});

        // Finding the passwords using Bcrypt (model method)
        const isMatch = await user.matchPassword(password);
        if(!isMatch) return res.status(400).json({message : 'Invalid Credentials'});

        //Returning User info with tokens
        res.status(200).json({
            _id:user._id,
            username:user.username,
            email:user.email,
            token : generateToken(user._id),
        });
    } catch (err){
        console.error('Login Error : ',err.message);
        res.status(500).json({ message : 'Server Error'});
    }
};

//Exporting the two controller functions
module.exports={
    registerUser,
    loginUser,
};