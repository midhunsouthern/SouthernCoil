import {
	Button,
	Container,
	Dialog,
	DialogActions,
	IconButton,
	ImageList,
	ImageListItem,
	Stack,
	TextField,
	Typography,
	AppBar,
	Toolbar,
	Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Grid from "@mui/material/Grid";
import PrintIcon from "@mui/icons-material/Print";

import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Autocomplete } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import {
	baseURL,
	getLookupData,
	getOrderDataByID,
	getCustomersDataAll,
	imageURL,
} from "../../constant/url";
import { AccessContext } from "../../constant/accessContext";
import {
	orange,
	blue,
	lime,
	green,
	grey,
	purple,
	yellow,
} from "@mui/material/colors";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PreviewIcon from "@mui/icons-material/Preview";
import Slide from "@mui/material/Slide";
import "../../Table.css";
import logo from "../../assets/img/sc-straight.jpeg";
import AutoCompleteOrder from "../Component/AutoCompleteOrder";
const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function OrderViewModal(prop) {
	let orderRowID = prop.orderId;
	const access = useContext(AccessContext).authID;
	let dateObj = new Date();
	const [orderNo, setOrderNo] = useState();
	const [splitId, setSplitId] = useState();
	const [orderDate, setOrderDate] = useState(
		dateObj.getDate() + "/" + dateObj.getMonth() + "/" + dateObj.getFullYear()
	);
	const [customerName, setCustomerName] = useState([]);
	const [customerNameList, setCustomerNameList] = useState([]);
	const [length, setLength] = useState(null);
	const [height, setHeight] = useState(null);
	const [row, setRow] = useState(null);
	const [quantity, setQuantity] = useState(null);
	const [sqfeet, setSqFeet] = useState(0);
	const [size, setSize] = useState(0);
	const [pipeType, setPipeType] = useState("");
	const [expansionType, setExpansionType] = useState("");
	//New Pipe Bend components
	const [pbStraight, setPBStraight] = useState(false);
	const [pbStraightQty, setPBStraightQty] = useState(0);
	const [pbStraightSize, setPBStraightSize] = useState(0);
	const [pbStraightTotQty, setPBStraightTotQty] = useState(0);

	const [pbSingle, setPBSingle] = useState(false);
	const [pbSingleQty, setPBSingleQty] = useState(0);
	const [pbSingleSize, setPBSingleSize] = useState(0);
	const [pbSingleTotQty, setPBSingleTotQty] = useState(0);

	const [pbCross, setPBCross] = useState(false);
	const [pbCrossQty, setPBCrossQty] = useState(0);
	const [pbCrossSize, setPBCrossSize] = useState(0);
	const [pbCrossTotQty, setPBCrossTotQty] = useState(0);

	const [pbOther, setPBOther] = useState(false);
	const [pbOtherQty, setPBOtherQty] = useState(0);
	const [pbOtherSize, setPBOtherSize] = useState(0);
	const [pbOtherTotQty, setPBOtherTotQty] = useState(0);

	const [pipeComment, setPipeComment] = useState("");
	const [endPlateMaterial, setEndPlateMaterial] = useState("");
	const [endPlateModel, setEndPlateModel] = useState("");
	const [endPlateOrientation, setEndPlateOrientation] = useState([]);
	const [coverType, setCoverType] = useState([]);
	const [coverDetail, setCoverDetail] = useState([]);
	const [epComments, setEPComments] = useState("");
	const [finPerInch, setFinPerInch] = useState("");
	const [finComments, setFinComments] = useState("");
	const [circuitModels, setCircuitModels] = useState([]);
	const [noCircuit, setNoCircuit] = useState("");
	const [liquidLine, setLiquidLine] = useState("");
	const [dischargeLine, setDischargeLine] = useState("");
	const [brazingComments, setBrazingComments] = useState("");
	const [paintType, setPaintType] = useState([]);
	const [packingType, setPackingType] = useState([]);
	const [dispatchMode, setDispatchMode] = useState([]);
	const [dispatchComment, setDispatchComments] = useState("");
	const [finalComments, setFinalComments] = useState("");
	const [finalConcatComments, setFinalConcatComments] = useState("");
	const [epPhoto, setEpPhoto] = useState([]);
	const [assemblyPhoto, setAssemblyPhoto] = useState([]);
	const [brazingPhoto, setBrazingPhoto] = useState([]);
	const [lookUpList, setLookupList] = React.useState([]);
	/**
	 * Coil Detail States
	 */
	const [cncNestingStatus, setCncNestingStatus] = useState([]);
	const [cncNestingDate, setCncNestingDate] = useState([]);
	const [cncNestingStatusDate, setCncNestingStatusDate] = useState([]);
	const [cncNestingPgm, setCncNestingPgm] = useState([]);
	const [cncPunchingStatus, setCncPunchingStatus] = useState([]);
	const [cncPunchingDate, setCncPunchingDate] = useState([]);
	const [bendingStatus, setBendingStatus] = useState([]);
	const [bendingDate, setBendingDate] = useState([]);
	const [tCuttingStatus, setTCuttingStatus] = useState([]);
	const [tCuttingRollNo, setTCuttingRollNo] = useState([]);
	const [tCuttingDate, setTCuttingDate] = useState([]);
	const [finPunchStatus, setFinPunchStatus] = useState([]);
	const [finPunchDate, setFinPunchDate] = useState([]);
	const [finFoilNo, setFinFoilNo] = useState([]);
	const [brazingExpansion, setBrazingExpansion] = useState([]);
	const [brazingStatus, setBrazingStatus] = useState([]);
	const [brazingDate, setBrazingDate] = useState([]);
	const [caStatus, setCaStatus] = useState([]);
	const [caStatusDate, setCaStatusDate] = useState([]);
	const [ceStatus, setCeStatus] = useState([]);
	const [ceStatusDate, setCeStatusDate] = useState([]);
	const [ppStatus, setPpStatus] = useState([]);
	const [ppDate, setPPDate] = useState([]);
	const [ppStatusDate, setPpStatusDate] = useState([]);
	const [dispatchStatus, setDispatchStatus] = useState([]);
	const [dispatchDate, setDispatchDate] = useState([]);

	const [isUpdate, setIsUpdate] = useState(false);
	const [brazingDetails, setBrazingDetails] = useState([]);
	const [openImg, setOpenImg] = useState(false);
	const [dialogImg, setDialogImg] = useState("");
	const [brazingTestingImages, setBrazingTestingImages] = useState([]);

	const handleClickOpenimg = (base64) => {
		setDialogImg(base64);
		setOpenImg(true);
	};

	const handleCloseImg = (response) => {
		setOpenImg(false);
	};

	const handleSqFeet = () => {
		setSqFeet(((length * height * row * quantity) / 144).toFixed(2));
	};

	const handleSize = () => {
		const len = length === null ? 0 : length;
		const heig = height === null ? 0 : height;
		const rowval = row === null ? 0 : row;
		const qty = quantity === null ? 0 : quantity;

		let x =
			String(len) +
			" x " +
			String(heig) +
			" x " +
			String(rowval) +
			"R - " +
			String(qty);
		setSize(x);
	};

	function handleGetLookup() {
		var bodyFormData = new FormData();
		bodyFormData.append("authId", access);

		/**add photos */
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
					//console.log(res_data.status_msg);
				}
			})
			.catch(function (response) {
				//handle error
				console.log(response);
			});
	}

	const handleOrderinfo1 = () => {
		var bodyFormData = new FormData();
		bodyFormData.append("authId", access);
		bodyFormData.append("id", orderRowID);

		axios({
			method: "post",
			url: getOrderDataByID,
			data: bodyFormData,
			headers: { "Content-Type": "multipart/form-data" },
		})
			.then(function (response) {
				//handle success
				const res_data = response.data;
				if (res_data.status_code === 101) {
					toast("Api Aithentication failed. login again.");
				} else if (res_data.status_code === 200) {
					const ret_data_cd = res_data.data_orders;
					setOrderNo(ret_data_cd[0].order_id);
					setSplitId(ret_data_cd[0].split_id);
					setOrderDate(ret_data_cd[0].order_date);
					setCustomerName(ret_data_cd[0].full_customer_name);
					setLength(ret_data_cd[0].length);
					setHeight(ret_data_cd[0].height);
					setRow(ret_data_cd[0].rows);
					setQuantity(ret_data_cd[0].quantity);
					setSqFeet(ret_data_cd[0].sq_feet);
					setPipeType(ret_data_cd[0].pipe_type);
					setExpansionType(ret_data_cd[0].expansion_type);

					setPBStraight(ret_data_cd[0].pbStraight);
					setPBStraightQty(ret_data_cd[0].pbStraightQty);
					setPBStraightSize(ret_data_cd[0].pbStraightSize);
					setPBStraightTotQty(ret_data_cd[0].pbStraightTotQty);

					setPBSingle(ret_data_cd[0].pbSingle);
					setPBSingleQty(ret_data_cd[0].pbSingleQty);
					setPBSingleSize(ret_data_cd[0].pbSingleSize);
					setPBSingleTotQty(ret_data_cd[0].pbSingleTotQty);

					setPBCross(ret_data_cd[0].pbCross);
					setPBCrossQty(ret_data_cd[0].pbCrossQty);
					setPBCrossSize(ret_data_cd[0].pbCrossSize);
					setPBCrossTotQty(ret_data_cd[0].pbCrossTotQty);

					setPBOther(ret_data_cd[0].pbOther);
					setPBOtherQty(ret_data_cd[0].pbOtherQty);
					setPBOtherSize(ret_data_cd[0].pbOtherSize);
					setPBOtherTotQty(ret_data_cd[0].pbOtherTotQty);

					setPipeComment(ret_data_cd[0].pipe_comment);
					setEndPlateMaterial(ret_data_cd[0].end_plate_material);
					setEndPlateModel(ret_data_cd[0].end_plate_modal);
					setEndPlateOrientation(ret_data_cd[0].end_plate_orientation);
					setCoverType(ret_data_cd[0].cover_type);
					setCoverDetail(ret_data_cd[0].cover_detail);
					setEPComments(ret_data_cd[0].ep_comments);
					setFinPerInch(ret_data_cd[0].fin_per_inch);
					setFinComments(ret_data_cd[0].fin_comments);
					setCircuitModels(ret_data_cd[0].circuit_models);
					setNoCircuit(ret_data_cd[0].circuit_no);
					setLiquidLine(ret_data_cd[0].liquid_line);
					setDischargeLine(ret_data_cd[0].discharge_line);
					setBrazingComments(ret_data_cd[0].brazing_comment);
					setPaintType(ret_data_cd[0].paint);
					setPackingType(ret_data_cd[0].packing_type);
					setDispatchMode(ret_data_cd[0].dispatch_mode);
					setDispatchComments(ret_data_cd[0].dispatch_comment);
					setFinalComments(ret_data_cd[0].final_comment);
					setEpPhoto(ret_data_cd[0].ep_photo);
					setAssemblyPhoto(ret_data_cd[0].assembly_Photo);
					setBrazingPhoto(ret_data_cd[0].brazing_Photo);
					setCncNestingStatus(ret_data_cd[0].cnc_nesting_status);
					setCncNestingPgm(ret_data_cd[0].cnc_nesting_pgm_no);
					setCncNestingDate(ret_data_cd[0].cnc_nested);
					setCncNestingStatusDate(ret_data_cd[0].cnc_nesting_status_dt);
					setCncPunchingStatus(ret_data_cd[0].cnc_punching_status);
					setCncPunchingDate(ret_data_cd[0].cnc_punching_status_dt);
					setBendingStatus(ret_data_cd[0].bending_status);
					setBendingDate(ret_data_cd[0].bending_status_dt);
					setTCuttingRollNo(ret_data_cd[0].tcutting_roll_no);
					setTCuttingDate(ret_data_cd[0].tcutting_datetime);
					setFinPunchStatus(ret_data_cd[0].finpunch_status);
					setFinPunchDate(ret_data_cd[0].finpunch_status_dt);
					setFinFoilNo(ret_data_cd[0].finpunching_foilno);
					setBrazingStatus(ret_data_cd[0].brazing_status);
					setBrazingDate(ret_data_cd[0].brazing_status_dt);
					setBrazingExpansion(ret_data_cd[0].ce_status_dt);
					setCaStatus(ret_data_cd[0].ca_status);
					setCaStatusDate(ret_data_cd[0].ca_status_dt);
					setCeStatus(ret_data_cd[0].ce_status);
					setCeStatusDate(ret_data_cd[0].ce_status_dt);
					setPpStatus(ret_data_cd[0].pp_status);
					setPPDate(ret_data_cd[0].pp_datetime);
					setPpStatusDate(ret_data_cd[0].pp_status_dt);
					setDispatchStatus(ret_data_cd[0].dispatch_status);
					setDispatchDate(ret_data_cd[0].dispatch_status_dt);
					setBrazingDetails(ret_data_cd[0].brazing_details);
					setBrazingTestingImages(ret_data_cd[0].brazing_testing_Photo);
				} else {
					//console.log(res_data.status_msg);
				}
			})
			.catch(function (response) {
				//handle error
				console.log(response);
			});
	};

	function printPage() {
		window.print();
	}
	const handleSearchOrderId = (orderId) => {
		orderRowID = orderId.id;
		handleOrderinfo1();
	};
	const getThickValue = (finPerInch) => {
		const mapper = {
			T: "0.15mm Thick",
			H: "0.13mm Thick",
			B: "0.12mm Thick Hydrophilic blue Aluminum",
			PP: "Not Applicable",
			// Add more mappings as needed
		};
		if (finPerInch.includes("-")) {
			finPerInch = finPerInch.split("-")[0].trim().toUpperCase();
		}
		if (typeof finPerInch === "string") {
			finPerInch = finPerInch.toUpperCase();
		}
		if (mapper[finPerInch]) {
			return mapper[finPerInch];
		} else {
			// If value is not found in mapper, return a default value
			return "0.12mm Thick"; // You can set your default value here
		}
	};
	const formatDateIst = (date) => {
		if (date != "" && date != null && date != "undefined") {
			const time = date.split(" ")[1] ?? "";
			let newDate = new Date(date);
			let month = newDate.getMonth() + 1;
			month = month < 10 ? "0" + month : month;
			return (
				newDate.getDate() +
				"-" +
				month +
				"-" +
				newDate.getFullYear() +
				" " +
				time
			);
		}
		return "";
	};
	useEffect(() => {
		handleSqFeet();
		handleSize();
	}, [length, height, row, quantity, handleSqFeet, handleSize]);

	useEffect(() => {
		if (prop.orderId !== null || prop.orderId !== 0) {
			handleGetLookup();
			handleOrderinfo1();
		}
	}, [prop.orderId]);
	const fixedLayout = {
		tableLayout: "fixed",
	};
	return (
		<div>
			<>
				<Container key={"orderView"} id="orderView">
					<Grid container spacing={3}>
						<Grid
							item
							xs={12}
							style={{ display: "flex", justifyContent: "center" }}
						>
							<AutoCompleteOrder
								access={access}
								onSearchOrderId={handleSearchOrderId}
							/>
						</Grid>
					</Grid>
					<Grid container spacing={4} id="print-ignore">
						<Grid item xs={6}>
							<img
								src={logo}
								alt="Logo"
								style={{ width: "50%", height: "auto" }}
							/>
						</Grid>
						<Grid
							item
							xs={6}
							style={{
								display: "flex",
								justifyContent: "flex-end",
								alignItems: "center",
							}}
						>
							<Box>
								<Button
									style={{ backgroundColor: "#C5552C", color: "white" }}
									onClick={() => {
										printPage();
									}}
									variant="contained"
									startIcon={<PrintIcon />}
								>
									Print
								</Button>
							</Box>
						</Grid>
					</Grid>
					<Grid container spacing={2} columnGap={2} className="print-header">
						<Grid
							item
							xs={12}
							style={{ display: "flex", justifyContent: "center" }}
						>
							<img
								src={logo}
								alt="Logo"
								style={{ width: "50%", height: "50%" }}
							/>
						</Grid>
					</Grid>

					<Grid
						container
						spacing={2}
						columnSpacing={2}
						columnGap={2}
						className="container"
						style={{
							padding: "10px",
							marginTop: "1.5em",
							tableLayout: "fixed",
						}}
					>
						<Typography variant="h5">Order Details</Typography>
						<table
							border={1}
							cellPadding={1}
							cellSpacing={2}
							style={{ width: "inherit" }}
						>
							<thead>
								<tr>
									<th>Order No</th>
									<th>Date</th>
									<th>Customer</th>
									<th>Size</th>
									<th>Sq Feet</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>{orderNo + splitId}</td>
									<td>{orderDate}</td>
									<td>{customerName}</td>
									<td>{size}</td>
									<td>{sqfeet}</td>
								</tr>
							</tbody>
						</table>
					</Grid>
					<Grid container spacing={2} sx={fixedLayout}>
						<Grid item xs={6}>
							<Grid container spacing={2}>
								<Grid item xs={12}>
									<Typography variant="h6">End Plate</Typography>
									<table style={{ tableLayout: "fixed" }}>
										<tbody>
											<tr>
												<th style={{ textAlign: "left", paddingLeft: "10px" }}>
													Material
												</th>
												<td style={{ textAlign: "left", paddingLeft: "10px" }}>
													{lookUpList["epMaterial"]?.map((item) => {
														return (
															<>
																{endPlateMaterial &&
																endPlateMaterial.includes(item.id)
																	? item.lkp_value
																	: ""}
															</>
														);
													})}
												</td>
											</tr>
											<tr>
												<th style={{ textAlign: "left", paddingLeft: "10px" }}>
													Model
												</th>
												<td style={{ textAlign: "left", paddingLeft: "10px" }}>
													{lookUpList["epModal"]?.map((item) => {
														return (
															<>
																{endPlateModel &&
																endPlateModel.includes(item.id)
																	? item.lkp_value
																	: ""}
															</>
														);
													})}
												</td>
											</tr>
											<tr>
												<th style={{ textAlign: "left", paddingLeft: "10px" }}>
													Orientation
												</th>
												<td style={{ textAlign: "left", paddingLeft: "10px" }}>
													{lookUpList["oreientation"]?.map((item) => {
														return (
															<>
																{endPlateOrientation &&
																endPlateOrientation.includes(item.id)
																	? item.lkp_value
																	: ""}
																<br />
															</>
														);
													})}
												</td>
											</tr>
											<tr>
												<th style={{ textAlign: "left", paddingLeft: "10px" }}>
													Cover Type
												</th>
												<td style={{ textAlign: "left", paddingLeft: "10px" }}>
													<Stack direction="row" spacing={3}>
														{lookUpList["coverType"]?.map((item) => {
															return (
																<>
																	{lookUpList["coverDetail"]?.map((itemd) => {
																		if (
																			coverDetail !== undefined &&
																			itemd.lkp_id === item.id &&
																			coverDetail.indexOf(itemd.id) !== -1
																		) {
																			return (
																				<>
																					{itemd.sublkp_val} <br />
																				</>
																			);
																		}
																	})}
																</>
															);
														})}
													</Stack>
												</td>
											</tr>
										</tbody>
									</table>
								</Grid>
								<Grid item xs={12}>
									<Typography variant="h6">Pipe</Typography>
									<table style={{ tableLayout: "fixed" }}>
										<tbody>
											<tr>
												<th style={{ textAlign: "left", paddingLeft: "10px" }}>
													Pipe Type:
												</th>
												<td style={{ textAlign: "left", paddingLeft: "10px" }}>
													{lookUpList["pipeType"]?.map((item) => {
														return (
															<>
																{pipeType && pipeType.includes(item.id)
																	? item.lkp_value
																	: null}
															</>
														);
													})}
												</td>
											</tr>

											<tr>
												<th style={{ textAlign: "left", paddingLeft: "10px" }}>
													Pipe Bend:
												</th>
												<td style={{ textAlign: "left", paddingLeft: "10px" }}>
													<Stack
														direction="row"
														spacing={10}
														alignContent="space-between"
													>
														{pbStraight === "true" && (
															<Typography variant="subtitle1" gutterBottom>
																Straight
															</Typography>
														)}
														{pbSingle === "true" && (
															<Typography variant="subtitle1" gutterBottom>
																Single
															</Typography>
														)}
														{pbCross === "true" && (
															<Typography variant="subtitle1" gutterBottom>
																Cross
															</Typography>
														)}
														{pbOther === "true" && (
															<Typography variant="subtitle1" gutterBottom>
																Other
															</Typography>
														)}
													</Stack>
												</td>
											</tr>
										</tbody>
									</table>
								</Grid>
								<Grid item xs={12}>
									<Typography variant="h6">Fins</Typography>
									<table style={{ tableLayout: "fixed" }}>
										<tbody>
											<tr>
												<th style={{ textAlign: "left", paddingLeft: "10px" }}>
													Fin per Inch
												</th>
												<td style={{ textAlign: "left", paddingLeft: "10px" }}>
													{finPerInch}
												</td>
											</tr>
											<tr>
												<th style={{ textAlign: "left", paddingLeft: "10px" }}>
													Fin Thickness
												</th>
												<td style={{ textAlign: "left", paddingLeft: "10px" }}>
													{getThickValue(finPerInch)}
												</td>
											</tr>
										</tbody>
									</table>
								</Grid>
								<Grid item xs={12}>
									<Typography variant="h6">Brazing</Typography>
									<table style={{ tableLayout: "fixed" }}>
										<tbody>
											<tr>
												<th style={{ textAlign: "left", paddingLeft: "10px" }}>
													Circuit Model
												</th>
												<td style={{ textAlign: "left", paddingLeft: "10px" }}>
													{lookUpList["circuitModel"]?.map((item) => {
														return (
															<>
																{circuitModels &&
																circuitModels.indexOf(item.id) !== -1
																	? item.lkp_value
																	: ""}
															</>
														);
													})}
												</td>
											</tr>
											<tr>
												<th style={{ textAlign: "left", paddingLeft: "10px" }}>
													No of circuit
												</th>
												<td style={{ textAlign: "left", paddingLeft: "10px" }}>
													{noCircuit}
												</td>
											</tr>
											<tr>
												<th style={{ textAlign: "left", paddingLeft: "10px" }}>
													Liquid Line
												</th>
												<td style={{ textAlign: "left", paddingLeft: "10px" }}>
													{lookUpList["liquidLine"]?.map((item) => {
														return (
															<>
																{liquidLine &&
																	liquidLine.indexOf(item.id) !== -1 &&
																	item.lkp_value}
															</>
														);
													})}
												</td>
											</tr>
											<tr>
												<th style={{ textAlign: "left", paddingLeft: "10px" }}>
													Discharge Line
												</th>
												<td style={{ textAlign: "left", paddingLeft: "10px" }}>
													{lookUpList["dischargeLine"]?.map((item) => {
														return (
															<>
																{dischargeLine &&
																dischargeLine.indexOf(item.id) !== -1
																	? item.lkp_value
																	: ""}
															</>
														);
													})}
												</td>
											</tr>
										</tbody>
									</table>
								</Grid>
								<Grid item xs={12}>
									<Typography variant="h6">
										Paint,Packing and Dispatch
									</Typography>
									<table style={{ tableLayout: "fixed" }}>
										<tbody>
											<tr>
												<th style={{ textAlign: "left", paddingLeft: "10px" }}>
													Paint
												</th>
												<td style={{ textAlign: "left", paddingLeft: "10px" }}>
													{lookUpList["paintType"]?.map((item) => {
														return (
															<>
																{paintType && paintType.includes(item.id)
																	? item.lkp_value
																	: ""}
															</>
														);
													})}
												</td>
											</tr>

											<tr>
												<th style={{ textAlign: "left", paddingLeft: "10px" }}>
													Packing
												</th>
												<td style={{ textAlign: "left", paddingLeft: "10px" }}>
													{lookUpList["packingType"]?.map((item) => {
														return (
															<>
																{packingType && packingType.includes(item.id)
																	? item.lkp_value
																	: ""}
															</>
														);
													})}
												</td>
											</tr>
											<tr>
												<th style={{ textAlign: "left", paddingLeft: "10px" }}>
													Dispatch
												</th>
												<td style={{ textAlign: "left", paddingLeft: "10px" }}>
													{lookUpList["dispatchMode"]?.map((item) => {
														return (
															<>
																{dispatchMode && dispatchMode.includes(item.id)
																	? item.lkp_value
																	: ""}
															</>
														);
													})}
												</td>
											</tr>
										</tbody>
									</table>
								</Grid>
							</Grid>
						</Grid>
						<Grid item xs={6}>
							<Grid container>
								<Grid item xs={12}>
									<>
										{
											<ImageList cols={1} rowHeight={200}>
												{epPhoto?.map((item, index) => (
													<ImageListItem key={"epphoto" + index}>
														<img
															src={imageURL + item}
															srcSet={imageURL + item}
															alt={"EpPhoto"}
															loading="lazy"
															style={{
																maxWidth: "100%",
																maxHeight: "100%",
																verticalAlign: "middle",
																objectFit: "contain",
															}}
														/>
														<IconButton
															className="order-view-img"
															onClick={() =>
																handleClickOpenimg(imageURL + item)
															}
														>
															<PreviewIcon />
														</IconButton>
													</ImageListItem>
												))}
											</ImageList>
										}
									</>
								</Grid>
								<Grid item xs={12}>
									<>
										{
											<ImageList cols={1} rowHeight={250}>
												{assemblyPhoto?.map((item, index) => (
													<ImageListItem key={"assembly" + index}>
														<img
															src={imageURL + item}
															srcSet={imageURL + item}
															alt={"assembly"}
															loading="lazy"
															style={{
																maxWidth: "100%",
																maxHeight: "100%",
																verticalAlign: "middle",
																objectFit: "contain",
															}}
														/>
														<IconButton
															className="order-view-img"
															onClick={() => handleClickOpenimg(imageURL + item)}
														>
															<PreviewIcon />
														</IconButton>
													</ImageListItem>
												))}
											</ImageList>
										}
									</>
								</Grid>
								<Grid item xs={12}>
									<>
										{
											<ImageList cols={1} rowHeight={"25%"}>
												{brazingPhoto?.map((item, index) => (
													<ImageListItem key={"brazing" + index}>
														<img
															src={imageURL + item}
															srcSet={imageURL + item}
															alt={"Brazing"}
															loading="lazy"
															style={{
																maxWidth: "100%",
																maxHeight: "100%",
																verticalAlign: "middle",
																objectFit: "contain",
															}}
														/>
														<IconButton
															onClick={() => handleClickOpenimg(imageURL + item)}
														>
															<PreviewIcon />
														</IconButton>
													</ImageListItem>
												))}
											</ImageList>
										}
									</>
								</Grid>
							</Grid>
						</Grid>
					</Grid>
					<div className="print-page-break"></div>
					<Grid container spacing={2} columnGap={2} className="print-header">
						<Grid
							item
							xs={12}
							style={{ display: "flex", justifyContent: "center" }}
						>
							<img
								src={logo}
								alt="Logo"
								style={{ width: "50%", height: "50%" }}
							/>
						</Grid>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="h5">Coil Details</Typography>
						<table style={{ tableLayout: "fixed" }}>
							<thead>
								<tr>
									<th>Process</th>
									<th>Date & Time</th>
									<th>Comments</th>
								</tr>
							</thead>
							<tbody>
								{
									<tr>
										<th style={{ textAlign: "left" }}>CNC Nesting</th>
										<td>{formatDateIst(cncNestingDate)}</td>
									</tr>
								}

								{
									<tr>
										<th style={{ textAlign: "left" }}>CNC Program Created</th>
										<td>{formatDateIst(cncNestingStatusDate)}</td>
										<td
											style={{
												display: "flex",
												flexDirection: "column",
												alignItems: "flex-start",
												border: "0",
											}}
										>
											Program Number-{cncNestingPgm}
										</td>
									</tr>
								}

								{
									<tr>
										<th style={{ textAlign: "left" }}>
											CNC end plate punching
										</th>
										<td>{formatDateIst(cncPunchingDate)}</td>
									</tr>
								}

								{
									<tr>
										<th style={{ textAlign: "left" }}>End plate bending</th>
										<td>{formatDateIst(bendingDate)}</td>
									</tr>
								}

								{
									<tr>
										<th style={{ textAlign: "left" }}>
											Tray/Fan Cover Bending
										</th>
										<td>{formatDateIst(bendingDate)}</td>
										<td
											style={{
												display: "flex",
												flexDirection: "column",
												alignItems: "flex-start",
												border: "0",
											}}
										>
											Comments: {epComments}
										</td>
									</tr>
								}
								{
									<tr>
										<th style={{ textAlign: "left" }}>Copper tube Cutting</th>
										<td>{formatDateIst(tCuttingDate)}</td>
										<td
											style={{
												display: "flex",
												flexDirection: "column",
												alignItems: "flex-start",
												border: "0",
											}}
										>
											<span>Roll Number: {tCuttingRollNo}</span>
											{pbStraight == "true" && (
												<span>
													Pipe Straight-{pbStraightQty} Nos {pbStraightSize}mm
												</span>
											)}
											{pbCross == "true" && (
												<span>
													Pipe Cross-{pbCrossQty} Nos {pbCrossSize}mm
												</span>
											)}
											{pbSingle == "true" && (
												<span>
													Pipe Single-{pbSingleQty} Nos {pbSingleSize}mm
												</span>
											)}
											{pbOther == "true" && (
												<span>
													Pipe Others-{pbOtherQty} Nos {pbOtherSize}mm
												</span>
											)}
										</td>
									</tr>
								}
								{
									<tr>
										<th style={{ textAlign: "left" }}>Copper tube Bending</th>
										<td>{formatDateIst(bendingDate)}</td>
										<td
											style={{
												display: "flex",
												flexDirection: "column",
												alignItems: "flex-start",
												border: "0",
											}}
										>
											Comments-{pipeComment}
										</td>
									</tr>
								}
								{
									<tr>
										<th style={{ textAlign: "left" }}>Fins Punching</th>
										<td>{formatDateIst(finPunchDate)}</td>
										<td
											style={{
												display: "flex",
												flexDirection: "column",
												alignItems: "flex-start",
												border: "0",
											}}
										>
											<span>
												Foil Number:{finFoilNo ? finFoilNo : " No Roll no"}
											</span>
										</td>
									</tr>
								}
								{
									<tr>
										<th style={{ textAlign: "left" }}>Coil Assembly</th>
										<td>{formatDateIst(caStatusDate)}</td>
										<td
											style={{
												display: "flex",
												flexDirection: "column",
												alignItems: "flex-start",
												border: "0",
											}}
										>
											<span>Comments-{finComments}</span>
										</td>
									</tr>
								}
								{
									<tr>
										<th style={{ textAlign: "left" }}>Coil Expansion</th>
										<td>{formatDateIst(brazingExpansion)}</td>
										<td
											style={{
												display: "flex",
												flexDirection: "column",
												alignItems: "flex-start",
												border: "0",
											}}
										>
											<span>
												Expansion Type:{" "}
												{lookUpList["expansionType"]?.map((item) => {
													return (
														<>
															{expansionType && expansionType.includes(item.id)
																? item.lkp_value
																: ""}
														</>
													);
												})}
											</span>
										</td>
									</tr>
								}
								{
									<tr>
										<th style={{ textAlign: "left" }}>
											Coil Brazing & Leak Testing
										</th>
										<td>{formatDateIst(brazingDate)}</td>
										<td
											style={{
												display: "flex",
												flexDirection: "column",
												alignItems: "flex-start",
												border: "0",
											}}
										>
											{" "}
											Comments: {brazingComments}
										</td>
									</tr>
								}

								{
									<tr>
										<th style={{ textAlign: "left" }}>Painting</th>
										<td>{formatDateIst(ppDate)}</td>
										<td
											style={{
												display: "flex",
												flexDirection: "column",
												alignItems: "flex-start",
												border: "0",
											}}
										>
											<span>
												Painting Type:{" "}
												{lookUpList["paintType"]?.map((item) => {
													return (
														<>
															{paintType && paintType.includes(item.id)
																? item.lkp_value
																: ""}
														</>
													);
												})}
											</span>
										</td>
									</tr>
								}
								{
									<tr>
										<th style={{ textAlign: "left" }}>Packing</th>
										<td>{formatDateIst(ppStatusDate)}</td>
										<td
											style={{
												display: "flex",
												flexDirection: "column",
												alignItems: "flex-start",
												border: "0",
											}}
										>
											<span>
												Packing Type:{" "}
												{lookUpList["packingType"]?.map((item) => {
													return (
														<>
															{packingType && packingType.includes(item.id)
																? item.lkp_value
																: ""}
														</>
													);
												})}
											</span>
										</td>
									</tr>
								}
								{
									<tr>
										<th style={{ textAlign: "left" }}>Dispatch</th>
										<td>{formatDateIst(dispatchDate)}</td>
										<td
											style={{
												display: "flex",
												flexDirection: "column",
												alignItems: "flex-start",
												border: "0",
											}}
										>
											{dispatchComment}
										</td>
									</tr>
								}
							</tbody>
						</table>
					</Grid>
					<div className="print-page-break"></div>
					<Grid container spacing={2} columnGap={2} className="print-header">
						<Grid
							item
							xs={12}
							style={{ display: "flex", justifyContent: "center" }}
						>
							<img
								src={logo}
								alt="Logo"
								style={{ width: "50%", height: "50%" }}
							/>
						</Grid>
					</Grid>
					<Grid container>
						<Grid item xs={12}>
							<Typography variant="h5" style={{ marginBottom: 10 }}>
								Brazing & Leak Testing Details
							</Typography>
						</Grid>
						{brazingDetails &&
							brazingDetails.map((value, index) => (
								<React.Fragment key={index}>
									{/* Brazing & Leak Testing Details */}
									<Grid item xs={6}>
										<div>
											<h6>Table {index + 1}</h6>
											<table style={{ tableLayout: "fixed" }}>
												<tbody>
													<tr>
														<th
															style={{ textAlign: "left", paddingLeft: "10px" }}
														>
															Serial No
														</th>
														<td
															style={{ textAlign: "left", paddingLeft: "10px" }}
														>
															{value.series_ref}
														</td>
													</tr>
													<tr>
														<th
															style={{ textAlign: "left", paddingLeft: "10px" }}
														>
															Leak Date
														</th>
														<td
															style={{ textAlign: "left", paddingLeft: "10px" }}
														>
															{value.completion}
														</td>
													</tr>
													{/* Additional details */}
												</tbody>
											</table>
										</div>
									</Grid>

									{/* Corresponding Image */}
									<Grid item xs={6}>
										{brazingTestingImages &&
											brazingTestingImages[index + 1] && (
												<ImageList cols={1} rowHeight={200}>
													{brazingTestingImages[index + 1]?.map(
														(item, index) => (
															<ImageListItem key={"brazing_testing" + index}>
																<img
																	src={imageURL + item}
																	srcSet={imageURL + item}
																	alt={"BrazingTesting"}
																	loading="lazy"
																	style={{
																		maxWidth: "100%",
																		maxHeight: "100%",
																		objectFit: "contain",
																	}}
																/>
																<IconButton
																	className="order-view-img"
																	onClick={() =>
																		handleClickOpenimg(imageURL + item)
																	}
																>
																	<PreviewIcon />
																</IconButton>
															</ImageListItem>
														)
													)}
												</ImageList>
											)}
									</Grid>
								</React.Fragment>
							))}
					</Grid>
				</Container>
			</>
			<Dialog
				fullScreen
				open={openImg}
				TransitionComponent={Transition}
				keepMounted
				onClose={handleCloseImg}
				aria-describedby="alert-dialog-slide-description"
			>
				<AppBar sx={{ position: "relative" }}>
					<Toolbar>
						<IconButton
							edge="start"
							color="inherit"
							onClick={handleCloseImg}
							aria-label="close"
						>
							<CloseIcon />
						</IconButton>
						<Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
							Order View Images
						</Typography>
					</Toolbar>
				</AppBar>
				<img
					src={dialogImg}
					srcSet={dialogImg}
					alt={dialogImg}
					loading="lazy"
				/>
				<DialogActions>
					<Button onClick={() => handleCloseImg("yes")}>Close</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
