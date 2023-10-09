import React, { useState } from 'react'
import { auth } from '../firebase'
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

export default function Login() {

    const [error, setError] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handdleLogin = (e) => {
        e.preventDefault();

        setError("");
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log(user);
                navigate('/')
            }).catch((error) => {
                setError(error.code + ' ' + error.message);
            });
    }

    return (
        <div>
            <form onSubmit={handdleLogin}>
                <input type="email" placeholder="Correo" onChange={e => setEmail(e.target.value)} />
                <input type="password" placeholder="Contraseña" onChange={e => setPassword(e.target.value)} />

                <button type="submit">Iniciar</button>
                {error && <span>Error en la contraseña o correo</span>}
            </form>
        </div>
    )
}





