import { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import "./Profile.css";

function UserProfile() {
  const { id } = useParams();
  const { token, user: loggedInUser } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);

        // Check if logged-in user is following this profile
        if (res.data.followers.some((f) => f._id === loggedInUser._id)) {
          setIsFollowing(true);
        } else {
          setIsFollowing(false);
        }
      } catch (err) {
        console.error("User fetch error:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchUser();
  }, [id, token, loggedInUser]);

  const handleFollowToggle = async () => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/users/${id}/follow`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setIsFollowing(!isFollowing);

      // Update followers list without refetching
      setUser((prev) => ({
        ...prev,
        followers: isFollowing
          ? prev.followers.filter((f) => f._id !== loggedInUser._id)
          : [...prev.followers, { _id: loggedInUser._id, username: loggedInUser.username, profilePic: loggedInUser.profilePic }],
      }));
    } catch (err) {
      console.error("Follow toggle error:", err.response?.data || err.message);
    }
  };

  if (loading) return <p>Loading user profile...</p>;
  if (!user) return <p>User not found.</p>;

  return (
    <div className="profile-container">
      {/* === USER INFO === */}
      <div className="profile-header">
        <img
          src={user.profilePic || "/default-avatar.png"}
          alt="Profile"
          className="profile-pic"
        />
        <div>
          <h2>{user.username}</h2>
          <p>{user.email}</p>
          <p>{user.bio || "No bio yet."}</p>

          {/* === FOLLOW/UNFOLLOW BUTTON === */}
          {loggedInUser._id !== user._id && (
            <button onClick={handleFollowToggle} className="follow-btn">
              {isFollowing ? "Unfollow" : "Follow"}
            </button>
          )}
        </div>
      </div>

      {/* === STATS === */}
      <div className="profile-stats">
        <p>
          <b>Followers :</b>{" "}
          <Link to={`/user/${user._id}/followers`}>
            {user.followers?.length || 0}
          </Link>
        </p>

        <p>
          <b>Following:</b>{" "}
          <Link to={`/user/${user._id}/following`}>
            {user.following?.length || 0}
          </Link>
        </p>

        <p><b>Badges:</b> {user.badges?.length || 0}</p>
        <p><b>Points:</b> {user.points}</p>
        <p><b>Perks:</b> {user.perks}</p>
        <p><b>Streak:</b> {user.streak} 🔥</p>
      </div>

      {/* === FOLLOWERS LIST === */}
      <div className="profile-followers">
        <h3>Followers</h3>
        {user.followers?.length > 0 ? (
          <ul>
            {user.followers.map((f) => (
              <li key={f._id}>
                <Link to={`/user/${f._id}`} className="follower-link">
                  <img
                    src={f.profilePic || "/default-avatar.png"}
                    alt={f.username}
                    className="small-avatar"
                  />
                  {f.username}
                </Link>
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
        {user.following?.length > 0 ? (
          <ul>
            {user.following.map((f) => (
              <li key={f._id}>
                <Link to={`/user/${f._id}`} className="following-link">
                  <img
                    src={f.profilePic || "/default-avatar.png"}
                    alt={f.username}
                    className="small-avatar"
                  />
                  {f.username}
                </Link>
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
        {user.completedLessons?.length > 0 ? (
          <div className="lesson-grid">
            {user.completedLessons.map((lesson) => (
              <div className="lesson-card" key={lesson._id}>
                <img src={lesson.thumbnail} alt={lesson.title} />
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
        {user.submissions?.length > 0 ? (
          <div className="submission-grid">
            {user.submissions.map((sub) => (
              <div className="submission-card" key={sub._id}>
                <img src={sub.image} alt="submission" />
                <p>Votes: {sub.votes}</p>
                <p>
                  Challenge: {sub.challenge?.title} <br />
                  Deadline: {sub.challenge?.deadline}
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

export default UserProfile;
