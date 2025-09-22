import { useEffect , useState , useContext } from "react";
import { useParams , Link, useNavigate } from "react-router-dom";  
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import "./Profile.css";

function FollowersList(){
    const {id} = useParams();
    const {token} = useContext(AuthContext);
    const [followers , setFollowers] = useState([]);
    const [loading , setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFollowers = async() => {
            try{
                const res = await axios.get(`http://localhost:5000/api/users/${id}`,{
                    headers : {Authorization : `Bearer ${token}`},
                });
                setFollowers(res.data.followers || []);
            } catch(err){
                console.error("Followers fetch error :", err.response?.data || err.message);
            } finally {
                setLoading(false);
            }
        };

        if(token) fetchFollowers();
    },[id,token]);

    if(loading) return <p> Loading followers .... </p>;

    return (
        <div className="profile-followers full-list">
            <button className="back-btn" onClick={() => navigate(-1)}> ⬅ Back to Profile</button>
            <h2>Followers</h2>
            {followers.length > 0 ? (
                <ul>
                    {followers.map((f) => (
                        <li key={f._id}>
                            <Link to={`/user/${f._id}`} className="follower-link">
                                <img
                                    src = {f.profilePic || "/default-avatar.png"}
                                    alt={f.username}
                                    className="small-avatar"
                                />
                                {f.username}
                            </Link>
                        </li>
                    ))}
                </ul>
            ):(
                <p>No Followers Yet ... </p>
            )}
        </div>
    );
}

export default FollowersList;