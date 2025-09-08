import { useEffect , useState , useContext} from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import "./Profile.css";

function Profile(){
    const {token , logout} = useContext(AuthContext);
    const [profile,setProfile] = useState(null);
    const [loading , setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async() => {
            try{
                const res = await axios.get("http://localhost:5000/api/users/profile",{
                    headers : {Authorization : `Bearer ${token}`},
                });
                setProfile(res.data);
            } catch(err){
                console.error("Profile fetch Error : ",err.response?.data || err.message);
                logout();
            } finally{
                setLoading(false);
            }
        };

        if(token) fetchProfile();
    },[token,logout]);

    if(loading) return <h2>Loading Profile ...</h2>;
    if(!profile) return <h2>No profile data found.</h2>;

    return(
        <div className="profile-container">
            <div className="profile-header">
                <img
                    onScroll={profile.profilePic
                        ?`http://localhost:5000/${profile.profilePic}`
                        : "https://via.placeholder.com/150"
                    }
                    alt="Profile"
                    className="profile-pic"
                />
                <h2>{profile.username}</h2>
                <p>{profile.email}</p>
                <p className="bio">{profile.bio || "No Bio Yet."}</p>
            </div>

            <div className="profile-stats">
                <p><strong>Badges:</strong> {profile.badges?.length || 0}</p>
                <p><strong>Points:</strong> {profile.points}</p>
                <p><strong>Perks :</strong> {profile.perks}</p>
                <p><strong>Streak:</strong> {profile.streak} 🔥</p>
            </div>

            <button onClick={logout} className="logout-btn">Logout</button>
        </div>
    );
}

export default Profile;