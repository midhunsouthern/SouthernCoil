import {
	Button,
	ButtonGroup,
	Card,
	CardContent,
	Checkbox,
	Container,
	FormControl,
	FormControlLabel,
	InputLabel,
	MenuItem,
	Select,
	Stack,
	TextField,
} from "@mui/material";
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AccessContext } from "../../constant/accessContext";
import {
	getLookupData,
	setBrazingDetails,
	getBrazingDetail,
} from "../../constant/url";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { toast } from "react-toastify";

export default function BracingLeakModal(prop) {
	const access = useContext(AccessContext).authID;
	const dataId = prop.orderId;
	const rowQuantity = parseInt(prop.quantity);
	const arr = [
		{
			leak: "",
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
			uBend: "",
			inletOutlet: "",
			headder: "",
			headderFix: "",
			distributor: "",
			distributorFix: "",
			completion: "",
		},
	];
	const repeat = (arrdata, n) => Array(n).fill(arrdata).flat();
	const [lookUpList, setLookupList] = React.useState([]);
	const handleBrazingData = (data) => {
		console.log("handleBrazingData", data);
		handleContentSave(data);
	};
	//component
	const BrazingCompCard = (bProp) => {
		const [compArray, setCompArray] = useState(bProp.dataArray);
		if (bProp.requested) {
			bProp.returnBrazingData(compArray);
		}

		const handleLeak = (index, event) => {
			const { name, value, checked } = event.target;
			let editData;
			if (checked) {
				editData = compArray.map((item, itemIndex) =>
					index === itemIndex && name ? { ...item, [name]: value } : item
				);
			} else {
				editData = compArray.map((item, itemIndex) =>
					index === itemIndex && name ? { ...item, [name]: "" } : item
				);
			}
			setCompArray(editData);
		};

		const handleGenricSel = (index, event) => {
			const { name, value } = event.target;
			const editData = compArray.map((item, itemIndex) =>
				index === itemIndex && name ? { ...item, [name]: value } : item
			);
			setCompArray(editData);
		};

		const handleAddVal = (eleName, index) => {
			const editData = compArray.map((item, itemIndex) =>
				index === itemIndex && eleName
					? { ...item, [eleName]: item[eleName] + 1 }
					: item
			);
			setCompArray(editData);
		};

		const handleMinusVal = (eleName, index) => {
			const editData = compArray.map((item, itemIndex) =>
				index === itemIndex && eleName
					? {
							...item,
							[eleName]: item[eleName] - 1 < 0 ? 0 : item[eleName] - 1,
					  }
					: item
			);
			setCompArray(editData);
		};

		function CounterButtonGroup(cbProp) {
			return (
				<ButtonGroup
					size="small"
					aria-label="small button group"
					orientation="vertical"
				>
					<Button
						sx={{ padding: 0, margin: 0 }}
						onClick={() => handleAddVal(cbProp.cbElemName, cbProp.cbIndex)}
					>
						<AddIcon />
					</Button>
					<Button
						sx={{ padding: 0, margin: 0 }}
						onClick={() => handleMinusVal(cbProp.cbElemName, cbProp.cbIndex)}
					>
						<RemoveIcon />
					</Button>
				</ButtonGroup>
			);
		}
		const comp = [];
		comp.push(
			compArray.map((item, index) => {
				return (
					<Card key={"card" + index} className="mt-4">
						<CardContent key={"cardContent" + index}>
							<Container>
								<p>Order Id: {dataId + "-" + (index + 1)}</p>
								<div className="row mt-3">
									<InputLabel>Leak</InputLabel>
									<Stack direction="row" spacing={1}>
										<FormControlLabel
											control={<Checkbox value="leakFound" />}
											name="leak"
											label="Leak Found"
											onChange={(e) => handleLeak(index, e)}
											checked={compArray.at(index).leak === "leakFound"}
											key={"lf" + index}
										/>
										<FormControlLabel
											control={<Checkbox value="noLeak" />}
											name="leak"
											label="No Leak"
											onChange={(e) => handleLeak(index, e)}
											checked={compArray.at(index).leak === "noLeak"}
											key={"nl" + index}
										/>
										<FormControlLabel
											control={<Checkbox value="notRecord" />}
											name="leak"
											label="Not Record"
											onChange={(e) => handleLeak(index, e)}
											checked={compArray.at(index).leak === "notRecord"}
											key={"nr" + index}
										/>
									</Stack>
								</div>
								<div className="row mt-3">
									<InputLabel>Instance</InputLabel>
									<Stack direction="row" spacing={1}>
										<Stack direction="row" spacing={0}>
											<TextField
												type="number"
												label="A"
												name="A"
												InputProps={{
													inputProps: { min: 0, srink: true },
												}}
												onChange={(e) => handleGenricSel(index, e)}
												value={compArray.at(index).A}
												key={"a" + index}
											/>
											<CounterButtonGroup cbElemName="A" cbIndex={index} />
										</Stack>
										<Stack direction="row" spacing={0}>
											<TextField
												type="number"
												label="B"
												name="B"
												InputProps={{
													inputProps: { min: 0 },
												}}
												onChange={(e) => handleGenricSel(index, e)}
												value={compArray.at(index).B}
												key={"a" + index}
											/>
											<CounterButtonGroup cbElemName="B" cbIndex={index} />
										</Stack>
										<Stack direction="row" spacing={0}>
											<TextField
												type="number"
												label="D"
												name="D"
												InputProps={{
													inputProps: { min: 0 },
												}}
												onChange={(e) => handleGenricSel(index, e)}
												value={compArray.at(index).D}
												key={"d" + index}
											/>
											<CounterButtonGroup cbElemName="D" cbIndex={index} />
										</Stack>
										<Stack direction="row" spacing={0}>
											<TextField
												type="number"
												label="E"
												name="E"
												InputProps={{
													inputProps: { min: 0 },
												}}
												onChange={(e) => handleGenricSel(index, e)}
												value={compArray.at(index).E}
												key={"e" + index}
											/>
											<CounterButtonGroup cbElemName="E" cbIndex={index} />
										</Stack>
									</Stack>
									<Stack direction="row" spacing={1}>
										<Stack direction="row" spacing={0}>
											<TextField
												type="number"
												label="F"
												name="F"
												InputProps={{
													inputProps: { min: 0 },
												}}
												onChange={(e) => handleGenricSel(index, e)}
												value={compArray.at(index).F}
												key={"f" + index}
											/>
											<CounterButtonGroup cbElemName="F" cbIndex={index} />
										</Stack>
										<Stack direction="row" spacing={0}>
											<TextField
												type="number"
												label="G"
												name="G"
												InputProps={{
													inputProps: { min: 0 },
												}}
												onChange={(e) => handleGenricSel(index, e)}
												value={compArray.at(index).G}
												key={"g" + index}
											/>
											<CounterButtonGroup cbElemName="G" cbIndex={index} />
										</Stack>
										<Stack direction="row" spacing={0}>
											<TextField
												type="number"
												label="H"
												name="H"
												InputProps={{
													inputProps: { min: 0 },
												}}
												onChange={(e) => handleGenricSel(index, e)}
												value={compArray.at(index).H}
												key={"h" + index}
											/>
											<CounterButtonGroup cbElemName="H" cbIndex={index} />
										</Stack>
										<Stack direction="row" spacing={0}>
											<TextField
												type="number"
												label="K"
												name="K"
												InputProps={{
													inputProps: { min: 0 },
												}}
												onChange={(e) => handleGenricSel(index, e)}
												value={compArray.at(index).K}
												key={"k" + index}
											/>
											<CounterButtonGroup cbElemName="K" cbIndex={index} />
										</Stack>
									</Stack>
									<Stack direction="row" spacing={1}>
										<Stack direction="row" spacing={0}>
											<TextField
												type="number"
												label="L"
												name="L"
												InputProps={{
													inputProps: { min: 0 },
												}}
												onChange={(e) => handleGenricSel(index, e)}
												value={compArray.at(index).L}
												key={"l" + index}
											/>
											<CounterButtonGroup cbElemName="L" cbIndex={index} />
										</Stack>
										<Stack direction="row" spacing={0}>
											<TextField
												type="number"
												label="N"
												name="N"
												InputProps={{
													inputProps: { min: 0 },
												}}
												onChange={(e) => handleGenricSel(index, e)}
												value={compArray.at(index).N}
												key={"n" + index}
											/>
											<CounterButtonGroup cbElemName="N" cbIndex={index} />
										</Stack>
									</Stack>
								</div>
								<div className="row mt-3">
									<div className="col">
										<FormControl fullWidth>
											<InputLabel id="ubend-label">U Bend</InputLabel>
											<Select
												labelId="ubend-label"
												id="ubend-select"
												label="U Bend"
												name="uBend"
												defaultValue=""
												value={compArray.at(index).uBend}
												onChange={(e) => handleGenricSel(index, e)}
												key={"ubend" + index}
											>
												<MenuItem value="">
													{compArray.at(index).uBend}
												</MenuItem>
												{lookUpList["brazingLkp"]?.map((item) => {
													return (
														<MenuItem value={item.id}>
															{item.lkp_value}
														</MenuItem>
													);
												})}
											</Select>
										</FormControl>
									</div>
									<div className="col">
										<FormControl fullWidth>
											<InputLabel id="inletOutlet-label">
												Inlet Outlet
											</InputLabel>
											<Select
												labelId="inletOutlet-label"
												id="inletOutlet-select"
												label="Inlet Outlet"
												name="inletOutlet"
												defaultValue=""
												value={compArray.at(index).inletOutlet}
												onChange={(e) => handleGenricSel(index, e)}
												key={"iolet" + index}
											>
												<MenuItem value="">N/A</MenuItem>
												{lookUpList["brazingLkp"]?.map((item) => {
													return (
														<MenuItem value={item.id}>
															{item.lkp_value}
														</MenuItem>
													);
												})}
											</Select>
										</FormControl>
									</div>
								</div>
								<div className="row mt-3">
									<div className="col">
										<FormControl fullWidth>
											<InputLabel id="headder-label">Headder</InputLabel>
											<Select
												labelId="headder-label"
												id="headder-select"
												label="Headder"
												name="headder"
												defaultValue=""
												value={compArray.at(index).headder}
												onChange={(e) => handleGenricSel(index, e)}
												key={"head" + index}
											>
												<MenuItem value="">N/A</MenuItem>
												{lookUpList["brazingLkp"]?.map((item) => {
													return (
														<MenuItem value={item.id}>
															{item.lkp_value}
														</MenuItem>
													);
												})}
											</Select>
										</FormControl>
									</div>
									<div className="col">
										<FormControl fullWidth>
											<InputLabel id="headderFix-label">Headder Fix</InputLabel>
											<Select
												labelId="headderFix-label"
												id="headderFix-select"
												label="Headder Fix"
												name="headderFix"
												defaultValue=""
												value={compArray.at(index).headderFix}
												onChange={(e) => handleGenricSel(index, e)}
												key={"headfix" + index}
											>
												<MenuItem value="">N/A</MenuItem>
												{lookUpList["brazingLkp"]?.map((item) => {
													return (
														<MenuItem value={item.id}>
															{item.lkp_value}
														</MenuItem>
													);
												})}
											</Select>
										</FormControl>
									</div>
								</div>
								<div className="row mt-3">
									<div className="col">
										<FormControl fullWidth>
											<InputLabel id="dist-label">Distributor</InputLabel>
											<Select
												labelId="dist-label"
												id="dist-select"
												label="Distributor"
												name="distributor"
												defaultValue=""
												value={compArray.at(index).distributor}
												onChange={(e) => handleGenricSel(index, e)}
												key={"dist" + index}
											>
												<MenuItem value="">N/A</MenuItem>
												{lookUpList["brazingLkp"]?.map((item) => {
													return (
														<MenuItem value={item.id}>
															{item.lkp_value}
														</MenuItem>
													);
												})}
											</Select>
										</FormControl>
									</div>
									<div className="col">
										<FormControl fullWidth>
											<InputLabel id="distfix-label">
												Distributor Fix
											</InputLabel>
											<Select
												labelId="distfix-label"
												id="distfix-select"
												label="Distributor Fix"
												name="distributorFix"
												defaultValue=""
												value={compArray.at(index).distributorFix}
												onChange={(e) => handleGenricSel(index, e)}
												key={"distfix" + index}
											>
												<MenuItem value="">N/A</MenuItem>
												{lookUpList["brazingLkp"]?.map((item) => {
													return (
														<MenuItem value={item.id}>
															{item.lkp_value}
														</MenuItem>
													);
												})}
											</Select>
										</FormControl>
									</div>
								</div>
							</Container>
						</CardContent>
					</Card>
				);
			})
		);
		comp.push(
			<div className="row mt-3">
				<Button
					variant="contained"
					onClick={() => bProp.returnBrazingData(compArray)}
					data-bs-dismiss="modal"
					aria-label="Close"
				>
					Save
				</Button>
			</div>
		);

		return comp;
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
	const handleContentSave = (data) => {
		var bodyFormData = new FormData();
		bodyFormData.append("orderId", dataId);
		bodyFormData.append("authId", access);
		bodyFormData.append("data", JSON.stringify(data));
		return;
		axios({
			method: "post",
			url: setBrazingDetails,
			data: bodyFormData,
			headers: { "Content-Type": "multipart/form-data" },
		})
			.then(function (response) {
				//handle success
				const res_data = response.data;
				console.log(res_data);
				if (res_data.status_code === 200) {
					toast(res_data.status_msg);
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
				console.log(res_data);
				if (res_data.status_code === 200) {
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

	useEffect(() => {
		handleGetLookup();
		handleContentGet(dataId);
	}, [dataId, rowQuantity]);

	/*useEffect(() => {
    BrazingCompCard();
  },[compArray]);*/
	return (
		<div>
			{/* <!-- Modal --> */}
			<div
				className="modal fade"
				id="staticActionBackdrop"
				data-bs-backdrop="static"
				data-bs-keyboard="false"
				tabIndex="-1"
				aria-labelledby="staticBackdropLabel"
				aria-hidden="true"
			>
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-headline" id="staticBackdropLabel">
								Edit Brazing Leak
							</h5>
							<button
								type="button"
								className="btn-close"
								data-bs-dismiss="modal"
								aria-label="Close"
							></button>
						</div>
						<div className="modal-body">
							{/*
              <ButtonGroup variant="contained" aria-label="outlined primary button group">
                  <Button onClick={()=>handleCompCount('add')}><AddIcon /></Button>
                  <Button onClick={()=>handleCompCount('minus')}><RemoveIcon /></Button>
    </ButtonGroup> */}
							{
								<BrazingCompCard
									dataArray={repeat(arr, rowQuantity)}
									returnBrazingData={(data) => {
										handleBrazingData(data);
									}}
								/>
							}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
