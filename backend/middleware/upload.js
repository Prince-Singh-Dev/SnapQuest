const multer = require('multer');
const path = require('path');

// Logic to store the image of profile

const storage = multer.diskStorage({
    destination(req,file,cb){
        cb(null,'uploads/profilePics/');
    },
    filename(req,file,cb){
        cb(null , `${req.user._id}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

//checking the file type of image uploaded by the user

const fileFilter = (req,file,cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if(extname && mimetype){
        return cb(null,true);
    } else{
        cb('Only .png , .jpg and .jpeg format are allowed !');
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits:{fileSize : 1024*1024*2},  //2 MB limit for profile pics
});

module.exports = upload;