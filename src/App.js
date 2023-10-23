import React from 'react'
import { AuthProvider } from './context/AuthContext';
import Home from './pages/home';
import Login from './pages/login';
import Prestamos from './pages/prestamos';
import Inversiones from './pages/inversiones';
import Users from './pages/users';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from './utils/privateRoute'

function App() {
  return ( 
    <>
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
            <Route path="/usuarios" element={
              <PrivateRoute>
                <Users />
              </PrivateRoute>
            } />
          </Routes>
        </AuthProvider>
      </BrowserRouter> 

    </>
  )
}

export default App;
