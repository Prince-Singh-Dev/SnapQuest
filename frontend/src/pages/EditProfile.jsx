import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./EditProfile.css";

function EditProfile() {
  const { token, user, setUser } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setBio(user.bio || "");
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Update username & bio
      const res = await axios.put(
        "http://localhost:5000/api/users/update",
        { username, bio },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUser(res.data); // Update AuthContext with new user info
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleUploadProfilePic = async (e) => {
    e.preventDefault();
    if (!profilePic) return alert("Please select an image");

    const formData = new FormData();
    formData.append("profilePic", profilePic);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/profile/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUser(res.data); // update AuthContext
      alert("Profile picture updated!");
    } catch (err) {
      console.error(err);
      alert("Failed to upload profile picture");
    }
  };

  return (
    <div className="edit-profile-container">
      <form className="edit-profile-form" onSubmit={handleUpdateProfile}>
        <h2>Edit Profile</h2>

        <label>Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label>Bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        ></textarea>

        <button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>

      <form className="upload-pic-form" onSubmit={handleUploadProfilePic}>
        <h2>Update Profile Picture</h2>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setProfilePic(e.target.files[0])}
        />
        <button type="submit">Upload Picture</button>
      </form>

      <button className="back-btn" onClick={() => navigate("/profile")}>
        Back to Profile
      </button>
    </div>
  );
}

export default EditProfile;
