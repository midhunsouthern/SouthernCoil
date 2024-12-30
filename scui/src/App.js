import React, { createContext, useEffect, useState } from "react";
import "./App.css";
import AppRoutes from "./routes";
import Login from "./components/Auth/login";
import { AccessContext } from "./constant/accessContext";
import { handleVerifyLogin } from "./commonjs/LoginVerify.js";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
const App = () => {
    const navigate = useNavigate();
    const [authID, setAuthID] = useState(null);
    const [accessModuleList, setAccessModuleList] = useState(null);
 
    const handleLogin = (access_code) => {
        if (access_code !== "") {
            setAuthID(access_code.access_code);
            setAccessModuleList(access_code.accessModuleList);
            if (access_code.access_code) {
                navigate("/");
            }
        } else {
            alert("Invalid username or password");
        }
    };
    
    // Handle logout
    const handleLogout = () => {
		localStorage.removeItem("authId");
		localStorage.removeItem("accessModuleList");
		navigate("/login")
    };
     
    return (
        <div>
            {localStorage.getItem("authId") ? (
                <AccessContext.Provider
                    value={{
                        authID: localStorage.getItem("authId"),
                        handleLogout: handleLogout,
                        accessModuleList: JSON.parse(localStorage.getItem("accessModuleList")),
                    }} >
                    <AppRoutes onLogout={handleLogout} />
                </AccessContext.Provider>
            ) : (
                <Login onLogin={(retAccessCode) => handleLogin(retAccessCode)} />
            )}
        </div>
    );
};
export default App;