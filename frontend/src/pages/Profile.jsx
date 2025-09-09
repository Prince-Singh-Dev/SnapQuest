import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const Profile = () => {
  const { user, token, setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (token) {
      fetch("http://localhost:5000/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          setProfile(data);
          setUser(data); // keep context updated
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [token, setUser]);

  if (loading) return <p className="text-center mt-5">Loading profile...</p>;

  if (!profile) return <p className="text-center mt-5">No profile found.</p>;

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-2xl p-6 mt-10">
      {/* Profile Header */}
      <div className="flex items-center gap-6">
        <img
          src={
            profile.profilePic
              ? `http://localhost:5000${profile.profilePic}`
              : "/default-avatar.png"
          }
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover border"
        />
        <div>
          <h1 className="text-2xl font-bold">{profile.username}</h1>
          <p className="text-gray-600">{profile.email}</p>
          <p className="mt-1 text-gray-700 italic">{profile.bio || "No bio yet"}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mt-6 text-center">
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-xl font-bold">{profile.followers?.length || 0}</h2>
          <p className="text-gray-600">Followers</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-xl font-bold">{profile.points || 0}</h2>
          <p className="text-gray-600">Points</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-xl font-bold">{profile.perks || 0}</h2>
          <p className="text-gray-600">Perks</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-xl font-bold">{profile.streak || 0}</h2>
          <p className="text-gray-600">Streak</p>
        </div>
      </div>

      {/* Badges */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Badges</h2>
        {profile.badges?.length > 0 ? (
          <div className="flex gap-2 flex-wrap">
            {profile.badges.map((badge, idx) => (
              <span
                key={idx}
                className="bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full text-sm"
              >
                {badge}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No badges earned yet.</p>
        )}
      </div>

      {/* Admin Flag */}
      {profile.isAdmin && (
        <div className="mt-6">
          <span className="px-3 py-1 bg-red-200 text-red-800 rounded-full text-sm">
            Admin
          </span>
        </div>
      )}
    </div>
  );
};

export default Profile;
