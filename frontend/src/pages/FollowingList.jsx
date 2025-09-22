import { useEffect , useState , useContext } from "react";
import { useParams,Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import "./Profile.css";

function FollowingList(){
    const {id} = useParams();
    const {token} = useContext(AuthContext);
    const [following , setFollowing ] =useState([]);
    const [loading , setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFollowing = async() =>{
            try{
                const res = await axios.get(`http://localhost:5000/api/users/${id}`,{
                    headers:{Authorization : `Bearer ${token}`},
                });
                setFollowing(res.data.following || []);
            } catch(err){
                console.error("Following fetch error : ",err.response?.data || err.message);
            } finally{
                setLoading(false);
            }
        };

        if(token) fetchFollowing();
    } , [id,token]);

    if(loading) return <p>Loading Following ... </p>;

    return (
        <div className="profile-following full-list">
            <button className="back-btn" onClick={() => navigate(-1)}>⬅ Back to Profile</button>
            <h2>Following</h2>
            {following.length > 0 ? (
                <ul>
                    {following.map((f) => (
                        <li key={f._id}>
                            <Link to={`/user/${f._id}`} className="following-link">
                                <img
                                    src={f._profilePic || "/default-avatar.png"}
                                    alt={f.username}
                                    className="small-avatar"
                                />
                                {f.username}
                            </Link>
                        </li>
                    ))}
                </ul>
            ):(
                <p> Not following anyone yet ... </p>
            )}
        </div>
    );
}

export default FollowingList;