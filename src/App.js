import React from 'react'
import { AuthProvider } from './context/AuthContext';
import Home from './pages/home';
import Login from './pages/login';
import Prestamos from './pages/prestamos';
import Inversiones from './pages/inversiones';
import Users from './pages/users';
import { Routes, Route } from "react-router-dom";
import PrivateRoute from './utils/privateRoute'
import { useDispatch } from 'react-redux';
import { app } from './firebase';
import { allInvestment, allLoans, allUsers } from './hook/actions';
import { collection, getDocs, getFirestore, orderBy, query } from 'firebase/firestore';

function App() {

  const dispatch = useDispatch();
  const db = getFirestore(app);

  const all_datas = async () => {

    const dataInv = query(collection(db, "inversiones"), orderBy("created_at", "desc"));

    await getDocs(dataInv)
      .then((querySnapshot) => {
        const data = querySnapshot.docs.map(
          (doc) => (
            { ...doc.data(), id: doc.id }
          ));
        dispatch(allInvestment(data))
      });


    const dataPre = query(collection(db, "prestamos"), orderBy("created_at", "desc"));

    await getDocs(dataPre)
      .then((querySnapshot) => {
        const datas = querySnapshot.docs.map(
          (doc) => (
            { ...doc.data(), id: doc.id }
          ));
        dispatch(allLoans(datas))
      });


    await getDocs(collection(db, "users"))
      .then((querySnapshot) => {
        const datas = querySnapshot.docs.map(
          (doc) => (
            { ...doc.data(), id: doc.id }
          ));
        dispatch(allUsers(datas))
      });
    console.log("LOAD datas")
  }

  React.useEffect(() => {
    all_datas();
  }, []);


  return (   

    <AuthProvider>
      <Routes>
        <Route path="/" element={
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

  )
}

export default App;
