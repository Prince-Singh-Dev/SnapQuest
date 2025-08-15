const asyncHandler = require('express-async-handler');

const admin = asyncHandler((req,res,next)=>{
    if(req.user && req.user.isAdmin){
        next();
    } else {
        res.status(403);
        throw new Error('Admin Access Only');
    }
});

module.exports = {admin};