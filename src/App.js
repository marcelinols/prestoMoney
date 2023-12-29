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
import { suma } from './utils/funtions';
import Detail from './pages/detail';

function App() {

  const { currentUser } = useAuth();

  let uid = useSelector(status => status.uid);
  let admin = useSelector(status => status.admin);

  const dispatch = useDispatch();
  const db = getFirestore(app); 

  const all_datas = async () => {

    let tt_dispose = 0;

    if (currentUser.email === "admin@arka.com") {
      admin = 1;
      dispatch({ type: 'admin', payload: 1 })

      const data_all_inv = query(collection(db, "inversiones"), where("status", "==", true), orderBy("created_at", "desc"));
      await getDocs(data_all_inv)
        .then((querySnapshot) => {
          const datas = querySnapshot.docs.map(
            (doc) => (
              { ...doc.data(), id: doc.id }
            ));
          dispatch(allInvestment(datas))
          tt_dispose += suma(datas)
        });

      const data_all_pre = query(collection(db, "prestamos"), orderBy("created_at", "desc"));
      await getDocs(data_all_pre)
        .then((querySnapshot) => {
          const datas = querySnapshot.docs.map(
            (doc) => (
              { ...doc.data(), id: doc.id }
            ));
          tt_dispose -= suma(datas)
          dispatch(allLoans(datas))
        });

      dispatch({ type: "tt_investment", payload: tt_dispose })

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
              dispatch(allUsers(data))
            });


          const inverRef = collection(db, "inversiones");
          const dataInv = query(inverRef, where("uid", "==", uid), where("status", "==", true), orderBy("created_at", "desc"));

          await getDocs(dataInv)
            .then((querySnapshot) => {
              const data = querySnapshot.docs.map(
                (doc) => (
                  { ...doc.data(), id: doc.id }
                ));
              dispatch(allInvestment(data))
              tt_dispose = suma(data);
            });

          const presRef = collection(db, "prestamos");
          const dataPre = query(presRef, where("uid", "==", uid), where("status", "==", true), orderBy("created_at", "desc"));

          await getDocs(dataPre)
            .then((querySnapshot) => {
              const datas = querySnapshot.docs.map(
                (doc) => (
                  { ...doc.data(), id: doc.id }
                ));
              dispatch(allLoans(datas))
            });

          dispatch({ type: "tt_investment", payload: tt_dispose * 1.3 })
        }

      }
    }


    if (admin === 1) {
      await getDocs(collection(db, "users"))
        .then((querySnapshot) => {
          const datas_user = querySnapshot.docs.map(
            (doc) => (
              { ...doc.data(), id: doc.id }
            ));
          dispatch(allUsers(datas_user))
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
      <Route path="/detail" element={
        <PrivateRoute>
          <Detail />
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
