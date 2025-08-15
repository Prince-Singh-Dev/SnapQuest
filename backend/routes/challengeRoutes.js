// challengeRoutes.js SetUp

const express = require('express');
const router = express.Router();
const {protect} = require('../middleware/authMiddleware');
const {admin} = require('../middleware/adminMiddleware');
const {completeChallenge} = require('../controllers/challengeControllers');

//Existing Challenge routes here...

router.put('/:id/complete',protect,admin,completeChallenge);

module.exports = router;