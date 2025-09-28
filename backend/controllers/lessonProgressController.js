const LessonProgress = require('../models/LessonProgress');
const Lesson = require('../models/Lesson');
const User = require('../models/User');
const multer = require("multer");

// --- Multer Setup for Submissions ---
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/submissions");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// --- Submit a Lesson ---
// POST /api/lessons/:lessonId/submit
// Private
const submitLesson = async (req, res) => {
  const userId = req.user._id;
  const lessonId = req.params.lessonId;

  try {
    // Check lesson existence
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) return res.status(404).json({ message: "Lesson Not Found" });

    // Prevent duplicate submission
    const alreadySubmitted = await LessonProgress.findOne({ user: userId, lesson: lessonId });
    if (alreadySubmitted) return res.status(400).json({ message: "Lesson Already Submitted" });

    // Ensure file is uploaded
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const photoUrl = `/uploads/submissions/${req.file.filename}`;
    const caption = req.body.caption || "";

    // Create submission
    const submission = await LessonProgress.create({
      user: userId,
      lesson: lessonId,
      photoUrl,
      caption,
      isCompleted: true,
    });

    // Update user stats
    const user = await User.findById(userId);
    user.points += lesson.rewardPoints || 10;

    // Update perks for every 50 points
    user.perks = Math.floor(user.points / 50);

    // Badge milestones
    const badgeMilestones = [
      { count: 10, name: 'Rookie' },
      { count: 50, name: 'Skilled' },
      { count: 100, name: 'Pro' },
      { count: 200, name: 'Master' },
    ];

    const completedCount = await LessonProgress.countDocuments({ user: userId, isCompleted: true });

    badgeMilestones.forEach(badge => {
      if (completedCount >= badge.count && !user.badges.includes(badge.name)) {
        user.badges.push(badge.name);
      }
    });

    await user.save();

    res.status(201).json({
      message: 'Lesson Submitted Successfully and rewards updated.',
      submission,
      points: user.points,
      perks: user.perks,
      badges: user.badges
    });

  } catch (err) {
    console.error('Lesson Submission Error:', err.message);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// --- Get User Lesson Progress ---
// GET /api/lessons/progress
// Private
const getUserProgress = async (req, res) => {
  try {
    const progress = await LessonProgress.find({ user: req.user._id })
      .populate('lesson', 'title description taskType rewardPoints');
    res.status(200).json(progress);
  } catch (err) {
    console.error('Get Progress Error:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  submitLesson,
  getUserProgress,
  upload // export multer middleware to use in routes
};
