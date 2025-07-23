const express = require('express');
const router = express.Router();  //Creates a mini router instance
const { registerUser , loginUser } = require('../controllers/authController');

router.post('/register',registerUser);  //Connecting post /register with controller logic

router.post('/login',loginUser);   //Connecting post /login with controller logic 

module.exports = router;   //exports the router to be used in index.js