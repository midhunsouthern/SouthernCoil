import { useState, useEffect, useContext, forwardRef } from "react";
import axios from "axios";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";

import PreviewIcon from "@mui/icons-material/Preview";
import {
	Dialog,
	DialogActions,
	Typography,
	AppBar,
	Toolbar,
	IconButton,
	Button,
	Stack,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	FormControlLabel,
	ImageListItem,
	ImageList,
	RadioGroup,
	Radio,
	FormHelperText,
} from "@mui/material";
import ReactFileReader from "react-file-reader";
import { toast } from "react-toastify";
import {
	getLookupData,
	setBrazingDetails,
	getBrazingDetail,
	imageURL,
} from "../../constant/url";
import { AccessContext } from "../../constant/accessContext";
import DeleteIcon from "@mui/icons-material/Delete";
import Slide from "@mui/material/Slide";
import CloseIcon from "@mui/icons-material/Close";

const Transition = forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function BrazingQuantity(prop) {
	const access = useContext(AccessContext).authID;
	const orderId = prop.orderId;
	const splitId = prop.splitId;
	const [lookUpList, setLookupList] = useState([]);
	const [addQty, setAddQty] = useState(0);
	const [brazingPhotosInLeak, setBrazingPhotosInLeak] = useState([]);

	const [bzQtyImg, setBzQtyImg] = useState("");
	const [bzQtyImgDialog, setBzQtyImgDialog] = useState(false);

	//qty Data
	const [brazingQtyData, setBrazingQtyData] = useState([]);
	const [selData, setSelData] = useState([]);

	const handleFiles = (type, files, serialRef) => {
		if (type === "brazing") {
			setBrazingPhotosInLeak((prevImages) => {
				// Ensure you have the serial reference, e.g., '123-1'
				const serialReference = serialRef; // You can replace this with the actual reference

				// Check if the reference exists in the state
				if (!prevImages[serialReference]) {
					prevImages[serialReference] = []; // Initialize the array if it doesn't exist
				}

				// Check if the array already contains 5 images
				if (prevImages[serialReference].length >= 5) {
					alert("You can't upload more than five images for this reference.");
					return prevImages;
				} else {
					// Add the new image(s) to the array for the specified reference
					prevImages[serialReference].push(...files.base64);
					return { ...prevImages }; // Return a new object to trigger a state update
				}
			});
		}
	};

	const handleClickOpenimg = (base64) => {
		setBzQtyImg(base64);
		setBzQtyImgDialog(true);
	};
	const handleClickDeleteimg = (imgIndex, imgType) => {
		setBrazingPhotosInLeak((brazePhoto) => {
			const seriesRef = selData["series_ref"];
			const updatedBrazePhoto = [...brazePhoto[seriesRef]]; // Create a copy of the array
			updatedBrazePhoto.splice(imgIndex, 1); // Remove the image at imgIndex

			// Update the state with the new array
			return {
				...brazePhoto,
				[seriesRef]: updatedBrazePhoto,
			};
		});
	};
	const handleSetBrazingData = (paramOrder, paramSplit) => {
		var bodyFormData = new FormData();
		bodyFormData.append("authId", access);
		bodyFormData.append("orderId", paramOrder);
		bodyFormData.append("splitId", paramSplit);
		// bodyFormData.append("data", JSON.stringify(brazingQtyData));
		bodyFormData.append("data", JSON.stringify([selData]));
		bodyFormData.append("brazingPhoto", JSON.stringify(brazingPhotosInLeak));
		/**add photos */
		axios({
			method: "post",
			url: setBrazingDetails,
			data: bodyFormData,
			headers: { "Content-Type": "multipart/form-data" },
		})
			.then(function (response) {
				//handle success
				const res_data = response.data;
				if (res_data.status_code === 200) {
					toast(res_data.status_msg);
				} else {
					toast(res_data.status_msg);
				}
			})
			.catch(function (response) {
				//handle error
				console.log(response);
			});
	};

	const handleGetLookup = () => {
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
	};

	const handleContentGet = (orderId) => {
		var bodyFormData = new FormData();
		bodyFormData.append("orderId", orderId);
		bodyFormData.append("splitId", splitId);
		bodyFormData.append("authId", access);
		axios({
			method: "post",
			url: getBrazingDetail,
			data: bodyFormData,
			headers: { "Content-Type": "multipart/form-data" },
		})
			.then(function (response) {
				//handle success
				const res_data = response.data;
				if (res_data.status_code === 200) {
					setBrazingQtyData(res_data.data);
					toast(res_data.status_msg);
				} else if (res_data.status_code === 202) {
				} else {
					console.log(res_data.status_msg);
				}
			})
			.catch(function (response) {
				//handle error
				console.log(response);
			});
	};

	// const addQuantitySeries = (paramOrder, paramSplit, paramQth) => {
	// 	if (paramQth < 1) {
	// 		toast("Enter Quantity Greater than 0.");
	// 		return;
	// 	}
	// 	var bodyFormData = new FormData();
	// 	bodyFormData.append("orderId", paramOrder);
	// 	bodyFormData.append("splitId", paramSplit);
	// 	bodyFormData.append("qtyCount", paramQth);
	// 	bodyFormData.append("authId", access);
	// 	axios({
	// 		method: "post",
	// 		url: setAddBrazingQuantity,
	// 		data: bodyFormData,
	// 		headers: { "Content-Type": "multipart/form-data" },
	// 	})
	// 		.then(function (response) {
	// 			//handle success
	// 			const res_data = response.data;
	// 			if (res_data.status_code === 200) {
	// 				setBrazingQtyData(res_data.data);
	// 				toast(res_data.status_msg);
	// 			} else if (res_data.status_code === 202) {
	// 			} else {
	// 				toast(res_data.status_msg);
	// 			}
	// 		})
	// 		.catch(function (response) {
	// 			//handle error
	// 			console.log(response);
	// 		});
	// };

	const handleSeriesSel = (seriedId) => {
		setBrazingPhotosInLeak("");
		const selData = brazingQtyData.filter((item) => item.id === seriedId)[0];
		const newBrazingPhotosInLeak = { ...brazingPhotosInLeak }; // Create a copy of the state
		selData["brazing_photo"].forEach((item, index) => {
			if (!newBrazingPhotosInLeak[selData["series_ref"]]) {
				newBrazingPhotosInLeak[selData["series_ref"]] = [];
			}
			const imagePath = imageURL + "uploads/" + item["drawing_base64"];
			if (
				newBrazingPhotosInLeak[selData["series_ref"]].indexOf(imagePath) == -1
			) {
				newBrazingPhotosInLeak[selData["series_ref"]].push(imagePath);
			}
		});
		setBrazingPhotosInLeak(newBrazingPhotosInLeak); // Update the state with the new object
		setSelData(selData);
	};

	const handleSelDataChange = (e) => {
		const { name, value } = e.target;
		setSelData({ ...selData, [name]: value });
	};

	const handleTxtDataChange = (e) => {
		const { name, value } = e.target;
		if (/\d/.test(value) === true) {
			if (name === "qty") {
				setAddQty(value);
			} else {
				setSelData({ ...selData, [name]: value });
			}
		}
	};

	const handleCheckChange = (e) => {
		const { name, checked, value } = e.target;
		if (checked) {
			if (name === "leak" && value !== "leakFound") {
				setSelData({
					...selData,
					[name]: value,
					A: 0,
					B: 0,
					D: 0,
					E: 0,
					F: 0,
					G: 0,
					H: 0,
					K: 0,
					L: 0,
					N: 0,
				});
			} else if (name === "leak" && value === "leakFound") {
				setSelData({ ...selData, [name]: value });
			}
		}
	};

	const handleInc = (name) => {
		if (selData?.leak === "leakFound") {
			if (name === "qty") {
				setAddQty((item) => item + 1);
			} else {
				setSelData((item) => ({
					...selData,
					[name]: isNaN(item[name]) ? 0 : parseInt(item[name]) + 1,
				}));
			}
		} else {
			toast(
				"Cannot update Count as Leak is not found and Leak record is not found"
			);
		}
	};

	const handleDesc = (name) => {
		if (selData?.leak === "leakFound") {
			if (name === "qty") {
				setAddQty((item) => item - 1);
			} else {
				setSelData((item) => ({
					...selData,
					[name]: isNaN(item[name])
						? 0
						: parseInt(item[name]) - 1 < 0
						? 0
						: parseInt(item[name]) - 1,
				}));
			}
		} else {
			toast(
				"Cannot update Count as Leak is not found and Leak record is not found"
			);
		}
	};

	const selOrderSeriesId = () => {
		if (selData.order_id) {
			return selData.order_id + selData.split_id + "-" + selData.series_id;
		} else {
			return "Not selected";
		}
	};

	const handleUpdateMainList = () => {
		const listData = brazingQtyData;
		const id = selData?.id;
		const idx = listData.findIndex((item) => item.id === id);
		listData[idx] = selData;
		setBrazingQtyData(listData);
	};

	const getBtnColor = (itemId) => {
		const idx = brazingQtyData.findIndex((item) => item.id === itemId);
		const leak = brazingQtyData[idx]?.leak;
		if (selData?.id === itemId) {
			return "secon-bg";
		} else if (
			leak === "leakFound" ||
			leak === "noLeak" ||
			leak === "notRecord"
		) {
			return "bg-success";
		} else {
			return "";
		}
	};

	useEffect(() => {
		handleGetLookup();
		handleContentGet(orderId, splitId);
	}, [orderId, splitId]);

	useEffect(() => {
		handleUpdateMainList();
	}, [selData]);

	return (
		<div className="container-fluid">
			<div className="row">
				<div className="col">
					<p className="m-0">Order Id:{orderId + splitId}</p>
				</div>
				{/* <div className="col-6 d-flex justify-content-right">
					<div className="col-8">
						<div className="input-group">
							<button
								className="btn secon-bg text-white p-0"
								onClick={() => handleDesc("qty")}
							>
								<RemoveIcon fontSize="small" />
							</button>
							<input
								type="text"
								className="form-control prime-border p-0"
								value={addQty}
								name="qty"
							/>
							<button
								className="btn secon-bg text-white p-0"
								onClick={() => handleInc("qty")}
							>
								<AddIcon fontSize="small" />
							</button>
							<button
								className="btn prime-bg text-white p-0"
								onClick={() => addQuantitySeries(orderId, splitId, addQty)}
							>
								Add Quantity
							</button>
						</div>
					</div>
				</div> */}
			</div>

			<div className="row prime-border p-1 mt-3 mx-1 btnList">
				{brazingQtyData.map((item) => {
					return (
						<div className="col-2 p-0 d-grid gap-2 p-1">
							<button
								className={`btn bg-secondary m-0 p-1 text-white ${getBtnColor(
									item.id
								)}`}
								onClick={() => handleSeriesSel(item.id)}
								style={{ fontSize: "12px" }}
							>
								{item.order_id + item.split_id + "-" + item.series_id}
							</button>
						</div>
					);
				})}
			</div>

			<div className="col-12 prime-border p-1 mt-3">
				<div className="row">
					<div className="col-3">
						<p className="m-0">Order Id:</p>
						<strong>{selOrderSeriesId()}</strong>
					</div>
					<div className="col-8">
						<RadioGroup
							aria-labelledby="leak-group-label"
							name="leak"
							row
							onChange={(e) => handleCheckChange(e)}
						>
							<FormControlLabel
								value="leakFound"
								control={
									<Radio size="small" checked={selData?.leak === "leakFound"} />
								}
								label="Leak Found"
								sx={{ "& .MuiFormControlLabel-label": { fontSize: 14 } }}
							/>
							<FormControlLabel
								value="noLeak"
								control={
									<Radio size="small" checked={selData?.leak === "noLeak"} />
								}
								label="No Leak"
								sx={{ "& .MuiFormControlLabel-label": { fontSize: 14 } }}
							/>
							<FormControlLabel
								value="notRecord"
								control={
									<Radio size="small" checked={selData?.leak === "notRecord"} />
								}
								label="Not Recorded"
								sx={{ "& .MuiFormControlLabel-label": { fontSize: 14 } }}
							/>
						</RadioGroup>
					</div>
				</div>
				<div className="row d-flex justify-content-between mt-3">
					<div className="col-2">
						<p className="text-center p-0">A</p>
						<div className="input-group">
							<button
								className="btn secon-bg text-white p-0"
								onClick={() => handleDesc("A")}
							>
								<RemoveIcon fontSize="small" />
							</button>
							<input
								type="text"
								className="form-control prime-border p-0"
								value={selData?.A}
								name="A"
							/>
							<button
								className="btn secon-bg text-white p-0"
								onClick={() => handleInc("A")}
							>
								<AddIcon fontSize="small" />
							</button>
						</div>
					</div>
					<div className="col-2">
						<p className="text-center p-0">B</p>
						<div className="input-group">
							<button
								className="btn secon-bg text-white p-0"
								onClick={() => handleDesc("B")}
							>
								<RemoveIcon fontSize="small" />
							</button>
							<input
								type="text"
								className="form-control prime-border p-0"
								value={selData?.B}
								name="B"
							/>
							<button
								className="btn secon-bg text-white p-0"
								onClick={() => handleInc("B")}
							>
								<AddIcon fontSize="small" />
							</button>
						</div>
					</div>
					<div className="col-2">
						<p className="text-center p-0">D</p>
						<div className="input-group">
							<button
								className="btn secon-bg text-white p-0"
								onClick={() => handleDesc("D")}
							>
								<RemoveIcon fontSize="small" />
							</button>
							<input
								type="text"
								className="form-control prime-border p-0"
								value={selData?.D}
								name="D"
							/>
							<button
								className="btn secon-bg text-white p-0"
								onClick={() => handleInc("D")}
							>
								<AddIcon fontSize="small" />
							</button>
						</div>
					</div>

					<div className="col-2">
						<p className="text-center p-0">E</p>
						<div className="input-group">
							<button
								className="btn secon-bg text-white p-0"
								onClick={() => handleDesc("E")}
							>
								<RemoveIcon fontSize="small" />
							</button>
							<input
								type="text"
								className="form-control prime-border p-0"
								value={selData?.E}
								name="E"
							/>
							<button
								className="btn secon-bg text-white p-0"
								onClick={() => handleInc("E")}
							>
								<AddIcon fontSize="small" />
							</button>
						</div>
					</div>
					<div className="col-2">
						<p className="text-center p-0">F</p>
						<div className="input-group">
							<button
								className="btn secon-bg text-white p-0"
								onClick={() => handleDesc("F")}
							>
								<RemoveIcon fontSize="small" />
							</button>
							<input
								type="text"
								className="form-control prime-border p-0"
								value={selData?.F}
								name="F"
							/>
							<button
								className="btn secon-bg text-white p-0"
								onClick={() => handleInc("F")}
							>
								<AddIcon fontSize="small" />
							</button>
						</div>
					</div>
				</div>
				<div className="row d-flex justify-content-between">
					<div className="col-2">
						<p className="text-center p-0">G</p>
						<div className="input-group">
							<button
								className="btn secon-bg text-white p-0"
								onClick={() => handleDesc("G")}
							>
								<RemoveIcon fontSize="small" />
							</button>
							<input
								type="text"
								className="form-control prime-border p-0"
								value={selData?.G}
								name="G"
							/>
							<button
								className="btn secon-bg text-white p-0"
								onClick={() => handleInc("G")}
							>
								<AddIcon fontSize="small" />
							</button>
						</div>
					</div>
					<div className="col-2">
						<p className="text-center p-0">H</p>
						<div className="input-group">
							<button
								className="btn secon-bg text-white p-0"
								onClick={() => handleDesc("H")}
							>
								<RemoveIcon fontSize="small" />
							</button>
							<input
								type="text"
								className="form-control prime-border p-0"
								value={selData?.H}
								name="H"
							/>
							<button
								className="btn secon-bg text-white p-0"
								onClick={() => handleInc("H")}
							>
								<AddIcon fontSize="small" />
							</button>
						</div>
					</div>
					<div className="col-2">
						<p className="text-center p-0">K</p>
						<div className="input-group">
							<button
								className="btn secon-bg text-white p-0"
								onClick={() => handleDesc("K")}
							>
								<RemoveIcon fontSize="small" />
							</button>
							<input
								type="text"
								className="form-control prime-border p-0"
								value={selData?.K}
								name="K"
							/>
							<button
								className="btn secon-bg text-white p-0"
								onClick={() => handleInc("K")}
							>
								<AddIcon fontSize="small" />
							</button>
						</div>
					</div>
					<div className="col-2">
						<p className="text-center p-0">L</p>
						<div className="input-group">
							<button
								className="btn secon-bg text-white p-0"
								onClick={() => handleDesc("L")}
							>
								<RemoveIcon fontSize="small" />
							</button>
							<input
								type="text"
								className="form-control prime-border p-0"
								value={selData?.L}
								name="L"
							/>
							<button
								className="btn secon-bg text-white p-0"
								onClick={() => handleInc("L")}
							>
								<AddIcon fontSize="small" />
							</button>
						</div>
					</div>
					<div className="col-2">
						<p className="text-center p-0">N</p>
						<div className="input-group">
							<button
								className="btn secon-bg text-white p-0"
								onClick={() => handleDesc("N")}
							>
								<RemoveIcon fontSize="small" />
							</button>
							<input
								type="text"
								className="form-control prime-border p-0"
								value={selData?.N}
								name="N"
							/>
							<button
								className="btn secon-bg text-white p-0"
								onClick={() => handleInc("N")}
							>
								<AddIcon fontSize="small" />
							</button>
						</div>
					</div>
				</div>
				<div className="row mt-3">
					<div className="col-4 p-0">
						<FormControl fullWidth>
							<InputLabel id="demo-simple-select-label">U Bend</InputLabel>
							<Select
								labelId="demo-simple-select-label"
								id="ubend"
								key={Math.random()}
								value={selData?.uBend}
								name="uBend"
								onChange={(e) => handleSelDataChange(e)}
							>
								<MenuItem value="">
									<em>None</em>
								</MenuItem>
								{lookUpList["brazingLkp"]?.map((item) => {
									return <MenuItem value={item.id}>{item.lkp_value}</MenuItem>;
								})}
							</Select>
						</FormControl>
					</div>
					<div className="col-4 p-0">
						<FormControl fullWidth>
							<InputLabel id="demo-simple-select-label">
								Inlet Outlet
							</InputLabel>
							<Select
								labelId="demo-simple-select-label"
								id="inletoutlet"
								key={Math.random()}
								value={selData.inletOutlet}
								name="inletOutlet"
								onChange={(e) => handleSelDataChange(e)}
							>
								<MenuItem value="">
									<em>None</em>
								</MenuItem>
								{lookUpList["brazingLkp"]?.map((item) => {
									return <MenuItem value={item.id}>{item.lkp_value}</MenuItem>;
								})}
							</Select>
						</FormControl>
					</div>
					<div className="col-4 p-0">
						<FormControl fullWidth>
							<InputLabel id="demo-simple-select-label">Headder</InputLabel>
							<Select
								labelId="demo-simple-select-label"
								id="headder"
								key={Math.random()}
								value={selData.headder}
								name="headder"
								onChange={(e) => handleSelDataChange(e)}
							>
								<MenuItem value="">
									<em>None</em>
								</MenuItem>
								{lookUpList["brazingLkp"]?.map((item) => {
									return <MenuItem value={item.id}>{item.lkp_value}</MenuItem>;
								})}
							</Select>
						</FormControl>
					</div>
				</div>
				<div className="row mt-3">
					<div className="col-4 p-0">
						<FormControl fullWidth>
							<InputLabel id="demo-simple-select-label">Headder Fix</InputLabel>
							<Select
								labelId="demo-simple-select-label"
								id="headderfix"
								key={Math.random()}
								value={selData.headderFix}
								name="headderFix"
								onChange={(e) => handleSelDataChange(e)}
							>
								<MenuItem value="">
									<em>None</em>
								</MenuItem>
								{lookUpList["brazingLkp"]?.map((item) => {
									return <MenuItem value={item.id}>{item.lkp_value}</MenuItem>;
								})}
							</Select>
						</FormControl>
					</div>
					<div className="col-4 p-0">
						<FormControl fullWidth>
							<InputLabel id="demo-simple-select-label">
								Distribution
							</InputLabel>
							<Select
								labelId="demo-simple-select-label"
								id="distri"
								key={Math.random()}
								value={selData.distributor}
								name="distributor"
								onChange={(e) => handleSelDataChange(e)}
							>
								<MenuItem value="">
									<em>None</em>
								</MenuItem>
								{lookUpList["brazingLkp"]?.map((item) => {
									return <MenuItem value={item.id}>{item.lkp_value}</MenuItem>;
								})}
							</Select>
						</FormControl>
					</div>
					<div className="col-4 p-0">
						<FormControl fullWidth>
							<InputLabel id="demo-simple-select-label">
								Distribution Fix
							</InputLabel>
							<Select
								labelId="demo-simple-select-label"
								id="distrifix"
								key={Math.random()}
								name="distributorFix"
								value={selData.distributorFix}
								onChange={(e) => handleSelDataChange(e)}
							>
								<MenuItem value="">
									<em>None</em>
								</MenuItem>
								{lookUpList["brazingLkp"]?.map((item) => {
									return <MenuItem value={item.id}>{item.lkp_value}</MenuItem>;
								})}
							</Select>
						</FormControl>
					</div>
				</div>
			</div>
			<div className="row mt-3">
				<InputLabel>Photo upload Hair pin(Brazing)</InputLabel>
				{brazingPhotosInLeak.length === 0 && (
					<FormHelperText error>Select Brazing Photo</FormHelperText>
				)}
				<>
					{
						<ImageList cols={3} rowHeight={164}>
							{brazingPhotosInLeak[selData["series_ref"]]?.map(
								(item, index) => (
									<ImageListItem key={"brazing_in_leak" + index}>
										<img
											src={item}
											srcSet={item}
											alt={"brazing_in_leaks"}
											loading="lazy"
										/>
										<Stack direction="row" spacing={1}>
											<IconButton onClick={() => handleClickOpenimg(item)}>
												<PreviewIcon />
											</IconButton>

											<IconButton
												onClick={() => handleClickDeleteimg(index, "brazing")}
											>
												<DeleteIcon />
											</IconButton>
										</Stack>
									</ImageListItem>
								)
							)}
						</ImageList>
					}
					<ReactFileReader
						fileTypes={[".png", ".jpg"]}
						base64={true}
						multipleFiles={true}
						handleFiles={(files) => {
							handleFiles("brazing", files, selData["series_ref"]);
						}}
						key={Math.random()}
					>
						<PhotoCameraIcon />
					</ReactFileReader>
				</>
			</div>
			<div className="row d-flex justify-content-end mt-2">
				<div className="col-2">
					<Button
						className="btn secon-bg text-white"
						onClick={() => handleSetBrazingData(orderId, splitId)}
					>
						Save
					</Button>
				</div>
			</div>
			<Dialog
				fullScreen
				open={bzQtyImgDialog}
				TransitionComponent={Transition}
				keepMounted
				onClose={() => setBzQtyImgDialog(false)}
				aria-describedby="alert-dialog-slide-description"
			>
				<AppBar sx={{ position: "relative" }}>
					<Toolbar>
						<IconButton
							edge="start"
							color="inherit"
							onClick={() => setBzQtyImgDialog(false)}
							aria-label="close"
						>
							<CloseIcon />
						</IconButton>
						<Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
							Brazing Images
						</Typography>
					</Toolbar>
				</AppBar>
				<img src={bzQtyImg} srcSet={bzQtyImg} alt={bzQtyImg} loading="lazy" />
				<DialogActions>
					<Button onClick={() => setBzQtyImgDialog(false)}>Close</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
