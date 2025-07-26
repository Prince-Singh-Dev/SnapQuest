// Middle for protecting my routes and decode the JWT 

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async(req,resizeBy,next) => {
    let token;

    if(
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ){
        try{
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token,process.env.JWT_SECRET);

            req.user = await User.findById(decoded.id).select('-password');

            next();
        } catch (err) {
            console.error('Auth MiddleWare Error : ', err.message);
            res.status(401).json({message : 'Not Authorized , Token Failed'});
        }
    }

    if(!token){
        return res.status(401).json({ message : 'Not authorized , No token'});
    }
};

module.exports = {protect};