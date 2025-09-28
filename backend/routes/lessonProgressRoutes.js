const express = require('express');
const router = express.Router();
const { submitLesson,getUserProgress,upload} = require('../controllers/lessonProgressController');
const { protect } = require('../middleware/authMiddleware');

// Submit a lesson
router.post('/:lessonId/submit',protect, upload.single("file") ,submitLesson);

// Get all progress for current user
router.get('/progress',protect,getUserProgress);

module.exports = router;