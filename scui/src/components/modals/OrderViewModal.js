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
	Box
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import Grid from '@mui/material/Grid';
import PrintIcon from '@mui/icons-material/Print';

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
import '../../Table.css';
import logo from '../../assets/img/logo1.png';
const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function OrderViewModal(prop) {
	const orderRowID = prop.orderId;
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
	const [cncNestingStatus,setCncNestingStatus]=useState([]);
	const [cncNestingDate,setCncNestingDate]=useState([]);
	const [cncNestingPgm,setCncNestingPgm]=useState([]);
	const [cncPunchingStatus,setCncPunchingStatus]=useState([]);
	const [cncPunchingDate,setCncPunchingDate]=useState([]);
	const [bendingStatus,setBendingStatus]=useState([]);
	const [bendingDate,setBendingDate]=useState([]);
	const [tCuttingStatus,setTCuttingStatus]=useState([]);
	const [tCuttingRollNo,setTCuttingRollNo]=useState([]);
	const [tCuttingDate,setTCuttingDate]=useState([]);
	const [finPunchStatus,setFinPunchStatus]=useState([]);
	const [finPunchDate,setFinPunchDate]=useState([]);
	const [brazingExpansion,setBrazingExpansion]=useState([]);
	const [brazingStatus,setBrazingStatus]=useState([]);
	const [brazingDate,setBrazingDate]=useState([]);
	const [caStatus,setCaStatus]=useState([]);
	const [caStatusDate,setCaStatusDate]=useState([]);
	const [ceStatus,setCeStatus]=useState([]);
	const [ceStatusDate,setCeStatusDate]=useState([]);
	const [ppStatus,setPpStatus]=useState([]);
	const [ppStatusDate,setPpStatusDate]=useState([]);
	const [dispatchStatus,setDispatchStatus]=useState([]);
	const [dispatchDate,setDispatchDate]=useState([]);


	const [isUpdate, setIsUpdate] = useState(false);
	const [brazingDetails,setBrazingDetails]=useState([]);
	const [openImg, setOpenImg] = useState(false);
	const [dialogImg, setDialogImg] = useState("");
	const [brazingTestingImages,setBrazingTestingImages]=useState([]);

	const handleClickOpenimg = (base64) => {
		setDialogImg(base64);
		setOpenImg(true);
	};

	const handleCloseImg = (response) => {
		setOpenImg(false);
	};

	const handleSqFeet = () => {
		setSqFeet((length * height * row * quantity) / 144);
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
					console.log(res_data.status_msg);
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
					setCncNestingDate(ret_data_cd[0].cnc_nesting_status_dt);
					setCncPunchingStatus(ret_data_cd[0].cnc_punching_status);
					setCncPunchingDate(ret_data_cd[0].cnc_punching_status_dt);
					setBendingStatus(ret_data_cd[0].bending_status);
					setBendingDate(ret_data_cd[0].bending_status_dt);
					setFinPunchStatus(ret_data_cd[0].finpunch_status);
					setFinPunchDate(ret_data_cd[0].finpunch_status_dt);
					setBrazingStatus(ret_data_cd[0].brazing_status);
					setBrazingDate(ret_data_cd[0].brazing_status_dt);
					setBrazingExpansion(ret_data_cd[0].brazing_expansion);
					setCaStatus(ret_data_cd[0].ca_status);
					setCaStatusDate(ret_data_cd[0].ca_status_dt);
					setCeStatus(ret_data_cd[0].ce_status);
					setCeStatusDate(ret_data_cd[0].ce_status_dt);
					setPpStatus(ret_data_cd[0].pp_status);
					setPpStatusDate(ret_data_cd[0].pp_status_dt);
					setDispatchStatus(ret_data_cd[0].dispatch_status);
					setDispatchDate(ret_data_cd[0].dispatch_status_dt);
					setBrazingDetails(ret_data_cd[0].brazing_details);
					setBrazingTestingImages(ret_data_cd[0].brazing_testing_Photo);
				} else {
					console.log(res_data.status_msg);
				}
			})
			.catch(function (response) {
				//handle error
				console.log(response);
			});
	};

	function printPage() {
		// Get the element with the ID 'orderView' and the button to hide

window.print();

		  
	}

	useEffect(() => {
		handleSqFeet();
		handleSize();
	}, [length, height, row, quantity, handleSqFeet, handleSize]);

	useEffect(() => {
		if (prop.orderId !== null) {
			handleGetLookup();
			handleOrderinfo1();
		}
	}, [prop.orderId]);
	return (
		<div>
			<>
				<Container key={"orderView"} id="orderView">
					<Grid container spacing={4}>
						<Grid item xs={6}>
							<img src={logo} alt="Logo" style={{ width: '50%', height: 'auto' }} />
						</Grid>
						<Grid item xs={6} style={{display:'flex',justifyContent:"flex-end",alignItems:"center"}}>
							<Box >
							<Button id="print-ignore"
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
					<Grid container spacing={2} columnSpacing={2} columnGap={2} style={{padding:'10px',marginTop:'1.5em'}}>
						<Typography>Order Details</Typography>
						<table border={1} cellPadding={1} cellSpacing={2} style={{ width: 'inherit' }}>
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
					<Grid container spacing={2}>
						<Grid item xs={6}>
							<Grid container spacing={2}>
								<Grid item xs={12}>
									<Typography variant="h6">End Plate</Typography>
									<table>
										<tbody>
											<tr>
												<th>
													Material
												</th>
												<td>
													{lookUpList["epMaterial"]?.map((item) => {
														return (
															<>
																{endPlateMaterial && endPlateMaterial.includes(item.id)
																	? item.lkp_value
																	: ""}
															</>
														);
													})}

												</td>
											</tr>
											<tr>
												<th>Model</th>
												<td>
													{lookUpList["epModal"]?.map((item) => {
														return (
															<>
																{endPlateModel && endPlateModel.includes(item.id)
																	? item.lkp_value
																	: ""}
															</>
														);
													})}
												</td>
											</tr>
											<tr>
												<th>Orientation</th>
												<td>
													{lookUpList["oreientation"]?.map((item) => {
														return (
															<>
																{endPlateOrientation && endPlateOrientation.includes(item.id)
																	? item.lkp_value
																	: ""}
																<br />
															</>
														);
													})}
												</td>
											</tr>
											<tr>
												<th>Cover Type</th>
												<td>
													<Stack direction="row" spacing={3}>
														{lookUpList["coverType"]?.map((item) => {
															return (
																<>
																	{item.lkp_value},
																	{lookUpList["coverDetail"]?.map((itemd) => {
																		if (
																			coverDetail !== undefined && itemd.lkp_id === item.id &&
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
									<table border={1} cellPadding={1} cellSpacing={2}>
										<tbody>
											<tr>
												<th>Pipe Type:</th>
												<td>{lookUpList["pipeType"]?.map((item) => {
													return (
														<>
															{pipeType && pipeType.includes(item.id) ? item.lkp_value : null}
														</>
													);
												})}</td>
											</tr>

											<tr>
												<th>Expansion Type:</th>
												<td>{lookUpList["expansionType"]?.map((item) => {
													return (
														<>
															{expansionType && expansionType.includes(item.id)
																? item.lkp_value
																: ""}
														</>
													);
												})}</td>
											</tr>

											<tr>
												<th>Pipe Comment:</th>
												<td> {pipeComment}</td>
											</tr>

											<tr>
												<th>Pipe Bend:</th>
												<td>
													<Stack
														direction="row"
														spacing={10}
														alignContent="space-between"
													>
														{pbStraight === "true" && (
															<Stack direction="row" spacing={2}>
																<Typography variant="subtitle1" gutterBottom>
																	Straight
																</Typography>

															</Stack>
														)}
														{pbSingle === "true" && (
															<Stack direction="row" spacing={2}>
																<Typography variant="subtitle1" gutterBottom>
																	Single
																</Typography>

															</Stack>
														)}
														{pbCross === "true" && (
															<Stack direction="row" spacing={2}>
																<Typography variant="subtitle1" gutterBottom>
																	Cross
																</Typography>

															</Stack>
														)}
														{pbOther === "true" && (
															<Stack direction="row" spacing={2}>
																<Typography variant="subtitle1" gutterBottom>
																	Other
																</Typography>

															</Stack>
														)}
													</Stack>
												</td>
											</tr>
										</tbody>
									</table>
								</Grid>
								<Grid item xs={12}>
									<Typography>Fins</Typography>
									<table>
										<tbody>
											<tr>
												<th>
													Fin per Inch
												</th>
												<td>
													{finPerInch}
												</td>
											</tr>
										</tbody>
									</table>
								</Grid>
								<Grid item xs={12}>
									<Typography>Brzing</Typography>
									<table>
										<tbody>
											<tr>
												<th>
													Circuit Model
												</th>
												<td>
													{lookUpList["circuitModel"]?.map((item) => {
														return (
															<>
																{circuitModels && circuitModels.indexOf(item.id) !== -1
																	? item.lkp_value
																	: ""}
															</>
														);
													})}
												</td>
											</tr>
											<tr>
												<th>No of circuit</th>
												<td>
													{noCircuit}
												</td>
											</tr>
											<tr>
												<th>
													Liquid Line
												</th>
												<td>
													{lookUpList["liquidLine"]?.map((item) => {
														return (
															<>
																{liquidLine && liquidLine.indexOf(item.id) !== -1 &&
																	item.lkp_value}
															</>
														);
													})}
												</td>
											</tr>
											<tr>
												<th>
													Discharge Line
												</th>
												<td>
													{lookUpList["dischargeLine"]?.map((item) => {
														return (
															<>
																{dischargeLine && dischargeLine.indexOf(item.id) !== -1
																	? item.lkp_value
																	: ""}
															</>
														);
													})}
												</td>
											</tr>
											<tr>
												<th>
													Brazing Comment
												</th>
												<td>

													{brazingComments}

												</td>
											</tr>
										</tbody>
									</table>
								</Grid>
								<Grid item xs={12}>
									<Typography>Paint,Packing and Dispatch</Typography>
									<table>
										<tbody>
											<tr>
												<th>
													Paint
												</th>
												<td>
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
												<th>
													Dispatch
												</th>
												<td>
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

											<tr>
												<th>
													Packing
												</th>
												<td>
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
										</tbody>
									</table>
								</Grid>
							</Grid>

						

						</Grid>
						<Grid item xs={6}>
							<Grid container spacing={2} padding={10}>
								<Grid item xs={12}>
									<Typography variant="h6">End Plate</Typography>
									<>
										{
											<ImageList cols={1} rowHeight={164}>
												{epPhoto?.map((item, index) => (

													<ImageListItem key={"epphoto" + index}>
														<img

															src={'http://localhost/' + item}
															srcSet={'http://localhost/' + item}
															alt={"EpPhoto"}
															loading="lazy"
														/>
														<IconButton className="order-view-img"
															onClick={() => handleClickOpenimg('http://localhost/' + item)}
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
									<Typography variant="h6">Assembly Images</Typography>
									<>
										{
											<ImageList cols={1} rowHeight={164}>
												{assemblyPhoto?.map((item, index) => (
													<ImageListItem key={"assembly" + index}>
														<img

															src={'http://localhost/' + item}
															srcSet={'http://localhost/' + item}
															alt={"assembly"}
															loading="lazy"
														/>
														<IconButton className="order-view-img"
															onClick={() => handleClickOpenimg(item)}
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
									<Typography variant="h6">
										Hair pin(Brazing) Images
									</Typography>
									<>
										{
											<ImageList cols={1} rowHeight={164}>
												{brazingPhoto?.map((item, index) => (
													<ImageListItem key={"brazing" + index}>
														<img
															src={'http://localhost/' + item}
															srcSet={'http://localhost/' + item}
															alt={"Brazing"}
															loading="lazy"
														/>
														<IconButton
															onClick={() => handleClickOpenimg(item)}
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
					<Grid item xs={12}>
						<Typography>Coil Details</Typography>
						<table>
							<thead>
								<tr>
									<th>Process</th>
									<th>Date & Time</th>
									<th>Comments</th>
								</tr>
							</thead>
							<tbody>
								{
									cncNestingStatus && (
										<tr>
											<th>Nesting No</th>
											<td>{cncNestingDate}</td>
											<td>{cncNestingPgm}</td>
										</tr>
									)
								}
								{
									cncPunchingStatus && (
										<tr>
											<th>Punching</th>
											<td>{cncPunchingDate}</td>
											<td>{cncNestingPgm}</td>
										</tr>
									)
								}
								{
									bendingStatus && (
										<tr>
											<th>Bending</th>
											<td>{bendingDate}</td>
											<td>{cncNestingPgm}</td>
										</tr>
									)
								}
								{
									tCuttingStatus && (
										<tr>
											<th>Tray</th>
											<td>{tCuttingDate}</td>
											<td>{cncNestingPgm}</td>
										</tr>
									)
								}
								{
									brazingExpansion && (
										<tr>
											<th>Expansion</th>
											<td>{brazingDate}</td>
											<td>{brazingComments}</td>
										</tr>
									)
								}
								{
									caStatus && (
										<tr>

										</tr>
									)
								}
							</tbody>
						</table>
					</Grid>
					<Grid container spacing={2}>
						
						<Grid item xs={6}>
							<Grid container spacing={2}>
								<Grid item xs={12}>
								<Typography>Brazing & Leak Testing Details</Typography>
									{
										brazingDetails && brazingDetails.map((value, index) => (
											<div key={index}>
												<h3>Table {index + 1}</h3>
												<table>
													<tbody>
														<tr>
															<th>Serial No</th>
															<td>{value.series_ref}</td>
															{/* More <td> elements as needed */}
														</tr>
														<tr>
															<th>Leak Date</th>
															<td>{value.create_dt}</td>
														</tr>
														<tr>
															<th>Leak Details</th>
															<td>

															</td>
														</tr>
														<tr>
															<th>Workman details</th>
															<td>
																UBend:{value.uBend},
																Header:{value.headder},
																Header Fix:{value.headderFix}
															</td>
														</tr>
													</tbody>
												</table>
											</div>
										))
									}
								</Grid>
							</Grid>
						</Grid>
						<Grid item xs={6}>
							<Grid container spacing={2}>
								<Grid item xs={12}>
									<Typography variant="h6">Brazing</Typography>
									<>
										{
											<ImageList cols={1} rowHeight={164}>
												{brazingTestingImages?.map((item, index) => (

													<ImageListItem key={"brazing_testing" + index}>
														<img

															src={'http://localhost/' + item}
															srcSet={'http://localhost/' + item}
															alt={"BrazingTesting"}
															loading="lazy"
														/>
														<IconButton className="order-view-img"
															onClick={() => handleClickOpenimg('http://localhost/' + item)}
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
				<AppBar sx={{ position: 'relative' }}>
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
							Sound
						</Typography>
						<Button autoFocus color="inherit" onClick={handleCloseImg}>
							save
						</Button>
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
