import React, { useEffect, useState, useContext } from "react";
import { AccessContext } from "../../constant/accessContext";
import axios from "axios";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Autocomplete, Button, Radio, TextField } from "@mui/material";
import { pageList, setAccessSetup } from "../../constant/url";

export default function ModuleAccess(props) {
	const access = useContext(AccessContext).authID;
	const [pageListData, setPageListData] = useState([]);
	const [accessName, setAccessName] = useState("");

	function handlePageList(accessName) {
		var bodyFormData = new FormData();
		bodyFormData.append("authId", access);
		bodyFormData.append("accessName", accessName);
		axios({
			method: "post",
			url: pageList,
			data: bodyFormData,
			headers: { "Content-Type": "multipart/form-data" },
		})
			.then(function (response) {
				//handle success
				const res_data = response.data;
				if (res_data.status_code === 200) {
					setPageListData(res_data.pageData);
				} else {
					console.log(res_data.status_msg);
				}
			})
			.catch(function (response) {
				//handle error
				console.log(response);
			});
	}

	function handleSaveAccess() {
		var bodyFormData = new FormData();
		bodyFormData.append("authId", access);
		bodyFormData.append("accessName", accessName);
		bodyFormData.append("pageListData", JSON.stringify(pageListData));

		axios({
			method: "post",
			url: setAccessSetup,
			data: bodyFormData,
			headers: { "Content-Type": "multipart/form-data" },
		})
			.then(function (response) {
				//handle success
				const res_data = response.data;
				if (res_data.status_code === 200) {
					console.log("res_data", res_data);
				} else {
					console.log(res_data.status_msg);
				}
			})
			.catch(function (response) {
				//handle error
				console.log(response);
			});
	}

	const handleChange = (page_mod, accessType) => {
		const updatedList = pageListData.map((page) => {
			if (page.page_mod_name === page_mod) {
				return { ...page, access_type: accessType };
			}
			return page;
		});
		setPageListData(updatedList);
	};

	const columns = [
		{
			field: "page_name",
			headerName: "Page Name",
			flex: 1,
		},
		{
			field: "cust_access_type",
			headerName: "Deny",
			flex: 1,
			renderCell: (params) => {
				return (
					<Radio
						checked={params.row.access_type === "deny"}
						onChange={() => handleChange(params.row.page_mod_name, "deny")}
						value="deny"
						name={params.row.page_mod_name}
						inputProps={{ "aria-label": "A" }}
					/>
				);
			},
		},
		{
			field: "access_type",
			headerName: "Grant",
			renderCell: (params) => {
				return (
					<Radio
						checked={params.row.access_type === "grant"}
						onChange={() => handleChange(params.row.page_mod_name, "grant")}
						value="grant"
						name={params.row.page_mod_name}
						inputProps={{ "aria-label": "A" }}
					/>
				);
			},
			flex: 1,
		},
	];

	useEffect(() => {
		handlePageList(accessName);
	}, []);

	return (
		<div className="container-fluid">
			<div className="row">
				<div className="col-6">
					<div className="card">
						<h2>Create Access Group</h2>
						<div className="card-body">
							<div className="row">
								<div className="col-4">
									<TextField onChange={(e) => setAccessName(e.target.value)} />
								</div>
								<div className="col-4">
									<Autocomplete
										disableClearable
										required
										disablePortal
										id="sel-access-group-edit"
										// options={orderAllList}
										// fullWidth
										renderInput={(params) => (
											<TextField {...params} label="Access Name" />
										)}
										// onChange={(e, value) => {
										// 	handleGetOrderById(value);
										// }}
										// value={hisOrderId}
										key={"sel-access-group-edit-1"}
									/>
								</div>
								<div className="col-4">
									<Button
										onClick={() => handleSaveAccess()}
										variant="contained"
									>
										Save
									</Button>
								</div>
							</div>
							<div className="col-12">
								<DataGrid
									getRowClassName={(params) => {
										if (params.indexRelativeToCurrentPage % 2 === 0) {
											return params.row.priority === "true"
												? "Mui-even secon-bg"
												: "Mui-even";
										} else {
											return params.row.priority === "true"
												? "Mui-odd secon-bg"
												: "Mui-odd";
										}
									}}
									sx={{
										"& .MuiDataGrid-columnHeader": {
											backgroundColor: "#943612",
											color: "white",
										},
										".MuiDataGrid-row.Mui-odd ": {
											backgroundColor: "#FFE1D6",
										},
										".MuiDataGrid-row.Mui-even ": {
											backgroundColor: "#F2F2F2",
										},
										".MuiDataGrid-row:not(.MuiDataGrid-row--dynamicHeight)>.MuiDataGrid-cell":
											{
												overflow: "visible !important",
												whiteSpace: "break-spaces",
												padding: 0,
												display: "flex",
												justifyContent: "center",
												fontSize: "0.75rem",
											},
										".MuiDataGrid-columnHeaderTitleContainer": {
											display: "flex",
											justifyContent: "center",
											fontSize: "0.75rem",
										},
										"& .MuiDataGrid-columnHeader, .MuiDataGrid-cell": {
											border: ".5px solid white",
										},
										"& .MuiInputBase-input": {
											fontSize: "0.74rem",
											padding: "16.5px 1px ",
										},
									}}
									rows={pageListData}
									columns={columns}
									checkboxSelection
									disableSelectionOnClick
									slots={{ toolbar: GridToolbar }}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
