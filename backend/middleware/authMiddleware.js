const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

const protect = asyncHandler (async (req,res,next) => {
  let token;

  if(
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      //Getting token from header
      token = req.headers.authorization.split(' ')[1];

      //Verifying tokens
      const decoded = jwt.verify(token,process.env.JWT_SECRET);

      //Get user from the token (excluding the paaswords)
      req.user = await User.findById(decoded.id).select('-password');

      if(!req.user){
        req.status(401);
        throw new Error('User Not Found');
      }
      next();
    } catch (error){
      console.error(error);
      res.status(401);
      throw new Error('Not authorized , token failed');
    }
  }

  if(!token){
    res.status(401);
    throw new Error('Not Authorized , no Token');
  }
});

module.exports = {protect};