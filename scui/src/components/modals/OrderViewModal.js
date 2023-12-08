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
} from "@mui/material";
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Autocomplete } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import {
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
	const [lookUpList, setLookupList] = useState([]);

	const [isUpdate, setIsUpdate] = useState(false);
	const [openImg, setOpenImg] = useState(false);
	const [dialogImg, setDialogImg] = useState("");

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
					//console.log(res_data.status_msg);
				}
			})
			.catch(function (response) {
				//handle error
				console.log(response);
			});
	}

	const handleOrderinfo = () => {
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
		let printContents = document.getElementById("orderView").innerHTML;
		let originalContents = document.body.innerHTML;
		document.body.innerHTML = printContents;
		window.print();
		document.body.innerHTML = originalContents;
		/*$("#staticOrderViewBackdrop").modal('dispose');*/
	}

	useEffect(() => {
		handleSqFeet();
		handleSize();
	}, [length, height, row, quantity]);

	useEffect(() => {
		if (prop.orderId !== null) {
			handleGetLookup();
			handleOrderinfo();
		}
	}, [prop.orderId]);
	return (
		<div>
			{/* <!-- Modal --> */}
			<>
				<Button
					onClick={() => {
						printPage();
					}}
					variant="outlined"
				>
					Print
				</Button>
				<Container key={"orderView"}>
					<div className="row">
						<div className="col-12">
							<div className="row  mt-2 rounded">
								<Stack direction="row" spacing={12}>
									<Typography variant="subtitle1" gutterBottom>
										Date: {orderDate}
									</Typography>
									<Typography variant="subtitle1" gutterBottom>
										Order No: {orderNo + splitId}
									</Typography>
								</Stack>
								<div
									className="row  mt-2 rounded"
									style={{ backgroundColor: orange[200] }}
								>
									<div className="col-6">
										<Typography variant="subtitle1" gutterBottom>
											Customer:{customerName}
										</Typography>
									</div>
									<div className="col-6">
										<Typography variant="subtitle1" gutterBottom>
											Length: {length}
										</Typography>
									</div>
									<div className="col-6">
										<Typography variant="subtitle1" gutterBottom>
											Height: {height}
										</Typography>
									</div>
									<div className="col-6">
										<Typography variant="subtitle1" gutterBottom>
											Row: {row}
										</Typography>
									</div>
									<div className="col-6">
										<Typography variant="subtitle1" gutterBottom>
											Quantity: {quantity}
										</Typography>
									</div>
									<div className="col-6">
										<Typography variant="subtitle1" gutterBottom>
											Sq Feet: {sqfeet}
										</Typography>
									</div>
									<div className="col-6">
										<Typography variant="subtitle1" gutterBottom>
											Size: {size}
										</Typography>
									</div>
								</div>

								<div
									className="row  mt-2 rounded"
									style={{ backgroundColor: purple[200] }}
								>
									<div className="col-6">
										<Typography variant="subtitle1" gutterBottom>
											Pipe Type:
											{lookUpList["pipeType"]?.map((item) => {
												return (
													<>
														{pipeType?.includes(item.id)
															? item.lkp_value
															: null}
													</>
												);
											})}
										</Typography>
									</div>

									<div className="col-6">
										<Typography variant="subtitle1" gutterBottom>
											Expansion Type:{" "}
											{lookUpList["expansionType"]?.map((item) => {
												return (
													<>
														{expansionType?.includes(item.id)
															? item.lkp_value
															: ""}
													</>
												);
											})}
										</Typography>
									</div>
									<div className="col-12">
										<Typography variant="subtitle1" gutterBottom>
											Pipe Bend Data
										</Typography>
										<Stack
											direction="row"
											spacing={10}
											alignContent="space-between"
										>
											{pbStraight === "true" && (
												<Stack>
													<Typography variant="subtitle1" gutterBottom>
														Straight
													</Typography>
													<Typography variant="subtitle1" gutterBottom>
														Qty: {pbStraightQty}
													</Typography>
													<Typography variant="subtitle1" gutterBottom>
														Size: {pbStraightSize}
													</Typography>
													<Typography variant="subtitle1" gutterBottom>
														Total Qty: {pbStraightTotQty}
													</Typography>
												</Stack>
											)}
											{pbSingle === "true" && (
												<Stack>
													<Typography variant="subtitle1" gutterBottom>
														Single
													</Typography>
													<Typography variant="subtitle1" gutterBottom>
														Qty: {pbSingleQty}
													</Typography>
													<Typography variant="subtitle1" gutterBottom>
														Size: {pbSingleSize}
													</Typography>
													<Typography variant="subtitle1" gutterBottom>
														Total Qty: {pbSingleTotQty}
													</Typography>
												</Stack>
											)}
											{pbCross === "true" && (
												<Stack>
													<Typography variant="subtitle1" gutterBottom>
														Cross
													</Typography>
													<Typography variant="subtitle1" gutterBottom>
														Qty: {pbCrossQty}
													</Typography>
													<Typography variant="subtitle1" gutterBottom>
														Size: {pbCrossSize}
													</Typography>
													<Typography variant="subtitle1" gutterBottom>
														Total Qty: {pbCrossTotQty}
													</Typography>
												</Stack>
											)}
											{pbOther === "true" && (
												<Stack>
													<Typography variant="subtitle1" gutterBottom>
														Other
													</Typography>
													<Typography variant="subtitle1" gutterBottom>
														Qty: {pbOtherQty}
													</Typography>
													<Typography variant="subtitle1" gutterBottom>
														Size: {pbOtherSize}
													</Typography>
													<Typography variant="subtitle1" gutterBottom>
														Total Qty: {pbOtherTotQty}
													</Typography>
												</Stack>
											)}
										</Stack>
									</div>
									<div className="col-6">
										<Typography variant="subtitle1" gutterBottom>
											Pipe Comment: {pipeComment}
										</Typography>
									</div>
								</div>
								<div
									className="row  mt-2 rounded"
									style={{ backgroundColor: blue[200] }}
								>
									<div className="col-6">
										<Typography variant="subtitle1" gutterBottom>
											End Plate Material:{" "}
											{lookUpList["epMaterial"]?.map((item) => {
												return (
													<>
														{endPlateMaterial?.includes(item.id)
															? item.lkp_value
															: ""}
													</>
												);
											})}
										</Typography>
									</div>
									<div className="col-6">
										<Typography variant="subtitle1" gutterBottom>
											End Plate Model:{" "}
											{lookUpList["epModal"]?.map((item) => {
												return (
													<>
														{endPlateModel?.includes(item.id)
															? item.lkp_value
															: ""}
													</>
												);
											})}
										</Typography>
									</div>
									<div className="col-6">
										<Typography variant="subtitle1" gutterBottom>
											End Plate Images
										</Typography>
										<>
											{
												<ImageList cols={3} rowHeight={164}>
													{epPhoto?.map((item, index) => (
														<ImageListItem key={"epphoto" + index}>
															<img
																src={item}
																srcSet={item}
																alt={"EpPhoto"}
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
									</div>
									<div className="col-6">
										<Typography variant="subtitle1" gutterBottom>
											End Plate Orientation{" "}
											{lookUpList["oreientation"]?.map((item) => {
												return (
													<>
														{endPlateOrientation?.includes(item.id)
															? item.lkp_value
															: ""}
														<br />
													</>
												);
											})}
										</Typography>
									</div>
									<div className="col-12">
										<Typography variant="subtitle1" gutterBottom>
											Cover Type-Detail:
											<Stack direction="row" spacing={2}>
												{lookUpList["coverType"]?.map((item) => {
													return (
														<div
															style={{
																backgroundColor: yellow[300],
																padding: "3px",
																borderRadius: "5px",
															}}
														>
															<InputLabel id="cover-label">
																{item.lkp_value}
															</InputLabel>
															<Stack
																style={{
																	backgroundColor: orange[400],
																	padding: "3px",
																	borderRadius: "5px",
																}}
															>
																{lookUpList["coverDetail"]?.map((itemd) => {
																	if (
																		itemd.lkp_id === item.id &&
																		coverDetail?.indexOf(itemd.id) !== -1
																	) {
																		return (
																			<>
																				{itemd.sublkp_val} <br />
																			</>
																		);
																	}
																})}
															</Stack>
														</div>
													);
												})}
											</Stack>
										</Typography>
									</div>
									<div className="col-6">
										<Typography variant="subtitle1" gutterBottom>
											EP Comments: {epComments}
										</Typography>
									</div>
								</div>
								<div
									className="row  mt-2 rounded"
									style={{ backgroundColor: lime[200] }}
								>
									<div className="col-6">
										<Typography variant="subtitle1" gutterBottom>
											Fin Per Inch: {finPerInch}
										</Typography>
									</div>
									<div className="col-6">
										<Typography variant="subtitle1" gutterBottom>
											Hair pin(Assembly) Images
										</Typography>
										<>
											{
												<ImageList cols={3} rowHeight={164}>
													{assemblyPhoto?.map((item, index) => (
														<ImageListItem key={"assembly" + index}>
															<img
																src={item}
																srcSet={item}
																alt={"Assembly"}
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
									</div>
									<div className="col-6">
										<Typography variant="subtitle1" gutterBottom>
											Fin Comments: {finComments}
										</Typography>
									</div>
								</div>
								<div
									className="row mt-2 rounded"
									style={{ backgroundColor: green[200] }}
								>
									<div className="col-6">
										<Typography variant="subtitle1" gutterBottom>
											Circuit Models:{" "}
											{lookUpList["circuitModel"]?.map((item) => {
												return (
													<>
														{circuitModels?.indexOf(item.id) !== -1
															? item.lkp_value
															: ""}
														<br />
													</>
												);
											})}
										</Typography>
									</div>
									<div className="col-6">
										<Typography variant="subtitle1" gutterBottom>
											Hair pin(Brazing) Images
										</Typography>
										<>
											{
												<ImageList cols={3} rowHeight={164}>
													{brazingPhoto?.map((item, index) => (
														<ImageListItem key={"brazing" + index}>
															<img
																src={item}
																srcSet={item}
																alt={"Assembly"}
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
									</div>
									<div className="col-6">
										<Typography variant="subtitle1" gutterBottom>
											No Of Circuit: {noCircuit}
										</Typography>
									</div>
									<div className="col-6">
										<Typography variant="subtitle1" gutterBottom>
											Liquid Line:{" "}
											{lookUpList["liquidLine"]?.map((item) => {
												return (
													<>
														{liquidLine?.indexOf(item.id) !== -1 &&
															item.lkp_value}
														<br />
													</>
												);
											})}
										</Typography>
									</div>
									<div className="col-6">
										<Typography variant="subtitle1" gutterBottom>
											Discharge Line:{" "}
											{lookUpList["dischargeLine"]?.map((item) => {
												return (
													<>
														{dischargeLine?.indexOf(item.id) !== -1
															? item.lkp_value
															: ""}
														<br />
													</>
												);
											})}
										</Typography>
									</div>
									<div className="col-6">
										<Typography variant="subtitle1" gutterBottom>
											Brazing Comment: {brazingComments}
										</Typography>
									</div>
								</div>
								<div
									className="row  mt-2 rounded"
									style={{ backgroundColor: purple[200] }}
								>
									<div className="col-6">
										<Typography variant="subtitle1" gutterBottom>
											Paint Type:{" "}
											{lookUpList["paintType"]?.map((item) => {
												return (
													<>
														{paintType?.indexOf(item.id) !== -1
															? item.lkp_value
															: ""}
														<br />
													</>
												);
											})}
										</Typography>
									</div>
									<div className="col-6">
										<Typography variant="subtitle1" gutterBottom>
											Packing Type:{" "}
											{lookUpList["packingType"]?.map((item) => {
												return (
													<>
														{packingType?.indexOf(item.id) !== -1
															? item.lkp_value
															: ""}
														<br />
													</>
												);
											})}
										</Typography>
									</div>
									<div className="col-6">
										<Typography variant="subtitle1" gutterBottom>
											Dispatch Mode:
											{lookUpList["dispatchMode"]?.map((item) => {
												return (
													<>
														{dispatchMode?.indexOf(item.id) !== -1
															? item.lkp_value
															: ""}
														<br />
													</>
												);
											})}
										</Typography>
									</div>
									<div className="col-6">
										<Typography variant="subtitle1" gutterBottom>
											Displacement Comments: {dispatchComment}
										</Typography>
									</div>
								</div>
								<div
									className="row mt-2 rounded"
									style={{ backgroundColor: orange[200] }}
								>
									<div className="col-6">
										<Typography variant="subtitle1" gutterBottom>
											Final Comment: {finalComments}
										</Typography>
									</div>
								</div>
							</div>
						</div>
					</div>
				</Container>
			</>
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
		</div>
	);
}
