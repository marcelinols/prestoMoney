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
import { collection, addDoc, getFirestore } from 'firebase/firestore';

//hook
import { useDispatch, useSelector } from 'react-redux';
import { addInvestment } from '../hook/actions';

export default function Inversiones() {

    const list_users = useSelector((state) => state.users);
    const list_investment = useSelector((state) => state.inversiones);

    const [inversion, setInversion] = React.useState(0.0);
    const [show, setShow] = React.useState(false); 
    const [error, setError] = React.useState(false)
    const [msgError, setMsgError] = React.useState('');

    const [idUser, setIdUser] = React.useState('');
    const [user, setUser] = React.useState('');
    const [amount, setAmount] = React.useState(0.0); 

    const db = getFirestore(app);
    const dispatch = useDispatch();

    const all_inversiones = () => {
        setInversion(suma(list_investment));
        console.log(list_investment);
    }

    const clean = () => {
        setIdUser('')
        setUser('')
        setAmount(0) 
    }

    const add_inversion = async (e) => {
        e.preventDefault();
        if (idUser == '') {
            setError(true);
            setMsgError('Seleccione una Persona')
        } else if (parseFloat(amount) <= 0) {
            setError(true);
            setMsgError('El monto debe ser mayor a 0')
        } else {
            try {

                const fecha = new Date();
                const today = fecha.getFullYear() + '-' + (fecha.getMonth() + 1) + '-' + fecha.getDate();

                const data = {
                    amount: parseFloat(amount),
                    available: true,
                    created_at: today,
                    status: true,
                    rendimiento: 0,
                    uid: idUser,
                    user: {
                        username: user
                    }
                }
                const docRef = await addDoc(collection(db, "inversiones"), data);
                dispatch(addInvestment({
                    id: docRef.id,
                    amount: parseFloat(amount),
                    available: true,
                    created_at: today,
                    status: true,
                    rendimiento: 0,
                    uid: idUser,
                    user: {
                        username: user
                    }
                }));
                clean();
                all_inversiones();
                setShow(false);
                console.log("Document written with ID: ", docRef.id);
            } catch (e) {
                console.log("error in creating inversion", e)
            }
        }
    }

    React.useEffect(() => {
        all_inversiones(); 
    }, [list_investment])


    return (
        <>
            <Navbars />
            <Container className="d-flex align-items-center justify-content-center">
                <div className="w-100 screen">
                    <div className="card-total text-center p-3">
                        <h6 className="fw-bolder in" style={{ color: '#b2c3eb' }}>Monto Ahorrado</h6>
                        <h1 className="text-center m-3">{format(inversion)}</h1>

                        <Fab className='btn-add' variant="extended" color="primary" aria-label="add" onClick={() => { setShow(true); }}>
                            <AddIcon />
                            Agregar
                        </Fab>
                    </div>
                    <div className='history'>
                        <ListGroup as="ol" className="m-2">
                            {
                                list_investment.map((dato) =>

                                    <ListGroup.Item key={dato.id} as="li"
                                        className=" justify-content-between align-items-start">

                                        <Row>
                                            <Col xs={2} md={2} >
                                                <Avatar alt={dato.user.username}  {...stringAvatar(dato.user.username)} />
                                            </Col>
                                            <Col xs={6} md={7}>
                                                <div className="fw-bold">{dato.user.username}</div>
                                                {dato.created_at}
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
                    <Modal.Title >Agregar Ahorro</Modal.Title>
                </Modal.Header>
                <Form onSubmit={add_inversion}>
                    <Modal.Body className='text-center'>
                        <Form.Label htmlFor="users" className='label '><h4> Personas</h4></Form.Label>
                        <Form.Select id="users" onChange={e => { setIdUser(e.target.value); setUser(e.target.options[e.target.selectedIndex].text) }}>
                            <option value={0}>Seleccionar...</option>
                            {
                                list_users.map((dt) =>
                                    <option key={dt.id} value={dt.id}>{dt.username}</option>
                                )
                            }
                        </Form.Select> 
                        <div className='text-center'>
                            <Form.Label className='label' htmlFor="amount"><h4>Monto</h4></Form.Label>
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
