const User = require("../models/User.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const generateToken = (id)=>{
    return jwt .sign({id},process.env.JWT_SECRET,{
        expiresIn:"7d",
    });
};

const registerUser = async(req,res) => {
    try{
        const{username , email , password}=req.body;

        if(!username || !email || !password){
            return res.status(400).json({message : "All fields are required"});
        }

        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message : "User already Exists"});
        }

        const newUser = await User.create({username , email , password});

        const token = generateToken(newUser._id);

        res.status(201).json({
            token,
            user:{
                _id:newUser._id,
                username : newUser.username,
                email: newUser.email,
                profilePic : newUser.profilePic,
                bio : newUser.bio,
                followers:newUser.followers,
                badges:newUser.badges,
                perks:newUser.badges,
                perks:newUser.perks,
                streak:newUser.streak,
            },
        });
    } catch(err){
        console.error(err);
        res.status(500).json({message : "Server Error"});
    }
};

const loginUser = async(req,res)=>{
    try{
        const{email,password}=req.body;

        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message : "Invalid Credentials"});
        }

        const isMatch = await user.matchPassword(password);
        if(!isMatch){
            return res.status(400).json({message : "Invalid Credentials"});
        }

        const token = generateToken(user._id);

        res.json({
            token,
            user:{
                _id:user._id,
                username:user.username,
                email:user.email,
                profilePic:user.profilePic,
                bio:user.bio,
                followers:user.followers,
                badges:user.badges,
                perks:user.perks,
                streak:user.streak,
            },
        });
    } catch(err){
        console.error(err);
        res.status(500).json({message:"Server Error"});
    }
};

const getMe = async(req,res) => {
    try{
        const user = await User.findById(req.user.id).select("-password");
        res.json(user);
    } catch(err){
        res.status(500).json({message : "Server Error"});
    }
};

module.exports = {
    registerUser,
    loginUser,
    getMe,
};