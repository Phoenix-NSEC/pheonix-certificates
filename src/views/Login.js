import React from "react";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";
import { auth, provider } from "../firebaseConf";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const loginHandler = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        navigate("/");
      })
      .catch((error) => {
        alert("Login Failed");
      });
  };

  const logoutHandler = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
      })
      .catch((error) => {
        // An error happened.
      });
  };

  return (
    <div className="flex min-h-screen justify-center items-center">
      <button
        className="inline-block self-center bg-blue-600 text-white font-bold rounded-lg px-6 py-2 uppercase  text-sm hover:bg-blue-600"
        onClick={loginHandler}
      >
        Sign In With Google
      </button>
    </div>
  );
};

export default Login;
