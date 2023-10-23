import React, { useEffect } from "react";
import { collection, getDocs, query, collectionGroup, getFirestore } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { Col, Row, Container, Tab, Tabs, ListGroup, Badge } from 'react-bootstrap';
import { MoneyOff, PriceChange } from '@mui/icons-material';
import { Avatar } from "@mui/material";

import Navbars from "../components/navbar";
import { format, stringAvatar, suma } from '../utils/funtions'
import '../asset/style/home.css'
import { app } from "../firebase";

export default function Home() {

    const [investment, setInvestment] = React.useState(0.0);
    const [investments, setInvestments] = React.useState([]);
    const [loan, setLoan] = React.useState(0.0);
    const [loans, setLoans] = React.useState([]);

    const { currentUser, logout } = useAuth();

    const db = getFirestore(app);

    const all_datas = async () => {

        await getDocs(collection(db, "inversiones"))
            .then((querySnapshot) => {
                const data = querySnapshot.docs.map(
                    (doc) => (
                        { ...doc.data(), id: doc.id }
                    ));
                setInvestment(suma(data));
                setInvestments(data);
            });

        await getDocs(collection(db, "prestamos"))
            .then((querySnapshot) => {
                const datas = querySnapshot.docs.map(
                    (doc) => (
                        { ...doc.data(), id: doc.id }
                    ));
                setLoan(suma(datas));
                setLoans(datas);
            });
    }

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
        all_datas(); 
    }, [])


    return (
        <>
            <Navbars />
            <Container className="d-flex align-items-center justify-content-center">
                <div className="w-100 screen">
                    <div className="card-total text-center p-4">
                        <h6 className="fw-bolder in" style={{ color: '#b2c3eb' }}>Monto disponible</h6>
                        <h1 className="text-center m-4">{format(investment - loan)}</h1>
                        <Row className="text-center ">
                            <Col>
                                <div className="card-mount">
                                    <PriceChange fontSize="large" style={{ color: '#22e07d' }} className="mb-1" />
                                    <br></br>
                                    {format(investment)}
                                    <p className="mt-1" style={{ color: '#adb5bd' }}>Inversión</p>
                                </div>
                            </Col>
                            <Col>
                                <div className="card-mount">
                                    <MoneyOff fontSize="large" style={{ color: '#e02228' }} className="mb-1" />
                                    <br></br>
                                    {format(loan)}
                                    <p className="mt-1" style={{ color: "#adb5bd" }}>Prestamos</p>
                                </div>
                            </Col>
                        </Row>
                        <p><br></br></p>
                    </div>
                    <div className="resume">
                        <Tabs defaultActiveKey="inversiones">
                            <Tab eventKey="inversiones" title="Inversiones">
                                <ListGroup as="ol" className="m-2">
                                    {
                                        investments.map((dato) =>
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
                            </Tab>
                            <Tab eventKey="prestamos" title="Prestamos">
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

                            </Tab>
                        </Tabs>
                    </div>
                </div>
            </Container>
        </>
    )
}
