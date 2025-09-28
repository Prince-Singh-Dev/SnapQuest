const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { createLesson , getActiveLessons } = require('../controllers/lessonController');

router.post('/',protect,createLesson);

router.get('/',protect,getActiveLessons);

module.exports = router;