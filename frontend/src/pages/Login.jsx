import { useState , useContext } from "react";
import axios from "axios";
import {AuthContext} from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Login(){
    const {login} = useContext(AuthContext);
    const navigate = useNavigate();
    const [formData , setFormData] = useState({email:"",password:""});
    const [ error , setError] = useState("");

    const handleChange = (e) => {
        setFormData({...formData,[e.target.name]:e.target.value});
    };

    const handleSubmit = async(e) =>{
        e.preventDefault();
        setError("");

        try{
            const res = await axios.post("http://localhost:5000/api/auth/login",formData);

            login(res.data.token , res.data.user);

            navigate("/profile");
        } catch (err){
            setError(err.response?.data?.message || "Login");
        }
    };

    return (
        <div>
            <h2>Login</h2>
            {error && <p style={{color : "red"}}>{error}</p>}
            
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />

                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;