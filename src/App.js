import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Dashboard from './views/Dashboard';
import Login from './views/Login';
import Verify from './views/Verify';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';
import { auth } from './firebaseConf';
import Preview from './views/Preview';

function App() {
  const navigate = useNavigate()

  useEffect(() => {
    onAuthStateChanged(auth, (userAuth) => {
      if (userAuth) {
      } else {
        navigate("/login")
      }
    });
  }, [])
  
  return (
    <>
        <Routes>
          <Route path='/' element={<Dashboard />} />
          <Route path='/login' element={<Login />} />
          <Route path='/verify/:cId' element={<Verify />} />
          <Route path='/preview/:eventName/:name/:cId/:id' element={<Preview/>}/>
        </Routes>
    </>
  );
}

export default App;
