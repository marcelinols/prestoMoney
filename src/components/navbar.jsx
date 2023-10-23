import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Image from 'react-bootstrap/Image';
import logo from '../asset/images/prestoMoney.png'
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbars() {
    const { logout } = useAuth();
    const handleClose = () => {
        logout();
    }

    return (
        <div className='navigation'>
            <Container>
                <Navbar key='md' expand='md'>
                    <Container fluid>
                        <Navbar.Brand href="/"><Image src={logo} width={60} roundedCircle /> prestoMoney</Navbar.Brand>
                        <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-md`} />
                        <Navbar.Offcanvas
                            id={`offcanvasNavbar-expand-md`}
                            aria-labelledby={`offcanvasNavbarLabel-expand-md`}
                            placement="end"
                        >
                            <Offcanvas.Header closeButton>
                                <Offcanvas.Title id={`offcanvasNavbarLabel-expand-md`}>
                                    prestoMoney
                                </Offcanvas.Title>
                            </Offcanvas.Header>
                            <Offcanvas.Body>
                                <Nav className="justify-content-end flex-grow-1 pe-3">
                                    <Link to="/">Inicio</Link>
                                    <Link to="/usuarios">Usuarios</Link>
                                    <Link to="/inversiones">Inversiones</Link>
                                    <Link to="/prestamos">Prestamos</Link>
                                    <NavDropdown title="Perfil" id={`offcanvasNavbarDropdown-expand-md`} >
                                        <NavDropdown.Item href="#action3">Action</NavDropdown.Item>
                                        <NavDropdown.Item href="#action4">
                                            Perfil
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