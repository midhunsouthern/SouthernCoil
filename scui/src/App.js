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
	// Handle login with user credentials
	const handleLogin = (access_code) => {
		if (access_code !== "") {
			setAuthID(access_code.access_code);
			setAccessModuleList(access_code.accessModuleList);
			if (access_code.access_code) {
				navigate("/");
			}
		} else {
			navigate("/login");
			alert("Invalid username or password");
		}
	};

	// Handle logout
	const handleLogout = () => {
		setAuthID(null);
	};

	// useEffect(() => {
	// 	//console.log(handleVerifyLogin(localStorage.getItem("authId")));
	// 	handleLogin(localStorage.getItem("authId"));
	// 	console.log("accessModuleList", localStorage.getItem("accessModuleList"));
	// }, []);

	return (
		<div>
			{authID ? (
				<AccessContext.Provider
					value={{
						authID: authID,
						handleLogout: handleLogout,
						accessModuleList: accessModuleList,
					}}
				>
					<AppRoutes onLogout={handleLogout} />
				</AccessContext.Provider>
			) : (
				<Login onLogin={(retAccessCode) => handleLogin(retAccessCode)} />
			)}
		</div>
	);
};

export default App;
