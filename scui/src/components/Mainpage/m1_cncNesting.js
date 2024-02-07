import {
	useState,
	useContext,
	useEffect,
	forwardRef,
	useCallback,
} from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import moment from "moment";

import { AccessContext } from "../../constant/accessContext";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";

import { DataGrid, GridToolbar } from "@mui/x-data-grid";
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
	TextField,
	Checkbox,
	DialogTitle,
	DialogActions,
	ImageList,
	ImageListItem,
	Box,
} from "@mui/material";
import Slide from "@mui/material/Slide";
import { TickGif } from "../../commonjs/HilightRule";
import CloseIcon from '@mui/icons-material/Close';

import OrderViewModal from "../modals/OrderViewModal";
import {
	handleFindCoverDetailLookup_arr,
	handleFindLookup_arr,
} from "../../commonjs/CommonFun";

import {
	getLookupData,
	setOrderGeneric,
	getImagesOnly,
	getOrderAllLakVal,
	imageURL,
} from "../../constant/url";
import { IOSSwitch } from "../../commonjs/TableFunc";
import CommentBoxModal from "../modals/CommentBoxModal";
import ModuleTools from "../modals/ModuleTools";
import { handleGenericUpdateRow } from "../../commonjs/CommonApi";

const Transition = forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});
export default function M1cncNesting() {
	const access = useContext(AccessContext).authID;
	const [orderList, setOrderList] = useState([]);
	const [selectedRowId, setSelectedRowId] = useState(0);
	const [selComment, setSelComment] = useState("");
	const [imageBase64, setImageBase64] = useState([]);
	const [lookUpList, setLookupList] = useState([]);
	const [openStatusCnf, setOpenStatusCnf] = useState(false);
	const [openImgDialog, setOpenImgDialog] = useState(false);
	const [animeShow, setAnimeShow] = useState(false);
	const [isEdit, setIsEdit] = useState(false);

	const [openCommentDialog, setOpenCommentDialog] = useState(false);
	const [openOrderView, setOpenOrderView] = useState(false);

	const handleClickOpenStatus = (rowId) => {
		setSelectedRowId(rowId);
		setOpenStatusCnf(true);
	};

	const handleCloseStatus = (response) => {
		if (response === "yes") {
			handleNested(selectedRowId, {
				target: { name: "cnc_nesting_status", checked: true },
			});
		}
		setOpenStatusCnf(false);
	};

	const handleCloseImg = (response) => {
		setOpenImgDialog(false);
	};

	const handleOrderList = () => {
		var bodyFormData = new FormData();
		bodyFormData.append("authId", access);
		bodyFormData.append("pageType", "cncNesting");
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

	const handleNested = (rowId, e) => {
		const { name, checked } = e.target;
		var idx = orderList.findIndex((item) => item.id === rowId);
		if (name === "cnc_nesting_status") {
			if (orderList.at(idx).cnc_nesting_pgm_no.trim().length === 0) {
				toast(
					"Please update CNC Nesting Number Before updating status.",
					"warning"
				);
				return;
			}
			if (
				orderList.at(idx).cnc_nested !== "true" &&
				!moment(orderList.at(idx).cnc_nested, "YYYY-MM-DD HH:mm:ss").isValid()
			) {
				toast("Please check CNC Nesting Before updating status.", "warning");
				return;
			}
		}

		var editData;
		if (name.includes("status")) {
			editData = orderList.filter((itemA) => rowId !== itemA.id);
			setOrderList(editData);
			handleGenericUpdate(rowId, name, String(checked));
			return;
		} else {
			editData = orderList.map((item) =>
				item.id === rowId && name
					? { ...item, [name]: moment().format("YYYY-MM-DD HH:mm:ss") }
					: item
			);
			setOrderList(editData);
			handleGenericUpdate(rowId, name, moment().format("YYYY-MM-DD HH:mm:ss"));
			return;
		}
	};

	const handleEPComments = (rowId, rowValue) => {
		handleGenericUpdate(rowId, "ep_comments", rowValue);
		const editData = orderList.map((item) =>
			item.id === rowId ? { ...item, ["ep_comments"]: rowValue } : item
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
					handleOrderList(access);
					toast(res_data.status_msg, "success");
					if (field.includes("status")) {
						setAnimeShow(true);
						const timeId = setTimeout(() => {
							// After 3 seconds set the show value to false
							setAnimeShow(false);
						}, 3000);

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
	const handleCloseModal = (response) => {
		setOpenOrderView(false);
	};
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
		if (lookUpList.length === 0) {
			handleGetLookup();
		}
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
							setIsEdit(false);
							setOpenOrderView(true);
						}}
						color="info"
						className="toolButton-grid "
					>
						{params.row.order_id}
					</Button>
				);
			},
			flex: 1,
		},
		{
			field: "full_customer_name",
			headerName: "Customer",
			minWidth: 90,
			flex: 1,
		},
		{
			field: "size",
			headerName: "Size",
			minWidth: 120,
			flex: 1,
			style: { fontWeight: "700" },
		},
		{
			field: "pipe_type",
			headerName: "Pipe",
			maxWidth: 75,
			flex: 1,
		},
		{
			field: "end_plate_material",
			headerName: "EP Matl",
			maxWidth: 75,
			flex: 1,
		},
		{
			field: "end_plate_modal",
			headerName: "EP Model",
			minWidth: 150,
			renderCell: (params) => {
				return (
					<Button
						fullWidth
						onClick={() => {
							setImageBase64("");
							setOpenImgDialog(true);
							handleGetImagebyId(params.row.ep_photo, "N/A", "N/A");
						}}
						color="info"
						className="toolButton-grid "
					>
						{params.row.end_plate_modal}
					</Button>
				);
			},
			flex: 1,
		},
		{
			field: "end_plate_orientation",
			headerName: "LH/RH",
			valueGetter: (params) => {
				return handleFindLookup_arr(
					lookUpList,
					"oreientation",
					params.row.end_plate_orientation
				);
			},
			maxWidth: 70,
			flex: 1,
		},
		{
			field: "cover_detail",
			headerName: "Cover Details",
			valueGetter: (params) => {
				return handleFindCoverDetailLookup_arr(
					lookUpList,
					params.row.cover_detail
				);
			},
			minWidth: 150,
			flex: 1,
		},
		{
			field: "ep_comments",
			headerName: "EP Comments",
			editable: true,
			minWidth: 150,
			flex: 1,
		},
		{
			field: "cnc_nested",
			headerName: "Nest",
			renderCell: (params) => {
				return (
					<Checkbox
						checked={
							params.row.cnc_nested === "true" ||
							moment(params.row.cnc_nested, "YYYY-MM-DD HH:mm:ss").isValid()
								? true
								: false
						}
						sx={{ m: 1 }}
						name="cnc_nested"
						onChange={(e) => handleNested(params.row.id, e)}
					/>
				);
			},
			maxWidth: 50,
			flex: 1,
		},
		{
			field: "cnc_nesting_pgm_no",
			headerName: "Nesting No.",
			editable: true,
			minWidth: 150,
			flex: 1,
		},
		{
			field: "cnc_nesting_status",
			headerName: "Status",
			renderCell: (params) => {
				return (
					<IOSSwitch
						checked={params.row.cnc_nesting_status === "true" ? true : false}
						sx={{ m: 1 }}
						name="cnc_nesting_status"
						onChange={(e) => {
							handleClickOpenStatus(params.row.id);
						}}
					></IOSSwitch>
				);
			},
			maxWidth: 60,
			flex: 1,
		},
	];

	return (
		<Box>
			<ToastContainer />
			<TickGif show={animeShow} />
			<Card>
				<CardContent>
					<Stack direction={"row"} spacing={4}>
						<Typography
							gutterBottom
							variant="h5"
							component="div"
							sx={{
								"& .MuiTypography-root": {
									width: "350px",
								},
							}}
							className="mt-2"
						>
							Manage CNC Nesting
						</Typography>

						<ModuleTools
							pageName="cncNesting"
							OrderData={orderList}
							refreshPage={(request) => refreshData(request)}
						/>
						<div style={{ border: "1px solid grey" }}></div>
						<NavLink to="/orderList" className="toolButton">
							<KeyboardDoubleArrowLeftIcon style={{ color: "#BC1921" }} />
							Prev Module
						</NavLink>
						<NavLink to="/cncpunching" className="toolButton">
							Next Module
							<KeyboardDoubleArrowRightIcon style={{ color: "#BC1921" }} />
						</NavLink>
					</Stack>
					<div className="mt-3">
						<DataGrid
							slots={{ toolbar: GridToolbar }}
							getRowClassName={(params) =>
								// params.indexRelativeToCurrentPage % 2 === 0
								// 	? "Mui-even"
								// 	: "Mui-odd"
								{
									if (params.indexRelativeToCurrentPage % 2 === 0) {
										if (params.row.priority === "true") {
											return "secon-bg";
										} else if (
											params.row.tcutting_status === "true" &&
											params.row.finpunch_status === "true"
										) {
											return "partial-comp-bg";
										} else {
											return "Mui-even";
										}
									} else {
										if (params.row.priority === "true") {
											return "secon-bg";
										} else if (
											params.row.tcutting_status === "true" &&
											params.row.finpunch_status === "true"
										) {
											return "partial-comp-bg";
										} else {
											return "Mui-odd";
										}
									}
								}
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
									["ep_comments", "cnc_nesting_pgm_no"],
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
							editMode="cell"
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
						handleEPComments(selectedRowId, e);
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
											src={imageURL +'/uploads/'+ item['drawing_base64']}
											srcSet={imageURL +'/uploads/'+ item['drawing_base64']}
											alt={"Assembly"}
											loading="lazy"
										/>
									</ImageListItem>
								))}
							</ImageList>
						}
					</>
					{/* <>
						{imageBase64.assembly_Photo?.length > 0 ? (
							<DialogTitle>Assembly Images</DialogTitle>
						) : (
							""
						)}

						{
							<ImageList cols={1} >
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
							<ImageList cols={1} >
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
					</> */}
				</Stack>
				<DialogActions>
					<Button onClick={() => handleCloseImg("yes")}>Close</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
}
