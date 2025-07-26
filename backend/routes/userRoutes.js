// User Route Setting Up

const express = require('express');
const router = express.Router();
const { getUserProfile , toggleFollowUser } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// Public Routes Setup to fetch a user's Profile
router.get('/:id',getUserProfile);

// Protected route to follow and Unfollow a user
router.put('/:id/follow', protect,toggleFollowUser);

module.exports = router;