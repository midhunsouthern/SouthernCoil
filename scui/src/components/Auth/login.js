import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { loginURL } from "../../constant/url";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import "./login.css";

export default function Login(prop) {
	const navigate = useNavigate();
	const [username, setUsername] = useState(null);
	const [password, setPassword] = useState(null);

	function handleSubmit(e) {
		e.preventDefault();

		var bodyFormData = new FormData();
		bodyFormData.append("username", username);
		bodyFormData.append("password", password);
		axios({
			method: "post",
			url: loginURL,
			data: bodyFormData,
			headers: { "Content-Type": "multipart/form-data" },
		})
			.then(function (response) {
				//handle success
				const res_data = response.data;
				if (res_data.status_code === 200) {
					prop.onLogin({
						access_code: res_data.access_code,
						accessModuleList: res_data.accessModuleList,
					});
					localStorage.setItem("authId", res_data.access_code);
					localStorage.setItem("accessModuleList",JSON.stringify(res_data.accessModuleList));
					navigate("/main");
				} else if (res_data.status_code === 201) {
					toast(
						"Creadentials not available, please provide the corret credentials."
					);
				} else {
					console.log(res_data.status_msg);
				}
			})
			.catch(function (response) {
				//handle error
				console.log(response);
			});
	}

	return (
		<div className="login-bg">
			<ToastContainer />
			<div className="row">
				<div className="col-12">
					<div className="circles">
						<div className="circle1"></div>
						<div className="circle2"></div>
					</div>
					<form action="#" className="login_form" onSubmit={handleSubmit}>
						<h1>Welcome back!</h1>
						<p>Login to your account.</p>
						<input
							type="text"
							placeholder="Username"
							onChange={(e) => setUsername(e.target.value)}
						/>
						<input
							type="password"
							placeholder="Password"
							onChange={(e) => setPassword(e.target.value)}
						/>
						<button type="submit">Login</button>
					</form>
				</div>
			</div>
		</div>
	);
}
