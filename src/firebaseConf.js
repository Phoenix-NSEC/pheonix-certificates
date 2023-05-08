import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { GoogleAuthProvider, getAuth } from "firebase/auth";

const certFirebaseConfig = {
    apiKey: "AIzaSyALu0BdcGBFdNcK67Hl5V31LZFD4DSM5tI",
    authDomain: "certificates-phoenix.firebaseapp.com",
    projectId: "certificates-phoenix",
    storageBucket: "certificates-phoenix.appspot.com",
    messagingSenderId: "1018574926639",
    appId: "1:1018574926639:web:dc37e30560ae4dab2da7da",
    measurementId: "G-3QNGQDW2V6"
};
const mainFirebaseConfig = {
    apiKey: "AIzaSyBw4mgLgM6im3_xsLe7DTa9P7ONm9GjnjU",
    authDomain: "phoenix-c88b9.firebaseapp.com",
    projectId: "phoenix-c88b9",
    storageBucket: "phoenix-c88b9.appspot.com",
    messagingSenderId: "974004018957",
    appId: "1:974004018957:web:c0ee9fa84238ecc03b5a44",
    measurementId: "G-XGRM7GLEXT"
};



export const app = initializeApp(certFirebaseConfig);
export const mainApp = initializeApp(mainFirebaseConfig, "mainApp")
export const provider = new GoogleAuthProvider();
export const auth = getAuth(app);
export const db = getFirestore(app);
export const maindb = getFirestore(mainApp)