const express = require('express');
const router = express.Router();
const { submitLesson,getUserProgress} = require('../controllers/lessonProgressController');
const { protect } = require('../middleware/authMiddleware');

// Submit a lesson
router.post('/:lessonId/submit',protect,submitLesson);

// Get all progress for current user
router.get('/progress',protect,getUserProgress);

module.exports = router;