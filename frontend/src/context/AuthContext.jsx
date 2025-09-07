import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token") || null);

    useEffect(() => {
        if (token) {
            fetch("http://localhost:5000/api/auth/me", {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => res.json())
            .then((data) => {
                if (!data.error) setUser(data);
                else {
                    setToken(null);
                    localStorage.removeItem("token");
                }
            });
        }
    }, [token]);

    const login = (token, userData) => {
        setToken(token);
        setUser(userData);
        localStorage.setItem("token", token);
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("token");
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
