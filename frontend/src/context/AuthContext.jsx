import { createContext , useState , useEffect } from "react";

// Ceating Context 
export const AuthContext = createContext();

// Provider Component
export const AuthProvider = ({ children }) => {
    const [user,setUser] = useState(null); //Storing Logged in Users only
    const [token , seToken] = useState(localStorage.getItem("token") || null );

    useEffect(() => {
        if(token){
            fetch("/api/auth/me",{
                headers : {Authorization : `Bearer ${token}`},
            })
            .then((res) => res.json())
            .then((data) => {
                if(!data.error) setUser(data);
                else{
                    setToken(null);
                    localStorage.removeItem("token");
                }
            });
        }
    },[token]);

    const login = (token,userData) => {
        setToken(token);
        setUser(userData);
        localStorage.setItem("token",token);
    };

    const logout = () =>{
        setToken(null);
        setUser(null);
        localStorage.removeItem("token");
    };

    return(
        <AuthContext.Provider value={{user,token,login,logout}}>
            {children}
        </AuthContext.Provider>
    );
};