import {useEffect , useState , useContext} from "react";
import {useParams} from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import "./Profile.css";

function UserProfile(){
    const {id} = useParams();
    const {user,token} = useContext(AuthContext);
    const [profile , setProfile] = useState(null);
    const [loading,setLoading] = useState(true);
    const [isFollowing , setIsFollowing] = useState(false);

    useEffect(()=>{
        if(!token || !id) return;

        const fetchUserProfile = async() => {
            try{
                const res = await axios.get(`http://localhost:5000/api/users/${id}`,{
                    headers:{Authorization : `Bearer ${token}`},
                });

                setProfile(res.data);

                if(res.data.followers?.some((f) => f._id === user._id)){
                    setIsFollowing(true);
                }
            } catch(err){
                console.error("User Profile fetch error : ",err.response?.data || err.message);
            } finally{
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [id,token,user]);

    const handleFollowToggle = async() => {
        try{
            await axios.put(
                `http://localhost:5000/api/users/${id}/follow`,
                {},
                {headers : {Authorization: `Bearer ${token}`}}
            );

            setIsFollowing(!isFollowing);
            setProfile((prev) => ({
                ...prev,
                followers:isFollowing
                    ?prev.followers.filter((f) => f._id !== user._id)
                    : [...prev.followers , {_id:user._id,username:user.username,profilePic:user,profilePic}],
            }));
        } catch(err){
            console.error("follow toggle error : ",err.response?.data || err.message);
        }
    };

    if(loading) return <p>Loading Profile...</p>;
    if(!profile) return <p>User Not Found ...</p>;

    return (
        <div className="profile-container">
            {/* === Users INFO === */}
            <div className="profile-header">
                <img
                    src={profile.profilePic || "/default-avatar.png"}
                    alt="Profile"
                    className="profile-pic"
                />

                <div>
                    <h2>{profile.username}</h2>
                    <p>{profile.email}</p>
                    <p>{profile.bio || "No Bio Yet. "}</p>
                </div>
            </div>

            {/* === Follow / Unfllow Button ===*/}
            {user._id !== profile._id && (
                <button className="follow-btn" onClick={handleFollowToggle}>
                    {isFollowing ? "Unfollow" : "Follow"}
                </button>
            )}

            {/*=== STATS ===*/}
            <div className="profile-stats">
                <p><b>Followers :</b>{profile.followers?.length || 0}</p>
                <p><b>Following :</b>{profile.following?.length || 0}</p>
                <p><b>Badges :</b>{profile.badges?.length || 0}</p>
                <p><b>Streak :</b> {profile.streak || 0} 🔥</p>
            </div>

            {/* === FOLLOWERS LIST ===*/}
            <div className="profile-followers">
                <h3>Followers</h3>
                {profile.followers?.length > 0?(
                    <ul>
                        {profile.followers?.map((f) => (
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
                ):(
                    <p>No Followers Yet !</p>
                )}
            </div>
        </div>
    );
}

export default UserProfile;
