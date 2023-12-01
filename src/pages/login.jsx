import React, { useEffect, useState } from 'react'
import { auth } from '../firebase'
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Form, Alert, Container, Image } from 'react-bootstrap';
import '../asset/style/login.css';
import logo from '../asset/images/prestoMoney.jpeg'
import { useDispatch } from 'react-redux';


export default function Login() {

    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [validated, setValidated] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState(""); 
    const navigate = useNavigate();

    const { currentUser } = useAuth(); 

    const dispatch = useDispatch();

    const handdleLogin = (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;   
                console.log(user)
                dispatch({ type: 'id_user', payload: user.uid })
                navigate('/')
            }).catch((error) => {
                setError(error.code + ' ' + error.message);
            });
        setLoading(false);
    }

    useEffect(() => {
        if (currentUser) {
            navigate("/")
        } 
    }, []);

    return (
        <Container className="d-flex align-items-center justify-content-center"
            style={{ minHeight: "90vh" }}>

            <div className="w-100 screen m-3 p-3 border-0 card pb-4 pb-5" >
                <div className='cards'>
                    <h4 className='text-center text-white fw-bold '>Bienvenidos</h4>
                    <h5 className='text-center text-white mb-4'>Iniciar Sesión</h5>
                </div>
                <div className='text-center mt-2'>
                    <Image src={logo} thumbnail width={120} />
                </div>
                <Form validated={validated} onSubmit={handdleLogin}>
                    <Form.Group className="mb-3 mt-4">
                        <Form.Label className='label'>Correo</Form.Label>
                        <Form.Control required type="email" placeholder="name@example.com" onChange={e => setEmail(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label className='label'>Contraseña</Form.Label>
                        <Form.Control required type="password" placeholder="********" onChange={e => setPassword(e.target.value)} />
                    </Form.Group>
                    <div className="d-grid gap-2 mt-4 ">
                        <button className='btn-login' type="submit" >
                            Iniciar
                        </button>
                    </div>
                    <br></br>
                    {error && <Alert key="danger" variant="danger">Error en la contraseña o correo</Alert>}
                </Form>


            </div>
        </Container>
    )
}





