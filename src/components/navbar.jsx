import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Image from 'react-bootstrap/Image';
import logo from '../asset/images/prestoMoney.jpeg'
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSelector } from 'react-redux';

function Navbars() {
    const { logout, currentUser } = useAuth();
    const admin = useSelector(status => status.admin);

    console.log("admin", admin);

    const handleClose = () => {
        logout();
    }

    return (
        <div className='navigation'>
            <Container>
                <Navbar key='md' expand='md'>
                    <Container fluid>
                        <Navbar.Brand href="/"><Image src={logo} width={35} roundedCircle /> ARKA</Navbar.Brand>
                        <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-md`} />
                        <Navbar.Offcanvas
                            id={`offcanvasNavbar-expand-md`}
                            aria-labelledby={`offcanvasNavbarLabel-expand-md`}
                            placement="end"
                        >
                            <Offcanvas.Header closeButton>
                                <Offcanvas.Title id={`offcanvasNavbarLabel-expand-md`}>
                                    ARKA
                                </Offcanvas.Title>
                            </Offcanvas.Header>
                            <Offcanvas.Body>
                                <Nav className="justify-content-end flex-grow-1 pe-3">
                                    <Link to="/">Inicio</Link>
                                    {
                                        (admin === 1) && <Link to="/usuarios">Usuarios</Link>
                                    }

                                    <Link to="/inversiones">Inversiones</Link>
                                    <Link to="/prestamos">Prestamos</Link>
                                    <NavDropdown title="Perfil" id={`offcanvasNavbarDropdown-expand-md`} >
                                        <NavDropdown.Item href="#action3">Action</NavDropdown.Item>
                                        <NavDropdown.Item href="#action4">
                                            {currentUser.email}
                                        </NavDropdown.Item>
                                        <NavDropdown.Divider />
                                        <NavDropdown.Item href="#action5" onClick={handleClose}>
                                            Salir
                                        </NavDropdown.Item>
                                    </NavDropdown>
                                </Nav>
                            </Offcanvas.Body>
                        </Navbar.Offcanvas>
                    </Container>
                </Navbar>
            </Container>
        </div>
    );
}

export default Navbars;