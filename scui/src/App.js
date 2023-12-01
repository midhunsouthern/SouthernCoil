import React, { createContext, useEffect, useState } from 'react';
import './App.css';
import AppRoutes from './routes';
import Login from './components/Auth/login';
import { AccessContext } from './constant/accessContext';
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const navigate = useNavigate();
  const [authID, setAuthID] = useState(null);
  // Handle login with user credentials
  const handleLogin = (access_code) => {
    if (access_code !== '') {
      setAuthID(access_code);
      if (access_code) {
        navigate("/");
      }
    } else {
      alert('Invalid username or password');
    }
  };

  // Handle logout
  const handleLogout = () => {
    setAuthID(null);
  };

  useEffect(() => {
    handleLogin(localStorage.getItem('authId'));
  },[])

  return (

    <div>
      {authID ? (
        <AccessContext.Provider value={{authID:authID, handleLogout:handleLogout}}>
          <AppRoutes onLogout={handleLogout} />
        </AccessContext.Provider>
      ) : (
          <Login onLogin={(retAccessCode) => handleLogin(retAccessCode)} />
      )}
    </div>
  );
};

export default App;
