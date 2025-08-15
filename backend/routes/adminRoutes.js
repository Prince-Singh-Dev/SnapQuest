const express = require('express');
const router = express.Router();
const {protect} = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');
const {
    createChallenge,
    getAllChallenge,
    deleteChallenge,
    getAllUser,
    deleteUser,
    getAllSubmissions,
    getAllChallenges,
    getAllUsers
} = require('../controllers/adminController');

// Challenge Management
router.post('/challenge',protect,admin,createChallenge);
router.get('/challenges',protect,admin,getAllChallenges);
router.delete('/challenge/:id',protect,admin,deleteChallenge);

// User Management
router.get('/users',protect,admin,getAllUsers);
router,delete('/user/:id',protect,admin,deleteUser);

// Submissions Management
router.get('/submissions',protect,admin,getAllSubmissions);

module.exports = router;