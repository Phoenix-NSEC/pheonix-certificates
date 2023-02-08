import { initializeApp } from "firebase/app";

const certFirebaseConfig = {
    apiKey: "AIzaSyALu0BdcGBFdNcK67Hl5V31LZFD4DSM5tI",
    authDomain: "certificates-phoenix.firebaseapp.com",
    projectId: "certificates-phoenix",
    storageBucket: "certificates-phoenix.appspot.com",
    messagingSenderId: "1018574926639",
    appId: "1:1018574926639:web:dc37e30560ae4dab2da7da",
    measurementId: "G-3QNGQDW2V6"
};

export const app = initializeApp(certFirebaseConfig);