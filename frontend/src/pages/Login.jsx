import {useState , useContext} from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import "./Auth.css";

function Login(){
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const {login} = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = async(e) => {
        e.preventDefault();
        try{
            const res = await axios.post("/api/users/login" , {email,password});
            login(res.data.user , res.data.token);
            navigate("/profile");
        } catch(err){
            alert("Invalid email pr password");
        }
    };

    return(
        <div className="auth-container">
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input 
                    type="passowrd"
                    placeholder = "Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;