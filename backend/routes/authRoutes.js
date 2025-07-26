const express = require('express');
const router = express.Router();  //Creates a mini router instance

const { registerUser , loginUser } = require('../controllers/authController');
const { getUserProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register',registerUser);  //Connecting post /register with controller logic
router.post('/login',loginUser);   //Connecting post /login with controller logic 

//Protected Routes
router.get('/profile',protect,getUserProfile);

module.exports = router;   //exports the router to be used in index.js