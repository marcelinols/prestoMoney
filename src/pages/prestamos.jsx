import React from 'react'
import { Col, Container, Form, ListGroup, Modal, Row } from 'react-bootstrap';
import Navbars from "../components/navbar";
import { format, stringAvatar, suma } from '../utils/funtions'
import { Avatar } from '@mui/material';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Alert from '@mui/material/Alert';

import '../asset/style/inversiones.css'
import { app } from '../firebase';
import { collection, getDocs, addDoc, getFirestore } from 'firebase/firestore';

//hook
import { useSelector } from 'react-redux';

export default function Prestamos() {

    const list_users = useSelector((state) => state.users);

    const [loan, setLoan] = React.useState(0.0);
    const [show, setShow] = React.useState(false);
    const [loans, setLoans] = React.useState([]);
    const [usuarios, setUsuarios] = React.useState(list_users);
    const [error, setError] = React.useState(false)
    const [msgError, setMsgError] = React.useState('');

    const [idUser, setIdUser] = React.useState('');
    const [user, setUser] = React.useState('');
    const [amount, setAmount] = React.useState(0.0);
    const [porcent, setPorcent] = React.useState(5);
    const [time, setTime] = React.useState(1);


    const db = getFirestore(app);

    const all_user = async () => {

        if (Object.keys(usuarios).length <= 0) {
            await getDocs(collection(db, "users"))
                .then((querySnapshot) => {
                    const newDatas = querySnapshot.docs.map(
                        (doc) => (
                            { ...doc.data(), id: doc.id }
                        ));
                    setUsuarios(newDatas);
                });
        }
    }

    const all_loans = async () => {

        await getDocs(collection(db, "prestamos"))
            .then((querySnapshot) => {
                const data = querySnapshot.docs.map(
                    (doc) => (
                        { ...doc.data(), id: doc.id }
                    ));
                setLoans(data);
                setLoan(suma(data));
            });
    }

    const clean = () => {
        setIdUser()
        setUser('')
        setAmount(0)
        setPorcent(5)
        setTime(1)
    }

    const add_loan = async (e) => {
        e.preventDefault();
        if (idUser == '') {
            setError(true);
            setMsgError('Seleccione una Persona')
        } else if (parseFloat(amount) <= 0) {
            setError(true);
            setMsgError('El monto debe ser mayor a 0')
        } else {
            try {
                const docRef = await addDoc(collection(db, "prestamos"), {
                    amount: parseFloat(amount),
                    available: true,
                    created_at: new Date(),
                    porcent: parseInt(porcent),
                    status: true,
                    time: parseInt(time),
                    uid: /users/ + idUser,
                    user: {
                        username: user
                    }
                });
                clean();
                all_loans();
                setShow(false);
                console.log("Document written with ID: ", docRef.id);
            } catch (e) {
                console.log("error in creating loan", e)
            }
        }
    }

    React.useEffect(() => {
        all_loans();
        all_user();
    }, [])


    return (
        <>
            <Navbars />
            <Container className="d-flex align-items-center justify-content-center">
                <div className="w-100 screen">
                    <div className="card-total text-center p-3">
                        <h6 className="fw-bolder in" style={{ color: '#b2c3eb' }}>Monto Prestamos</h6>
                        <h1 className="text-center m-3">{format(loan)}</h1>

                        <Fab className='btn-add' variant="extended" color="primary" aria-label="add" onClick={() => { setShow(true); }}>
                            <AddIcon />
                            Agregar
                        </Fab>
                    </div>
                    <div className='history'>
                        <ListGroup as="ol" className="m-2">
                            {
                                loans.map((dato) =>

                                    <ListGroup.Item key={dato.id} as="li"
                                        className=" justify-content-between align-items-start">

                                        <Row>
                                            <Col xs={2} md={2} >
                                                <Avatar alt={dato.user.username}  {...stringAvatar(dato.user.username)} />
                                            </Col>
                                            <Col xs={6} md={7}>
                                                <div className="fw-bold">{dato.user.username}</div>
                                                {new Date(dato.created_at.seconds * 1000).toLocaleDateString("es-MX")}
                                            </Col>
                                            <Col xs={4} md={3}>
                                                <p bg="light" text="dark" > {format(dato.amount)} </p>
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                )}
                        </ListGroup>
                    </div>
                </div>
            </Container>
            <Modal
                show={show}
                onHide={() => { setShow(false) }}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title >Agregar Prestamo</Modal.Title>
                </Modal.Header>
                <Form onSubmit={add_loan}>
                    <Modal.Body>
                        <Form.Label htmlFor="users" className='label'>Personas</Form.Label>
                        <Form.Select id="users" onChange={e => { setIdUser(e.target.value); setUser(e.target.options[e.target.selectedIndex].text) }}>
                            <option value={0}>Seleccionar...</option>
                            {
                                usuarios.map((dt) =>
                                    <option key={dt.id} value={dt.id}>{dt.username}</option>
                                )
                            }
                        </Form.Select>
                        <Row>
                            <Col sm={6}>
                                <Form.Label htmlFor="porcent" className='label'>Porcentaje</Form.Label>
                                <Form.Control
                                    type="number"
                                    id="porcent"
                                    aria-describedby="porcentaje"
                                    value={porcent}
                                    onChange={e => setPorcent(e.target.value)}
                                    max={100}
                                    min={0}
                                />
                            </Col>
                            <Col sm={6}>
                                <Form.Label className='label' htmlFor="porcent">Periodo</Form.Label>
                                <Form.Select onChange={e => setTime(e.target.value)}>
                                    <option value={1}>Semanal</option>
                                    <option value={2}>Quincenal</option>
                                    <option value={3}>Mensual</option>
                                </Form.Select>
                            </Col>
                        </Row>
                        <div className='text-center'>
                            <Form.Label className='label' htmlFor="amount">Monto</Form.Label>
                            <Form.Control
                                className='text-center'
                                size="lg"
                                placeholder='Monto'
                                step={0.01}
                                type="number"
                                id="amount"
                                min={1}
                                aria-describedby="Monto"
                                value={amount}
                                onChange={e => setAmount(e.target.value)}
                            />

                        </div>
                        {
                            error && <Alert severity="error" className='mt-2' onClose={() => { setError(false) }}>{msgError}</Alert>
                        }
                    </Modal.Body>
                    <Modal.Footer>
                        <button size='sm' className='btn-default' onClick={() => { setShow(false) }}>
                            Cerrar
                        </button>
                        <button type='submit' className='btn-new' size='sm'>Crear</button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    )
}
