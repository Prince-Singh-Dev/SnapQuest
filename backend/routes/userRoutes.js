// User Route Setting Up

const express = require('express');
const router = express.Router();
const { getUserProfile , toggleFollowUser, getMyProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

//Get your own Profile
router.get('/profile',protect,getMyProfile);

// Public Routes Setup to fetch a user's Profile
router.get('/:id',getUserProfile);

// Protected route to follow and Unfollow a user
router.put('/:id/follow', protect,toggleFollowUser);

module.exports = router;