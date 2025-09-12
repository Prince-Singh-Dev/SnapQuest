const User = require("../models/User");

// ✅ Get another user's profile by ID (public)
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password") // exclude password
      .populate("followers", "username email profilePic")
      .populate("following", "username email profilePic"); // ✅ Added following

    if (!user) {
      return res.status(404).json({ message: "User not Found" });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("fetchUser Error:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Get logged-in user's own profile
const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-password")
      .populate("followers", "username email profilePic")
      .populate("following", "username email profilePic"); // ✅ Added following

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("getMyProfile Error:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// Follow / Unfollow another user
const toggleFollowUser = async(req,res) =>{
  try{
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if(!userToFollow){
      return res.status(404).json({message : "User Not Found"});
    }

    if(userToFollow){
      return res.status(404).json({message:"User not found"});
    }

    if(userToFollow._id.toString() === req.user._id.toString()){
      return res.status(400).json({message:"You cannot follow yorself"});
    }

    const isFollowing = currentUser.following.includes(userToFollow._id);

    if(isFollowing){
      currentUser.following.pull(userToFollow._id);
      userToFollow.followers.pull(currentUser._id);
    } else{
      currentUser.following.push(userToFollow._id);
      userToFollow.followers.push(currentUser._id);
    }

    await currentUser.save();
    await userToFollow.save();

    res.json({
      message:isFollowing ? "Unfollowed Successfully" : "Followed Successfully",
      following : currentUser.following,
      followers:userToFollow.followers,
    });
  } catch(error){
    res.status(500).json({message : "Server Error" , error:error.message});
  }
};


//  Update profile
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not Found" });
    }

    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      bio: updatedUser.bio,
      message: "Profile Updated Successfully",
    });
  } catch (err) {
    console.error("updateProfile Error:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Upload profile picture
const uploadProfilePic = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No File Uploaded" });
    }

    const user = await User.findById(req.user._id);
    user.profilePic = `/uploads/profilePics/${req.file.filename}`;
    await user.save();

    res.status(200).json({
      message: "Profile Picture Uploaded Successfully",
      profilePic: user.profilePic,
    });
  } catch (err) {
    console.error("uploadProfilePic Error:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Export all
module.exports = {
  getUserProfile,
  getMyProfile,
  toggleFollowUser,
  updateProfile,
  uploadProfilePic,
};
