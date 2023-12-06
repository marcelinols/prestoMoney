import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: "prestomoney-db199.firebaseapp.com",
    projectId: "prestomoney-db199",
    storageBucket: "prestomoney-db199.appspot.com",
    messagingSenderId: "270163489568",
    appId: "1:270163489568:web:6b5a6427159d93cd751d45"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);  