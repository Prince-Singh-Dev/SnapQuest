const User = require('../models/User');

// Getting users profile

const getUserProfile = async (req,res) => {
    try{
        const user = await User.findById(req.params.id)
        .select('-password')  //Excluding the password
        .populate('followers','username email');  //Getting the details of the followers

        if (!user){
            return res.status(404).json({Message : 'User not Found'});
        }

        res.status(200).json(user);
    }   catch(err){
        console.error('fetch User Errors : ',err.message);
        res.status(500).json({message : 'Server Error'});
    }
};

// Fetching logged-in user's own profile
const getMyProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .select('-password')  // Hide password
            .populate('followers', 'username email');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (err) {
        console.error('getMyProfile Error:', err.message);
        res.status(500).json({ message: 'Server Error' });
    }
};


// Logic for following and unfollowing any user 

const toggleFollowUser = async (req , res) => {
    try{
        const targetUser = await User.findById(req.params.id);
        const currentUser = await User.findById(req.user.id);

        if(!targetUser || !currentUser){
            return res.status(404).json({ message : 'User not found'});
        }

        const isFollowing = targetUser.followers.includes(req.user.id);

        if(isFollowing){
            //Unfollow
            targetUser.followers.pull(req.user.id);
        } else{
            //follow
            targetUser.followers.push(req.user.id);
        }

        await targetUser.save();

        res.status(200).json({
            message : isFollowing ? 'Unfollowed user' : 'Followed User',
        });
    } catch (err){
        console.error('follow toggle error : ',err.message);
        res.status(500).json({message : 'Server Error'});
    }
};

// Logic for giving access to the user to update their profile like username , email-id and other things
const updateProfile = async(req,res)=>{
    try{
        const user = await User.findById(req.user._id);

        if(!user){
            return res.status(404).json({message : 'User not Found'});
        }

        //Updating only if values are provided by user
        user.username = req.body.username||user.username;
        user.email = req.body.email || user.email;
        user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;

        const updateUser = await user.save();

        res.status(200).json({
            _id: updateUser.username,
            username : updateUser.username,
            email:updateUser.email,
            bio : updateUser.bio,
            message : 'Profile Updated Successfully',
        });
    } catch(err){
        console.error('updateProfile Error :',err.message);
        res.status(500).json({ message : 'Server Error'});
    }
};

const uploadProfilePic = async (req,res)=>{
    try {
        if(!req.file){
            return res.status(400).json({message : 'No File Uploaded'});
        }

        const user = await User.findById(req.user._id);
        user.profilePic = `/uploads/profilePics/${req.file.filename}`;
        await user.save();

        res.status(200).json({
            message: 'Profile Picture Uploaded Successfully',
            profilePic : user.profilePic
        });
    } catch (err){
        console.error('Upload error:',err.message);
        res.status(500).json({message : 'Server Error'});
    }
};

module.exports = {
    getUserProfile,
    toggleFollowUser,
    getMyProfile,
    updateProfile,
    uploadProfilePic,
};