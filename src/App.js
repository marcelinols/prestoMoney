import React from 'react'
import { AuthProvider } from './context/AuthContext';
import Home from './pages/home';
import Login from './pages/login';
import Prestamos from './pages/prestamos';
import Inversiones from './pages/inversiones';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Container } from 'react-bootstrap';
import PrivateRoute from './pages/privateRoute'

function App() {
  return ( 
    <Container>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route exaxt path="/" element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            } />
            <Route path="/login" element={<Login />} />
            <Route path="/prestamos" element={
              <PrivateRoute>
                <Prestamos />
              </PrivateRoute>
            } />
            <Route path="/inversiones" element={
              <PrivateRoute>
                <Inversiones />
              </PrivateRoute>
            } />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </Container>
  )
}

export default App;
