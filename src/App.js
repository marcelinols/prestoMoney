import React from 'react'
import Home from './pages/home';
import Login from './pages/login';
import Register from './pages/register';
import Prestamos from './pages/prestamos';
import Inversiones from './pages/inversiones';
import Users from './pages/users';
import { Routes, Route } from "react-router-dom";
import PrivateRoute from './utils/privateRoute'
import { useDispatch, useSelector } from 'react-redux';
import { app } from './firebase';
import { allInvestment, allLoans, allUsers } from './hook/actions';
import { collection, getDocs, getFirestore, orderBy, query, where } from 'firebase/firestore';
import { useAuth } from './context/AuthContext';

function App() {

  const { currentUser } = useAuth();

  let uid = useSelector(status => status.uid);
  let admin = useSelector(status => status.admin);

  const dispatch = useDispatch();
  const db = getFirestore(app); 

  const all_datas = async () => {

    if (currentUser.email === "admin@arka.com") {
      admin = 1;
      dispatch({ type: 'admin', payload: 1 })

    } else {
      if (currentUser.uid != undefined) {
        const userRef = collection(db, "users");
        const datos = query(userRef, where("uid", "==", "" + currentUser.uid + ""));

        if (uid === "") { 
          await getDocs(datos)
            .then((querySnapshot) => {
              const data = querySnapshot.docs.map(
                (doc) => (
                  { ...doc.data(), id: doc.id }
                ));
              uid = data[0].id
              dispatch({ type: 'uid', payload: data[0].id })
            });
        }
      }
    }


    let dataInv = {};
    if (admin === 1) {
      dataInv = query(collection(db, "inversiones"), orderBy("created_at", "desc"));
    } else {
      const inverRef = collection(db, "inversiones");
      dataInv = query(inverRef, where("uid", "==", uid), orderBy("created_at", "desc"));

    } 
    await getDocs(dataInv)
      .then((querySnapshot) => {
        const data = querySnapshot.docs.map(
          (doc) => (
            { ...doc.data(), id: doc.id }
          ));
        dispatch(allInvestment(data))
      });

    let dataPre = [];
    if (admin === 1) {
      dataPre = dataPre = query(collection(db, "prestamos"), orderBy("created_at", "desc"));
    } else {
      const presRef = collection(db, "prestamos");
      dataPre = dataPre = query(presRef, where("uid", "==", uid), orderBy("created_at", "desc"));
    }

    await getDocs(dataPre)
      .then((querySnapshot) => {
        const datas = querySnapshot.docs.map(
          (doc) => (
            { ...doc.data(), id: doc.id }
          ));
        dispatch(allLoans(datas))
      });



    if (admin === 1) {
      await getDocs(collection(db, "users"))
        .then((querySnapshot) => {
          const datas = querySnapshot.docs.map(
            (doc) => (
              { ...doc.data(), id: doc.id }
            ));
          dispatch(allUsers(datas))
        });
    }

    console.log("LOAD datas")
  }

  React.useEffect(() => {
    if (currentUser) {
      all_datas();
    }
  }, [admin, uid, currentUser]);

  return (   

      <Routes>
        <Route path="/" element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            } />
            <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
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

  )
}

export default App;
