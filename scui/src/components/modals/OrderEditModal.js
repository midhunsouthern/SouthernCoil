import React, {
	useEffect,
	useState,
	useContext,
	useInsertionEffect,
} from "react";
import axios from "axios";
import {
	Container,
	Button,
	TextField,
	Autocomplete,
	Checkbox,
	FormControlLabel,
	Stack,
	IconButton,
	ImageList,
	ImageListItem,
	Dialog,
	DialogActions,
	Typography,
	FormHelperText,
} from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import DeleteIcon from "@mui/icons-material/Delete";
import PreviewIcon from "@mui/icons-material/Preview";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import {
	setOrderNew,
	getOrderDataByID,
	getCustomersDataAll_dd,
	getLookupData,
	imageURL,
} from "../../constant/url";
import { AccessContext } from "../../constant/accessContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactFileReader from "react-file-reader";
import Slide from "@mui/material/Slide";
import { handleInput_Check } from "../../commonjs/CommonFun";

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function OrderEditModal(prop) {
	const access = useContext(AccessContext).authID;
	const rowId = prop.orderId;
	const editable = prop.isEdit;
	let dateObj = new Date();
	const [lookUpList, setLookupList] = React.useState([]);
	const [chkst, setChkst] = React.useState(Math.random());
	const [orderNo, setOrderNo] = useState("");
	const [orderDate, setOrderDate] = useState("");
	const [customerName, setCustomerName] = useState({ label: "N/A", id: "0" });
	const [customerNameList, setCustomerNameList] = useState([]);
	const [splitId, setSplitId] = useState([]);
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
	const [endPlateOrientation, setEndPlateOrientation] = useState(["0"]);
	const [coverType, setCoverType] = useState(["0"]);
	const [coverDetail, setCoverDetail] = useState(["0"]);
	const [epComments, setEPComments] = useState("");
	const [finPerInch, setFinPerInch] = useState("");
	const [finComments, setFinComments] = useState("");
	const [circuitModels, setCircuitModels] = useState(["0"]);
	const [noCircuit, setNoCircuit] = useState("");
	const [liquidLine, setLiquidLine] = useState(["0"]);
	const [dischargeLine, setDischargeLine] = useState(["0"]);
	const [brazingComments, setBrazingComments] = useState("");
	const [paintType, setPaintType] = useState(["0"]);
	const [packingType, setPackingType] = useState(["0"]);
	const [dispatchMode, setDispatchMode] = useState(["0"]);
	const [dispatchComment, setDispatchComments] = useState("");
	const [finalComments, setFinalComments] = useState("");
	const [epPhoto, setEpPhoto] = useState([]);
	const [assemblyPhoto, setAssemblyPhoto] = useState([]);
	const [brazingPhoto, setBrazingPhoto] = useState([]);

	const [isUpdate, setIsUpdate] = useState(false);
	const [customerDefaultSelect, setCustomerDefaultSelect] = useState({
		label: "Loading...",
		id: 0,
	});
	const [openImg, setOpenImg] = useState(false);
	const [dialogImg, setDialogImg] = useState("");

	const handleClickOpenimg = (base64) => {
		setDialogImg(base64);
		setOpenImg(true);
	};
	const handleClickDeleteimg = (imgIndex, imgType) => {
		if (imgType === "ep") {
			setEpPhoto((prevEpPhoto) => {
				// Create a copy of the array and then splice
				const newEpPhoto = [...prevEpPhoto];
				newEpPhoto.splice(imgIndex, 1);
				return newEpPhoto;
			});
		} else if (imgType === "assembly") {
			setAssemblyPhoto((prevAssemblyPhoto) => {
				const newAssemblyPhoto = [...prevAssemblyPhoto];
				newAssemblyPhoto.splice(imgIndex, 1);
				return newAssemblyPhoto;
			});
		} else {
			setBrazingPhoto((brazePhoto) => {
				const newBrazePhoto = [...brazePhoto];
				newBrazePhoto.splice(imgIndex, 1);
				return newBrazePhoto;
			});
		}
	};
	const handleCloseImg = (response) => {
		setOpenImg(false);
	};

	const handleFiles = (type, files) => {
		console.log(files.fileList.length);
		if (type === "ep") {
			setEpPhoto((prevImage) => {
				if (prevImage.length === 3) {
					alert("You cant upload more than three images");
					return prevImage;
				} else {
					return [...prevImage, ...files.base64];
				}
			});
		} else if (type === "assembly") {
			setAssemblyPhoto((prevImage) => {
				if (prevImage.length === 3) {
					alert("You cant upload more than three images");
					return prevImage;
				} else {
					return [...prevImage, ...files.base64];
				}
			});
		} else if (type === "brazing") {
			setBrazingPhoto((prevImage) => {
				if (prevImage.length === 3) {
					alert("You cant upload more than three images");
					return prevImage;
				} else {
					return [...prevImage, ...files.base64];
				}
			});
		}
	};

	const handleSubmit = (type, e) => {
		e.preventDefault();
		const imgData = [
			{ ep: epPhoto, assembly: assemblyPhoto, brazing: brazingPhoto },
		];
		const btnname = type;
		var bodyFormData = new FormData();

		bodyFormData.append("authId", access);
		bodyFormData.append("type", btnname);
		bodyFormData.append("id", rowId);

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
		bodyFormData.append("fin_comments", finComments);

		bodyFormData.append("circuit_models", circuitModels);
		bodyFormData.append("circuit_no", noCircuit);
		bodyFormData.append("liquid_line", liquidLine);
		bodyFormData.append("discharge_line", dischargeLine);
		bodyFormData.append("brazing_comment", brazingComments);

		bodyFormData.append("paint", paintType);
		bodyFormData.append("packing_type", packingType);
		bodyFormData.append("dispatch_mode", dispatchMode);
		bodyFormData.append("dispatch_comment", dispatchComment);
		bodyFormData.append("final_comment", finalComments);
		//bodyFormData.append("image_data", JSON.stringify(imgData));
		imgData.forEach((item, index) => {
			if (item.ep.length > 0) {
				item.ep.forEach((img, imgIndex) => {
					bodyFormData.append(`epPhoto[${imgIndex}]`, img);
				});
			}
			if (item.assembly.length > 0) {
				item.assembly.forEach((img, imgIndex) => {
					bodyFormData.append(`assemblyPhoto[${imgIndex}]`, img);
				});
			}
			if (item.brazing.length > 0) {
				item.brazing.forEach((img, imgIndex) => {
					bodyFormData.append(`brazingPhoto[${imgIndex}]`, img);
				});
			}
		});
		axios({
			method: "post",
			url: setOrderNew,
			data: bodyFormData,
			headers: { "Content-Type": "multipart/form-data" },
		})
			.then(function (response) {
				//handle success
				const res_data = response.data;
				console.log(res_data.status_code);
				if (res_data.status_code === 200) {
					toast(res_data.message, "success");
					//return data
				} else {
					toast(res_data.message, "error");
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
					console.log(res_data.status_msg);
				}
			})
			.catch(function (response) {
				//handle error
				console.log(response);
			});
	}

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
					console.log(res_data.status_msg);
				}
			})
			.catch(function (response) {
				//handle error
				console.log(response);
			});
	};
	const isBase64Image = (str) => {
		return str.startsWith("data:image/");
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

	const handleOrderinfo = () => {
		console.log(orderNo);
		var bodyFormData = new FormData();
		bodyFormData.append("authId", access);
		bodyFormData.append("id", rowId);

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
					const ret_data_cd = res_data.data_orders[0];
					setOrderNo(ret_data_cd.order_id);
					setOrderDate(ret_data_cd.order_date);
					setCustomerName({
						id: ret_data_cd.customer_name,
						label: ret_data_cd.full_customer_name,
					});
					setLength(ret_data_cd.length);
					setSplitId(ret_data_cd.split_id);
					setHeight(ret_data_cd.height);
					setRow(ret_data_cd.rows);
					setQuantity(ret_data_cd.quantity);
					setSqFeet(ret_data_cd.sq_feet);
					setPipeType(ret_data_cd.pipe_type);
					setExpansionType(ret_data_cd.expansion_type);

					setPBStraight(ret_data_cd.pbStraight);
					setPBStraightQty(ret_data_cd.pbStraightQty);
					setPBStraightSize(ret_data_cd.pbStraightSize);
					setPBStraightTotQty(ret_data_cd.pbStraightTotQty);

					setPBSingle(ret_data_cd.pbSingle);
					setPBSingleQty(ret_data_cd.pbSingleQty);
					setPBSingleSize(ret_data_cd.pbSingleSize);
					setPBSingleTotQty(ret_data_cd.pbSingleTotQty);

					setPBCross(ret_data_cd.pbCross);
					setPBCrossQty(ret_data_cd.pbCrossQty);
					setPBCrossSize(ret_data_cd.pbCrossSize);
					setPBCrossTotQty(ret_data_cd.pbCrossTotQty);

					setPBOther(ret_data_cd.pbOther);
					setPBOtherQty(ret_data_cd.pbOtherQty);
					setPBOtherSize(ret_data_cd.pbOtherSize);
					setPBOtherTotQty(ret_data_cd.pbOtherTotQty);

					setPipeComment(ret_data_cd.pipe_comment);
					setEndPlateMaterial(ret_data_cd.end_plate_material);
					setEndPlateModel(ret_data_cd.end_plate_modal);
					setEndPlateOrientation(ret_data_cd.end_plate_orientation.split(","));
					setCoverType(ret_data_cd.cover_type);
					setCoverDetail(ret_data_cd.cover_detail.split(","));
					setEPComments(ret_data_cd.ep_comments);
					setFinPerInch(ret_data_cd.fin_per_inch);
					setFinComments(ret_data_cd.fin_comments);
					setCircuitModels(ret_data_cd.circuit_models);
					setNoCircuit(ret_data_cd.circuit_no);
					setLiquidLine(ret_data_cd.liquid_line.split(","));
					setDischargeLine(ret_data_cd.discharge_line.split(","));
					setBrazingComments(ret_data_cd.brazing_comment);
					setPaintType(ret_data_cd.paint.split(","));
					setPackingType(ret_data_cd.packing_type.split(","));
					setDispatchMode(ret_data_cd.dispatch_mode.split(","));
					setDispatchComments(ret_data_cd.dispatch_comment);
					setFinalComments(ret_data_cd.final_comment);
					setEpPhoto(ret_data_cd.ep_photo);
					setAssemblyPhoto(ret_data_cd.assembly_Photo);
					setBrazingPhoto(ret_data_cd.brazing_Photo);
				} else {
					console.log(res_data.status_msg);
				}
			})
			.catch(function (response) {
				//handle error
				console.log(response);
			});
	};

	function handlePaintingType(value, isChecked) {
		const list = paintType;
		const index = list.indexOf(value);
		if (isChecked && index === -1) {
			list.push(value);
		} else if (!isChecked && index >= 0) {
			list.splice(index, 1);
		}
		setPaintType(list);
		setChkst(Math.random());
	}

	function handleDispatchMode(value, isChecked) {
		const list = dispatchMode;
		const index = list.indexOf(value);
		if (isChecked && index === -1) {
			list.push(value);
		} else if (!isChecked && index >= 0) {
			list.splice(index, 1);
		}
		setDispatchMode(list);
		setChkst(Math.random());
	}

	function handlePackingType(value, isChecked) {
		const list = packingType;
		const index = list.indexOf(value);
		if (isChecked && index === -1) {
			list.push(value);
		} else if (!isChecked && index >= 0) {
			list.splice(index, 1);
		}
		setPackingType(list);
		setChkst(Math.random());
	}

	function FinalConcatComment() {
		let a = pipeComment ? "Pipe: " + pipeComment + ";" : null;
		let b = epComments ? "EP: " + epComments + ";" : null;
		let c = finComments ? "Fins: " + finComments + ";" : null;
		let d = brazingComments ? "Brazing: " + brazingComments + ";" : null;
		let e = dispatchComment ? "Dispatch: " + dispatchComment + ";" : null;
		let f = finalComments ? "Final: " + finalComments + ";" : null;

		return (
			<div>
				{a} <br /> {b} <br /> {c} <br /> {d} <br />
				{e}
				<br />
				{f}
			</div>
		);
	}

	useEffect(() => {
		handleSqFeet();
		handleSize();
		// setPBStraightQty((height * row) / 2);
		// setPBSingleQty(height * row);
		// setPBCrossQty((height * row) / 2);
	}, [length, height, row, quantity]);

	useEffect(() => {
		setPBStraightTotQty(quantity * pbStraightQty);
		setPBSingleTotQty(quantity * pbSingleQty);
		setPBCrossTotQty(quantity * pbCrossQty);
	}, [quantity, pbStraightQty, pbSingleQty, pbCrossQty]);

	useEffect(() => {
		if (rowId !== null) {
			handleOrderinfo();
			handleCustomerList(access);
			handleGetLookup();
		}
	}, [rowId]);

	function handleCustomerName(custId) {
		setCustomerName(custId);
	}

	useEffect(() => {
		let a = customerNameList.find((item) => {
			if (item.id === customerName) {
				return item;
			}
		});
		setCustomerDefaultSelect(a);
	}, [customerNameList, customerName]);

	return (
		<div>
			{/* <!-- Modal --> */}

			<Container key={"orderEdit"}>
				<ToastContainer />
				<form onSubmit={(e) => handleSubmit("submit", e)}>
					<div className="row">
						<div className="col-12">
							<div className="row  mt-2 rounded">
								<div className="col-6">
									<Stack direction="row" spacing={5}>
										<Typography variant="p">Order Date: {orderDate}</Typography>
										<Typography variant="p">Order Id: {orderNo}</Typography>
									</Stack>
								</div>
								<div className="row  mt-2 rounded prime-border pt-2">
									<div className="col-6">
										<Stack direction="row" spacing={2}>
											{/* <Button className="prime-bg " variant="contained" data-bs-toggle="modal" data-bs-target="#staticBackdrop" sx={{height:"50px"}}>
                        <PersonAddAltIcon />
                      </Button> */}
											<Autocomplete
												disableClearable
												required
												disablePortal
												fullWidth
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
															customerName === 0 ? "Select Customer" : ""
														}
													/>
												)}
												onChange={(e, value) => {
													setCustomerName({ label: value.label, id: value.id });
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
												length.length === 0 ? "Enter Proper Value." : ""
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
												height.length === 0 ? "Enter Proper Value." : ""
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
											helperText={row.length === 0 ? "Enter Proper Value." : ""}
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
											aria-readonly="true"
											error={quantity.length === 0}
											helperText={
												quantity.length === 0 ? "Enter Proper Value." : ""
											}
										/>
									</div>
								</div>

								<div className="row  mt-2 rounded prime-border pt-2">
									<div className="col-3">
										<FormControl fullWidth>
											<InputLabel
												key={() => Math.random()}
												id="modeDispatch-label"
											>
												Pipe Type
											</InputLabel>
											<Select
												required={true}
												labelId="modeDispatch-label"
												id="pipeType-select"
												label="Pipe Type"
												value={pipeType}
												onChange={(e) => setPipeType(e.target.value)}
												error={pipeType === ""}
												helperText={pipeType !== "" ? "Select Pipe Type" : ""}
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
												<FormHelperText error>Select Pipe Type</FormHelperText>
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
												onChange={(e) => setExpansionType(e.target.value)}
											>
												{lookUpList["expansionType"]?.map((item) => {
													return (
														<MenuItem value={item.id}>
															{item.lkp_value}
														</MenuItem>
													);
												})}
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
																setPBStraight(event.target.checked.toString())
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
																setPBSingle(event.target.checked.toString())
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
																setPBCross(event.target.checked.toString())
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
																setPBOther(event.target.checked.toString())
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
															type="text"
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
															type="text"
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
															type="text"
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
											<FormHelperText error>Select EP Photo</FormHelperText>
										)}
										<>
											{
												<ImageList cols={3} rowHeight={164}>
													{epPhoto &&
														epPhoto?.map((item, index) => (
															<ImageListItem key={"epphoto" + index}>
																<img
																	src={
																		isBase64Image(item) ? item : imageURL + item
																	}
																	srcSet={
																		isBase64Image(item) ? item : imageURL + item
																	}
																	alt={"epphoto"}
																	loading="lazy"
																/>
																<Stack direction="row" spacing={1}>
																	<IconButton
																		onClick={() => handleClickOpenimg(item)}
																	>
																		<PreviewIcon />
																	</IconButton>
																	{splitId == "" && (
																		<IconButton
																			onClick={() =>
																				handleClickDeleteimg(index, "ep")
																			}
																		>
																			<DeleteIcon />
																		</IconButton>
																	)}
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
												{splitId == "" && <PhotoCameraIcon />}
											</ReactFileReader>
										</>
									</div>
									<div className="col-3">
										<InputLabel>Orientation</InputLabel>
										{endPlateOrientation.length <= 0 && (
											<FormHelperText error>Select Orientation</FormHelperText>
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
																		endPlateOrientation.indexOf(item.id) !== -1
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
										<InputLabel id="cover-label">Cover Type-Detail</InputLabel>
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
																}}
															>
																{lookUpList["coverDetail"]?.map((itemd) => {
																	if (itemd.lkp_id === item.id) {
																		return (
																			<FormControlLabel
																				control={
																					<Checkbox
																						value={itemd.id}
																						checked={
																							coverDetail.indexOf(itemd.id) !==
																							-1
																						}
																						onChange={(event) => {
																							setCoverDetail(
																								handleInput_Check(
																									coverDetail,
																									event.target.value,
																									event.target.checked
																								)
																							);
																							setChkst(Math.random());
																						}}
																					/>
																				}
																				label={itemd.sublkp_val}
																			/>
																		);
																	}
																})}
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
								<div className="row  mt-2 rounded prime-border P-2">
									<div className="col-6">
										<TextField
											InputLabelProps={{ shrink: true }}
											margin="normal"
											required
											fullWidth
											size="small"
											label="Fins per inch"
											autoComplete="Finspi"
											value={finPerInch}
											onChange={(e) => setFinPerInch(e.target.value)}
										/>
									</div>
									<div className="col-6">
										<InputLabel>Photo upload Hair pin(Assembly)</InputLabel>
										<>
											{
												<ImageList cols={3} rowHeight={164}>
													{assemblyPhoto &&
														assemblyPhoto?.map((item, index) => (
															<ImageListItem key={"assembly" + index}>
																<img
																	src={
																		isBase64Image(item) ? item : imageURL + item
																	}
																	srcSet={
																		isBase64Image(item) ? item : imageURL + item
																	}
																	alt={"assembly"}
																	loading="lazy"
																/>
																<Stack direction="row" spacing={1}>
																	<IconButton
																		onClick={() => handleClickOpenimg(item)}
																	>
																		<PreviewIcon />
																	</IconButton>
																	{splitId == "" && (
																		<IconButton
																			onClick={() =>
																				handleClickDeleteimg(index, "assembly")
																			}
																		>
																			<DeleteIcon />
																		</IconButton>
																	)}
																</Stack>
															</ImageListItem>
														))}
												</ImageList>
											}
											<ReactFileReader
												fileTypes={[".png", ".jpg"]}
												base64={true}
												multipleFiles={true}
												handleFiles={(files) => handleFiles("assembly", files)}
											>
												{splitId == "" && <PhotoCameraIcon />}
											</ReactFileReader>
										</>
									</div>
									<div className="col-6">
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
												{lookUpList["circuitModel"]?.map((item) => {
													return (
														<MenuItem value={item.id}>
															{item.lkp_value}
														</MenuItem>
													);
												})}
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
											onChange={(e) => setNoCircuit(e.target.value)}
											error={noCircuit.length <= 0}
											helperText={
												noCircuit.length <= 0 ? "Enter No of Circuit" : ""
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
										<InputLabel>Photo upload Hair pin(Brazing)</InputLabel>
										{brazingPhoto.length === 0 && (
											<FormHelperText error>
												Select Brazing Photo
											</FormHelperText>
										)}
										<>
											{
												<ImageList cols={3} rowHeight={164}>
													{brazingPhoto &&
														brazingPhoto?.map((item, index) => (
															<ImageListItem key={"brazing" + index}>
																<img
																	src={
																		isBase64Image(item) ? item : imageURL + item
																	}
																	srcSet={
																		isBase64Image(item) ? item : imageURL + item
																	}
																	alt={"brazing"}
																	loading="lazy"
																/>
																<Stack direction="row" spacing={1}>
																	<IconButton
																		onClick={() => handleClickOpenimg(item)}
																	>
																		<PreviewIcon />
																	</IconButton>
																	{splitId == "" && (
																		<IconButton
																			onClick={() =>
																				handleClickDeleteimg(index, "brazing")
																			}
																		>
																			<DeleteIcon />
																		</IconButton>
																	)}
																</Stack>
															</ImageListItem>
														))}
												</ImageList>
											}
											<ReactFileReader
												fileTypes={[".png", ".jpg"]}
												base64={true}
												multipleFiles={true}
												handleFiles={(files) => handleFiles("brazing", files)}
											>
												{splitId == "" && <PhotoCameraIcon />}
											</ReactFileReader>
										</>
									</div>

									<div className="col-8">
										<InputLabel id="liquidLine-label">Liquid Line</InputLabel>
										{liquidLine.length <= 0 && (
											<FormHelperText error>Select Liquid Line</FormHelperText>
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
																checked={liquidLine.indexOf(item.id) !== -1}
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
											{lookUpList["dischargeLine"]?.map((item) => {
												return (
													<FormControlLabel
														control={
															<Checkbox
																value={item.id}
																checked={dischargeLine.indexOf(item.id) !== -1}
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
											})}
										</Stack>
									</div>
								</div>
								<div className="row  mt-2 rounded prime-border P-2">
									<div className="col-6">
										<InputLabel id="PaintingType-label">
											Painting Type
										</InputLabel>
										<Stack
											direction="row"
											spacing={1}
											useFlexGap
											flexWrap="wrap"
										>
											{chkst > 0 &&
												lookUpList["paintType"]?.map((item) => {
													return (
														<FormControlLabel
															control={
																<Checkbox
																	value={item.id}
																	onChange={(event) =>
																		handlePaintingType(
																			event.target.value,
																			event.target.checked
																		)
																	}
																	checked={paintType.indexOf(item.id) !== -1}
																/>
															}
															label={item.lkp_value}
														/>
													);
												})}
										</Stack>
									</div>
									<div className="col-6">
										<InputLabel id="packingType-label">Packing Type</InputLabel>
										<Stack
											direction="row"
											spacing={1}
											useFlexGap
											flexWrap="wrap"
										>
											{chkst > 0 &&
												lookUpList["packingType"]?.map((item) => {
													return (
														<FormControlLabel
															control={
																<Checkbox
																	value={item.id}
																	onChange={(event) =>
																		handlePackingType(
																			event.target.value,
																			event.target.checked
																		)
																	}
																	checked={packingType.indexOf(item.id) !== -1}
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
										<Stack
											direction="row"
											spacing={1}
											useFlexGap
											flexWrap="wrap"
										>
											{lookUpList["dispatchMode"]?.map((item) => {
												return (
													<FormControlLabel
														control={
															<Checkbox
																value={item.id}
																onChange={(event) =>
																	handleDispatchMode(
																		event.target.value,
																		event.target.checked
																	)
																}
																checked={dispatchMode.indexOf(item.id) !== -1}
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
								<div className="row mt-2 rounded prime-border P-2">
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
										<InputLabel>Final Concatinated Comment</InputLabel>
										<FinalConcatComment />
									</div>
								</div>
							</div>
							{editable && (
								<Button
									className="float-right mt-2"
									variant="contained"
									size="large"
									type="submit"
								>
									Submit
								</Button>
							)}
						</div>
					</div>
				</form>
			</Container>

			<Dialog
				open={openImg}
				TransitionComponent={Transition}
				keepMounted
				onClose={handleCloseImg}
				aria-describedby="alert-dialog-slide-description"
			>
				<img
					src={isBase64Image(dialogImg) ? dialogImg : imageURL + dialogImg}
					srcSet={isBase64Image(dialogImg) ? dialogImg : imageURL + dialogImg}
					alt={isBase64Image(dialogImg) ? dialogImg : imageURL + dialogImg}
					loading="lazy"
				/>
				<DialogActions>
					<Button onClick={() => handleCloseImg("yes")}>Close</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
