import { useState, useContext, useEffect, forwardRef } from "react";
import axios from "axios";
import moment from "moment";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AccessContext } from "../../../constant/accessContext";
import {
	Button,
	Dialog,
	Card,
	CardContent,
	Box,
	DialogTitle,
	IconButton,
} from "@mui/material";
import Slide from "@mui/material/Slide";
import CloseIcon from "@mui/icons-material/Close";

import OrderViewModal from "../../modals/OrderViewModal";
import {
	ordersToBeDispatched,
	updateSchedulerHoliday,
	updateSchedulerOrderDate,
	getOrderAllLakVal,
	updateSchedulerCommitmentStatus,
} from "../../../constant/url";
import Checkbox from "@mui/material/Checkbox";
import NoRowsOverlay from "../../Component/NoRowOverlay";
import statusPercentage from "../../../commonjs/StatusPercentage";

const Transition = forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function EnhancedTable() {
	const navigate = useNavigate();
	const access = useContext(AccessContext).authID;
	const [selectedRowId, setSelectedRowId] = useState(null);
	const [orderList, setOrderList] = useState([]);
	const [ordersToBeDispatchList, setOrdersToBeDispatchList] = useState([]);

	const [isLoadingDispatchList, setIsLoadingDispatchList] = useState(true);

	const [isUpdated, setIsUpdate] = useState(false);

	//Dialog States
	const [openOrderView, setOpenOrderView] = useState(false);

	const handleOrderList = () => {
		var bodyFormData = new FormData();
		bodyFormData.append("authId", access);
		//bodyFormData.append("pageType", "scheduler")
		axios({
			method: "post",
			url: getOrderAllLakVal,
			data: bodyFormData,
			headers: { "Content-Type": "multipart/form-data" },
		})
			.then(function (response) {
				//handle success
				const res_data = response.data;
				if (res_data.status_code === 101) {
					toast("Api Authentication failed. login again.");
				} else if (res_data.status_code === 200) {
					const ret_data_cd = res_data.data_orders;
					const newOrderlist = ret_data_cd.map((item, index) => {
						return { ...item, status: statusPercentage(item) };
					});
					setOrderList(newOrderlist);
				} else {
					console.log("handleOrderList else", res_data.status_msg);
				}
			})
			.catch(function (response) {
				//handle error
				console.error(response);
			});
		setIsUpdate(false);
	};

	const handleOrdersToBeDispatchedList = () => {
		setIsLoadingDispatchList(true);
		var bodyFormData = new FormData();
		bodyFormData.append("authId", access);
		axios({
			method: "post",
			url: ordersToBeDispatched,
			data: bodyFormData,
			headers: { "Content-Type": "multipart/form-data" },
		})
			.then(function (response) {
				//handle success

				setIsLoadingDispatchList(false);
				const res_data = response.data;
				if (res_data.status_code === 101) {
					toast("Api Authentication failed. login again.");
				} else if (res_data.status_code === 200) {
					setOrdersToBeDispatchList(
						res_data.data.map((row, index) => ({ id: index, ...row }))
					);
				} else {
					console.log("handleOrderList else", res_data.status_msg);
				}
			})
			.catch(function (response) {
				//handle error
				console.error(response);
				setIsLoadingDispatchList(false);
			});
		setIsUpdate(false);
	};

	const schedulerDateChangeHandler = (row, date, column) => {
		date = moment(date).format("YYYY-MM-DD");
		setOrderList(
			orderList.map((r) => ({
				...r,
				[column]: r.id === row.id ? date : r[column],
			}))
		);
		var bodyFormData = new FormData();
		bodyFormData.append("authId", access);
		bodyFormData.append("date", date);
		bodyFormData.append("column", column);
		bodyFormData.append("id", row.id);

		axios({
			method: "post",
			url: updateSchedulerOrderDate,
			data: bodyFormData,
			headers: { "Content-Type": "multipart/form-data" },
		})
			.then(function (response) {
				//handle success
				const res_data = response.data;
				if (res_data.status_code === 101) {
					toast("Api Authentication failed. login again.");
				}

				handleOrdersToBeDispatchedList();
			})
			.catch(function (response) {
				//handle error
				console.error(response);
			});
	};

	const commitmentChangeHandler = (id, isChecked = false) => {
		setOrderList(
			orderList.map((r) => ({
				...r,
				is_commitment_important:
					r.id === id ? (isChecked ? "1" : "0") : r["is_commitment_important"],
			}))
		);

		var bodyFormData = new FormData();
		bodyFormData.append("authId", access);
		bodyFormData.append("is_commitment_important", isChecked);
		bodyFormData.append("id", id);

		axios({
			method: "post",
			url: updateSchedulerCommitmentStatus,
			data: bodyFormData,
			headers: { "Content-Type": "multipart/form-data" },
		})
			.then(function (response) {
				console.log(response);
			})
			.catch(function (response) {
				//handle error
				console.error(response);
			});
	};
	const handleCloseModal = (response) => {
		setOpenOrderView(false);
	};
	const columns = [
		{
			field: "is_commitment_important",
			headerName: "Imp?",
			//flex: 1,
			width: 50,
			maxWidth: 50,
			renderCell: (params) => (
				<div>
					<Checkbox
						color="primary"
						checked={params.row.is_commitment_important !== "0"}
						onChange={(event, checked) =>
							commitmentChangeHandler(params.row.id, checked)
						}
					/>
				</div>
			),
		},
		{
			field: "order_id",
			headerName: "Order No",
			renderCell: (params) => {
				return (
					<Button
						fullWidth
						onClick={() => {
							setSelectedRowId(params.row.id);
							setOpenOrderView(true);
						}}
						color="info"
						className="toolButton-grid "
					>
						{params.row.order_id}{" "}
					</Button>
				);
			},
			maxWidth: 90,
			flex: 1,
		},
		{
			field: "order_date",
			headerName: "Order Date",
			maxWidth: 100,
			valueFormatter: (params) => {
				return moment(params?.value, "DD/MM/YYYY").format("Do MMM");
			},

			flex: 1,
		},
		{
			field: "full_customer_name",
			headerName: "Customer Name",
			width: 500,
			flex: 1,
		},
		{
			field: "size",
			headerName: "Size",
			maxWidth: 220,
			flex: 1,
		},
		{
			field: "sq_feet",
			headerName: "SQ Feet",
			flex: 1,
			maxWidth: 80,
			type: "number",
		},
		{
			field: "pipe_type",
			headerName: "Pipe Type",
			flex: 1,
			maxWidth: 150,
		},
		{
			field: "status",
			headerName: "Status",
			width: 100,
			maxWidth: 100,
			renderCell: (params) => {
				return params.value + "%";
			},
			flex: 1,
		},
		{
			field: "coil_ready_at",
			headerName: "Ready Date",
			//flex: 1,
			maxWidth: 150,
			width: 180,
			renderCell: (params) => {
				if (params.row.coil_ready_at === "Ready") return "Ready";

				if (params.row.is_commitment_important == "1")
					return params.row.coil_ready_at;

				return (
					<>
						<DatePicker
							value={dayjs(params.row.coil_ready_at)}
							onChange={(newValue) => {
								schedulerDateChangeHandler(
									params.row,
									newValue.toString(),
									"coil_ready_at"
								);
							}}
						/>
						<small>
							<a
								href="#"
								onClick={() =>
									schedulerDateChangeHandler(params.row, null, "coil_ready_at")
								}
							>
								CLR
							</a>
						</small>
					</>
				);
			},
		},
		{
			field: "est_delivery_date",
			headerName: "CTD",
			//flex: 1,
			maxWidth: 150,
			width: 180,
			renderCell: (params) => {
				return (
					<>
						<DatePicker
							value={dayjs(params.row.est_delivery_date)}
							onChange={(newValue) => {
								schedulerDateChangeHandler(
									params.row,
									newValue.toString(),
									"est_delivery_date"
								);
							}}
						/>
						<small>
							<a
								href="#"
								onClick={() =>
									schedulerDateChangeHandler(
										params.row,
										null,
										"est_delivery_date"
									)
								}
							>
								CLR
							</a>
						</small>
					</>
				);
			},
		},
		{
			field: "lead_time",
			headerName: "Lead Time",
			flex: 1,
			maxWidth: 100,
			width: 100,
			renderCell: (params) =>
				getLeadTime(params.row.coil_ready_at, params.row.order_date),
		},
	];

	const holidayCheckboxHandler = (date, checked) => {
		setOrdersToBeDispatchList(
			ordersToBeDispatchList.map((row) => ({
				...row,
				is_holiday: row.row_labels === date ? checked : row.is_holiday,
			}))
		);
		var bodyFormData = new FormData();
		bodyFormData.append("authId", access);
		bodyFormData.append("date", date);
		bodyFormData.append("is_holiday", checked);

		axios({
			method: "post",
			url: updateSchedulerHoliday,
			data: bodyFormData,
			headers: { "Content-Type": "multipart/form-data" },
		})
			.then(function (response) {
				//handle success
				const res_data = response.data;
				if (res_data.status_code === 101) {
					toast("Api Authentication failed. login again.");
				}
			})
			.catch(function (response) {
				//handle error
				console.error(response);
			});
	};

	const dispatcherColumns = [
		{
			field: "is_holiday",
			headerName: "H",
			//flex: 1,
			width: 40,
			maxWidth: 40,
			renderCell: (params) => {
				if (!["unassigned", "ready"].includes(params.row.row_labels)) {
					return (
						<div>
							<Checkbox
								color="primary"
								checked={params.row.is_holiday}
								onChange={(event, checked) =>
									holidayCheckboxHandler(params.row.row_labels, checked)
								}
							/>
						</div>
					);
				}

				return <></>;
			},
		},
		{
			field: "row_labels",
			headerName: "Date",
			width: 120,
			maxWidth: 120,
			valueFormatter: (params) => {
				if (!["ready", "unassigned"].includes(params.value)) {
					return moment(params.value, "YYYY-MM-DD").format("Do MMM");
				}

				return params.value;
			},
			//flex: 1,
		},
		{
			field: "total_orders",
			headerName: "Orders",
			flex: 1,
		},
		{
			field: "total_sq_feet",
			headerName: "Sq. Feet",
			flex: 1,
		},
	];

	const getLeadTime = (coilReadyDate, orderDate) => {
		if (!coilReadyDate || !orderDate) return "--";

		return moment(coilReadyDate).diff(moment(orderDate, "DD/MM/YYYY"), "days");
	};

	useEffect(() => {
		handleOrderList(access);
		handleOrdersToBeDispatchedList(access);
	}, []);

	return (
		<Box>
			<ToastContainer />
			<LocalizationProvider dateAdapter={AdapterDayjs}>
				<div className="row">
					<div className="col-3">
						<Card>
							<CardContent>
								<Box sx={{ height: "84vh", width: "100%" }}>
									<DataGrid
										density="compact"
										getRowClassName={(params) => {
											if (params.indexRelativeToCurrentPage % 2 === 0) {
												return params.row.is_holiday
													? "Mui-even secon-bg"
													: "Mui-even";
											} else {
												return params.row.is_holiday
													? "Mui-odd secon-bg"
													: "Mui-odd";
											}
										}}
										loading={isLoadingDispatchList}
										columns={dispatcherColumns}
										rows={ordersToBeDispatchList}
										// getRowClassName={(params) => params.row.is_holiday && "secon-bg"}
										editMode="row"
										slots={{
											toolbar: GridToolbar,
											noRowsOverlay: NoRowsOverlay,
										}}
										sx={{
											"--DataGrid-overlayHeight": "300px",
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
									/>
								</Box>
							</CardContent>
						</Card>
					</div>

					<div className="col-9">
						<Card>
							<CardContent>
								<Box sx={{ height: "84vh", width: "100%" }}>
									<DataGrid
										slots={{
											toolbar: GridToolbar,
											noRowsOverlay: NoRowsOverlay,
										}}
										loading={orderList.length === 0}
										getRowClassName={(params) => {
											if (params.row.is_commitment_important == "1") {
												return "Mui-even secon-bg";
											}

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
											"--DataGrid-overlayHeight": "300px",
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
										rows={orderList}
										editMode="row"
									/>
								</Box>
							</CardContent>
						</Card>
					</div>
				</div>
			</LocalizationProvider>

			<Dialog
				maxWidth={"lg"}
				fullWidth
				open={openOrderView}
				TransitionComponent={Transition}
				keepMounted
				onClose={() => setOpenOrderView(false)}
				key={Math.random(1, 100)}
			>
				<DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
					View Order Details
				</DialogTitle>
				<IconButton
					aria-label="close"
					onClick={handleCloseModal}
					sx={{
						position: "absolute",
						right: 8,
						top: 8,
						color: (theme) => theme.palette.grey[500],
					}}
					id="order-view-close-btn"
				>
					<CloseIcon />
				</IconButton>
				<OrderViewModal orderId={selectedRowId} key={Math.random(1, 100)} />
			</Dialog>
		</Box>
	);
}
