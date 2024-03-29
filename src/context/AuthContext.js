import React, { createContext, useContext, useEffect } from "react";
import { auth } from "../firebase"
import { onAuthStateChanged, signOut } from 'firebase/auth'

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {

    const [currentUser, setCurrentUser] = React.useState({});
    const [admin, setAdmin] = React.useState(1);
    const [username, setUsername] = React.useState('')
    const [email, setEmail] = React.useState('')
    const [avatar, setAvatar] = React.useState('')

    function logout() {
        signOut(auth)
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user) 
        })
        return unsubscribe 
    }, []) 

    return (
        <AuthContext.Provider value={{
            currentUser, logout, admin, username, avatar, email
        }}>
            {children}
        </AuthContext.Provider>
    )
}
