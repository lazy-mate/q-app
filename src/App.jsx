import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './components/Home';
import Login from './components/Login';
import Company from './components/Company';
import CompanyDetail from './components/Company/CompanyDetail';
import User from './components/User';
import { getAuth, onAuthStateChanged } from "firebase/auth";

function App() {
  const [isLogin, setIsLogin] = useState(false)


  useEffect(() => {
    const auth = getAuth();
    const unSubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        console.log(user)
        setIsLogin(true)
        // ...
      } else {
        // User is signed out
        setIsLogin(false)
      }
    });

    return () => {
      unSubscribe();
      console.log('Connection Diconnected')
    }
  }, [])




  return (
    <div>
      {(isLogin) ?
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/company" element={<Company />} />
          <Route path="/user" element={<User />} />
          <Route path='/company/companydetail' element={<CompanyDetail />} />
          <Route path="*" element={<div>Page Not Found</div>} />
        </Routes>
        :
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="*" element={<Navigate to="/" replace={true} />} />
        </Routes>
      }

    </div>
  );
}

export default App;
