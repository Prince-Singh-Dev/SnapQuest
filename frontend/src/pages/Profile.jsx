import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import "./Profile.css";

function Profile() {
  const { user, token, logout } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
      } catch (err) {
        console.error("Profile fetch error:", err.response?.data || err.message);
        if (err.response?.status === 401) logout();
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, logout]);

  if (loading) return <p>Loading profile...</p>;
  if (!profile) return <p>No profile data found.</p>;

  return (
    <div className="profile-container">
      {/* === USER INFO === */}
      <div className="profile-header">
        <img
          src={profile.profilePic || "/default-avatar.png"}
          alt="Profile"
          className="profile-pic"
        />
        <div>
          <h2>{profile.username}</h2>
          <p>{profile.email}</p>
          <p>{profile.bio || "No bio yet."}</p>
        </div>
      </div>

      {/* === STATS === */}
      <div className="profile-stats">
        <p><b>Followers:</b> {profile.followers?.length || 0}</p>
        <p><b>Following:</b> {profile.following?.length || 0}</p>
        <p><b>Badges:</b> {profile.badges?.length || 0}</p>
        <p><b>Perks:</b> {profile.perks || 0}</p>
        <p><b>Streak:</b> {profile.streak || 0} 🔥</p>
      </div>

      {/* === FOLLOWERS LIST === */}
      <div className="profile-followers">
        <h3>Followers</h3>
        {profile.followers?.length > 0 ? (
          <ul>
            {profile.followers.map((f) => (
              <li key={f._id}>
                <img
                  src={f.profilePic || "/default-avatar.png"}
                  alt={f.username}
                  className="small-avatar"
                />
                {f.username}
              </li>
            ))}
          </ul>
        ) : (
          <p>No followers yet.</p>
        )}
      </div>

      {/* === FOLLOWING LIST === */}
      <div className="profile-following">
        <h3>Following</h3>
        {profile.following?.length > 0 ? (
          <ul>
            {profile.following.map((f) => (
              <li key={f._id}>
                <img
                  src={f.profilePic || "/default-avatar.png"}
                  alt={f.username}
                  className="small-avatar"
                />
                {f.username}
              </li>
            ))}
          </ul>
        ) : (
          <p>Not following anyone yet.</p>
        )}
      </div>

      {/* === COMPLETED LESSONS === */}
      <div className="profile-lessons">
        <h3>Completed Lessons</h3>
        {profile.completedLessons?.length > 0 ? (
          <div className="lesson-grid">
            {profile.completedLessons.map((lesson) => (
              <div className="lesson-card" key={lesson._id}>
                <img src={lesson.thumbnail || "/lesson-placeholder.png"} alt={lesson.title} />
                <h4>{lesson.title}</h4>
                <p>{lesson.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No lessons completed yet.</p>
        )}
      </div>

      {/* === SUBMISSIONS === */}
      <div className="profile-submissions">
        <h3>Challenge Submissions</h3>
        {profile.submissions?.length > 0 ? (
          <div className="submission-grid">
            {profile.submissions.map((sub) => (
              <div className="submission-card" key={sub._id}>
                <img src={sub.image || "/submission-placeholder.png"} alt="submission" />
                <p>Votes: {sub.votes}</p>
                <p>
                  Challenge: {sub.challenge?.title || "Unknown"} <br />
                  Deadline: {sub.challenge?.deadline || "N/A"}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p>No submissions yet.</p>
        )}
      </div>
    </div>
  );
}

export default Profile;
