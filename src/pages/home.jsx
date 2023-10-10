import React, { useState, useEffect } from "react";
import { collection, getDocs, query, collectionGroup } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";


export default function Home() {

    const [todos, setTodos] = useState([]);
    const [total, setTotal] = useState(0);
    const { currentUser, logout } = useAuth();



    const fetchPost = async () => {

        /*await getDocs(collection(db, "prestamos"))
            .then((querySnapshot) => {
                const newData = querySnapshot.docs.map(
                    (doc) => (
                        { ...doc.data(), id: doc.id }
                    ));
                setTodos(newData);
                console.log(todos);
            });

        const museums = query(collectionGroup(db, 'pays'));
        const querySnapshot = await getDocs(museums);
        querySnapshot.forEach((doc) => {
            console.log(doc.id, ' => ', doc.data());
        });*/

    }

    const logOut = () => {
        logout();
    }

    useEffect(() => {
        console.log("")
    }, [])

    return (
        <div>
            <h1>Hello from Home´s PrestoMoney</h1>
            <p>{currentUser.email}</p>
            <button onClick={logOut}>salir</button>
        </div>
    )
}
