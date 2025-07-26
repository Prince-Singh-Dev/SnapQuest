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

module.exports = {
    getUserProfile,
    toggleFollowUser,
    getMyProfile,
};