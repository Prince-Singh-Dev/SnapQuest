// User Route Setting Up

const express = require('express');
const router = express.Router();
const { getUserProfile , toggleFollowUser, getMyProfile , updateProfile, uploadProfilePic} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

//Get your own Profile
router.get('/me',protect,getMyProfile);

// Public Routes Setup to fetch a user's Profile
router.get('/:id',getUserProfile);

// Route to update user profile
router.put('/update',protect,updateProfile);

// Route for the User to update thier Profile Pics
router.post('/profile/upload',protect,upload.single('profilePic'),uploadProfilePic);

// Protected route to follow and Unfollow a user
router.put('/:id/follow', protect,toggleFollowUser);

module.exports = router;