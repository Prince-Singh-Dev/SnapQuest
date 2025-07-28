// User Route Setting Up

const express = require('express');
const router = express.Router();
const { getUserProfile , toggleFollowUser, getMyProfile , updateProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

//Get your own Profile
router.get('/profile',protect,getMyProfile);

// Public Routes Setup to fetch a user's Profile
router.get('/:id',getUserProfile);

// Route to update user profile
router.put('/update',protect,updateProfile);

// Protected route to follow and Unfollow a user
router.put('/:id/follow', protect,toggleFollowUser);

module.exports = router;