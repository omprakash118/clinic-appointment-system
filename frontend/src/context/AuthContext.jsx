// Manages the user authentication state and provides global access to user data and login/logout logic.

// Stores things like:
// user object (name, email, role, token)
// isAuthenticated (boolean)
// Functions: login(), logout(), updateUser()

import React , { createContext , useEffect, useState} from "react";

// 1️⃣ Create Context
export const AuthContext = createContext();

// 2️⃣ Create Provider
export const AuthProvider = ({ children }) => {
    const [user , setUser] = useState(null); // Store user info
    const [ isAuthenticated , setIsAuthenticated] = useState(false);

    // Load user from localStorage (for persistence)
    useEffect(() => {
        const storedUser = localStorage.getItem("clinic_user");
        if(storedUser){
            setUser(JSON.parse(storedUser));
            setIsAuthenticated(true);
        }
    }, []); 

    // Function to log in 
    const login = (userData) => {
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem("clinic_user", JSON.stringify(userData));
    };

    // Function to log out
    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem("clinic_user");
    };

    return (
        <AuthContext.Provider value={{user, isAuthenticated, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};