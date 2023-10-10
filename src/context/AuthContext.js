import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase"
import { onAuthStateChanged, signOut } from 'firebase/auth'

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {

    const [currentUser, setCurrentUser] = useState({});

    function logout() {
        signOut(auth)
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user)
            console.log(user)
        })

        return unsubscribe
    }, []) 

    return (
        <AuthContext.Provider value={{
            currentUser, logout
        }}>
            {children}
        </AuthContext.Provider>
    )
}
