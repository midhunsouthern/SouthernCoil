import React, { useState, useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import {
	Button,
	TextField,
	Autocomplete,
	Checkbox,
	FormGroup,
	FormControlLabel,
	Stack,
	IconButton,
	Grid,
	Box,
	Typography,
	ButtonBase,
	Modal,
	Avatar,
	ImageList,
	ImageListItem,
	Dialog,
	DialogActions,
	FormHelperText,
	CircularProgress,
	LinearProgress,
	styled,
} from "@mui/material";
import { Container } from "@mui/system";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import DeleteIcon from '@mui/icons-material/Delete';

import PreviewIcon from "@mui/icons-material/Preview";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import {
	setOrderNew,
	getCustomersDataAll_dd,
	getSavedOrderDataByID,
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
	red,
} from "@mui/material/colors";
import {
	getLookupData,
	getOrderDataByID,
	getOrderAll_dd,
	getLatestOrder,
} from "../../constant/url";
import Slide from "@mui/material/Slide";
import CustomerModal from "../modals/CustomerModal";
import SavedTempOrders from "../modals/SavedTempOrders";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactFileReader from "react-file-reader";
import {
	handleSize,
	handleSqFeet,
	handleInput_Check,
} from "../../commonjs/CommonFun";

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function CreateOrder() {
	const LocState = useLocation()["state"];
	let dateObj = new Date();
	const access = useContext(AccessContext).authID;
	const [lookUpList, setLookupList] = React.useState([]);
	const [chkst, setChkst] = React.useState(Math.random());
	const [isModalCustomerUpdated, setIsModalCustomerUpdated] =
		React.useState(false);

	const [hisOrderId, setHisOrderId] = useState("");
	const [orderDate, setOrderDate] = useState(
		dateObj.getDate() +
			"/" +
			(dateObj.getMonth() + 1) +
			"/" +
			dateObj.getFullYear()
	);
	const [customerName, setCustomerName] = useState(0);
	const [customerNameList, setCustomerNameList] = useState([
		{ label: "Loading...", id: 0 },
	]);
	const [orderAllList, setOrderAllList] = useState([
		{ label: "Loading...", id: 0 },
	]);
	const [orderId, setOrderId] = useState("");
	const [length, setLength] = useState(0);
	const [height, setHeight] = useState(0);
	const [row, setRow] = useState(0);
	const [quantity, setQuantity] = useState(0);
	const [sqfeet, setSqFeet] = useState(0);
	const [size, setSize] = useState(0);
	const [pipeType, setPipeType] = useState("");
	const [expansionType, setExpansionType] = useState("");
	//New Pipe Bend components
	const [pbStraight, setPBStraight] = useState(false);
	const [pbStraightQty, setPBStraightQty] = useState("");
	const [pbStraightSize, setPBStraightSize] = useState("");
	const [pbStraightTotQty, setPBStraightTotQty] = useState("");

	const [pbSingle, setPBSingle] = useState(false);
	const [pbSingleQty, setPBSingleQty] = useState("");
	const [pbSingleSize, setPBSingleSize] = useState("");
	const [pbSingleTotQty, setPBSingleTotQty] = useState("");

	const [pbCross, setPBCross] = useState(false);
	const [pbCrossQty, setPBCrossQty] = useState("");
	const [pbCrossSize, setPBCrossSize] = useState("");
	const [pbCrossTotQty, setPBCrossTotQty] = useState("");

	const [pbOther, setPBOther] = useState(false);
	const [pbOtherQty, setPBOtherQty] = useState("");
	const [pbOtherSize, setPBOtherSize] = useState("");
	const [pbOtherTotQty, setPBOtherTotQty] = useState("");

	const [pipeComment, setPipeComment] = useState("");
	const [endPlateMaterial, setEndPlateMaterial] = useState("");
	const [endPlateModel, setEndPlateModel] = useState("");
	const [endPlateOrientation, setEndPlateOrientation] = useState([]);
	const [coverType, setCoverType] = useState([]);
	const [coverDetail, setCoverDetail] = useState([]);
	const [epComments, setEPComments] = useState("");
	const [finPerInch, setFinPerInch] = useState("");
	const [finComments, setFinComments] = useState("");
	const [circuitModels, setCircuitModels] = useState("");
	const [noCircuit, setNoCircuit] = useState("");
	const [liquidLine, setLiquidLine] = useState([]);
	const [dischargeLine, setDischargeLine] = useState([]);
	const [brazingComments, setBrazingComments] = useState("");
	const [paintType, setPaintType] = useState([]);
	const [packingType, setPackingType] = useState([]);
	const [dispatchMode, setDispatchMode] = useState([]);
	const [dispatchComment, setDispatchComments] = useState("");
	const [finalComments, setFinalComments] = useState("");
	const [epPhoto, setEpPhoto] = useState([]);
	const [assemblyPhoto, setAssemblyPhoto] = useState([]);
	const [brazingPhoto, setBrazingPhoto] = useState([]);

	const [dialogImg, setDialogImg] = useState("");
	const [openImg, setOpenImg] = useState(false);
	const [open, setOpen] = React.useState(false);
	const [openOrderStatus, setOepenOrderStatus] = React.useState(false);
	const [retOrderId, setRetOrderId] = React.useState("");
	const [apiCompStatus, setApiCompStatus] = useState({
		saveLoading: false,
		sumbitLoading: false,
	});

	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	const handleClickOpenimg = (base64) => {
		setDialogImg(base64);
		setOpenImg(true);
	};
	const handleClickDeleteimg=(imgIndex,imgType)=>{
		if(imgType==='ep'){
			setEpPhoto(prevEpPhoto => {
				// Create a copy of the array and then splice
				const newEpPhoto = [...prevEpPhoto];
				newEpPhoto.splice(imgIndex, 1);
				return newEpPhoto;
			});
		} else if(imgType==='assembly'){
			setAssemblyPhoto(prevAssemblyPhoto=>{
				const newAssemblyPhoto=[...prevAssemblyPhoto];
				newAssemblyPhoto.splice(imgIndex,1);
				return newAssemblyPhoto;
			});
		} else{
			setBrazingPhoto(brazePhoto=>{
				const newBrazePhoto=[...brazePhoto];
				newBrazePhoto.splice(imgIndex,1);
				return newBrazePhoto;
			});
		}
	};
	const handleCloseImg = (response) => {
		setOpenImg(false);
	};

	const handleCloseOrderStatusDialog = () => {
		setOepenOrderStatus(false);
	};

	const handleGetNextOrderId = (access) => {
		var bodyFormData = new FormData();

		bodyFormData.append("authId", access);
		axios({
			method: "post",
			url: getLatestOrder,
			data: bodyFormData,
			headers: { "Content-Type": "multipart/form-data" },
		}).then(function (response) {
			//handle success
			const res = response.data;
			if (res.status_code === 200) {
				setOrderId(res.data);
			}
		});
	};

	const handleSubmit = async (type, e) => {
		e.preventDefault();
		setApiCompStatus({
			...apiCompStatus,
			sumbitLoading: true,
			saveLoading: true,
		});
		const imgData = [
			{ ep: epPhoto, assembly: assemblyPhoto, brazing: brazingPhoto },
		];
		console.log(imgData);
		const btnname = type;
		var bodyFormData = new FormData();
console.log(access);
		bodyFormData.append("authId", access);
		bodyFormData.append("type", btnname);

		bodyFormData.append("order_date", orderDate);
		bodyFormData.append("customer_name", customerName.id);
		bodyFormData.append("length", length);
		bodyFormData.append("height", height);
		bodyFormData.append("rows", row);
		bodyFormData.append("quantity", quantity);
		bodyFormData.append("sq_feet", sqfeet);

		bodyFormData.append("pipe_type", pipeType);
		bodyFormData.append("expansion_type", expansionType);
		bodyFormData.append("pbStraight", pbStraight);
		bodyFormData.append("pbStraightQty", pbStraightQty);
		bodyFormData.append("pbStraightSize", pbStraightSize);
		bodyFormData.append("pbStraightTotQty", pbStraightTotQty);
		bodyFormData.append("pbSingle", pbSingle);
		bodyFormData.append("pbSingleQty", pbSingleQty);
		bodyFormData.append("pbSingleSize", pbSingleSize);
		bodyFormData.append("pbSingleTotQty", pbSingleTotQty);
		bodyFormData.append("pbCross", pbCross);
		bodyFormData.append("pbCrossQty", pbCrossQty);
		bodyFormData.append("pbCrossSize", pbCrossSize);
		bodyFormData.append("pbCrossTotQty", pbCrossTotQty);
		bodyFormData.append("pbOther", pbOther);
		bodyFormData.append("pbOtherQty", pbOtherQty);
		bodyFormData.append("pbOtherSize", pbOtherSize);
		bodyFormData.append("pbOtherTotQty", pbOtherTotQty);

		bodyFormData.append("pipe_comment", pipeComment);
		bodyFormData.append("end_plate_material", endPlateMaterial);
		bodyFormData.append("end_plate_modal", endPlateModel);
		bodyFormData.append("end_plate_orientation", endPlateOrientation);
		bodyFormData.append("cover_type", coverType);
		bodyFormData.append("cover_detail", coverDetail);
		bodyFormData.append("ep_comments", epComments);

		bodyFormData.append("fin_per_inch", finPerInch);
		bodyFormData.append("assembly_Photo", assemblyPhoto);
		bodyFormData.append("fin_comments", finComments);

		bodyFormData.append("circuit_models", circuitModels);
		bodyFormData.append("brazing_Photo", brazingPhoto);
		bodyFormData.append("circuit_no", noCircuit);
		bodyFormData.append("liquid_line", liquidLine);
		bodyFormData.append("discharge_line", dischargeLine);
		bodyFormData.append("brazing_comment", brazingComments);

		bodyFormData.append("paint", paintType);
		bodyFormData.append("packing_type", packingType);
		bodyFormData.append("dispatch_mode", dispatchMode);
		bodyFormData.append("dispatch_comment", dispatchComment);
		bodyFormData.append("final_comment", finalComments);

		imgData.forEach((item, index) => {
			if (item.ep.length > 0) {
				item.ep.forEach((img, imgIndex) => {
					console.log('Image Index EP',imgIndex);
					bodyFormData.append(`epPhoto[${imgIndex}]`, img);
				});
			}
			if (item.assembly.length > 0) {
				item.assembly.forEach((img, imgIndex) => {
					console.log('Image Index Assembly',imgIndex);
					bodyFormData.append(`assemblyPhoto[${imgIndex}]`, img);
				});
			}
			if (item.brazing.length > 0) {
				item.brazing.forEach((img, imgIndex) => {
					console.log('Image Index Brazing',imgIndex);
					bodyFormData.append(`brazingPhoto[${imgIndex}]`, img);
				});
			}
		  });
		  const responseOfOrder=await axios({
			method: "post",
			url: setOrderNew,
			data: bodyFormData
		});
		const res_data=responseOfOrder.data;
		if(responseOfOrder.status===200){
			if (res_data.order_id === "n/a") {
				toast("Order Temporaly Saved Successfully");
			} else {
				toast("Order Successful, Order Id: " + res_data.order_id);
				setRetOrderId(res_data.order_id);
				setOepenOrderStatus(true);
			}
			//setCustomerName(0);
					setCustomerNameList([{ label: "Loading...", id: 0 }]);
					setLength(0);
					setHeight(0);
					setRow(0);
					setQuantity(0);
					setSqFeet(0);
					setSize(0);
					setPipeType("");
					setExpansionType("");
					setPBStraight(false);
					setPBStraightQty("");
					setPBStraightSize("");
					setPBStraightTotQty("");

					setPBSingle(false);
					setPBSingleQty("");
					setPBSingleSize("");
					setPBSingleTotQty("");

					setPBCross(false);
					setPBCrossQty("");
					setPBCrossSize("");
					setPBCrossTotQty("");

					setPBOther(false);
					setPBOtherQty("");
					setPBOtherSize("");
					setPBOtherTotQty("");

					setPipeComment("");
					setEndPlateMaterial("");
					setEndPlateModel("");
					setEndPlateOrientation([]);
					setCoverType([]);
					setCoverDetail([]);
					setEPComments("");
					setFinPerInch("");
					setFinComments("");
					setCircuitModels("");
					setNoCircuit("");
					setLiquidLine([]);
					setDischargeLine([]);
					setBrazingComments("");
					setPaintType([]);
					setPackingType([]);
					setDispatchMode([]);
					setDispatchComments("");
					setFinalComments("");
					//setEpPhoto([]);
					//setAssemblyPhoto([]);
					//setBrazingPhoto([]);
					retOrderId("");
					//return data
		}

		setApiCompStatus({
			...apiCompStatus,
			sumbitLoading: false,
			saveLoading: false,
		});
	};

	const handleGetOrderById = (orderId) => {
		var bodyFormData = new FormData();
		bodyFormData.append("authId", access);
		bodyFormData.append("id", orderId?.id);

		axios({
			method: "post",
			url: getOrderDataByID,
			data: bodyFormData,
			headers: { "Content-Type": "multipart/form-data" },
		})
			.then(function (response) {
				//handle success
				const res = response.data;
				if (res.status_code === 200) {
					const res_data = res.data_orders[0];
					setHisOrderId({ id: res_data.id, label: res_data.order_id });
					setCustomerName({
						id: res_data.customer_name,
						label: res_data.full_customer_name,
					});
					setLength(res_data.length);
					setHeight(res_data.height);
					setRow(res_data.rows);
					setQuantity(res_data.quantity);
					setSqFeet(res_data.sq_feet);
					setSize(res_data.pipe_type);
					setPipeType(res_data.pipe_type);
					setExpansionType(res_data.expansion_type);
					setPBStraight(res_data.pbStraight);
					setPBStraightQty(res_data.pbStraightQty);
					setPBStraightSize(res_data.pbStraightSize);
					setPBStraightTotQty(res_data.pbStraightTotQty);

					setPBSingle(res_data.pbSingle);
					setPBSingleQty(res_data.pbSingleQty);
					setPBSingleSize(res_data.pbSingleSize);
					setPBSingleTotQty(res_data.pbSingleTotQty);

					setPBCross(res_data.pbCross);
					setPBCrossQty(res_data.pbCrossQty);
					setPBCrossSize(res_data.pbCrossSize);
					setPBCrossTotQty(res_data.pbCrossTotQty);

					setPBOther(res_data.pbOther);
					setPBOtherQty(res_data.pbOtherQty);
					setPBOtherSize(res_data.pbOtherSize);
					setPBOtherTotQty(res_data.pbOtherTotQty);
					setPipeComment(res_data.pipe_comment);
					setEndPlateMaterial(res_data.end_plate_material);
					setEndPlateModel(res_data.end_plate_modal);
					setEndPlateOrientation(res_data.end_plate_orientation.split(","));
					setCoverDetail(res_data.cover_detail.split(","));
					setEPComments(res_data.ep_comments);
					setFinPerInch(res_data.fin_per_inch);
					setFinComments(res_data.fin_comments);
					setCircuitModels(res_data.circuit_models);
					setNoCircuit(res_data.circuit_no);
					setLiquidLine(res_data.liquid_line.split(","));
					setDischargeLine(res_data.discharge_line.split(","));
					setBrazingComments(res_data.brazing_comment);
					setPaintType(res_data.paint.split(","));
					setPackingType(res_data.packing_type.split(","));
					setDispatchMode(res_data.dispatch_mode.split(","));
					setDispatchComments(res_data.dispatch_comment);
					setFinalComments(res_data.final_comment);
					//setEpPhoto(res_data.ep_photo);
					//setAssemblyPhoto(res_data.assembly_Photo);
					//setBrazingPhoto(res_data.brazing_Photo);
					//return data
				} else {
					console.log("rresponse", res);
				}
			})
			.catch(function (response) {
				//handle error
				console.log(response);
			});
	};

	const handleGetSavedData = (savedId) => {
		var bodyFormData = new FormData();

		bodyFormData.append("authId", access);
		bodyFormData.append("id", savedId);

		axios({
			method: "post",
			url: getSavedOrderDataByID,
			data: bodyFormData,
			headers: { "Content-Type": "multipart/form-data" },
		})
			.then(function (response) {
				//handle success
				const res = response.data;
				if (res.status_code === 200) {
					const res_data = res.data_orders[0];
					setCustomerName({
						id: res_data.customer_name,
						label: res_data.full_customer_name,
					});
					setLength(res_data.length);
					setHeight(res_data.height);
					setRow(res_data.rows);
					setQuantity(res_data.quantity);
					setSqFeet(res_data.sq_feet);
					setSize(res_data.pipe_type);
					setPipeType(res_data.pipe_type);
					setExpansionType(res_data.expansion_type);
					setPBStraight(res_data.pbStraight);
					setPBStraightQty(res_data.pbStraightQty);
					setPBStraightSize(res_data.pbStraightSize);
					setPBStraightTotQty(res_data.pbStraightTotQty);

					setPBSingle(res_data.pbSingle);
					setPBSingleQty(res_data.pbSingleQty);
					setPBSingleSize(res_data.pbSingleSize);
					setPBSingleTotQty(res_data.pbSingleTotQty);

					setPBCross(res_data.pbCross);
					setPBCrossQty(res_data.pbCrossQty);
					setPBCrossSize(res_data.pbCrossSize);
					setPBCrossTotQty(res_data.pbCrossTotQty);

					setPBOther(res_data.pbOther);
					setPBOtherQty(res_data.pbOtherQty);
					setPBOtherSize(res_data.pbOtherSize);
					setPBOtherTotQty(res_data.pbOtherTotQty);
					setPipeComment(res_data.pipe_comment);
					setEndPlateMaterial(res_data.end_plate_material);
					setEndPlateModel(res_data.end_plate_modal);
					setEndPlateOrientation(res_data.end_plate_orientation.split(","));
					setCoverDetail(res_data.cover_detail.split(","));
					setEPComments(res_data.ep_comments);
					setFinPerInch(res_data.fin_per_inch);
					setFinComments(res_data.fin_comments);
					setCircuitModels(res_data.circuit_models);
					setNoCircuit(res_data.circuit_no);
					setLiquidLine(res_data.liquid_line.split(","));
					setDischargeLine(res_data.discharge_line.split(","));
					setBrazingComments(res_data.brazing_comment);
					setPaintType(res_data.paint.split(","));
					setPackingType(res_data.packing_type.split(","));
					setDispatchMode(res_data.dispatch_mode.split(","));
					setDispatchComments(res_data.dispatch_comment);
					setFinalComments(res_data.final_comment);
					//setEpPhoto(res_data.ep_photo);
					//setAssemblyPhoto(res_data.assembly_Photo);
					//setBrazingPhoto(res_data.brazing_Photo);
					//return data
				} else {
					console.log(res.status_msg);
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
			url: getCustomersDataAll_dd,
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
					toast(res_data.status_msg);
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
					toast(res_data.status_msg);
				}
			})
			.catch(function (response) {
				//handle error
				console.log(response);
			});
	}

	function handleGetOrderAll_dd() {
		var bodyFormData = new FormData();
		bodyFormData.append("authId", access);

		axios({
			method: "post",
			url: getOrderAll_dd,
			data: bodyFormData,
			headers: { "Content-Type": "multipart/form-data" },
		})
			.then(function (response) {
				//handle success
				const res_data = response.data;
				if (res_data.status_code === 200) {
					setOrderAllList(res_data.data_his_id);
				} else {
					toast(res_data.status_msg);
				}
			})
			.catch(function (response) {
				//handle error
				console.log(response);
			});
	}

	function FinalConcatComment() {
		let a = "Pipe: " + pipeComment;
		let b = "EP: " + epComments;
		let c = "Fins: " + finComments;
		let d = "Brazing: " + brazingComments;
		let e = "Dispatch: " + dispatchComment;
		let f = "Final: " + finalComments;

		return (
			<div>
				{a} <br /> {b} <br /> {c} <br /> {d} <br />
				{e}
				<br />
				{f}
			</div>
		);
	}

	function handleSelectedOrder(retId) {
		handleGetSavedData(retId);
	}

	const handleFiles = (type, files) => {
		console.log(files.fileList.length);
		if (type === "ep") {
			setEpPhoto((prevImage)=>{
				if (prevImage.length===3) {
					alert('You cant upload more than three images');
					return prevImage;
				} else {
					return [...prevImage,...files.base64]
				}
			});
		} else if (type === "assembly") {
			setAssemblyPhoto((prevImage)=>{
				if (prevImage.length===3) {
					alert('You cant upload more than three images');
					return prevImage;
				} else {
					return [...prevImage,...files.base64]
				}
			});
		} else if (type === "brazing") {
			setBrazingPhoto((prevImage)=>{
				if (prevImage.length===3) {
					alert('You cant upload more than three images');
					return prevImage;
				} else {
					return [...prevImage,...files.base64]
				}
			});
		}
	};

	React.useEffect(() => {
		handleGetLookup();
	}, []);

	useEffect(() => {
		handleCustomerList(access);
		handleGetOrderAll_dd(access);
		setIsModalCustomerUpdated(false);
		handleGetNextOrderId(access);
	}, [isModalCustomerUpdated]);

	useEffect(() => {
		setSqFeet(handleSqFeet(length, height, row, quantity));
		setSize(handleSize(length, height, row, quantity));
		setPBStraightQty((height * row) / 2);
		setPBSingleQty(height * row);
		setPBCrossQty((height * row) / 2);
	}, [length, height, row, quantity]);

	useEffect(() => {
		setPBStraightTotQty(quantity * pbStraightQty);
		setPBSingleTotQty(quantity * pbSingleQty);
		setPBCrossTotQty(quantity * pbCrossQty);
	}, [quantity, pbStraightQty, pbSingleQty, pbCrossQty]);

	useEffect(() => {
		if (LocState?.orderRowid) {
			handleGetOrderById({ id: LocState.orderRowid });
		}
	}, [LocState]);

	return (
		<div>
			<div className="main mt-0 pt-0">
				<div className="content">
					<div className="container">
						<h5 className="headline">Create Order</h5>
						<ToastContainer />
						<div className="row">
							<div className="col-12">
								<div className="card shadow-card mb-4">
									<div className="card-body">
										<div className="row">
											<div className="col">
												<p className="mb-0">New Order No.</p>
												<p>{orderId}</p>
											</div>
											<div className="col">
												<TextField
													InputLabelProps={{ shrink: true }}
													type="text"
													margin="normal"
													required
													fullWidth
													className="mb-3"
													id="orderdate"
													size="small"
													label="Order Date"
													name="orderdate"
													autoComplete="orderdate"
													value={orderDate}
													error={!moment(orderDate, "DD/MM/YYY").isValid()}
													helperText={
														moment(orderDate, "DD/MM/YYY").isValid()
															? ""
															: "Data Value is not Correct. Use format DD/MM/YYY"
													}
												/>
											</div>
											<div className="col">
												<Autocomplete
													disableClearable
													required
													disablePortal
													id="combo-box-orderid"
													options={orderAllList}
													fullWidth
													renderInput={(params) => (
														<TextField {...params} label="Order History" />
													)}
													onChange={(e, value) => {
														handleGetOrderById(value);
													}}
													value={hisOrderId}
													key={"orderid-1"}
												/>
											</div>
											<div className="col">
												<Button
													className="prime-bg"
													variant="contained"
													onClick={handleOpen}
												>
													Display Saved Order
												</Button>
											</div>
										</div>
									</div>
								</div>
								<div className="card shadow-card">
									<div className="card-body order-card">
										<Container>
											<form onSubmit={(e) => handleSubmit("submit", e)}>
												<div className="row">
													<div className="col-12">
														<div className="row  mt-2 rounded">
															<div className="row  mt-2 rounded prime-border p-2 m-1">
																<div className="col-6">
																	<Stack direction="row" spacing={2}>
																		<Button
																			className="prime-bg "
																			variant="contained"
																			data-bs-toggle="modal"
																			data-bs-target="#staticBackdrop"
																			sx={{ height: "60px" }}
																		>
																			<PersonAddAltIcon />
																		</Button>
																		<Autocomplete
																			disableClearable
																			required
																			disablePortal
																			id="combo-box-demo"
																			options={customerNameList}
																			getOptionLabel={(customerNameList) =>
																				customerNameList.label || ""
																			}
																			getOptionSelected={(option, value) =>
																				option.id === value.id
																			}
																			isOptionEqualToValue={(option, value) =>
																				option.id === value.id
																			}
																			sx={{ width: 300 }}
																			renderInput={(params) => (
																				<TextField
																					{...params}
																					label="Customers"
																					required
																					error={customerName === 0}
																					helperText={
																						customerName === 0
																							? "Select Customer"
																							: ""
																					}
																				/>
																			)}
																			fullWidth
																			onChange={(e, value) => {
																				setCustomerName({
																					label: value.label,
																					id: value.id,
																				});
																			}}
																			value={customerName}
																			key={"custname" + 1}
																		/>
																	</Stack>
																</div>
																<div className="col-3">
																	<TextField
																		InputLabelProps={{ shrink: true }}
																		type="number"
																		margin="normal"
																		required
																		fullWidth
																		id="sqfeet"
																		size="small"
																		label="Sq. Feet"
																		name="sqfeet"
																		autoComplete="sqfeet"
																		value={sqfeet}
																	/>
																</div>
																<div className="col-3">
																	<TextField
																		InputLabelProps={{ shrink: true }}
																		type="text"
																		margin="normal"
																		required
																		fullWidth
																		id="Size"
																		size="small"
																		label="Size"
																		name="Size"
																		autoComplete="size"
																		value={size}
																	/>
																</div>
																<div className="col-3">
																	<TextField
																		InputLabelProps={{ shrink: true }}
																		type="number"
																		margin="normal"
																		required
																		fullWidth
																		id="length"
																		size="small"
																		label="Length"
																		name="length"
																		autoComplete="length"
																		value={length}
																		onChange={(e) => setLength(e.target.value)}
																		inputProps={{
																			maxLength: 13,
																		}}
																		error={length.length === 0}
																		helperText={
																			length.length === 0
																				? "Enter Proper Value."
																				: ""
																		}
																	/>
																</div>
																<div className="col-3">
																	<TextField
																		InputLabelProps={{ shrink: true }}
																		type="number"
																		margin="normal"
																		required
																		fullWidth
																		id="height"
																		size="small"
																		label="Height"
																		name="height"
																		autoComplete="height"
																		value={height}
																		onChange={(e) => setHeight(e.target.value)}
																		inputProps={{
																			maxLength: 13,
																		}}
																		error={height.length === 0}
																		helperText={
																			height.length === 0
																				? "Enter Proper Value."
																				: ""
																		}
																	/>
																</div>
																<div className="col-3">
																	<TextField
																		InputLabelProps={{ shrink: true }}
																		type="number"
																		margin="normal"
																		required
																		fullWidth
																		id="rows"
																		size="small"
																		label="Rows"
																		name="rows"
																		autoComplete="rows"
																		value={row}
																		onChange={(e) => setRow(e.target.value)}
																		inputProps={{
																			maxLength: 13,
																		}}
																		error={row.length === 0}
																		helperText={
																			row.length === 0
																				? "Enter Proper Value."
																				: ""
																		}
																	/>
																</div>
																<div className="col-3">
																	<TextField
																		InputLabelProps={{ shrink: true }}
																		type="number"
																		margin="normal"
																		required
																		fullWidth
																		id="quantity"
																		size="small"
																		label="Quantity (Max 99)"
																		name="quantity"
																		autoComplete="quantity"
																		value={quantity}
																		onChange={(e) => {
																			e.target.value > 99
																				? setQuantity(99)
																				: setQuantity(e.target.value);
																		}}
																		error={quantity.length === 0}
																		helperText={
																			quantity.length === 0
																				? "Enter Proper Value."
																				: ""
																		}
																	/>
																</div>
															</div>
															<div className="row  mt-2 rounded prime-border p-2 m-1">
																<div className="col-3">
																	<FormControl fullWidth>
																		<InputLabel id="modeDispatch-label">
																			Pipe Type
																		</InputLabel>
																		<Select
																			required={true}
																			labelId="modeDispatch-label"
																			id="pipeType-select"
																			label="Pipe Type"
																			value={pipeType}
																			onChange={(e) =>
																				setPipeType(e.target.value)
																			}
																			error={pipeType === ""}
																			helperText={
																				pipeType !== ""
																					? "Select Pipe Type"
																					: ""
																			}
																		>
																			{lookUpList["pipeType"]?.map((item) => {
																				return (
																					<MenuItem value={item.id}>
																						{item.lkp_value}
																					</MenuItem>
																				);
																			})}
																		</Select>
																		{pipeType === "" && (
																			<FormHelperText error>
																				Select Pipe Type
																			</FormHelperText>
																		)}
																	</FormControl>
																</div>
																<div className="col-3">
																	<FormControl fullWidth>
																		<InputLabel id="expansionType-label">
																			Expansion Type
																		</InputLabel>
																		<Select
																			required={true}
																			labelId="expansionType-label"
																			id="expansionType-select"
																			label="Expansion Type"
																			value={expansionType}
																			onChange={(e) =>
																				setExpansionType(e.target.value)
																			}
																		>
																			{lookUpList["expansionType"]?.map(
																				(item) => {
																					return (
																						<MenuItem value={item.id}>
																							{item.lkp_value}
																						</MenuItem>
																					);
																				}
																			)}
																		</Select>
																		{expansionType === "" && (
																			<FormHelperText error>
																				Select Expansion Type
																			</FormHelperText>
																		)}
																	</FormControl>
																</div>
																<div className="col-6">
																	<TextField
																		InputLabelProps={{ shrink: true }}
																		margin="normal"
																		fullWidth
																		id="pipesize"
																		size="small"
																		label="Pipe Comment"
																		name="pipecomment"
																		autoComplete="Pipe Comment"
																		value={pipeComment}
																		onChange={(e) => {
																			setPipeComment(e.target.value);
																		}}
																	/>
																</div>
																<div className="col-12">
																	<InputLabel>Pipe Bend Data</InputLabel>
																	{pbStraight !== "true" &&
																		pbSingle !== "true" &&
																		pbCross !== "true" &&
																		pbOther !== "true" && (
																			<FormHelperText error>
																				Select any of the Pipe Bend
																			</FormHelperText>
																		)}
																	<Stack
																		direction="row"
																		spacing={{ xs: 1, sm: 6, md: 12 }}
																		alignContent="space-between"
																	>
																		<Stack>
																			<FormControlLabel
																				control={
																					<Checkbox
																						value="Straight"
																						onChange={(event) =>
																							setPBStraight(
																								event.target.checked.toString()
																							)
																						}
																						checked={pbStraight === "true"}
																						name="pipebend"
																					/>
																				}
																				label="Straight"
																			/>

																			{pbStraight === "true" && (
																				<Stack>
																					<TextField
																						InputLabelProps={{ shrink: true }}
																						type="number"
																						margin="normal"
																						fullWidth
																						id="stQty"
																						size="small"
																						label="Straight Qty"
																						autoComplete="Straight Qty"
																						value={pbStraightQty}
																						onChange={(e) => {
																							setPBStraightQty(e.target.value);
																						}}
																					/>
																					<TextField
																						InputLabelProps={{ shrink: true }}
																						type="number"
																						margin="normal"
																						fullWidth
																						id="stSize"
																						size="small"
																						label="Straight Size"
																						autoComplete="Straight Size"
																						value={pbStraightSize}
																						onChange={(e) => {
																							setPBStraightSize(e.target.value);
																						}}
																					/>
																					<TextField
																						InputLabelProps={{ shrink: true }}
																						type="number"
																						margin="normal"
																						fullWidth
																						id="totStqty"
																						size="small"
																						label="Total Straight Qty"
																						autoComplete="Total Straight Qty"
																						value={pbStraightTotQty}
																						//onChange={(e) => {setPBStraightTotQty( e.target.value); }}
																					/>
																				</Stack>
																			)}
																		</Stack>
																		<Stack>
																			<FormControlLabel
																				control={
																					<Checkbox
																						value="Single"
																						onChange={(event) =>
																							setPBSingle(
																								event.target.checked.toString()
																							)
																						}
																						checked={pbSingle === "true"}
																					/>
																				}
																				label="Single"
																				name="pipebend"
																			/>
																			{pbSingle === "true" && (
																				<Stack>
																					<TextField
																						InputLabelProps={{ shrink: true }}
																						type="number"
																						margin="normal"
																						fullWidth
																						id="singleQty"
																						size="small"
																						label="Single Qty"
																						autoComplete="Single Qty"
																						value={pbSingleQty}
																						onChange={(e) => {
																							setPBSingleQty(e.target.value);
																						}}
																					/>
																					<TextField
																						InputLabelProps={{ shrink: true }}
																						type="number"
																						margin="normal"
																						fullWidth
																						id="SingleSize"
																						size="small"
																						label="Single Size"
																						autoComplete="Single Size"
																						value={pbSingleSize}
																						onChange={(e) => {
																							setPBSingleSize(e.target.value);
																						}}
																					/>
																					<TextField
																						InputLabelProps={{ shrink: true }}
																						type="number"
																						margin="normal"
																						fullWidth
																						id="totSIngleqty"
																						size="small"
																						label="Total Single Qty"
																						autoComplete="Total Single Qty"
																						value={pbSingleTotQty}
																						//onChange={(e) => {setPBSingleTotQty( e.target.value); }}
																					/>
																				</Stack>
																			)}
																		</Stack>
																		<Stack>
																			<FormControlLabel
																				control={
																					<Checkbox
																						value="Cross"
																						onChange={(event) =>
																							setPBCross(
																								event.target.checked.toString()
																							)
																						}
																						checked={pbCross === "true"}
																					/>
																				}
																				label="Cross"
																				name="pipebend"
																			/>
																			{pbCross === "true" && (
																				<Stack>
																					<TextField
																						InputLabelProps={{ shrink: true }}
																						type="number"
																						margin="normal"
																						fullWidth
																						id="crossQty"
																						size="small"
																						label="Cross Qty"
																						autoComplete="Cross Qty"
																						value={pbCrossQty}
																						onChange={(e) => {
																							setPBCrossQty(e.target.value);
																						}}
																					/>
																					<TextField
																						InputLabelProps={{ shrink: true }}
																						type="number"
																						margin="normal"
																						fullWidth
																						id="stSize"
																						size="small"
																						label="Cross Size"
																						autoComplete="Cross Size"
																						value={pbCrossSize}
																						onChange={(e) => {
																							setPBCrossSize(e.target.value);
																						}}
																					/>
																					<TextField
																						InputLabelProps={{ shrink: true }}
																						type="number"
																						margin="normal"
																						fullWidth
																						id="toCrossqty"
																						size="small"
																						label="Total Cross Qty"
																						autoComplete="Total Cross Qty"
																						value={pbCrossTotQty}
																						//onChange={(e) => {setPBCrossTotQty( e.target.value); }}
																					/>
																				</Stack>
																			)}
																		</Stack>
																		<Stack>
																			<FormControlLabel
																				control={
																					<Checkbox
																						value="Other"
																						onChange={(event) =>
																							setPBOther(
																								event.target.checked.toString()
																							)
																						}
																						checked={pbOther === "true"}
																					/>
																				}
																				label="Other"
																			/>
																			{pbOther === "true" && (
																				<Stack>
																					<TextField
																						InputLabelProps={{ shrink: true }}
																						type="number"
																						margin="normal"
																						fullWidth
																						id="otherQty"
																						size="small"
																						label="Other Qty"
																						autoComplete="Other Qty"
																						value={pbOtherQty}
																						onChange={(e) => {
																							setPBOtherQty(e.target.value);
																						}}
																					/>
																					<TextField
																						InputLabelProps={{ shrink: true }}
																						type="number"
																						margin="normal"
																						fullWidth
																						id="OtherSize"
																						size="small"
																						label="Other Size"
																						autoComplete="Other Size"
																						value={pbOtherSize}
																						onChange={(e) => {
																							setPBOtherSize(e.target.value);
																						}}
																					/>
																					<TextField
																						InputLabelProps={{ shrink: true }}
																						type="number"
																						margin="normal"
																						fullWidth
																						id="tototherqty"
																						size="small"
																						label="Total Other Qty"
																						autoComplete="Total Other Qty"
																						value={pbOtherTotQty}
																						onChange={(e) => {
																							setPBOtherTotQty(e.target.value);
																						}}
																					/>
																				</Stack>
																			)}
																		</Stack>
																	</Stack>
																</div>
															</div>
															<div className="row  mt-2 rounded prime-border p-2">
																<div className="col-3">
																	<FormControl fullWidth>
																		<InputLabel id="modeDispatch-label">
																			End Plate Material
																		</InputLabel>
																		<Select
																			required={true}
																			labelId="modeDispatch-label"
																			id="epMaterial-select"
																			label="End Plate Material"
																			value={endPlateMaterial}
																			onChange={(event) =>
																				setEndPlateMaterial(event.target.value)
																			}
																		>
																			{lookUpList["epMaterial"]?.map((item) => {
																				return (
																					<MenuItem value={item.id}>
																						{item.lkp_value}
																					</MenuItem>
																				);
																			})}
																		</Select>
																		{endPlateMaterial.length <= 0 && (
																			<FormHelperText error>
																				Select End Plate Material
																			</FormHelperText>
																		)}
																	</FormControl>
																</div>
																<div className="col-3">
																	<FormControl fullWidth>
																		<InputLabel id="modeDispatch-label">
																			End Plate Modal
																		</InputLabel>
																		<Select
																			required={true}
																			labelId="modeDispatch-label"
																			id="epModel-select"
																			label="End Plate Modal"
																			value={endPlateModel}
																			onChange={(event) =>
																				setEndPlateModel(event.target.value)
																			}
																		>
																			{lookUpList["epModal"]?.map((item) => {
																				return (
																					<MenuItem value={item.id}>
																						{item.lkp_value}
																					</MenuItem>
																				);
																			})}
																		</Select>
																		{endPlateModel?.length <= 0 && (
																			<FormHelperText error>
																				Select End Plate Model
																			</FormHelperText>
																		)}
																	</FormControl>
																</div>
																<div className="col-3">
																	<InputLabel>Photo upload EP</InputLabel>
																	{epPhoto.length === 0 && (
																		<FormHelperText error>
																			Select EP Photo
																		</FormHelperText>
																	)}
																	<>
																		{
																			<ImageList cols={3}>
																				{epPhoto?.map((item, index) => (
																					<ImageListItem
																						key={"epphoto" + index}
																					>
																						<img
																							src={item}
																							srcSet={item}
																							alt={"epphoto"}
																							loading="lazy"
																						/>
																						<Stack direction="row" spacing={1}>
																						<IconButton
																							onClick={() =>
																								handleClickOpenimg(item)
																							}
																						>
																							<PreviewIcon />
																						</IconButton>
																						<IconButton
																onClick={() => handleClickDeleteimg(index,'ep')}
															>
																<DeleteIcon />
															</IconButton>
															</Stack>
																					</ImageListItem>
																				))}
																			</ImageList>
																		}
																		<ReactFileReader

																			fileTypes={[".png", ".jpg"]}
																			base64={true}
																			multipleFiles={true}
																			handleFiles={(files) => {
																				handleFiles("ep", files);
																			}}
																			key={Math.random()}
																		>
																			<PhotoCameraIcon />
																		</ReactFileReader>
																	</>
																</div>
																<div className="col-3">
																	<InputLabel>Orientation</InputLabel>
																	{endPlateOrientation.length <= 0 && (
																		<FormHelperText error>
																			Select Orientation
																		</FormHelperText>
																	)}
																	<Stack direction="row" spacing={1}>
																		{lookUpList["oreientation"]?.map((item) => {
																			return (
																				<>
																					<FormControlLabel
																						control={
																							<Checkbox
																								value={item.id}
																								key={Math.random()}
																								onChange={(event) => {
																									setEndPlateOrientation(
																										handleInput_Check(
																											endPlateOrientation,
																											event.target.value,
																											event.target.checked
																										)
																									);
																									setChkst(Math.random());
																								}}
																								checked={
																									endPlateOrientation.indexOf(
																										item.id
																									) !== -1
																								}
																							/>
																						}
																						label={item.lkp_value}
																					/>
																				</>
																			);
																		})}
																	</Stack>
																</div>
																<div className="col-12">
																	<InputLabel id="cover-label">
																		Cover Type-Detail
																	</InputLabel>
																	{coverDetail.length <= 0 && (
																		<FormHelperText error>
																			Select Cover Type-Details
																		</FormHelperText>
																	)}
																	<Stack direction="column" spacing={2}>
																		{chkst > 0 &&
																			lookUpList["coverType"]?.map((item) => {
																				return (
																					<div
																						style={{
																							backgroundColor: "#D06800",
																							padding: "3px",
																							borderRadius: "5px",
																						}}
																					>
																						<InputLabel
																							id="cover-label"
																							style={{ color: "white" }}
																						>
																							{item.lkp_value}
																						</InputLabel>
																						<Stack
																							direction="row"
																							style={{
																								backgroundColor: "#F37C06",
																								padding: "3px",
																								borderRadius: "5px",
																								overflow: "scroll",
																							}}
																						>
																							{lookUpList["coverDetail"]?.map(
																								(itemd) => {
																									if (
																										itemd.lkp_id === item.id
																									) {
																										return (
																											<FormControlLabel
																												control={
																													<Checkbox
																														value={itemd.id}
																														checked={
																															coverDetail.indexOf(
																																itemd.id
																															) !== -1
																														}
																														onChange={(
																															event
																														) => {
																															setCoverDetail(
																																handleInput_Check(
																																	coverDetail,
																																	event.target
																																		.value,
																																	event.target
																																		.checked
																																)
																															);
																															setChkst(
																																Math.random()
																															);
																														}}
																													/>
																												}
																												label={itemd.sublkp_val}
																											/>
																										);
																									}
																								}
																							)}
																						</Stack>
																					</div>
																				);
																			})}
																	</Stack>
																</div>
																<div className="col-6">
																	<TextField
																		InputLabelProps={{ shrink: true }}
																		margin="normal"
																		fullWidth
																		size="small"
																		label="EP Comments"
																		autoComplete="epComments"
																		value={epComments}
																		onChange={(e) => {
																			setEPComments(e.target.value);
																		}}
																	/>
																</div>
															</div>
															<div className="row  mt-2 rounded prime-border p-2">
																<div className="col-4">
																	<TextField
																		InputLabelProps={{ shrink: true }}
																		margin="normal"
																		required
																		fullWidth
																		size="small"
																		label="Fins per inch"
																		autoComplete="Finspi"
																		value={finPerInch}
																		onChange={(e) =>
																			setFinPerInch(e.target.value)
																		}
																		error={finPerInch.length <= 0}
																		helperText={
																			finPerInch.length <= 0
																				? "Enter Fin Per Inch"
																				: ""
																		}
																	/>
																</div>
																<div className="col-4">
																	<TextField
																		InputLabelProps={{ shrink: true }}
																		margin="normal"
																		fullWidth
																		size="small"
																		label="Fins Comments"
																		autoComplete="findcom"
																		value={finComments}
																		onChange={(e) => {
																			setFinComments(e.target.value);
																		}}
																	/>
																</div>
																<div className="col-4">
																	<InputLabel>
																		Photo upload Hair pin(Assembly)
																	</InputLabel>
																	{assemblyPhoto.length === 0 && (
																		<FormHelperText error>
																			Select Assembly Photo
																		</FormHelperText>
																	)}
																	<>
																		{
																			<ImageList cols={3}>
																				{assemblyPhoto?.map((item, index) => (
																					<ImageListItem
																						key={"assemblyphoto" + index}
																					>
																						<img
																							src={item}
																							srcSet={item}
																							alt={"assemblyphoto"}
																							loading="lazy"
																						/>
																						<Stack direction="row" spacing={1}>
																						<IconButton
																							onClick={() =>
																								handleClickOpenimg(item)
																							}
																						>
																							<PreviewIcon />
																						</IconButton>
																						<IconButton
																onClick={() => handleClickDeleteimg(index,'assembly')}
															>
																<DeleteIcon />
															</IconButton>
															</Stack>
																					</ImageListItem>
																				))}
																			</ImageList>
																		}
																		<ReactFileReader
																			fileTypes={[".png", ".jpg"]}
																			base64={true}
																			handleFiles={(files) =>
																				handleFiles("assembly", files)
																			}
																			multipleFiles={true}
																		>
																			<PhotoCameraIcon />
																		</ReactFileReader>
																	</>
																</div>
															</div>
															<div className="row mt-2 rounded prime-border p-2">
																<div className="col-3">
																	<FormControl fullWidth>
																		<InputLabel id="circuitmodel-label">
																			Circuit Model
																		</InputLabel>
																		<Select
																			required={true}
																			labelId="circuitmodel-label"
																			id="circuitmodel-select"
																			label="Circuit Model"
																			value={circuitModels}
																			onChange={(event) =>
																				setCircuitModels(event.target.value)
																			}
																		>
																			{lookUpList["circuitModel"]?.map(
																				(item) => {
																					return (
																						<MenuItem value={item.id}>
																							{item.lkp_value}
																						</MenuItem>
																					);
																				}
																			)}
																		</Select>
																		{circuitModels === "" && (
																			<FormHelperText error>
																				Select Circuit Models
																			</FormHelperText>
																		)}
																	</FormControl>
																</div>
																<div className="col-3">
																	<TextField
																		InputLabelProps={{ shrink: true }}
																		margin="normal"
																		required
																		fullWidth
																		size="small"
																		label="No of circuits"
																		name="nocircuit"
																		autoComplete="nocircuit"
																		value={noCircuit}
																		onChange={(e) =>
																			setNoCircuit(e.target.value)
																		}
																		error={noCircuit.length <= 0}
																		helperText={
																			noCircuit.length <= 0
																				? "Enter No of Circuit"
																				: ""
																		}
																	/>
																</div>
																<div className="col-3">
																	<TextField
																		InputLabelProps={{ shrink: true }}
																		margin="normal"
																		fullWidth
																		size="small"
																		label="Brazing Comments"
																		name="bcomment"
																		autoComplete="Brazing Comments"
																		value={brazingComments}
																		onChange={(e) => {
																			setBrazingComments(e.target.value);
																		}}
																	/>
																</div>
																<div className="col-3">
																	<InputLabel>
																		Photo upload Hair pin(Brazing)
																	</InputLabel>
																	{brazingPhoto.length === 0 && (
																		<FormHelperText error>
																			Select Brazing Photo
																		</FormHelperText>
																	)}
																	<>
																		{
																			<ImageList cols={3}>
																				{brazingPhoto?.map((item, index) => (
																					<ImageListItem
																						key={"brazing" + index}
																					>
																						<img
																							src={item}
																							srcSet={item}
																							alt={"brazing"}
																							loading="lazy"
																						/>
																						<Stack direction="row" spacing={1}>
																						<IconButton
																							onClick={() =>
																								handleClickOpenimg(item)
																							}
																						>
																							<PreviewIcon />
																						</IconButton>
																						<IconButton
																onClick={() => handleClickDeleteimg(index,'brazing')}
															>
																<DeleteIcon />
															</IconButton>
															</Stack>
																					</ImageListItem>
																				))}
																			</ImageList>
																		}
																		<ReactFileReader
																			fileTypes={[".png", ".jpg"]}
																			base64={true}
																			handleFiles={(files) =>
																				handleFiles("brazing", files)
																			}
																			multipleFiles={true}
																		>
																			<PhotoCameraIcon />
																		</ReactFileReader>
																	</>
																</div>

																<div className="col-8">
																	<InputLabel id="liquidLine-label">
																		Liquid Line
																	</InputLabel>
																	{liquidLine.length <= 0 && (
																		<FormHelperText error>
																			Select Liquid Line
																		</FormHelperText>
																	)}
																	<Stack
																		direction="row"
																		spacing={0}
																		useFlexGap
																		flexWrap="wrap"
																	>
																		{lookUpList["liquidLine"]?.map((item) => {
																			return (
																				<FormControlLabel
																					control={
																						<Checkbox
																							value={item.id}
																							onChange={(event) => {
																								setLiquidLine(
																									handleInput_Check(
																										liquidLine,
																										event.target.value,
																										event.target.checked
																									)
																								);
																								setChkst(Math.random());
																							}}
																							checked={
																								liquidLine.indexOf(item.id) !==
																								-1
																							}
																							key={Math.random()}
																						/>
																					}
																					label={item.lkp_value}
																				/>
																			);
																		})}
																	</Stack>
																</div>
																<div className="col-4">
																	<InputLabel id="dischargeLine-label">
																		Discharge Line
																	</InputLabel>
																	{dischargeLine.length <= 0 && (
																		<FormHelperText error>
																			Select Discharge Line
																		</FormHelperText>
																	)}
																	<Stack
																		direction="row"
																		spacing={0}
																		useFlexGap
																		flexWrap="wrap"
																	>
																		{lookUpList["dischargeLine"]?.map(
																			(item) => {
																				return (
																					<FormControlLabel
																						control={
																							<Checkbox
																								value={item.id}
																								checked={
																									dischargeLine.indexOf(
																										item.id
																									) !== -1
																								}
																								onChange={(event) => {
																									setDischargeLine(
																										handleInput_Check(
																											dischargeLine,
																											event.target.value,
																											event.target.checked
																										)
																									);
																									setChkst(Math.random());
																								}}
																							/>
																						}
																						label={item.lkp_value}
																					/>
																				);
																			}
																		)}
																	</Stack>
																</div>
															</div>
															<div className="row  mt-2 rounded prime-border p-2">
																<div className="col-6">
																	<InputLabel id="PaintingType-label">
																		Painting Type
																	</InputLabel>
																	{paintType.length <= 0 && (
																		<FormHelperText error>
																			Select Painting Type
																		</FormHelperText>
																	)}
																	<Stack
																		direction="row"
																		spacing={0}
																		useFlexGap
																		flexWrap="wrap"
																	>
																		{lookUpList["paintType"]?.map((item) => {
																			return (
																				<FormControlLabel
																					control={
																						<Checkbox
																							value={item.id}
																							checked={
																								paintType.indexOf(item.id) !==
																								-1
																							}
																							onChange={(event) => {
																								setPaintType(
																									handleInput_Check(
																										paintType,
																										event.target.value,
																										event.target.checked
																									)
																								);
																								setChkst(Math.random);
																							}}
																						/>
																					}
																					label={item.lkp_value}
																				/>
																			);
																		})}
																	</Stack>
																</div>
																<div className="col-6">
																	<InputLabel id="modeDispatch-label">
																		Mode of Dispatch
																	</InputLabel>
																	{dispatchMode.length <= 0 && (
																		<FormHelperText error>
																			Select Mode of Dispatch
																		</FormHelperText>
																	)}
																	<Stack
																		direction="row"
																		spacing={0}
																		useFlexGap
																		flexWrap="wrap"
																	>
																		{lookUpList["dispatchMode"]?.map((item) => {
																			return (
																				<FormControlLabel
																					control={
																						<Checkbox
																							value={item.id}
																							checked={
																								dispatchMode.indexOf(
																									item.id
																								) !== -1
																							}
																							onChange={(event) => {
																								setDispatchMode(
																									handleInput_Check(
																										dispatchMode,
																										event.target.value,
																										event.target.checked
																									)
																								);
																								setChkst(Math.random);
																							}}
																						/>
																					}
																					label={item.lkp_value}
																				/>
																			);
																		})}
																	</Stack>
																</div>
																<div className="col-6">
																	<InputLabel id="packingType-label">
																		Packing Type
																	</InputLabel>
																	{packingType.length <= 0 && (
																		<FormHelperText error>
																			Select Packing Type
																		</FormHelperText>
																	)}
																	<Stack
																		direction="row"
																		spacing={0}
																		useFlexGap
																		flexWrap="wrap"
																	>
																		{lookUpList["packingType"]?.map((item) => {
																			return (
																				<FormControlLabel
																					control={
																						<Checkbox
																							value={item.id}
																							checked={
																								packingType.indexOf(item.id) !==
																								-1
																							}
																							onChange={(event) => {
																								setPackingType(
																									handleInput_Check(
																										packingType,
																										event.target.value,
																										event.target.checked
																									)
																								);
																								setChkst(Math.random);
																							}}
																						/>
																					}
																					label={item.lkp_value}
																				/>
																			);
																		})}
																	</Stack>
																</div>

																<div className="col-6">
																	<TextField
																		InputLabelProps={{ shrink: true }}
																		margin="normal"
																		fullWidth
																		size="small"
																		label="Dispatch Comments"
																		name="discomment"
																		autoComplete="discomment"
																		value={dispatchComment}
																		onChange={(e) => {
																			setDispatchComments(e.target.value);
																		}}
																	/>
																</div>
															</div>
															<div className="row mt-2 rounded prime-border p-2">
																<div className="col-6">
																	<TextField
																		InputLabelProps={{ shrink: true }}
																		margin="normal"
																		fullWidth
																		size="small"
																		label="Final Comments"
																		name="finalComments"
																		autoComplete="finalComments"
																		value={finalComments}
																		onChange={(e) => {
																			setFinalComments(e.target.value);
																		}}
																	/>
																</div>
																<div className="col-6">
																	<InputLabel>
																		Final Concatinated Comment
																	</InputLabel>
																	<FinalConcatComment />
																</div>
															</div>
														</div>
														<Stack direction="row" spacing={4}>
															<Box sx={{ position: "relative" }}>
																<Button
																	className="float-right mt-2 secon-bg"
																	variant="contained"
																	size="large"
																	type="button"
																	name="save"
																	onClick={(e) => handleSubmit("save", e)}
																	disabled={apiCompStatus.saveStatus}
																>
																	Save
																</Button>
																{apiCompStatus.saveLoading && (
																	<CircularProgress
																		size={30}
																		thickness={10}
																		sx={{
																			color: green[500],
																			position: "absolute",
																			left: 20,
																			top: 10,
																			zIndex: 1,
																		}}
																	/>
																)}
															</Box>
															<Box sx={{ position: "relative" }}>
																<Button
																	className="float-right mt-2 prime-bg"
																	variant="contained"
																	disabled={apiCompStatus.sumbitLoading}
																	type="submit"
																	size="large"
																>
																	Submit
																</Button>
																{apiCompStatus.sumbitLoading && (
																	<CircularProgress
																		size={30}
																		thickness={10}
																		sx={{
																			color: green[500],
																			position: "absolute",
																			left: 20,
																			top: 10,
																			zIndex: 1,
																		}}
																	/>
																)}
															</Box>
														</Stack>
													</div>
												</div>
											</form>
										</Container>
									</div>
								</div>
								<div>
									<Modal
										open={open}
										onClose={handleClose}
										aria-labelledby="modal-modal-title"
										aria-describedby="modal-modal-description"
									>
										<Box sx={style}>
											<SavedTempOrders
												selectedRow={(retId) => handleSelectedOrder(retId)}
											/>
										</Box>
									</Modal>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<CustomerModal custId="null" isUpdate={setIsModalCustomerUpdated} />
			{/*image load dialog*/}
			<Dialog
				open={openImg}
				TransitionComponent={Transition}
				keepMounted
				onClose={handleCloseImg}
				aria-describedby="alert-dialog-slide-description"
			>
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
			{/** Order Response Dialog*/}
			<Dialog
				open={openOrderStatus}
				TransitionComponent={Transition}
				keepMounted
				onClose={handleCloseOrderStatusDialog}
				aria-describedby="alert-dialog-slide-description"
			>
				<div className="col p-5">
					<Typography variant="h4">
						Your Order is Placed Successfully.
					</Typography>
					<Typography variant="h4">Order Id is: {retOrderId}</Typography>
					<br />
					<Typography variant="p">
						Please Navigate to the order page to view the full Order.
					</Typography>
				</div>
				<DialogActions>
					<Button onClick={() => handleCloseOrderStatusDialog("yes")}>
						Close
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}

const style = {
	position: "absolute",
	top: "45%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: "80%",
	height: "80%",
	bgcolor: "background.paper",
	border: "2px solid #000",
	boxShadow: 24,
	p: 4,
};
