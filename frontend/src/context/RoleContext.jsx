// Handles the user role (admin, doctor, or patient) and helps protect routes and render role-based UI.

// This is useful when you need:

// Role-based routing (like /admin/dashboard)

// Conditional rendering (e.g., only Admin sees "Manage Doctors")

// UI access control

import React , { createContext , useContext} from "react";
import { AuthContext } from "./AuthContext";

export const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const role = user?.role || "guest"; // fallback for not logged in

    const isAdmin = role === "admin";
    const isDoctor = role === "doctor";
    const isPatient = role === "patient";

    return (
        <RoleContext.Provider value={{ role, isAdmin, isDoctor, isPatient }}>
            {children}
        </RoleContext.Provider>
    )
}
