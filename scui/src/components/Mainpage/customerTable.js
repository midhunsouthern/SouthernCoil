import React, { useState, useContext, forwardRef } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import CreateRoundedIcon from "@mui/icons-material/CreateRounded";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomerModal from "../modals/CustomerModal";
import { AccessContext } from "../../constant/accessContext";
import { getCustomersDataAll, delCustomersData } from "../../constant/url";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button, Dialog, DialogTitle, DialogActions } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Slide from "@mui/material/Slide";

const Transition = forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function CustomerTable() {
	const access = useContext(AccessContext).authID;
	const [selectedRowId, setSelectedRowId] = React.useState([]);
	const [customerNameList, setCustomerNameList] = useState([]);
	const [isUpdated, setIsUpdate] = useState(false);
	const [openStatusCnf, setOpenStatusCnf] = useState(false);

	const handleCloseStatus = (response) => {
		if (response === "yes") {
			handleCustomerDelete(selectedRowId);
		}
		setOpenStatusCnf(false);
	};

	const handleCustomerDelete = (rowId) => {
		var bodyFormData = new FormData();
		bodyFormData.append("authId", access);
		bodyFormData.append("id", rowId);

		axios({
			method: "post",
			url: delCustomersData,
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
					setIsUpdate(true);
				} else {
					console.log(res_data.status_msg);
				}
			})
			.catch(function (response) {
				//handle error
				console.log(response);
			});
	};

	const handleCustomerList = (authID) => {
		var bodyFormData = new FormData();
		bodyFormData.append("authId", authID);

		axios({
			method: "post",
			url: getCustomersDataAll,
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
					setCustomerNameList(ret_data_cd);
				} else {
					console.log(res_data.status_msg);
				}
			})
			.catch(function (response) {
				//handle error
				console.log(response);
			});
	};

	const columns = [
		{
			field: "fname",
			headerName: "Full Name",
			flex: 1,
		},
		{
			field: "email",
			headerName: "Email",
			flex: 1,
		},
		{
			field: "phone",
			headerName: "Phone",
			flex: 1,
		},
		{
			field: "poc",
			headerName: "Point Of Contact",
			flex: 1,
		},
		{
			field: "address",
			headerName: "Address",
			flex: 1,
		},
		{
			field: "id",
			headerName: "Action",
			renderCell: (params) => {
				return (
					<div>
						<Tooltip title="Edit" color="info">
							<IconButton
								data-bs-toggle="modal"
								data-bs-target="#staticBackdrop"
								onClick={() => setSelectedRowId(params.row.id)}
							>
								<CreateRoundedIcon />
							</IconButton>
						</Tooltip>
						<Tooltip title="Delete">
							<IconButton
								onClick={() => {
									setOpenStatusCnf(true);
									setSelectedRowId(params.row.id);
								}}
								color="error"
							>
								<DeleteIcon />
							</IconButton>
						</Tooltip>
					</div>
				);
			},

			maxWidth: 90,
			flex: 1,
		},
	];

	React.useEffect(() => {
		handleCustomerList(access);
	}, []);

	React.useEffect(() => {
		if (isUpdated) {
			handleCustomerList(access);
			setIsUpdate(false);
		}
	}, [isUpdated]);
	return (
		<div style={{ marginTop: "105px", width: "100%" }}>
			<main className="main pt-0">
				<div className="content">
					<ToastContainer />
					<div className="row">
						<div className="col-12">
							<div className="card shadow-card glass-card">
								<div className="card-body">
									<Box>
										<DataGrid
											slots={{ toolbar: GridToolbar }}
											getRowClassName={(params) => {
												if (params.indexRelativeToCurrentPage % 2 === 0) {
													return "Mui-even";
												} else {
													return "Mui-odd";
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
											rowHeight={50}
											columns={columns}
											rows={customerNameList}
											editMode="cell"
										/>
									</Box>
								</div>
							</div>
						</div>
					</div>
				</div>
			</main>
			<CustomerModal
				custId={selectedRowId}
				isUpdate={(status) => setIsUpdate(status)}
			/>
			<Dialog
				open={openStatusCnf}
				TransitionComponent={Transition}
				keepMounted
				onClose={handleCloseStatus}
				aria-describedby="alert-dialog-slide-description"
			>
				<DialogTitle>{"Do you want to delete the customer ?"}</DialogTitle>
				<DialogActions>
					<Button onClick={() => handleCloseStatus("no")}>No</Button>
					<Button onClick={() => handleCloseStatus("yes")}>Yes</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
