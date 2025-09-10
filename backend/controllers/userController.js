const User = require ("../models/User");

// Get another user's profile by ID (public)
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password") 
      .populate("followers", "username profilePic"); // keep it light

    if (!user) {
      return res.status(404).json({ message: "User not Found" });
    }

    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      bio: user.bio,
      profilePic: user.profilePic,
      followers: user.followers,
      badges: user.badges,
      perks: user.perks,
      points: user.points,
      streak: user.streak,
      createdAt: user.createdAt,
    });
  } catch (err) {
    console.error("fetchUser Error:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get logged-in user's own profile
const getMyProfile = async (req,res) =>{
  try{
    const user = await User.findById(req.user._id)
    .select("-password")
    .populate("followers","username profilePic")
    .populate("following","username profilePic")
    .populate("completedLessons","title description thumbnail")
    .populate({
      path:"submissions",
      select:"image votes createdAt",
      populate:{
        path:"challenge",
        select:"title deadline",
      },
    });

    if(!user){
      return res.status(404).json({message:"User Not Found"});
    }

    res.status(200).json(user);
  } catch(err){
    console.error("getMyProfile Error:",err.message);
    res.status(500).json({message:"Server Error"});
  }
};

// Upload profile picture
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

module.exports = {
  getUserProfile,
  getMyProfile,
  toggleFollowUser,
  updateProfile,
  uploadProfilePic,
};
