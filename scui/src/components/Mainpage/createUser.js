import React, { useContext, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { PhotoCamera } from "@mui/icons-material/PhotoCamera";
import { AccessContext } from "../../constant/accessContext";
import ReactFileReader from "react-file-reader";
import {
	FormControl,
	Select,
	FormHelperText,
	Input,
	MenuItem,
	InputLabel,
	Autocomplete,
	Table,
	TextField,
	TableHead,
	TableCell,
	TableBody,
	TableRow,
	TableContainer,
	Paper,
	Tooltip,
} from "@mui/material";
import { Container } from "@mui/system";
import axios from "axios";
import {
	getProfileDataURL,
	getAccessNameList,
	setNewProfileData,
	getUsersData,
} from "../../constant/url";
import DeleteIcon from "@mui/icons-material/Delete";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CreateUser() {
	// The first commit of Material-UI
	const access = useContext(AccessContext).authID;
	const [selectedDate, setSelectedDate] = useState(new Date());
	const [empId, setEmpId] = useState(null);
	const [fullName, setFullName] = useState(null);
	const [mobileId, setMobileId] = useState(null);
	const [email, setEmail] = useState(null);
	const [accessType, setAccessType] = useState(null);
	const [password, setPassword] = useState(null);
	const [userName, setUserName] = useState(null);
	const [accessTypeList, setAccessTypeList] = useState(null);
	const [userList, setUserList] = useState([]);

	const handleSelectAccessType = (value) => {
		setAccessType(value.label);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		var bodyFormData = new FormData();
		bodyFormData.append("authId", access);
		bodyFormData.append("username", userName);
		bodyFormData.append("fname", fullName);
		bodyFormData.append("email", email);
		bodyFormData.append("dob", selectedDate);
		bodyFormData.append("mobile_no", mobileId);
		bodyFormData.append("emp_no", empId);
		bodyFormData.append("password", password);
		bodyFormData.append("access_type", accessType);

		axios({
			method: "post",
			url: setNewProfileData,
			data: bodyFormData,
			headers: { "Content-Type": "multipart/form-data" },
		})
			.then(function (response) {
				//handle success
				const res_data = response.data;
				if (res_data.status_code === 200) {
					toast(res_data.status_msg, "success");
					//return data
				} else {
					console.log(res_data.status_msg);
				}
			})
			.catch(function (response) {
				//handle error
				console.log(response);
			});
	};

	const handleDelete = (id) => {
		var bodyFormData = new FormData();
		bodyFormData.append("authId", access);
		bodyFormData.append("id", id);
		bodyFormData.append("type", "Delete");

		axios({
			method: "post",
			url: setNewProfileData,
			data: bodyFormData,
			headers: { "Content-Type": "multipart/form-data" },
		})
			.then(function (response) {
				//handle success
				const res_data = response.data;
				if (res_data.status_code === 200) {
					toast(res_data.status_msg, "success");
					handleGetAccessList();
					//return data
				} else {
					console.log(res_data.status_msg);
				}
			})
			.catch(function (response) {
				//handle error
				console.log(response);
			});
	};

	const handleGetAccessList = () => {
		var bodyFormData = new FormData();
		bodyFormData.append("authId", access);

		axios({
			method: "post",
			url: getAccessNameList,
			data: bodyFormData,
			headers: { "Content-Type": "multipart/form-data" },
		})
			.then(function (response) {
				//handle success
				const res_data = response.data;
				if (res_data.status_code === 101) {
					toast("Api Aithentication failed. login again.");
				} else if (res_data.status_code === 200) {
					const ret_data_at = response.data.access_data;
					setAccessTypeList(ret_data_at);
				} else {
					console.log(res_data.status_msg);
				}
			})
			.catch(function (response) {
				//handle error
				console.log(response);
			});
	};

	const handleGetUserList = () => {
		var bodyFormData = new FormData();
		bodyFormData.append("authId", access);

		axios({
			method: "post",
			url: getUsersData,
			data: bodyFormData,
			headers: { "Content-Type": "multipart/form-data" },
		})
			.then(function (response) {
				//handle success
				const res_data = response.data;
				if (res_data.status_code === 101) {
					toast("Api Aithentication failed. login again.");
				} else if (res_data.status_code === 200) {
					const ret_data_at = response.data.User_data;
					setUserList(ret_data_at);
				} else {
					console.log(res_data.status_msg);
				}
			})
			.catch(function (response) {
				//handle error
				console.log(response);
			});
	};

	const UserTableComponent = () => {
		const list = userList;
		return (
			<TableContainer component={Paper}>
				<Table fullWidth aria-label="simple table">
					<TableHead>
						<TableRow>
							<TableCell>EmpId</TableCell>
							<TableCell>Name</TableCell>
							<TableCell>Mobile</TableCell>
							<TableCell>Username</TableCell>
							<TableCell>Action</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{list.map((row) => (
							<TableRow key={row.id}>
								<TableCell align="left">{row.emp_no}</TableCell>
								<TableCell align="left">{row.fname}</TableCell>
								<TableCell align="left">{row.mobile_no}</TableCell>
								<TableCell align="left">{row.username}</TableCell>
								<TableCell align="left">
									{/*<Tooltip title="Edit" onClick={() => {}}>
                            <IconButton>
                              <CreateRoundedIcon/>
                            </IconButton>
                          </Tooltip>*/}
									<Tooltip title="Delete" id={"tooldelete" + row.id}>
										<IconButton
											color="error"
											onClick={() => handleDelete(row.id)}
											key={"icbtndel" + row.id}
										>
											<DeleteIcon />
										</IconButton>
									</Tooltip>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		);
	};

	useEffect(() => {
		handleGetAccessList();
	}, []);

	useEffect(() => {
		handleGetUserList();
	}, []);
	return (
		<div style={{ marginTop: "105px", width: "100%" }}>
			<main className="main mt-0 p-0">
				<div className="content pt-0">
					<ToastContainer />
					<div className="ml-1 mr-1">
						<div className="text-center prof-txt">
							<p>Create New User</p>
							<p className="mb-2">{fullName}</p>
							<p className="role">{accessType}</p>
						</div>
						<div className="col-12 position-relative my-4">
							<div className="row">
								<div className="col-xl-6">
									<div className="row">
										<div className="card shadow-card">
											<div className="card-body">
												<form action="#" onSubmit={handleSubmit}>
													<div className="row">
														<div className="col-sm-6">
															<Container>
																<TextField
																	margin="normal"
																	fullWidth
																	id="name"
																	label="Employee ID"
																	name="name"
																	autoComplete="Employee ID"
																	autoFocus
																	InputLabelProps={{
																		shrink: empId !== "" ? true : false,
																	}}
																	value={empId}
																	onChange={(e) => setEmpId(e.target.value)}
																/>
																<TextField
																	margin="normal"
																	required
																	fullWidth
																	id="name"
																	label="Full Name"
																	name="name"
																	autoComplete="name"
																	autoFocus
																	InputLabelProps={{
																		shrink: fullName !== "" ? true : false,
																	}}
																	value={fullName}
																	onChange={(e) => setFullName(e.target.value)}
																/>
																<TextField
																	type="text"
																	margin="normal"
																	required
																	fullWidth
																	id="username"
																	label="Username"
																	name="username"
																	InputLabelProps={{
																		shrink: userName !== "" ? true : false,
																	}}
																	value={userName}
																	onChange={(e) => setUserName(e.target.value)}
																/>
																<TextField
																	type="password"
																	margin="normal"
																	required
																	fullWidth
																	id="password"
																	label="Password"
																	name="password"
																	InputLabelProps={{
																		shrink: password !== "" ? true : false,
																	}}
																	value={password}
																	onChange={(e) => setPassword(e.target.value)}
																/>
															</Container>
														</div>
														<div className="col-sm-6">
															<Container>
																<TextField
																	margin="normal"
																	fullWidth
																	id="email"
																	label="Email Address"
																	name="email"
																	autoComplete="email"
																	value={email}
																	InputLabelProps={{
																		shrink: email !== "" ? true : false,
																	}}
																	onChange={(e) => setEmail(e.target.value)}
																/>
																<TextField
																	margin="normal"
																	id="date"
																	label="Date Of Birth"
																	fullWidth
																	type="date"
																	InputLabelProps={{
																		shrink: true,
																	}}
																	value={selectedDate}
																	onChange={(e) =>
																		setSelectedDate(e.target.value)
																	}
																/>
																<TextField
																	margin="normal"
																	required
																	fullWidth
																	id="mobile"
																	label="Mobile Number"
																	name="mobile"
																	InputLabelProps={{
																		shrink: mobileId !== "" ? true : false,
																	}}
																	value={mobileId}
																	onChange={(e) => setMobileId(e.target.value)}
																/>
																<Autocomplete
																	disablePortal
																	id="combo-box-demo"
																	options={accessTypeList}
																	renderInput={(params) => (
																		<TextField
																			{...params}
																			label="Access Types Existing"
																		/>
																	)}
																	onChange={(e, value) =>
																		handleSelectAccessType(value)
																	}
																/>
																{/* <FormControl fullWidth>
																	<InputLabel
																		id="access_type_lbl"
																		style={{
																			"margin-top": "16px",
																			"margin-bottom": "8px",
																		}}
																		shrink={true}
																	>
																		Access Type
																	</InputLabel>
																	<Select
																		labelId="access_type_lbl"
																		id="access_type_sel"
																		value={accessType}
																		label="Access Type"
																		fullWidth
																		style={{
																			marginTop: "16px",
																			marginBottom: "8px",
																		}}
																		onChange={handleAccessTypeChange}
																	>
																		{accessTypeList?.map((option) => {
																			return (
																				<MenuItem
																					key={option.access_type}
																					value={option.access_type}
																				>
																					{option.access_type ??
																						option.access_type}
																				</MenuItem>
																			);
																		})}
																	</Select>
																</FormControl> */}

																<div className="float-right my-2 ">
																	<Button
																		variant="contained"
																		size="large"
																		type="submit"
																	>
																		Save
																	</Button>
																</div>
															</Container>
														</div>
													</div>
												</form>
											</div>
										</div>
									</div>
								</div>
								<div className="col-xl-6">
									<div className="card shadow-card">
										<div className="card-body">
											<UserTableComponent />
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
