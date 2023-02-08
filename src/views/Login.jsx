import React from 'react'
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { auth, provider } from '../firebaseConf'; 
import "../styles/login.css"
import { useNavigate } from 'react-router-dom';

const Login = () => {

  const navigate = useNavigate()

  const loginHandler = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        navigate("/")
      }).catch((error) => {
        alert("Login Failed")
      });
  }

  const logoutHandler = () => {
    signOut(auth).then(() => {
      // Sign-out successful.
    }).catch((error) => {
      // An error happened.
    });
  }

  return (
    <div className='login-page'>
        <button onClick={loginHandler}>
            Sign In With Google
        </button>
    </div>
  )
}

export default Login