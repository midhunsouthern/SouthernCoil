import { useState, useContext, useEffect, forwardRef } from "react";
import axios from "axios";
import moment from "moment";
import { NavLink } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

import { AccessContext } from "../../constant/accessContext";

import { TickGif } from "../../commonjs/HilightRule";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";

import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import {
	Dialog,
	Button,
	Card,
	CardContent,
	Typography,
	Stack,
	DialogTitle,
	DialogActions,
	ImageList,
	ImageListItem,
	Box,
	IconButton,
	Select,
	MenuItem,
} from "@mui/material";
import Slide from "@mui/material/Slide";
import CloseIcon from "@mui/icons-material/Close";

import OrderViewModal from "../modals/OrderViewModal";
import ModuleTools from "../modals/ModuleTools";

import {
	getLookupData,
	setOrderGeneric,
	getImagesOnly,
	getOrderAllLakVal,
} from "../../constant/url";
import { IOSSwitch } from "../../commonjs/TableFunc";
import CommentBoxModal from "../modals/CommentBoxModal";
import { handleGenericUpdateRow } from "../../commonjs/CommonApi";

const Transition = forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});
export default function Dispatch() {
	const access = useContext(AccessContext).authID;
	const accessModuleList = useContext(AccessContext).accessModuleList;
	const [orderList, setOrderList] = useState([]);
	const [selectedRowId, setSelectedRowId] = useState(0);
	const [selComment, setSelComment] = useState("");
	const [imageBase64, setImageBase64] = useState([]);
	const [lookUpList, setLookupList] = useState([]);
	const [openStatusCnf, setOpenStatusCnf] = useState(false);
	const [openImgDialog, setOpenImgDialog] = useState(false);
	const [animeShow, setAnimeShow] = useState(false);
	const [selEvent, setSelEvent] = useState({
		target: { name: "", checked: null },
	});
	const [openCommentDialog, setOpenCommentDialog] = useState(false);
	const [openOrderView, setOpenOrderView] = useState(false);

	const handleClickOpenStatus = (rowId, e) => {
		setSelectedRowId(rowId);
		setSelEvent(e);
		setOpenStatusCnf(true);
	};
	const handleCloseModal = (response) => {
		setOpenOrderView(false);
	};
	const handleCloseStatus = (response) => {
		if (response === "yes") {
			handleNested(selectedRowId, {
				target: { name: "dispatch_status", checked: true },
			});
		}
		setOpenStatusCnf(false);
	};

	const handleCloseImg = (response) => {
		setOpenImgDialog(false);
	};

	const onChangeInputText = (e, rowId) => {
		const { name, value } = e.target;
		const editData = orderList.map((item) =>
			item.id === rowId && name ? { ...item, [name]: value } : item
		);
		setOrderList(editData);
		handleGenericUpdate(rowId, name, value);
	};

	const handleOrderList = () => {
		var bodyFormData = new FormData();
		bodyFormData.append("authId", access);
		bodyFormData.append("pageType", "dispatch");
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
					toast("Order Retrieved");
				} else {
					console.log(res_data.status_msg);
				}
			})
			.catch(function (response) {
				//handle error
				console.log(response);
			});
	};

	const handleGenericDatetimeCheck = (rowId, e) => {
		const { name, checked } = e.target;
		const date = new Date();
		const data_val = checked ? moment(date).format("DD MMM YY H:mm") : "";
		const editData = orderList.map((item) =>
			item.id === rowId && name ? { ...item, [name]: data_val } : item
		);

		handleGenericUpdate(rowId, name, data_val);
		setOrderList(editData);
	};

	const handleNested = (rowId, e) => {
		const { name, checked } = e.target;
		var editData;
		if (name.includes("status")) {
			editData = orderList.filter((itemA) => rowId !== itemA.id);
		} else {
			editData = orderList.map((item) =>
				item.id === rowId && name ? { ...item, [name]: String(checked) } : item
			);
		}

		setOrderList(editData);
		handleGenericUpdate(rowId, name, String(checked));
	};

	const handleDispatchComments = (rowId, rowValue) => {
		handleGenericUpdate(rowId, "dispatch_comment", rowValue);
		const editData = orderList.map((item) =>
			item.id === rowId ? { ...item, ["dispatch_comment"]: rowValue } : item
		);
		setOrderList(editData);
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
					toast(res_data.status_msg, "success");
					handleOrderList(access);
					if (field.includes("status")) {
						setAnimeShow(true);
						const timeId = setTimeout(() => {
							// After 3 seconds set the show value to false
							setAnimeShow(false);
						}, 4000);

						return () => {
							clearTimeout(timeId);
						};
					}

					//return data
				} else {
					toast(res_data.status_msg, "error");
					return false;
				}
			})
			.catch(function (response) {
				//handle error
				console.log(response);
			});
	};

	function handleGetLookup() {
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
				if (res_data.status_code === 200) {
					setLookupList(res_data);
				} else {
					toast(res_data.status_msg, "error");
				}
			})
			.catch(function (response) {
				//handle error
				console.log(response);
			});
	}

	function handleGetImagebyId(epid, assemblyid, brazingid) {
		var bodyFormData = new FormData();
		bodyFormData.append("authId", access);
		bodyFormData.append("epImg", epid);
		bodyFormData.append("assemblyImg", assemblyid);
		bodyFormData.append("brazingImg", brazingid);

		axios({
			method: "post",
			url: getImagesOnly,
			data: bodyFormData,
			headers: { "Content-Type": "multipart/form-data" },
		})
			.then(function (response) {
				//handle success
				const res_data = response.data;
				if (res_data.status_code === 200) {
					setImageBase64(res_data["data_orders"]);
				} else {
					toast(res_data.status_msg, "error");
				}
			})
			.catch(function (response) {
				//handle error
				console.log(response);
			});
	}

	const refreshData = (request) => {
		if (request) {
			handleOrderList(access);
		}
	};

	useEffect(() => {
		handleGetLookup();
		handleOrderList(access);
	}, []);

	const columns = [
		{
			field: "order_id",
			headerName: "Order No",
			maxWidth: 70,
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
			flex: 1,
		},
		{
			field: "full_customer_name",
			headerName: "Customer Name",
			minWidth: 90,
			flex: 1,
		},
		{
			field: "size",
			headerName: "Size",
			minWidth: 50,
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
			field: "paint",
			headerName: "Mode of Dispatch",
			renderCell: (params) => {
				let firstDispatchMethod =
					params.row.dispatch_mode.trim().charAt(0) === ","
						? params.row.dispatch_mode.substr(1).split(",")[0]
						: params.row.dispatch_mode.split(",")[0];
				return (
					<Select
						fullWidth
						required={true}
						label="Dispatch Model"
						value={firstDispatchMethod}
						onChange={(event) => onChangeInputText(event, params.row.id)}
						name="dispatch_mode"
					>
						{lookUpList["dispatchMode"]?.map((item) => {
							return <MenuItem value={item.id}>{item.lkp_value}</MenuItem>;
						})}
					</Select>
				);
			},
			maxWidth: 100,
			flex: 1,
		},
		{
			field: "order_confirm_date",
			headerName: "Order Confirmation",
			flex: 1,
			maxWidth: 120,
			type: "date",
			editable: true,
			valueFormatter: (params) => moment(params?.value).format("DD/MM/YYYY"),
		},
		{
			field: "est_delivery_date",
			headerName: "CTD",
			flex: 1,
			maxWidth: 120,
			type: "date",
			editable: true,
			valueFormatter: (params) => moment(params?.value).format("DD/MM/YYYY"),
		},
		{
			field: "dispatch_comment",
			headerName: "Dispatch Comments",
			editable: true,
			minWidth: 200,
			flex: 1,
		},
		{
			field: "dispatch_status",
			headerName: "Status",
			renderCell: (params) => {
				return (
					<IOSSwitch
						checked={params.row.dispatch_status === "true" ? true : false}
						sx={{ m: 1 }}
						name="dispatch_status"
						onChange={(e) => {
							handleClickOpenStatus(params.row.id, e);
						}}
					></IOSSwitch>
				);
			},
			maxWidth: 70,
			flex: 1,
		},
	];

	return (
		<Box style={{ marginTop: "105px", width: "100%" }}>
			<ToastContainer />
			<TickGif show={animeShow} />
			<Card>
				<CardContent>
					<Stack direction={"row"} spacing={4}>
						<Typography
							gutterBottom
							variant="h5"
							component="div"
							className="mt-2"
						>
							Dispatch
						</Typography>
						<ModuleTools
							pageName="dispatch"
							OrderData={orderList}
							refreshPage={(request) => refreshData(request)}
						/>
						<div style={{ border: "1px solid grey" }}></div>
						{accessModuleList.filter(
							(x) => x.module_name === "M4paintPacking"
						)[0].access_rw === "1" && (
							<NavLink to="/paintingpacking" className="toolButton">
								<KeyboardDoubleArrowLeftIcon style={{ color: "#BC1921" }} />
								Prev Module
							</NavLink>
						)}
					</Stack>
					<div className="mt-3">
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
							processRowUpdate={(param, event) => {
								handleGenericUpdateRow(
									access,
									[
										"dispatch_comment",
										"order_confirm_date",
										"est_delivery_date",
									],
									param
								).then((pStatus) => {
									console.log(pStatus);
								});
								return param;
							}}
							onProcessRowUpdateError={(param) => {
								console.log(param);
							}}
							rowHeight={50}
							columns={columns}
							rows={orderList}
							editMode="row"
						/>
					</div>
				</CardContent>
			</Card>

			<Dialog
				open={openCommentDialog}
				TransitionComponent={Transition}
				keepMounted
				onClose={() => setOpenCommentDialog(false)}
				key={Math.random(1, 100)}
			>
				<CommentBoxModal
					content={selComment}
					retContent={(e) => {
						handleDispatchComments(selectedRowId, e);
						setOpenCommentDialog(false);
					}}
				/>
			</Dialog>

			<Dialog
				fullWidth={true}
				maxWidth={"lg"}
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

			<Dialog
				open={openStatusCnf}
				TransitionComponent={Transition}
				keepMounted
				onClose={handleCloseStatus}
				aria-describedby="alert-dialog-slide-description"
			>
				<DialogTitle>
					{"Do you want to mark the status complete of the order?"}
				</DialogTitle>
				<DialogActions>
					<Button onClick={() => handleCloseStatus("no")}>No</Button>
					<Button onClick={() => handleCloseStatus("yes")}>Yes</Button>
				</DialogActions>
			</Dialog>

			<Dialog
				open={openImgDialog}
				TransitionComponent={Transition}
				keepMounted
				onClose={handleCloseImg}
				aria-describedby="alert-dialog-slide-description"
				fullWidth
				maxWidth="lg"
				style={{ padding: "5px" }}
			>
				<Stack>
					<>
						{imageBase64.ep_photo?.length > 0 ? (
							<DialogTitle>End Plate Images</DialogTitle>
						) : (
							""
						)}
						{
							<ImageList cols={1} rowHeight={500}>
								{imageBase64.ep_photo?.map((item, index) => (
									<ImageListItem key={"epphoto" + index}>
										<img
											src={item}
											srcSet={item}
											alt={"Assembly"}
											loading="lazy"
										/>
									</ImageListItem>
								))}
							</ImageList>
						}
					</>
					<>
						{imageBase64.assembly_Photo?.length > 0 ? (
							<DialogTitle>Assembly Images</DialogTitle>
						) : (
							""
						)}

						{
							<ImageList cols={1}>
								{imageBase64.assembly_Photo?.map((item, index) => (
									<ImageListItem key={"assembly" + index}>
										<img
											src={item}
											srcSet={item}
											alt={"Assembly"}
											loading="lazy"
										/>
									</ImageListItem>
								))}
							</ImageList>
						}
					</>
					<>
						{imageBase64.brazing_Photo?.length > 0 ? (
							<DialogTitle>Brazing Images</DialogTitle>
						) : (
							""
						)}
						{
							<ImageList cols={1}>
								{imageBase64.brazing_Photo?.map((item, index) => (
									<ImageListItem key={"brazing" + index}>
										<img
											src={item}
											srcSet={item}
											alt={"Assembly"}
											loading="lazy"
										/>
									</ImageListItem>
								))}
							</ImageList>
						}
					</>
				</Stack>
				<DialogActions>
					<Button onClick={() => handleCloseImg("yes")}>Close</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
}
