const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { createLesson , getActiveLessons } = require('../controllers/lessonController');

// For Only admins can create lessons -- ( Need Updates like protecting it with admin middlewares )
router.post('/create',protect,createLesson);

//Any Logged-in User can Fetch active Lessons
router.get('/',protect,getActiveLessons);

module.exports = router;