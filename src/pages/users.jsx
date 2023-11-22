import React from 'react'
import Navbars from "../components/navbar";
import '../asset/style/users.css'
import { Col, Container, Form, ListGroup, Modal, Row } from 'react-bootstrap';
import { Avatar } from '@mui/material';
import { stringAvatar } from '../utils/funtions'
import { app } from '../firebase'
import { getFirestore, collection, getDocs, addDoc } from 'firebase/firestore';
import { useDispatch, useSelector } from 'react-redux';
import { addUser } from '../hook/actions';

export default function Users() {

    const list_users = useSelector(status => status.users)

    const [show, setShow] = React.useState(false); 
    const [nombre, setNombre] = React.useState("");
    const [apellido, setApellido] = React.useState("");
    const [correo, setCorreo] = React.useState("");
    const [telefono, setTelefono] = React.useState("");

    const db = getFirestore(app);
    const dispatch = useDispatch();

    const handleUser = async (e) => {
        e.preventDefault();
        try {
            const data = {
                username: nombre + " " + apellido,
                email: correo,
                phone: telefono,
                status: true,
                avatar: "null",
                uid: "-"
            };

            const docRef = await addDoc(collection(db, "users"), data);
            console.log("Document written with ID: ", docRef.id);
            dispatch(addUser(data))
            setShow(false);
            setNombre("")
            setApellido("")
            setCorreo("")
            setTelefono("")
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }



    return (
        <>
            <Navbars />
            <Container className="d-flex align-items-center justify-content-center">
                <div className="w-100 screen">
                    <div className='history'>
                        <button className="btn-new" onClick={() => { setShow(true) }}> Nuevo </button>
                        <ListGroup as="ol" className="m-2">
                            {
                                list_users.map((dato) =>
                                    <ListGroup.Item key={dato.id} as="li"
                                        className=" justify-content-between align-items-start">
                                        <Row>
                                            <Col xs={2} md={2} >
                                                <Avatar alt={dato.username}  {...stringAvatar(dato.username)} />
                                            </Col>
                                            <Col xs={10} md={10}>
                                                <div className="fw-bold">{dato.username}</div>
                                                {dato.email + " - " + dato.phone}
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                )}
                        </ListGroup>
                    </div>
                </div>
            </Container>

            <Modal
                size='sm'
                show={show}
                onHide={() => { setShow(false) }}
                backdrop="static"
                keyboard={false}
                aria-labelledby="contained-modal-title-vcenter"
                centered >
                <Modal.Header closeButton>
                    <Modal.Title className='h5'>Agregar Usuarios</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleUser}>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label className='label'>Nombre</Form.Label>
                            <Form.Control value={nombre} required type="text" placeholder="Nombre" onChange={e => setNombre(e.target.value)} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label className='label'>Apellidos</Form.Label>
                            <Form.Control value={apellido} required type="text" placeholder="Apellidos" onChange={e => setApellido(e.target.value)} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label className='label'>Correo</Form.Label>
                            <Form.Control value={correo} required type="email" placeholder="Correo" onChange={e => setCorreo(e.target.value)} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label className='label'>Telefono</Form.Label>
                            <Form.Control value={telefono} maxLength={10} type="text" onKeyDown={e => /[\+\-\.\,]$/.test(e.key) && e.preventDefault()} pattern="[0-9]*" placeholder="Telefono" onChange={e => setTelefono(e.target.value)} />
                        </Form.Group>
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
