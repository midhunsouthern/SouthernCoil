import { useState, useEffect, useContext } from "react";
import axios from "axios";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import PreviewIcon from "@mui/icons-material/Preview";
import {
	IconButton,
	Button,
	TextField,
	Stack,
	Checkbox,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	FormGroup,
	FormControlLabel,
	ImageListItem,
	ImageList,
	RadioGroup,
	Radio,
} from "@mui/material";
import ReactFileReader from "react-file-reader";
import { toast } from "react-toastify";
import {
	getLookupData,
	setBrazingDetails,
	getBrazingDetail,
	setAddBrazingQuantity,
} from "../../constant/url";
import { AccessContext } from "../../constant/accessContext";

export default function BrazingQuantity(prop) {
	const access = useContext(AccessContext).authID;
	const orderId = prop.orderId;
	const splitId = prop.splitId;
	const [bzQtyPhoto, setBzQtyPhoto] = useState([]);
	const [lookUpList, setLookupList] = useState([]);
	const [addQty, setAddQty] = useState(0);

	const [bzQtyImg, setBzQtyImg] = useState("");
	const [bzQtyImgDialog, setBzQtyImgDialog] = useState(false);

	//qty Data
	const [brazingQtyData, setBrazingQtyData] = useState([]);
	const [selData, setSelData] = useState([]);

	const handleFiles = (type, files) => {};

	const handleClickOpenimg = (base64) => {
		setBzQtyImg(base64);
		setBzQtyImgDialog(true);
	};

	const handleSetBrazingData = (paramOrder, paramSplit) => {
		var bodyFormData = new FormData();
		bodyFormData.append("authId", access);
		bodyFormData.append("orderId", paramOrder);
		bodyFormData.append("splitId", paramSplit);
		bodyFormData.append("data", JSON.stringify(brazingQtyData));

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
					console.log(res_data.data);
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

	const addQuantitySeries = (paramOrder, paramSplit, paramQth) => {
		if (paramQth < 1) {
			toast("Enter Quantity Greater than 0.");
			return;
		}
		var bodyFormData = new FormData();
		bodyFormData.append("orderId", paramOrder);
		bodyFormData.append("splitId", paramSplit);
		bodyFormData.append("qtyCount", paramQth);
		bodyFormData.append("authId", access);
		axios({
			method: "post",
			url: setAddBrazingQuantity,
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
					toast(res_data.status_msg);
				}
			})
			.catch(function (response) {
				//handle error
				console.log(response);
			});
	};

	const handleSeriesSel = (seriedId) => {
		const selData = brazingQtyData.filter((item) => item.id === seriedId)[0];
		setSelData(selData);
	};

	const handleSelDataChange = (e) => {
		const { name, value } = e.target;
		console.log("sel data", name, value);
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
		console.log(name, checked, value);

		if (checked) {
			console.log("setting the array");
			setSelData({ ...selData, [name]: value });
		}
	};

	const handleInc = (name) => {
		if (name === "qty") {
			setAddQty((item) => item + 1);
		} else {
			setSelData((item) => ({
				...selData,
				[name]: isNaN(item[name]) ? 0 : parseInt(item[name]) + 1,
			}));
		}
	};

	const handleDesc = (name) => {
		if (name === "qty") {
			setAddQty((item) => item - 1);
		} else {
			setSelData((item) => ({
				...selData,
				[name]: isNaN(item[name]) ? 0 : parseInt(item[name]) - 1,
			}));
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
				<div className="col-6 d-flex justify-content-right">
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
				</div>
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
						{/* <div className="col p-0">
                                <FormControlLabel control={<Checkbox value="leakFound" />}  name="leak" label="Leak Found" checked={selData?.leak === "leakFound"}
                                sx={{ '& .MuiSvgIcon-root': { fontSize: 16 }, '& .MuiFormControlLabel-label':{fontSize:12} }} onChange={(e) => handleCheckChange(e)}/>
                            </div>
                            <div className="col p-0">
                                <FormControlLabel control={<Checkbox value="noLeak" />}  name="leak" label="No Leak" checked={selData?.leak === "noLeak"}
                                sx={{ '& .MuiSvgIcon-root': { fontSize: 16 }, '& .MuiFormControlLabel-label':{fontSize:12} }} onChange={(e) => handleCheckChange(e)}/>
                            </div>
                            <div className="col p-0">
                                <FormControlLabel control={<Checkbox value="notRecord" />}  name="leak" label="Not Record" checked={selData?.leak === "notRecord"}
                                sx={{ '& .MuiSvgIcon-root': { fontSize: 16 }, '& .MuiFormControlLabel-label':{fontSize:12} }} onChange={(e) => handleCheckChange(e)}/>
                            </div> */}
					</div>
					{/* <div className="col-3">
						<>
							{
								<ImageList cols={3} rowHeight={164}>
									{bzQtyPhoto?.map((item, index) => (
										<ImageListItem key={"bzqty" + index}>
											<img
												src={item}
												srcSet={item}
												alt={"bzqty"}
												loading="lazy"
											/>
											<IconButton onClick={() => handleClickOpenimg(item)}>
												<PreviewIcon />
											</IconButton>
										</ImageListItem>
									))}
								</ImageList>
							}
							<ReactFileReader
								fileTypes={[".png", ".jpg"]}
								base64={true}
								handleFiles={(files) => {
									handleFiles("bzQty", files);
								}}
								multipleFiles={true}
								key={Math.random()}
							>
								<AddAPhotoIcon />
							</ReactFileReader>
						</>
					</div> */}
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
						<p className="text-center p-0">H</p>
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
						<p className="text-center p-0">H</p>
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
		</div>
	);
}
