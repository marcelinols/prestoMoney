import React, { useEffect, useState } from 'react'
import { app, auth } from '../firebase'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Form, Alert, Container, Image } from 'react-bootstrap';
import '../asset/style/login.css';
import logo from '../asset/images/prestoMoney.jpeg'
import { useDispatch } from 'react-redux';
import { collection, doc, getDocs, getFirestore, query, updateDoc, where } from 'firebase/firestore';


export default function Register() {

    const [error, setError] = useState(false);
    const [validated, setValidated] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordconf, setPasswordconf] = useState("");
    const [msg, setMsg] = useState("");

    const navigate = useNavigate();

    const { currentUser, updateCurrentUser } = useAuth();

    const dispatch = useDispatch();
    const db = getFirestore(app);

    const handdleRegister = async (e) => {
        e.preventDefault();

        setError(false);
        if (password === passwordconf) {

            const userRef = collection(db, "users");
            const datos = query(userRef, where("email", "==", email));

            await getDocs(datos)
                .then((querySnapshot) => {
                    const data = querySnapshot.docs.map(
                        (doc) => (
                            { ...doc.data(), id: doc.id }
                        ));
                    if (Object.values(data).length > 0) {

                        createUserWithEmailAndPassword(auth, email, password)
                            .then((userCredential) => {
                                // Signed up 
                                const user = userCredential.user;

                                const updUser = doc(db, "users", data[0].id);
                                updateDoc(updUser, {
                                    uid: user.uid
                                });

                                dispatch({ type: 'uid', payload: data[0].id })
                                dispatch({ type: 'id_user', payload: user.uid })
                                navigate('/')
                            })
                            .catch((error) => {
                                const errorCode = error.code;
                                const errorMessage = error.message;
                                // ..
                            });
                    } else {
                        setError(true)
                        setMsg("No se ha dado de alta la cuenta!");
                    }
                });
        } else {
            setError(true)
            setMsg("Las Contraseñas no coinciden");
        }

    }


    useEffect(() => {
        if (currentUser && Object.values(currentUser).length > 0) {
            navigate("/")
        }
    }, [currentUser]);

    return (
        <Container className="d-flex align-items-center justify-content-center"
            style={{ minHeight: "90vh" }}>

            <div className="w-100 screen m-3 p-3 border-0 card pb-4 pb-5" >
                <div className='cards'>
                    <h4 className='text-center text-white fw-bold '>ARKA</h4>
                    <h5 className='text-center text-white mb-4'>Crear Cuenta</h5>
                </div>
                <div className='text-center mt-2'>
                    <Image src={logo} thumbnail width={120} />
                </div>
                <Form validated={validated} onSubmit={handdleRegister}>
                    <Form.Group className="mb-3 mt-4">
                        <Form.Label className='label'>Correo</Form.Label>
                        <Form.Control required type="email" placeholder="name@example.com" onChange={e => setEmail(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label className='label'>Contraseña</Form.Label>
                        <Form.Control required type="password" placeholder="********" onChange={e => setPassword(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label className='label'>Confirma Contraseña</Form.Label>
                        <Form.Control required type="password" placeholder="********" onChange={e => setPasswordconf(e.target.value)} />
                    </Form.Group>
                    <div className="d-grid gap-2 mt-4 ">
                        <button className='btn-login' type="submit" >
                            Registrarse
                        </button>
                        <small className='text-center'>Iniciar Sesión <a href="login"><b>Aqui</b></a></small>
                    </div>
                    <br></br>
                    {error && <Alert key="danger" variant="danger">{msg}</Alert>}
                </Form>


            </div>
        </Container>
    )
}





