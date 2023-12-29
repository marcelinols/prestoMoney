import React from 'react'
import { Badge, Col, Container, Form, ListGroup, Modal, Row } from 'react-bootstrap';
import Navbars from "../components/navbar";
import { format, stringAvatar, suma } from '../utils/funtions'
import { Avatar } from '@mui/material';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Alert from '@mui/material/Alert';
import { Link } from 'react-router-dom';


import '../asset/style/inversiones.css'
import { app } from '../firebase';
import { collection, addDoc, getFirestore } from 'firebase/firestore';

//hook
import { useDispatch, useSelector } from 'react-redux';
import { addLoan } from '../hook/actions';

export default function Prestamos() {

    const list_users = useSelector((state) => state.users);
    const list_loans = useSelector((state) => state.prestamos);  
    const tt_available = useSelector((state) => state.tt_investment);

    const [loan, setLoan] = React.useState(0.0);
    const [show, setShow] = React.useState(false);  
    const [error, setError] = React.useState(false)
    const [msgError, setMsgError] = React.useState('');

    const [idUser, setIdUser] = React.useState('');
    const [user, setUser] = React.useState('');
    const [amount, setAmount] = React.useState(0.0); 
    const [interes, setInteres] = React.useState(0);
    const [datePay, setDatePay] = React.useState();
    const [total, setTotal] = React.useState(0);

    const db = getFirestore(app);
    const dispatch = useDispatch(); 

    const all_loans = () => {
        setLoan(suma(list_loans));  
    }

    const clean = () => {
        setIdUser("0")
        setUser("")
        setAmount(0)
        setTotal(0);
        setDatePay()
    }

    const add_loan = async (e) => {
        e.preventDefault();
        if (user === "" || idUser === "0") {
            setError(true);
            setMsgError('Seleccione una Persona')
        } else if (parseFloat(amount) <= 0) {
            setError(true);
            setMsgError('El monto debe ser mayor a 0')
        } else if (parseFloat(tt_available) < parseFloat(amount)) {
            setError(true);
            setMsgError('El monto supera el saldo  disponible de prestamo, solo: $ ' + tt_available.toFixed(2))
        } else {
            try { 
                const fecha = new Date();
                const today = fecha.getFullYear() + '-' + (fecha.getMonth() + 1) + '-' + fecha.getDate();

                const data = {
                    amount: parseFloat(amount),
                    available: true,
                    created_at: today,
                    date_pay: datePay,
                    interes: 0,
                    status: false,
                    uid: idUser,
                    user: {
                        username: user
                    }
                }

                const docRef = await addDoc(collection(db, "prestamos"), data);
                dispatch(addLoan({
                    id: docRef.id,
                    amount: parseFloat(amount),
                    available: true,
                    created_at: today,
                    date_pay: datePay,
                    interes: 0,
                    status: false,
                    uid: idUser,
                    user: {
                        username: user
                    }
                }));

                const nvo_inv = parseFloat(tt_available) - parseFloat(amount);
                dispatch({ type: "tt_investment", payload: nvo_inv })

                clean();
                all_loans();
                setShow(false);
                console.log("Document written with ID: ", docRef.id);
            } catch (e) {
                console.log("error in creating loan", e)
            }
        }
    }

    const calcInteres = (datesPay, amounts) => {

        const fecha = new Date();
        const today = fecha.getFullYear() + '-' + (fecha.getMonth() + 1) + '-' + fecha.getDate();

        var date1 = new Date(datesPay);
        var date2 = new Date(today);

        // To calculate the time difference of two dates 
        var Difference_In_Time = date1.getTime() - date2.getTime();

        // To calculate the no. of days between two dates 
        var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

        console.log(Difference_In_Days, "days");
        if (Difference_In_Days > 0) {
            const intereses = ((12 * 8) / 365) * parseInt(Difference_In_Days);
            const tot = amounts * (parseFloat(intereses).toFixed(2) / 100);
            setInteres(tot)
            setTotal(parseFloat(tot) + parseFloat(amounts))
            setError(false)
        } else {
            setInteres(0)
            setTotal(0)
            setError(true)
            setMsgError("Fecha Invalida!, verifiquela")
        }
    }

    const value_interes = (datesPay, amounts) => {

        const fecha = new Date();
        const today = fecha.getFullYear() + '-' + (fecha.getMonth() + 1) + '-' + fecha.getDate();
        var date1 = new Date(datesPay);
        var date2 = new Date(today);

        // To calculate the time difference of two dates 
        var Difference_In_Time = date2.getTime() - date1.getTime();

        // To calculate the no. of days between two dates 
        var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

        const intereses = ((12 * 8) / 365) * parseInt(Difference_In_Days);
        const tot = amounts * (parseFloat(intereses).toFixed(2) / 100);
        return Number.parseFloat(tot).toFixed(2);
    }



    React.useEffect(() => {
        all_loans();
    }, [list_loans, tt_available])

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
                                list_loans.map((dato) =>

                                    <ListGroup.Item key={dato.id} as="li"
                                        className="justify-content-between align-items-start">
                                        <Row >
                                            <Col xs={2} md={2} >
                                                <Avatar alt={dato.user.username}  {...stringAvatar(dato.user.username)} />
                                            </Col>
                                            <Col xs={6} md={7}>
                                                <Link className='links' to={"/detail?id=" + dato.id}> 
                                                <div className="fw-bold">{dato.user.username}</div>
                                                {dato.created_at}
                                                </Link>
                                            </Col>
                                            <Col xs={4} md={3}>
                                                {
                                                    (dato.status === false) ? <p bg="light" text="dark" >...</p> : <p bg="light" text="dark" >{format(dato.amount)}  {(dato.available) && <Badge bg="danger">$ {value_interes(dato.created_at, dato.amount)}</Badge>} </p>
                                                }
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                )
                            }
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
                                list_users.map((dt) =>
                                    <option key={dt.id} value={dt.id}>{dt.username}</option>
                                )
                            }
                        </Form.Select>
                        <Row> 
                            <Col sm={6}>
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
                                    onChange={e => { setAmount(e.target.value); calcInteres(datePay, e.target.value) }}
                                />
                            </Col>
                            <Col sm={6}>
                                <Form.Label className='label' htmlFor="fecha pago">Fecha de Pago</Form.Label>
                                <Form.Control size="lg" type='date' onChange={e => { setDatePay(e.target.value); calcInteres(e.target.value, amount) }} />
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={6}>
                                <Form.Label htmlFor="tax" className='label text-danger'>Total Interes Generado</Form.Label>
                                <Form.Control
                                    disabled
                                    className='text-center text-danger'
                                    size="lg"
                                    step={0.01}
                                    type="text"
                                    id="tax"
                                    aria-describedby="Interes"
                                    value={format(interes)}
                                />
                            </Col>
                            <Col sm={6}>
                                <Form.Label htmlFor="tax" className='label text-success '>Total a Pagar</Form.Label>
                                <Form.Control
                                    disabled
                                    className='text-center text-success'
                                    size="lg"
                                    step={0.01}
                                    type="text"
                                    aria-describedby="Interes"
                                    value={format(total)}
                                />
                            </Col>
                        </Row> 
                        {
                            error && <Alert severity="error" className='mt-2' onClose={() => { setError(false) }}>{msgError}</Alert>
                        }
                    </Modal.Body>
                    <Modal.Footer>
                        <button size='sm' className='btn-default' onClick={() => { setShow(false) }}>
                            Cerrar
                        </button>
                        <button type='submit' className='btn-new' size='sm'>Solicitar</button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    )
}
