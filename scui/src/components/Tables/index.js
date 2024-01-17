import { useState, useContext, useEffect, forwardRef } from "react";
import axios from "axios";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

import { AccessContext } from "../../constant/accessContext";
import {
	Button,
	IconButton,
	Stack,
	Tooltip,
	Dialog,
	DialogTitle,
	DialogActions,
	Container,
	Card,
	CardContent,
	Typography,
	Box,
	AppBar,
	Toolbar,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

import Slide from "@mui/material/Slide";
import { IOSSwitch } from "../../commonjs/TableFunc";

import CreateRoundedIcon from "@mui/icons-material/CreateRounded";
import DeleteIcon from "@mui/icons-material/Delete";
import AddchartIcon from "@mui/icons-material/Addchart";
import CallSplitIcon from "@mui/icons-material/CallSplit";
import DownloadIcon from "@mui/icons-material/Download";

import StatusBar from "../modals/StatsBar";
import OrderViewModal from "../modals/OrderViewModal";
import OrderEditModal from "../modals/OrderEditModal";
import BrazingQuantity from "../modals/BrazingQuantity";
import OrderSplit from "../modals/OrderSplit";
import AddRemoveOrderQuantity from "../modals/AddRemoveOrderQuantity";
import { saveAsExcel } from "../../commonjs/CommonFun";
import {
	getOrderAllLakVal,
	getOrderAll,
	setOrderGeneric,
	setOrderHold,
	setOrderDelete,
	setOrderSplitNew,
} from "../../constant/url";

const Transition = forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function EnhancedTable() {
	const navigate = useNavigate();
	const access = useContext(AccessContext).authID;
	const [selectedRowId, setSelectedRowId] = useState(null);
	const [orderList, setOrderList] = useState([]);
	const [isUpdated, setIsUpdate] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [selEvent, setSelEvent] = useState({
		target: { name: "", checked: null },
	});
	const [orderToSplit, setOrderTOSPlit] = useState(null);

	const [unSplitOrderId, setUnSplitOrderId] = useState(0);
	const [splitId, setSplitId] = useState(0);

	//Dialog States
	const [openStatusCnf, setOpenStatusCnf] = useState(false);
	const [openProgressBardialog, setOpenProgressBardialog] = useState(false);
	const [openOrderSplitting, setOpenOrderSplitting] = useState(false);
	const [openOrderEdit, setOpenOrderEdit] = useState(false);
	const [openOrderView, setOpenOrderView] = useState(false);
	const [openAddRemoveQuantity, setOpenAddRemoveQuantity] = useState(false);

	const handleClickOpenStatus = (rowId, e) => {
		
		setSelectedRowId(rowId);
		setSelEvent(e);
		setOpenStatusCnf(true);
	};

	const handleCloseStatus = (response) => {
		if (response === "yes") {
			if (selEvent.target.name === "delete") {
				handleOrderDelete(selectedRowId);
			} else {
				handleGeneric(selectedRowId, selEvent);
			}
		}
		setOpenStatusCnf(false);
	};

	const handleClickOpenSplitOrder = (rowId, orderIdSplit, splitId) => {
		setSelectedRowId(rowId);
		setUnSplitOrderId(orderIdSplit);
		setSplitId(splitId);
		setOpenOrderSplitting(true);
	};

	const handleClickOpenAddRemoveQty = (rowId, orderIdSplit, splitId) => {
		setSelectedRowId(rowId);
		setUnSplitOrderId(orderIdSplit);
		setSplitId(splitId);
		setOpenAddRemoveQuantity(true);
	};

	const handleOrderList = (authID) => {
		var bodyFormData = new FormData();
		bodyFormData.append("authId", authID);
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
					setOrderList(ret_data_cd);
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

	const handleGeneric = (rowId, eTarget) => {
		const { name, checked } = {
			name: eTarget.target.name,
			checked: eTarget.target.checked ? false : true,
		};
		var editData;
		if (name.includes("status")) {
			editData = orderList.splice(
				orderList.findIndex((item) => item.id === rowId),
				1
			);
		} else {
			editData = orderList.map((item) =>
				item.id === rowId && name ? { ...item, [name]: String(checked) } : item
			);
			setOrderList(editData);
		}
		handleGenericUpdate(rowId, name, String(checked));
	};
	const handleCloseModal = (response) => {
		setOpenOrderView(false);
	};
	const handleGenericUpdate = async (rowid, field, value) => {
		var bodyFormData = new FormData();
		bodyFormData.append("authId", access);
		bodyFormData.append("id", rowid);
		bodyFormData.append(field, value);

		axios({
			method: "post",
			url: setOrderGeneric,
			data: bodyFormData,
			headers: { "Content-Type": "multipart/form-data" },
		})
			.then(function (response) {
				//handle success
				const res_data = response.data;
				if (res_data.status_code === 200) {
					toast(res_data.status_msg);
					return true;
					//return data
				} else {
					toast(res_data.status_msg);
					return false;
				}
			})
			.catch(function (response) {
				//handle error
				console.error(response);
			});
	};

	const handleOrderDelete = (rowid) => {
		var bodyFormData = new FormData();
		bodyFormData.append("authId", access);
		bodyFormData.append("id", rowid);
		axios({
			method: "post",
			url: setOrderDelete,
			data: bodyFormData,
			headers: { "Content-Type": "multipart/form-data" },
		})
			.then(function (response) {
				//handle success
				const res_data = response.data;
				if (res_data.status_code === 101) {
					toast("Api Authentication failed. login again.");
				} else if (res_data.status_code === 200) {
					handleOrderList(access);
					toast(res_data.status_msg);
				} else {
					toast(res_data.status_msg);
				}
			})
			.catch(function (response) {
				//handle error
				console.error(response);
			});
	};

	const handleSplitUpdated = (e) => {
		if (e) {
			handleOrderList(access);
			setOpenOrderSplitting(false);
		}
	};

	const handleQuantityUpdated = (e) => {
		if (e) {
			handleOrderList(access);
			setOpenAddRemoveQuantity(false);
		}
	};

	const columns = [
		{
			field: "order_id",
			headerName: "Order No",
			renderCell: (params) => {
				return (
					<Button
						fullWidth
						onClick={() => {
							console.log('Open Order Edit',openOrderEdit)
							setSelectedRowId(params.row.id);
							//setIsEdit(false);
							setOpenOrderEdit(false);
							console.log('Open Order Edit',openOrderEdit)
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
			width: 200,
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
			field: "status",
			headerName: "Status",
			width: 200,
			renderCell: (params) => {
				return (
					<div className="position-relative">
						<StatusBar statusData={params.row} source="Table" />
					</div>
				);
			},
			flex: 1,
		},
		{
			field: "ready_date",
			headerName: "Ready Date",
			flex: 1,
			maxWidth: 130,
		},
		{
			field: "delievery_date",
			headerName: "Delivery Date",
			flex: 1,
			maxWidth: 130,
		},
		{
			field: "priority",
			headerName: "Priority",
			maxWidth: 70,
			renderCell: (params) => {
				console.log("check priority", params.row.priority);
				return (
					<div className="position-relative">
						<IOSSwitch
							name="priority"
							checked={params.row.priority === "true" ? true : false}
							onChange={(e) => handleClickOpenStatus(params.row.id, e)}
						></IOSSwitch>
					</div>
				);
			},
			flex: 1,
		},
		{
			field: "hold",
			headerName: "Hold",
			maxWidth: 70,
			renderCell: (params) => {
				return (
					<div className="position-relative">
						<IOSSwitch
							name="hold"
							checked={params.row.hold === "true" ? true : false}
							onChange={(e) => handleClickOpenStatus(params.row.id, e)}
						></IOSSwitch>
					</div>
				);
			},
			flex: 1,
		},
		{
			field: "Action",
			headerName: "Action",
			maxWidth: 150,
			renderCell: (params) => {
				return (
					<Stack direction={"row"}>
						<Tooltip title="Edit">
							<IconButton
								onClick={() => {
									setSelectedRowId(params.row.id);
									setIsEdit(true);
									setOpenOrderEdit(true);
								}}
							>
								<CreateRoundedIcon />
							</IconButton>
						</Tooltip>
						<Tooltip title="Delete">
							<IconButton
								onClick={() =>
									handleClickOpenStatus(params.row.id, {
										target: { name: "delete" },
									})
								}
								name="delete"
								color="error"
							>
								<DeleteIcon />
							</IconButton>
						</Tooltip>
						{params.row.split_id.length === 0 && (
							<Tooltip title="Split Order">
								<IconButton
									onClick={() =>
										handleClickOpenSplitOrder(
											params.row.id,
											params.row.unsplit_order_id,
											params.row.split_id
										)
									}
									name="Split Order"
									color="warning"
								>
									<CallSplitIcon />
								</IconButton>
							</Tooltip>
						)}
						<Tooltip title="Brazing Quantity">
							<IconButton
								onClick={() =>
									handleClickOpenAddRemoveQty(
										params.row.id,
										params.row.unsplit_order_id,
										params.row.split_id
									)
								}
								name="Brazing Quantity"
								color="warning"
							>
								<AddchartIcon />
							</IconButton>
						</Tooltip>
					</Stack>
				);
			},
			flex: 1,
		},
	];
	useEffect(() => {
		handleOrderList(access);
	}, []);

	useEffect(() => {
		if (isUpdated) {
			handleOrderList(access);
		}
	}, [isUpdated]);

	return (
		<Box>
			<ToastContainer />
			<Card>
				<CardContent>
					<Stack direction={"row"}>
						<Typography gutterBottom variant="h5" component="div">
							Order Management
						</Typography>
						<Tooltip title="Download Excel list">
							<IconButton color="info" onClick={() => saveAsExcel(orderList)}>
								<DownloadIcon />
							</IconButton>
						</Tooltip>
					</Stack>
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
						rows={orderList}
						editMode="row"
					/>
				</CardContent>
			</Card>

			<Dialog
				open={openOrderEdit}
				TransitionComponent={Transition}
				keepMounted
				onClose={() => setOpenOrderEdit(false)}
				key={Math.random(1, 100)}
			>
				<OrderEditModal
					orderId={selectedRowId}
					isUpdate={(status) => setIsUpdate(status)}
					isEdit={isEdit}
					key={Math.random(1, 100)}
				/>
			</Dialog>

			<Dialog
			
				open={openOrderView}
				TransitionComponent={Transition}
				keepMounted
				key={Math.random(1, 100)}
			>
				 <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          View Order Details
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseModal}
          sx={{
            position: 'absolute',
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

			<Dialog
				open={openStatusCnf}
				TransitionComponent={Transition}
				keepMounted
				onClose={handleCloseStatus}
				aria-describedby="alert-dialog-slide-description"
				key={Math.random(1, 100)}
			>
				<DialogTitle>{"Do you want to update the order?"}</DialogTitle>
				<DialogActions>
					<Button onClick={() => handleCloseStatus("no")}>No</Button>
					<Button onClick={() => handleCloseStatus("yes")}>Yes</Button>
				</DialogActions>
			</Dialog>

			<Dialog
				open={openProgressBardialog}
				TransitionComponent={Transition}
				keepMounted
				onClose={() => setOpenProgressBardialog(false)}
				aria-describedby="alert-dialog-slide-description"
			>
				<div
					style={{
						width: "600px",
						marginTop: "10px",
						display: "flex",
						justifyContent: "center",
					}}
				>
					<StatusBar statusData={selectedRowId} source="Dialog" />
				</div>
				<DialogActions>
					<Button onClick={() => setOpenProgressBardialog(false)}>Close</Button>
				</DialogActions>
			</Dialog>

			<Dialog
				open={openOrderSplitting}
				TransitionComponent={Transition}
				keepMounted
				onClose={() => setOpenOrderSplitting(false)}
				aria-describedby="alert-dialog-slide-description"
				key={Math.random(1, 100)}
			>
				<div
					style={{
						width: "600px",
						marginTop: "10px",
						display: "flex",
						justifyContent: "center",
					}}
				>
					{/* <Typography variant="p">
            Are you sure you want to split the order { orderToSplit } ? 
          </Typography> */}
					<OrderSplit
						orderId={unSplitOrderId}
						splitId={splitId}
						key={Math.random(1, 100)}
						isUpdated={(e) => handleSplitUpdated(e)}
					/>
				</div>
			</Dialog>

			<Dialog
				open={openAddRemoveQuantity}
				TransitionComponent={Transition}
				keepMounted
				onClose={() => setOpenAddRemoveQuantity(false)}
				aria-describedby="alert-dialog-slide-description"
				key={Math.random(1, 100)}
			>
				<div
					style={{
						width: "100%",
						marginTop: "10px",
						display: "flex",
						justifyContent: "center",
					}}
				>
					<AddRemoveOrderQuantity
						orderId={unSplitOrderId}
						splitId={splitId}
						key={Math.random(1, 100)}
						isUpdated={(e) => handleQuantityUpdated(e)}
					/>
				</div>
				<DialogActions>
					<Button onClick={() => setOpenAddRemoveQuantity(false)}>Close</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
}
