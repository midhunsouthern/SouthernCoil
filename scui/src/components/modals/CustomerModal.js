import { Button, Container, TextField } from "@mui/material";
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AccessContext } from "../../constant/accessContext";
import { getCustomersDataByID, setCustomersData } from "../../constant/url";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CustomerModal(prop) {
	const access = useContext(AccessContext).authID;
	const [custId, setCustId] = useState(prop.custId);
	const [custName, setCustName] = useState(null);
	const [email, setEmail] = useState(null);
	const [phone, setPhone] = useState(null);
	const [address, setAddress] = useState(null);
	const [poc, setPoc] = useState(null);
	const [isUpdated, setIsUpdate] = useState(false);

	const handleEditUpdate = () => {
		var bodyFormData = new FormData();
		bodyFormData.append("authId", access);
		bodyFormData.append("id", custId);
		bodyFormData.append("fname", custName);
		bodyFormData.append("email", email);
		bodyFormData.append("phone", phone);
		bodyFormData.append("address", address);
		bodyFormData.append("poc", poc);

		axios({
			method: "post",
			url: setCustomersData,
			data: bodyFormData,
			headers: { "Content-Type": "multipart/form-data" },
		})
			.then(function (response) {
				//handle success
				const res_data = response.data;
				console.log(res_data);
				if (res_data.status_code === 101) {
					toast("Api Aithentication failed. login again.");
				} else if (res_data.status_code === 200) {
					toast(res_data.status_msg);
					setIsUpdate(true);
					prop.isUpdate(true);
				} else {
					console.log("msg", res_data.status_msg);
				}
			})
			.catch(function (response) {
				//handle error
				console.log(response);
			});
	};
	const loadCustomerData = (custId) => {
		var bodyFormData = new FormData();
		bodyFormData.append("authId", access);
		bodyFormData.append("cust_id", custId);

		axios({
			method: "post",
			url: getCustomersDataByID,
			data: bodyFormData,
			headers: { "Content-Type": "multipart/form-data" },
		})
			.then(function (response) {
				//handle success
				const res_data = response.data;
				if (res_data.status_code === 101) {
					toast("Api Aithentication failed. login again.");
				} else if (res_data.status_code === 200) {
					const ret_data_cd = res_data.data_cust;
					setCustName(ret_data_cd[0].fname);
					setAddress(ret_data_cd[0].address);
					setEmail(ret_data_cd[0].email);
					setPhone(ret_data_cd[0].phone);
					setPoc(ret_data_cd[0].poc);
				} else {
					console.log(res_data.status_msg);
				}
			})
			.catch(function (response) {
				//handle error
				console.log(response);
			});
	};
	useEffect(() => {
		setCustId(prop.custId);
		loadCustomerData(prop.custId);
	}, [prop.custId]);
	return (
		<div>
			{/* <!-- Modal --> */}
			<div
				className="modal fade"
				id="staticBackdrop"
				data-bs-backdrop="static"
				data-bs-keyboard="false"
				tabIndex="-1"
				aria-labelledby="staticBackdropLabel"
				aria-hidden="true"
			>
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-headline" id="staticBackdropLabel">
								Edit Customer
							</h5>
							<button
								type="button"
								className="btn-close"
								data-bs-dismiss="modal"
								aria-label="Close"
							></button>
						</div>
						<div className="modal-body">
							<Container>
								<div className="row">
									<div className="col-12">
										<TextField
											margin="normal"
											required
											fullWidth
											id="name"
											size="small"
											label="Name"
											name="name"
											autoComplete="name"
											value={custName}
											InputLabelProps={{
												shrink: custName !== "" ? true : false,
											}}
											onChange={(e) => {
												setCustName(e.target.value);
											}}
										/>
										<TextField
											margin="normal"
											required
											fullWidth
											id="email"
											size="small"
											label="Email"
											name="email"
											autoComplete="email"
											value={email}
											InputLabelProps={{
												shrink: email !== "" ? true : false,
											}}
											onChange={(e) => {
												setEmail(e.target.value);
											}}
										/>
										<TextField
											margin="normal"
											required
											fullWidth
											type={"number"}
											id="phone"
											size="small"
											label="Phone"
											name="phone"
											autoComplete="phone"
											value={phone}
											InputLabelProps={{
												shrink: phone !== "" ? true : false,
											}}
											onChange={(e) => {
												setPhone(e.target.value);
											}}
										/>
										<TextField
											margin="normal"
											id="outlined-multiline-static"
											label="Address"
											multiline
											rows={4}
											fullWidth
											variant="outlined"
											value={address}
											InputLabelProps={{
												shrink: address !== "" ? true : false,
											}}
											onChange={(e) => {
												setAddress(e.target.value);
											}}
										/>
										<TextField
											margin="normal"
											required
											fullWidth
											id="contact"
											size="small"
											label="Point of Contact"
											name="contact"
											autoComplete="contact"
											value={poc}
											InputLabelProps={{
												shrink: poc !== "" ? true : false,
											}}
											onChange={(e) => {
												setPoc(e.target.value);
											}}
										/>
										<Button
											className="float-right mt-2"
											data-bs-dismiss="modal"
											variant="contained"
											size="small"
											onClick={handleEditUpdate}
										>
											Save
										</Button>
									</div>
								</div>
							</Container>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
