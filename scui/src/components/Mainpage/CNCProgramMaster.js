import {
	useState,
	useEffect,
	useContext,
	forwardRef,
	useCallback,
} from "react";
import axios from "axios";
import moment from "moment";
import {
	Button,
	FormControl,
	TextField,
	Autocomplete,
	Typography,
	Dialog,
	DialogActions,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import { AccessContext } from "../../constant/accessContext";
import Slide from "@mui/material/Slide";

import {
	get_order_id_list,
	get_cnc_program_names,
	set_cnc_program_master,
	get_cnc_program_master_list,
	getLookupData,
} from "../../constant/url";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

const Transition = forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function CNCProgramMaster(prop) {
	const access = useContext(AccessContext).authID;
	const [masterProgramList, setMasterProgramList] = useState([]);
	const [programName, setProgramName] = useState("");
	const [programNameList, setProgramNameList] = useState([
		{ label: "Loading...", value: "" },
	]);
	const [creationDate, setCreationDate] = useState(
		moment(new Date()).format("YYYY-MM-DD hh:mm:ss")
	);
	const [completeDate, setCompleteDate] = useState(
		moment(new Date()).format("YYYY-MM-DD hh:mm:ss")
	);
	const [customerName, setCustomerName] = useState("");
	const [orderIdList, setOrderIdList] = useState([
		{ label: "Loading...", value: "" },
	]);
	const [order_id, setOrder_id] = useState("");
	const [size, setsize] = useState("");
	const [cncModelList, setCncModelList] = useState([
		{ label: "Loading...", value: "" },
	]);
	const [cncModel, setCncModel] = useState("");
	const [quantity, setQuantity] = useState("");
	const [okCount, setOkCount] = useState("");
	const [rejectionCount, setRejectionCount] = useState("");

	const [openAddProgramDialog, setOpenAddProgramDialog] = useState(false);

	const handleModelLookup = useCallback(
		(access) => {
			var bodyFormData = new FormData();
			bodyFormData.append("authId", access);

			axios({
				method: "post",
				url: getLookupData,
				data: bodyFormData,
				headers: { "Content-Type": "multipart/form-data" },
			})
				.then(function (response) {
					//handle success
					const res_data = response.data;
					if (res_data.status_code === 101) {
						toast("Api Aithentication failed. login again.");
					} else if (res_data.status_code === 200) {
						const ret_data_cd = res_data.cncMasterPmgLkp;
						setCncModelList(ret_data_cd);
					} else {
						toast(res_data.status_msg);
					}
				})
				.catch(function (response) {
					//handle error
					console.log(response);
				});
		},
		[cncModelList]
	);

	const handleGetOrderIdList = useCallback(
		(access) => {
			var bodyFormData = new FormData();
			bodyFormData.append("authId", access);

			axios({
				method: "post",
				url: get_order_id_list,
				data: bodyFormData,
				headers: { "Content-Type": "multipart/form-data" },
			})
				.then(function (response) {
					//handle success
					const res_data = response.data;
					if (res_data.status_code === 101) {
						toast("Api Aithentication failed. login again.");
					} else if (res_data.status_code === 200) {
						const ret_data_cd = res_data.data;
						setOrderIdList(ret_data_cd);
					} else {
						toast(res_data.status_msg);
					}
				})
				.catch(function (response) {
					//handle error
					console.log(response);
				});
		},
		[orderIdList]
	);

	const handleGetProgramName = useCallback(
		(access) => {
			var bodyFormData = new FormData();
			bodyFormData.append("authId", access);

			axios({
				method: "post",
				url: get_cnc_program_names,
				data: bodyFormData,
				headers: { "Content-Type": "multipart/form-data" },
			})
				.then(function (response) {
					//handle success
					const res_data = response.data;
					if (res_data.status_code === 101) {
						toast("Api Aithentication failed. login again.");
					} else if (res_data.status_code === 200) {
						const ret_data_cd = res_data.data;
						setProgramNameList(ret_data_cd);
					} else {
						toast(res_data.status_msg);
					}
				})
				.catch(function (response) {
					//handle error
					console.log(response);
				});
		},
		[programNameList]
	);

	const handleGetMasterProgramData = useCallback(
		(access) => {
			var bodyFormData = new FormData();
			bodyFormData.append("authId", access);

			axios({
				method: "post",
				url: get_cnc_program_master_list,
				data: bodyFormData,
				headers: { "Content-Type": "multipart/form-data" },
			})
				.then(function (response) {
					//handle success
					const res_data = response.data;
					if (res_data.status_code === 101) {
						toast("Api Aithentication failed. login again.");
					} else if (res_data.status_code === 200) {
						const ret_data_cd = res_data.data;
						setMasterProgramList(ret_data_cd);
					} else {
						toast(res_data.status_msg);
					}
				})
				.catch(function (response) {
					//handle error
					console.log(response);
				});
		},
		[masterProgramList]
	);

	const handleOrderIdSel = useCallback(
		(selValue) => {
			setOrder_id(selValue);
			const oidx = orderIdList.findIndex((item) => item.value === selValue);
			if (oidx !== -1) {
				setCustomerName(orderIdList[oidx].customer_name);
				setsize(orderIdList[oidx].size);
			} else {
				setCustomerName("");
				setsize("");
			}
		},
		[orderIdList]
	);

	const handleCNCModelSel = useCallback(
		(selValue) => {
			setCncModel(selValue);
		},
		[cncModel]
	);

	const handleProgramNameSel = useCallback(
		(selValue) => {
			setProgramName(selValue);
		},
		[programName]
	);

	const handleCNCProgramSubmit = useCallback(
		async (e) => {
			e.preventDefault();
			var bodyFormData = new FormData();

			bodyFormData.append("authId", access);
			bodyFormData.append("program_name", programName);
			bodyFormData.append("creation_datetime", creationDate);
			bodyFormData.append("order_no", order_id);
			bodyFormData.append("customer_name", customerName);
			bodyFormData.append("size", size);
			bodyFormData.append("cnc_program_model_id", cncModel);
			bodyFormData.append("quantity", quantity);
			// bodyFormData.append("ok_count", okCount);
			// bodyFormData.append("ok_count_by_id", ok);
			// bodyFormData.append("rejection_count", rejectionCount);
			// bodyFormData.append("rejection_count_by_id", access);
			await axios({
				method: "post",
				url: set_cnc_program_master,
				data: bodyFormData,
			})
				.then(function (response) {
					//handle success
					const res_data = response.data;
					if (res_data.status_code === 101) {
						toast("Api Aithentication failed. login again.");
					} else {
						toast(res_data.status_msg);
					}
					setProgramName("");
					setCreationDate();
					setCncModel("");
					setCustomerName("");
					setsize("");
					setQuantity("");
					setOpenAddProgramDialog(false);
					handleGetMasterProgramData(access);
				})
				.catch(function (response) {
					//handle error
					console.log(response);
				});
		},
		[
			access,
			programName,
			completeDate,
			order_id,
			customerName,
			size,
			cncModel,
			quantity,
		]
	);

	const handleCloseAddProgramDialog = useCallback(
		() => setOpenAddProgramDialog(false),
		[openAddProgramDialog]
	);

	const isValidOkRejectionCount = () => {};
	const _handleGenericUpdateRow = async (access, fields, param) => {
		console.log(param);
		if (
			parseInt(param.quantity) <
			parseInt(param.ok_count) + parseInt(param.rejection_count)
		) {
			toast(
				"Quantity count cannot be less than sum of Ok Count or Rejection Count"
			);
			handleGetMasterProgramData(access);
			return false;
		}
		var bodyFormData = new FormData();

		bodyFormData.append("authId", access);
		bodyFormData.append("id", param.id);
		bodyFormData.append("ok_count", param.ok_count);
		bodyFormData.append("rejection_count", param.rejection_count);

		await axios({
			method: "post",
			url: set_cnc_program_master,
			data: bodyFormData,
		})
			.then(function (response) {
				//handle success
				const res_data = response.data;
				if (res_data.status_code === 101) {
					toast("Api Aithentication failed. login again.");
				} else {
					toast(res_data.status_msg);
				}
				handleGetMasterProgramData(access);
			})
			.catch(function (response) {
				//handle error
				console.log(response);
			});
	};

	const columns = [
		{
			field: "program_name",
			headerName: "Program Name",
			maxWidth: 150,
			flex: 1,
		},
		{
			field: "creation_datetime",
			headerName: "Created On",
			maxWidth: 150,
			valueFormatter: (params) => {
				return moment(params.value).format("DD/MM/YYYY HH:mm");
			},

			flex: 1,
		},
		{
			field: "order_no",
			headerName: "Order No",
			maxWidth: 100,

			flex: 1,
		},
		{
			field: "customer_name",
			headerName: "Customer Name",
			maxWidth: 150,

			flex: 1,
		},
		{
			field: "size",
			headerName: "Size",
			maxWidth: 130,
			flex: 1,
		},
		{
			field: "cnc_program_model_id",
			headerName: "Model",
			maxWidth: 150,
			flex: 1,
		},
		{
			field: "quantity",
			headerName: "Quantity",
			maxWidth: 100,
			flex: 1,
		},
		{
			field: "complete_datetime",
			headerName: "Completed On",
			maxWidth: 150,
			valueFormatter: (params) => {
				return moment(params.value).format("DD/MM/YYYY HH:mm");
			},

			flex: 1,
		},
		{
			field: "ok_count",
			headerName: "OK",
			maxWidth: 100,
			flex: 1,
			editable: true,
			type: "number",
		},
		{
			field: "rejection_count",
			headerName: "Rejection",
			maxWidth: 100,
			flex: 1,
			editable: true,
			type: "number",
		},
	];

	useEffect(() => {
		handleGetOrderIdList(access);
		handleGetProgramName(access);
		handleGetMasterProgramData(access);
		handleModelLookup(access);
	}, [access]);

	useEffect(() => {
		console.log(completeDate);
	}, [completeDate]);
	return (
		<div style={{ marginTop: "105px", width: "100%" }}>
			<div className="main mt-0 pt-0">
				<div className="container">
					<h5 className="headline">CNC Program Master</h5>
					<ToastContainer />
					<div className="row">
						<div className="col-12">
							<Button
								onClick={() => setOpenAddProgramDialog(true)}
								variant="contained"
							>
								Add Program
							</Button>
							<DataGrid
								slots={{ toolbar: GridToolbar }}
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
											fontSize: "0.95rem",
										},
									".MuiDataGrid-columnHeaderTitleContainer": {
										display: "flex",
										justifyContent: "center",
										fontSize: "0.95rem",
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
								rows={masterProgramList}
								editMode="row"
								processRowUpdate={(param, event) => {
									_handleGenericUpdateRow(
										access,
										["ok_count", "rejection_count"],
										param
									).then((pStatus) => {
										console.log(pStatus);
									});
									return param;
								}}
								onProcessRowUpdateError={(param) => {
									console.log(param);
								}}
							/>
						</div>
					</div>
				</div>
			</div>
			<Dialog
				open={openAddProgramDialog}
				TransitionComponent={Transition}
				keepMounted
				onClose={handleCloseAddProgramDialog}
				aria-describedby="alert-dialog-slide-description"
			>
				<div className="col p-5">
					<form onSubmit={(e) => handleCNCProgramSubmit(e)}>
						<div className="card shadow-card mb-4 p-3">
							<div className="row">
								<div className="col-12 col-md-4 mb-4">
									<FormControl fullWidth>
										<Autocomplete
											id="programName1"
											freeSolo
											options={programNameList.map((option) => option.label)}
											renderInput={(params) => (
												<TextField
													{...params}
													label="Program Name"
													onChange={(e) => {
														handleProgramNameSel(e.target.value);
													}}
												/>
											)}
											required
											onChange={(e, value) => {
												handleProgramNameSel(value);
											}}
											value={programName}
											key={"programName-1"}
										/>
									</FormControl>
								</div>
								<div className="col-12 col-md-4 mb-4">
									<FormControl fullWidth>
										<LocalizationProvider dateAdapter={AdapterDayjs}>
											<DateTimePicker
												margin="normal"
												required
												fullWidth
												className="mb-3"
												label="Completion Date"
												format="DD-MM-YY hh:mm a"
												onChange={(newValue) => setCreationDate(newValue.$d)}
												error={
													!moment(completeDate, "YYYY-MM-DD hh:mm a ").isValid()
												}
												helperText={
													moment(completeDate, "YYYY-MM-DD hh:mm a").isValid()
														? ""
														: "Data Value is not Correct. Use format YYYY-MM-DD hh:mm a"
												}
											/>
										</LocalizationProvider>
									</FormControl>
								</div>
								<div className="col-12 col-md-4 mb-4">
									<FormControl fullWidth>
										<Autocomplete
											id="orderId1"
											freeSolo
											options={orderIdList.map((option) => option.label)}
											renderInput={(params) => (
												<TextField
													{...params}
													label="Order Id"
													onChange={(e) => handleOrderIdSel(e.target.value)}
												/>
											)}
											onChange={(e, value) => {
												handleOrderIdSel(value);
											}}
											value={order_id}
											key={"orderid-1"}
										/>
									</FormControl>
								</div>
							</div>
							<div className="row">
								<div className="col-12 col-md-4 mb-4">
									<TextField
										InputLabelProps={{ shrink: true }}
										type="text"
										margin="normal"
										required
										fullWidth
										className="mb-3"
										id="customer"
										size="small"
										label="Customer Name"
										name="customerName"
										autoComplete="customerName"
										value={customerName}
										error={customerName.length === 0}
										helperText={
											customerName.length === 0
												? "Please enter Customer Name"
												: ""
										}
									/>
								</div>
								<div className="col-12 col-md-4 mb-4">
									<TextField
										InputLabelProps={{ shrink: true }}
										type="text"
										margin="normal"
										required
										fullWidth
										className="mb-3"
										id="orderSize"
										size="small"
										label="Order Size"
										name="orderSize"
										autoComplete="orderSize"
										value={size}
										error={size.length === 0}
										helperText={size.length === 0 ? "Please enter size" : ""}
									/>
								</div>
								<div className="col-12 col-md-4 mb-4">
									<FormControl fullWidth>
										<Autocomplete
											id="cncModel1"
											freeSolo
											options={cncModelList.map((option) => option.lkp_value)}
											renderInput={(params) => (
												<TextField {...params} label="CNC Model" />
											)}
											onChange={(e, value) => {
												handleCNCModelSel(value);
											}}
											value={cncModel}
											key={"cncModel-1"}
										/>
									</FormControl>
								</div>
							</div>
							<div className="row">
								<div className="col-12 col-md-4 mb-4">
									<TextField
										InputLabelProps={{ shrink: true }}
										type="number"
										margin="normal"
										required
										fullWidth
										className="mb-3"
										id="quantity"
										size="small"
										label="Quantity"
										name="quantity"
										autoComplete="quantity"
										onChange={(e) => setQuantity(e.target.value)}
										value={quantity}
										error={quantity < 1}
										helperText={
											quantity < 1
												? "Quantity Less than 1 or invalid quantity"
												: ""
										}
									/>
								</div>
							</div>
							<div className="col-2">
								<Button variant="contained" color="primary" type="submit">
									Save
								</Button>
							</div>
						</div>
					</form>
				</div>
				<DialogActions>
					<Button onClick={() => handleCloseAddProgramDialog("yes")}>
						Close
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
