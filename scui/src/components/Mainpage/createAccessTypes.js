import React, { useContext, useEffect, useState } from "react";
import { AccessContext } from "../../constant/accessContext";
import {
	TextField,
	Autocomplete,
	Radio,
	RadioGroup,
	Button,
	TableContainer,
	Table,
	TableHead,
	TableCell,
	TableRow,
	TableBody,
	Paper,
} from "@mui/material";
import { Container } from "@mui/system";
import axios from "axios";
import {
	getModuleList,
	getAccessNameList,
	setAccessModuleList,
	getExistingAccessModuleList,
} from "../../constant/url";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CreateAccessTypes() {
	// The first commit of Material-UI
	const access = useContext(AccessContext).authID;
	const [selectedDate, setSelectedDate] = useState(new Date());
	const [accessName, setAccessName] = useState(null);
	const [accessNameList, setAccessNameList] = useState(null);
	const [moduleList, setModuleList] = useState([]);
	const [renderModule, setRender] = useState([]);

	const handleGetExistingModuleAccess = (selectedAccessName) => {
		var bodyFormData = new FormData();
		bodyFormData.append("authId", access);
		bodyFormData.append("access_type", selectedAccessName);

		axios({
			method: "post",
			url: getExistingAccessModuleList,
			data: bodyFormData,
			headers: { "Content-Type": "multipart/form-data" },
		})
			.then(function (response) {
				//handle success
				const res_data = response.data;
				if (res_data.status_code === 101) {
					toast("Api Aithentication failed. login again.");
				} else if (res_data.status_code === 200) {
					setModuleList(res_data.module_data);
					toast(res_data.status_msg, "success");
				} else {
					toast(res_data.status_msg);
				}
			})
			.catch(function (response) {
				//handle error
				console.log(response);
			});
	};
	const handleSetModuleList = () => {
		var bodyFormData = new FormData();
		bodyFormData.append("authId", access);
		bodyFormData.append("access_type", accessName);
		bodyFormData.append("module_list", JSON.stringify(moduleList));

		axios({
			method: "post",
			url: setAccessModuleList,
			data: bodyFormData,
			headers: { "Content-Type": "multipart/form-data" },
		})
			.then(function (response) {
				//handle success
				const res_data = response.data;
				if (res_data.status_code === 101) {
					toast("Api Aithentication failed. login again.");
				} else if (res_data.status_code === 200) {
					toast(res_data.status_msg, "success");
				} else {
					toast(res_data.status_msg);
				}
			})
			.catch(function (response) {
				//handle error
				console.log(response);
			});
	};

	const handleGetAccessNameList = (authID) => {
		var bodyFormData = new FormData();
		bodyFormData.append("authId", authID);

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
					const ret_data = response.data.access_data;
					setAccessNameList(ret_data);
				} else {
					toast(res_data.status_msg);
				}
			})
			.catch(function (response) {
				//handle error
				console.log(response);
			});
	};

	const handleGetModuleList = (authID) => {
		var bodyFormData = new FormData();
		bodyFormData.append("authId", authID);

		axios({
			method: "post",
			url: getModuleList,
			data: bodyFormData,
			headers: { "Content-Type": "multipart/form-data" },
		})
			.then(function (response) {
				//handle success
				const res_data = response.data;
				if (res_data.status_code === 101) {
					toast("Api Aithentication failed. login again.");
				} else if (res_data.status_code === 200) {
					setModuleList(res_data.module_data);
				} else {
					toast(res_data.status_msg);
				}
			})
			.catch(function (response) {
				//handle error
				console.log(response);
			});
	};
	const handleModuleAccessType = (rowId, rwd) => {
		let mList = moduleList;
		//Find index of specific object using findIndex method.
		let objIndex = mList.findIndex((obj) => obj.id === rowId);
		//Update object's name property.
		mList[objIndex].access_rw = rwd;
		setModuleList(mList);
		ModuleComponent(mList);
	};

	const handleSelectAccessType = (value) => {
		setAccessName(value.label);
		handleGetExistingModuleAccess(value.label);
	};

	const ModuleComponent = () => {
		return (
			<TableContainer component={Paper}>
				<Table fullWidth aria-label="simple table">
					<TableHead>
						<TableRow>
							<TableCell>Module Name</TableCell>
							<TableCell align="left">Description</TableCell>
							<TableCell align="left">Read/Write | Deny</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{moduleList?.map((row) => (
							<TableRow key={row.id}>
								<TableCell component="th" scope="row">
									{row.module_name}
								</TableCell>
								<TableCell align="left">{row.module_des}</TableCell>
								<TableCell>
									<RadioGroup name="use-radio-group" defaultValue="1" row>
										<Radio
											checked={row.access_rw === "1"}
											value={"1"}
											name={row.module_name}
											onChange={() => handleModuleAccessType(row.id, "1")}
										/>
										<Radio
											checked={row.access_rw === "0"}
											value={"0"}
											name={row.module_name}
											onChange={() => handleModuleAccessType(row.id, "0")}
										/>
									</RadioGroup>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		);
	};

	useEffect(() => {
		handleGetAccessNameList(access);
		handleGetModuleList(access);
	}, [access]);
	useEffect(() => {
		ModuleComponent();
	}, [moduleList]);
	return (
		<div style={{ marginTop: "105px", width: "100%" }}>
			<main className="main mt-0 p-0">
				<div className="content pt-0">
					<div className="container mb-0">
						<div className="text-center prof-txt">
							<p className="mb-2">Create Access TYpes</p>
						</div>
						<div className="col-12 position-relative my-4">
							<ToastContainer />
							<div className="row">
								<div className="col-sm-12">
									<div className="card shadow-card">
										<div className="card-body">
											<div className="row">
												<div className="col-sm-12">
													<Container>
														<div className="col-12">
															<div className="row">
																<div className="col">
																	<Autocomplete
																		disablePortal
																		id="combo-box-demo"
																		options={accessNameList}
																		sx={{ width: 300 }}
																		renderInput={(params) => (
																			<TextField
																				{...params}
																				label="Access Types Existing"
																			/>
																		)}
																		fullWidth
																		onChange={(e, value) =>
																			handleSelectAccessType(value)
																		}
																	/>
																</div>
																<div className="col">
																	<TextField
																		InputLabelProps={{
																			shrink: accessName?.length > 0,
																		}}
																		id="outlined-basic"
																		label="Access Types New"
																		variant="outlined"
																		value={accessName}
																		onChange={(e) => {
																			setAccessName(e.target.value);
																		}}
																	/>
																</div>
															</div>
															<ModuleComponent />
														</div>
														<div className="float-right my-2 ">
															<Button
																variant="contained"
																size="large"
																type="submit"
																onClick={() => handleSetModuleList()}
															>
																Save
															</Button>
														</div>
													</Container>
												</div>
											</div>
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
