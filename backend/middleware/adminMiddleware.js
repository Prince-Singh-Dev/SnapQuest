const admin = (req,res,next)=>{
    if(req.user && req.user.isAdmin){
        next();
    } else{
        re.status(403).json({
            message:'Acess Denied : Admin Privileges required'
        });
    }
};

module.exports = {admin};