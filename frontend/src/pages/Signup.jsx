import { useState,useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import "./Auth.css";

function Signup(){
    const [name , setName] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const {login} = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSignup = async(e) =>{
        e.preventDefault();
        try{
            const res = await axios.post("/api/users/signup",{
                name,
                email,
                password,
            });

            // Immediately login the user after the signup
            login(res.data.user , res.data.token);

            //Redirecting to profile
            navigate("/profile");
        } catch(err){
            alert("SignUp Failed . Try Again with a different email.");
        }
    };

    return(
        <div className="auth-container">
            <h1>Sign Up</h1>
            <form onSubmit={handleSignup}>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e)=>setName(e.target.value)}
                    required
                />

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Password (min 6 chars)"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                    required
                />

                <button type="submit">Create Account</button>
            </form>
        </div>
    );
}

export default Signup;

// How this works:
// User signs up → axios.post("/api/users/signup") hits backend.
// On success → res.data should include { user, token }.
// We call login(res.data.user, res.data.token) from AuthContext.
// That stores user + token in localStorage and updates context.
// Navigate to /profile immediately.