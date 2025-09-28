const express = require('express');
const router = express.Router();
const {protect} = require('../middleware/authMiddleware');
const {admin} = require('../controllers/challengeController');
const { completeChallenge } = require('../controllers/challengeController');

const { submitToChallenge , getChallengeSubmissions , getUserSubmissions , voteSubmission} = require('../controllers/submissionController');
const multer = require('multer');

const storage = multer.diskStorage({
    destination : function (req,file,cb){
        cb(null , 'uploads/submissions');
    },
    filename:function(req,file,cb){
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null,uniqueSuffix + '-' + file.originalname);
    }
});
const upload = multer({storage});

// For Admin : Complete Challenge
router.put('/:id/complete',protect,admin,completeChallenge);

// for User routes

router.post('/:challengeId/submit',protect,upload.single('photo'),submitToChallenge);

router.get('/:challengeId/submissions',protect,getChallengeSubmissions);

router.post('/submission/:submissionId/vote',protect,voteSubmission);

router.get('/my-submissions',protect,getUserSubmissions);

module.exports = router;