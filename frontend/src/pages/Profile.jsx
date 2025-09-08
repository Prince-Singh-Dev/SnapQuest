import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Profile.css";

function Profile() {
  const { user, token, logout } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
      } catch (err) {
        console.error("Error fetching profile:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchProfile();
    else navigate("/login");
  }, [token, navigate]);

  if (loading) return <p className="loading">Loading profile...</p>;

  if (!profile) return <p className="error">Profile not found</p>;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <img
          src={
            profile.profilePic
              ? `http://localhost:5000${profile.profilePic}`
              : "https://via.placeholder.com/150"
          }
          alt="Profile"
          className="profile-pic"
        />
        <h2>{profile.username}</h2>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Bio:</strong> {profile.bio || "No bio added yet."}</p>
        <p><strong>Followers:</strong> {profile.followers?.length || 0}</p>

        <div className="actions">
          <button onClick={() => navigate("/edit-profile")}>Edit Profile</button>
          <button onClick={logout} className="logout-btn">Logout</button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
