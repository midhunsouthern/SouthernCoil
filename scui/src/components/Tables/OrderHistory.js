import { useState, useContext, useEffect, forwardRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import moment from "moment";

import { AccessContext } from "../../constant/accessContext";
import {
	getOrderHistory,
	getOrderBrazingLeak,
	allData_excel,
} from "../../constant/url";

import { DataGrid } from "@mui/x-data-grid";
import {
	Dialog,
	Button,
	Container,
	Tooltip,
	IconButton,
	Card,
	CardContent,
	Typography,
	Stack,
} from "@mui/material";
import Slide from "@mui/material/Slide";

import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import DownloadIcon from "@mui/icons-material/Download";

import StatusBar from "../modals/StatsBar";
import OrderViewModal from "../modals/OrderViewModal";
import OrderEditModal from "../modals/OrderEditModal";
import { saveAsExcel } from "../../commonjs/CommonFun";

const Transition = forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function OrderHistory() {
	const navigate = useNavigate();
	const access = useContext(AccessContext).authID;
	const [orderList, setOrderList] = useState([]);
	const [allOrderList, setAllOrderList] = useState([]);
	const [BrazingLeakList, setBrazingLeakList] = useState([]);
	const [isUpdated, setIsUpdate] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [selectedRowId, setSelectedRowId] = useState(null);

	//Dialog States
	const [openOrderEdit, setOpenOrderEdit] = useState(false);
	const [openOrderView, setOpenOrderView] = useState(false);

	const handleOrderList = (authID) => {
		var bodyFormData = new FormData();
		bodyFormData.append("authId", authID);
		axios({
			method: "post",
			url: getOrderHistory,
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
					toast("Data Received.");
				} else {
					console.log(res_data.status_msg);
				}
			})
			.catch(function (response) {
				//handle error
				console.log(response);
			});
		setIsUpdate(false);
	};

	const handleAllDataOrderList = (authID) => {
		var bodyFormData = new FormData();
		bodyFormData.append("authId", authID);
		bodyFormData.append("reqType", "history");
		axios({
			method: "post",
			url: allData_excel,
			data: bodyFormData,
			headers: { "Content-Type": "multipart/form-data" },
		})
			.then(function (response) {
				//handle success
				const res_data = response.data;
				if (res_data.status_code === 101) {
					toast("Api Authentication failed. login again.");
				} else if (res_data.status_code === 200) {
					const ret_data_cd = res_data.data;
					// setAllOrderList(ret_data_cd);
					saveAsExcel(
						ret_data_cd,
						"Order History " + moment().format("YYYYMMDD H_mm").toString()
					);
					toast("Excel Data Received.");
				} else {
					console.log(res_data.status_msg);
				}
			})
			.catch(function (response) {
				//handle error
				console.log(response);
			});
		setIsUpdate(false);
	};

	const handleBrazingLeak = (authID) => {
		var bodyFormData = new FormData();
		bodyFormData.append("authId", authID);
		axios({
			method: "post",
			url: getOrderBrazingLeak,
			data: bodyFormData,
			headers: { "Content-Type": "multipart/form-data" },
		})
			.then(function (response) {
				//handle success
				const res_data = response.data;
				if (res_data.status_code === 101) {
					toast("Api Authentication failed. login again.");
				} else if (res_data.status_code === 200) {
					const ret_data_cd = res_data.data;
					saveAsExcel(res_data.data);
					setBrazingLeakList(ret_data_cd);
				} else {
					console.log(res_data.status_msg);
				}
			})
			.catch(function (response) {
				//handle error
				console.log(response);
			});
		setIsUpdate(false);
	};

	const columns = [
		{
			field: "order_id",
			headerName: "Order No",
			renderCell: (params) => {
				return (
					<Button
						onClick={() => {
							setSelectedRowId(params.row.id);
							setIsEdit(false);
							setOpenOrderView(true);
						}}
						color="info"
					>
						{params.row.order_id}{" "}
					</Button>
				);
			},
			flex: 1,
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
			field: "order_date",
			headerName: "Order Date",
			flex: 1,
		},
		{
			field: "full_customer_name",
			headerName: "Customer Name",
			width: 200,
			flex: 1,
		},
		{
			field: "size",
			headerName: "Size",
			width: 150,
			flex: 1,
		},
		{
			field: "sq_feet",
			headerName: "Sq Feet",
			flex: 1,
		},
		{
			field: "Action",
			headerName: "Action",
			renderCell: (params) => {
				return (
					<Tooltip title="Re-Use Order History">
						<IconButton
							onClick={() =>
								navigate("/createOrder", {
									state: { orderRowid: params.row.id },
								})
							}
							name="re-use"
							color="success"
						>
							<HistoryEduIcon />
						</IconButton>
					</Tooltip>
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
		<Container>
			<ToastContainer />
			<Card>
				<CardContent>
					<Stack direction={"row"}>
						<Typography gutterBottom variant="h5" component="div">
							Order History
						</Typography>
						<Tooltip title="Download Excel list">
							<IconButton
								color="info"
								onClick={() => handleAllDataOrderList(access)}
							>
								<DownloadIcon />
								<p>Order History</p>
							</IconButton>
						</Tooltip>
						<Tooltip title="Download Brazing Leak list">
							<IconButton
								color="info"
								onClick={() => handleBrazingLeak(access)}
							>
								<DownloadIcon />
								<p>Brazing Details</p>
							</IconButton>
						</Tooltip>
					</Stack>
					<DataGrid
						getRowClassName={(params) =>
							params.indexRelativeToCurrentPage % 2 === 0
								? "Mui-even"
								: "Mui-odd"
						}
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
				onClose={() => setOpenOrderView(false)}
				key={Math.random(1, 100)}
			>
				<OrderViewModal orderId={selectedRowId} key={Math.random(1, 100)} />
			</Dialog>
		</Container>
	);
}
