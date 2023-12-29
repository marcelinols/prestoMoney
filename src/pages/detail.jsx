import React from 'react'
import { Container, Form } from 'react-bootstrap';
import Navbars from "../components/navbar";
import { format } from '../utils/funtions'

import '../asset/style/inversiones.css'
import { app } from '../firebase';
import { getFirestore, getDoc, doc, updateDoc, addDoc, collection } from 'firebase/firestore';

//hook
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';


export default function Detail() {

    const tt_available = useSelector((state) => state.tt_investment);
    const admin = useSelector((state) => state.admin)

    const [id, setId] = React.useState('');
    const [uid, setUid] = React.useState('');
    const [user, setUser] = React.useState('');
    const [status, setStatus] = React.useState('');
    const [concepts, setConcepts] = React.useState('');
    const [dateConcept, setDateConcept] = React.useState('');
    const [available, setAvailable] = React.useState('');
    const [amount, setAmount] = React.useState(0.0);
    const [interes, setInteres] = React.useState(0);
    const [datePay, setDatePay] = React.useState();
    const [total, setTotal] = React.useState(0);

    const db = getFirestore(app);
    const location = useLocation()
    const params = new URLSearchParams(location.search)

    const detail_load = async () => {
        const ids = params.get("id");
        setId(ids)

        const prestamo = doc(db, "prestamos", ids);
        const docSnap = await getDoc(prestamo);

        if (docSnap.exists()) {
            setAmount(docSnap.data().amount);
            setDatePay(docSnap.data().created_at);
            setUser(docSnap.data().user.username);
            setStatus(docSnap.data().status);
            setAvailable(docSnap.data().available);
            setUid(docSnap.data().uid);
            const ints = calcInteres(docSnap.data().created_at, docSnap.data().amount)
            if (docSnap.data().available) {
                setInteres(ints)
            } else {
                setConcepts(docSnap.data().pays.concept)
                setDateConcept(docSnap.data().pays.date)
                setInteres(docSnap.data().interes)
            }
        } else {
            // docSnap.data() will be undefined in this case
            console.log("No such document!");
        }

    }

    const autorizar = async (e) => {
        e.preventDefault();

        const fecha = new Date();
        const today = fecha.getFullYear() + '-' + (fecha.getMonth() + 1) + '-' + fecha.getDate();

        const updPrestamo = doc(db, "prestamos", id);
        await updateDoc(updPrestamo, {
            amount: parseFloat(amount),
            status: true,
            created_at: today
        });
        window.location.reload(false);
    }

    const liquidar = async () => {
        var accept = window.confirm("Liquidar prestamo?")
        if (accept) {
            const fecha = new Date();
            const today = fecha.getFullYear() + '-' + (fecha.getMonth() + 1) + '-' + fecha.getDate();

            const updPrestamo = doc(db, "prestamos", id);
            await updateDoc(updPrestamo, {
                available: false,
                interes: parseFloat(interes),
                pays: {
                    concept: "liquidacion",
                    amount: parseFloat(interes + amount),
                    date: today
                }
            });
            window.location.reload(false);
        }
    }

    const abonar = () => {

    }

    const pagar_interes = async () => {
        var accept = window.confirm("Pagar interes?")
        if (accept) {

            const fecha = new Date();
            const today = fecha.getFullYear() + '-' + (fecha.getMonth() + 1) + '-' + fecha.getDate();

            const updPrestamo = doc(db, "prestamos", id);
            await updateDoc(updPrestamo, {
                available: false,
                interes: parseFloat(interes),
                pays: {
                    concept: "pago interes",
                    amount: parseFloat(interes + amount),
                    date: today
                }
            });

            await addDoc(collection(db, "prestamos"), {
                amount: parseFloat(amount),
                available: true,
                created_at: today,
                date_pay: datePay,
                interes: 0,
                status: true,
                uid: uid,
                user: {
                    username: user
                }
            });

            window.location.reload(false);

        }
    }
    const pagar_capital = async () => {
        var accept = window.confirm("Pagar capital?")
        if (accept) {
            const fecha = new Date();
            const today = fecha.getFullYear() + '-' + (fecha.getMonth() + 1) + '-' + fecha.getDate();

            const updPrestamo = doc(db, "prestamos", id);
            await updateDoc(updPrestamo, {
                available: false,
                interes: parseFloat(interes),
                pays: {
                    concept: "pago capital",
                    amount: parseFloat(interes + amount),
                    date: today
                }
            });

            await addDoc(collection(db, "prestamos"), {
                amount: parseFloat(interes),
                available: true,
                created_at: today,
                date_pay: datePay,
                interes: 0,
                status: true,
                uid: uid,
                user: {
                    username: user
                }
            });

            window.location.reload(false);
        }
    }


    const calcInteres = (datesPay, amounts) => {

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
        return Number.parseFloat(tot);

    }

    function DatosPrestamo() {
        return (
            <div>
                <div className="card-total text-center p-3">
                    <h6 className="fw-bolder in" style={{ color: '#b2c3eb' }}>Monto Prestado</h6>
                    <h1 className="text-center m-3">{format(amount)}</h1>

                    <p className='label-datils'>Fecha : {datePay} <br></br>
                        {user} <br></br>
                    </p>
                    <p className='text-danger'>Interes : {format(interes)}</p>
                    <h6 className='text-success'>Total Final: {format(interes + amount)}</h6>
                </div>
                {
                    (admin === 1 && available) &&
                    <div className='history text-center'>
                        <button className='btn-load m-2 p-2' onClick={liquidar} >Liquidar</button>
                        <button className='btn-load p-2'>Abonar</button>
                        <br></br>
                        <button className='btn-load m-2 p-2' onClick={pagar_interes}>Pagar Interes</button>
                        <button className='btn-load p-2' onClick={pagar_capital}>Pagar Capital</button>
                    </div>
                }
                {
                    (!available) &&
                    <div className='history text-center'>
                        <p className='label'>Concepto : {concepts}</p>
                        <p className='label'>Fecha : {dateConcept}</p>
                    </div>
                }
            </div>
        )
    }

    React.useEffect(() => {
        detail_load();
    }, [id, tt_available])

    return (
        <>
            <Navbars />
            <Container className="d-flex align-items-center justify-content-center">
                <div className="w-100 screen">
                    {
                        (status) ?
                            <DatosPrestamo />
                            :
                            <div className='text-center'>

                                <Form onSubmit={autorizar}>
                                    <Form.Label className='label'>Monto</Form.Label>
                                    <Form.Control
                                        className='text-center'
                                        size="lg"
                                        placeholder='Monto'
                                        step={0.01}
                                        type="number"
                                        id="amount"
                                        aria-describedby="Monto"
                                        value={amount}
                                        onChange={e => { setAmount(e.target.value); }}
                                    />
                                    <button type='submit' className='btn-new mt-1' size='sm'>Autorizar</button>
                                </Form>

                            </div>
                    }
                </div>


            </Container>
        </>
    )
}
