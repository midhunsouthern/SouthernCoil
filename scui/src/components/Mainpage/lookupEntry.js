import * as React from "react";
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import { useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {
	Container,
	TextField,
	Card,
	Button,
	TableContainer,
	Table,
	TableHead,
	TableCell,
	TableBody,
	TableRow,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Modal,
} from "@mui/material";
import axios from "axios";
import { AccessContext } from "../../constant/accessContext";
import {
	getLookupData,
	setLookupData,
	delLookupData,
} from "../../constant/url";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import CreateRoundedIcon from "@mui/icons-material/CreateRounded";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`full-width-tabpanel-${index}`}
			aria-labelledby={`full-width-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box sx={{ p: 3 }}>
					<Typography component={"div"}>{children}</Typography>
				</Box>
			)}
		</div>
	);
}

TabPanel.propTypes = {
	children: PropTypes.node,
	index: PropTypes.number.isRequired,
	value: PropTypes.number.isRequired,
};

function a11yProps(index) {
	return {
		id: `full-width-tab-${index}`,
		"aria-controls": `full-width-tabpanel-${index}`,
	};
}
const style = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 400,
	bgcolor: "background.paper",
	border: "2px solid #000",
	boxShadow: 24,
	p: 4,
};

export default function LookupEntry() {
	const access = React.useContext(AccessContext).authID;
	const theme = useTheme();
	const [value, setValue] = React.useState(0);
	const [lookUpList, setLookupList] = React.useState([]);
	const [lkpCat, setLkpCat] = React.useState("pipeType");
	const [editValue, setEditValue] = React.useState("");
	const [editSubValue, setEditSubValue] = React.useState("");
	const [selectedRowId, setSelectedRowId] = React.useState([]);

	const handleChange = (event, newValue) => {
		setValue(newValue);
		setLkpCat(event.target.name);
	};

	const handleChangeIndex = (index) => {
		setValue(index);
	};

	function TabContent(props) {
		const index = props.index;
		const [value, setValue] = React.useState("");
		const [subValue, setSubValue] = React.useState("");

		const lkpList = lookUpList[lkpCat];
		return (
			<Card id={"card" + index}>
				<div id={"main" + index}>
					<h3 id={"h3" + index}>Add look up value</h3>
					<div id={"body-div" + index} className="row">
						{lkpCat !== "coverDetail" && (
							<div id={"lkuvaluediv" + index} className="col-4">
								<TextField
									label="Look up Value"
									key={"lkpvalue" + index}
									name="lkpvalue"
									autoComplete="lkpvalue"
									required
									fullWidth
									value={value}
									onChange={(e) => {
										setValue(e.target.value);
									}}
								/>
							</div>
						)}
						{lkpCat === "coverDetail" && (
							<div id={"divrow " + index} className="row">
								<div id={"card" + index} className="col-4">
									<FormControl fullWidth>
										<InputLabel id="coverType-label">Cover Type</InputLabel>
										<Select
											labelId="coverType-label"
											id={"coverType-select" + index}
											label="Cover Type"
											value={value}
											onChange={(event) => setValue(event.target.value)}
											key={"ct" + index}
										>
											{lookUpList["coverType"]?.map((item) => {
												return (
													<MenuItem value={item.id}>{item.lkp_value}</MenuItem>
												);
											})}
										</Select>
									</FormControl>
								</div>
								<div className="col-4">
									<TextField
										label="Sub Look up Value"
										key={"sublkpvalue" + index}
										name="lkpvalue"
										autoComplete="lkpvalue"
										required
										fullWidth
										value={subValue}
										onChange={(e) => {
											setSubValue(e.target.value);
										}}
									/>
								</div>
							</div>
						)}
						<div className="col-4">
							<Button
								type="submit"
								key={"btn" + index}
								variant="contained"
								id={"button" + index}
								onClick={() => handleSubmit(value, subValue)}
							>
								Update
							</Button>
						</div>
					</div>
					<div className="mt-2">
						<TableContainer>
							<Table>
								<TableHead>
									<TableRow>
										<TableCell>Lookup Name</TableCell>
										{lkpCat === "coverDetail" && (
											<TableCell>Sub Lookup Name</TableCell>
										)}
										<TableCell>Action</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{lkpList?.map((item) => {
										return (
											<TableRow>
												<TableCell>{item.lkp_value}</TableCell>
												{lkpCat === "coverDetail" && (
													<TableCell>{item.sublkp_val}</TableCell>
												)}
												<TableCell>
													<Tooltip
														title="Edit"
														id={"tooledit" + index + "-" + item.id}
														color="info"
													>
														<IconButton
															id={"edit-button" + index + "-" + item.id}
															data-bs-toggle="modal"
															data-bs-target="#staticBackdrop"
															key={"icbtnedit" + index}
															onClick={() => {
																setSelectedRowId(item.id);
																setEditValue(item.lkp_value);
																setEditSubValue(item.sublkp_val);
															}}
														>
															<CreateRoundedIcon />
														</IconButton>
													</Tooltip>
													<Tooltip
														title="Delete"
														id={"tooldelete" + index + "-" + item.id}
													>
														<IconButton
															color="error"
															onClick={() => handleDelete(item.id)}
															key={"icbtndel" + index}
														>
															<DeleteIcon />
														</IconButton>
													</Tooltip>
												</TableCell>
											</TableRow>
										);
									})}
								</TableBody>
							</Table>
						</TableContainer>
					</div>
				</div>
			</Card>
		);
	}

	const handleSubmit = (lkpValue, subLkpValue, lkpid) => {
		if (lkpValue === "" || lkpValue === "undefined") {
			return false;
		}
		var bodyFormData = new FormData();

		bodyFormData.append("authId", access);
		bodyFormData.append("category", lkpCat);
		bodyFormData.append("lkp_value", lkpValue);
		bodyFormData.append("sublkp_val", subLkpValue);
		bodyFormData.append("lkpId", lkpid);

		/**add photos */
		axios({
			method: "post",
			url: setLookupData,
			data: bodyFormData,
			headers: { "Content-Type": "multipart/form-data" },
		})
			.then(function (response) {
				//handle success
				const res_data = response.data;
				if (res_data.status_code === 200) {
					toast(res_data.status_msg, "success");
					handleGetLookup();
					//return data
				} else {
					console.log(res_data.status_msg);
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

	function handleDelete(deleteId) {
		var bodyFormData = new FormData();
		console.log(access);
		bodyFormData.append("authId", access);
		bodyFormData.append("id", deleteId);

		/**add photos */
		axios({
			method: "post",
			url: delLookupData,
			data: bodyFormData,
			headers: { "Content-Type": "multipart/form-data" },
		})
			.then(function (response) {
				//handle success
				const res_data = response.data;
				console.log(res_data);
				if (res_data.status_code === 200) {
					toast(res_data.status_msg, "success");
					setLookupList(res_data);
					handleGetLookup();
				} else {
					console.log(res_data.status_msg);
				}
			})
			.catch(function (response) {
				//handle error
				console.log(response);
			});
	}

	React.useEffect(() => {
		handleGetLookup();
	}, []);

	return (
		<>
			<Container style={{ marginTop: "105px", width: "100%" }}>
				<ToastContainer />
				<Box
					sx={{ bgcolor: "background.paper" }}
					style={{ marginTop: "105px", width: "100%" }}
				>
					<AppBar position="static">
						<Tabs
							value={value}
							onChange={handleChange}
							indicatorColor="secondary"
							textColor="inherit"
							variant="scrollable"
							allowScrollButtonsMobile
							aria-label="full width tabs example"
						>
							<Tab label="Pipe Type" name="pipeType" {...a11yProps(0)} />
							<Tab
								label="Expansion Type"
								name="expansionType"
								{...a11yProps(1)}
							/>
							{/*<Tab label="Pipe Bend" name="pipeBend" {...a11yProps(2)}/>*/}
							<Tab
								label="End Plate Material"
								name="epMaterial"
								{...a11yProps(2)}
							/>
							<Tab label="End Plate Model" name="epModal" {...a11yProps(3)} />
							<Tab label="Orientation" name="oreientation" {...a11yProps(4)} />
							<Tab label="Cover Type" name="coverType" {...a11yProps(5)} />
							<Tab label="Cover Detail" name="coverDetail" {...a11yProps(6)} />
							<Tab
								label="Circuit Model"
								name="circuitModel"
								{...a11yProps(7)}
							/>
							<Tab label="Liquid Line" name="liquidLine" {...a11yProps(8)} />
							<Tab
								label="Discharge Line"
								name="dischargeLine"
								{...a11yProps(9)}
							/>
							<Tab label="Paint Type" name="paintType" {...a11yProps(10)} />
							<Tab label="Packing Type" name="packingType" {...a11yProps(11)} />
							<Tab
								label="Dispatch Mode"
								name="dispatchMode"
								{...a11yProps(12)}
							/>
							<Tab
								label="Brazing Lookup"
								name="brazingLkp"
								{...a11yProps(13)}
							/>
						</Tabs>
					</AppBar>
					<SwipeableViews
						axis={theme.direction === "rtl" ? "x-reverse" : "x"}
						index={value}
						onChangeIndex={handleChangeIndex}
					>
						<TabPanel value={value} index={0} dir={theme.direction}>
							<TabContent dataList={lookUpList} index={0} />
						</TabPanel>
						<TabPanel value={value} index={1} dir={theme.direction}>
							<TabContent dataList={lookUpList} index={1} />
						</TabPanel>
						<TabPanel value={value} index={2} dir={theme.direction}>
							<TabContent dataList={lookUpList} index={2} />
						</TabPanel>
						<TabPanel value={value} index={3} dir={theme.direction}>
							<TabContent dataList={lookUpList} index={3} />
						</TabPanel>
						<TabPanel value={value} index={4} dir={theme.direction}>
							<TabContent dataList={lookUpList} index={4} />
						</TabPanel>
						<TabPanel value={value} index={5} dir={theme.direction}>
							<TabContent dataList={lookUpList} index={5} />
						</TabPanel>
						<TabPanel value={value} index={6} dir={theme.direction}>
							<TabContent dataList={lookUpList} index={6} />
						</TabPanel>
						<TabPanel value={value} index={7} dir={theme.direction}>
							<TabContent dataList={lookUpList} index={7} />
						</TabPanel>
						<TabPanel value={value} index={8} dir={theme.direction}>
							<TabContent dataList={lookUpList} index={8} />
						</TabPanel>
						<TabPanel value={value} index={9} dir={theme.direction}>
							<TabContent dataList={lookUpList} index={9} />
						</TabPanel>
						<TabPanel value={value} index={10} dir={theme.direction}>
							<TabContent dataList={lookUpList} index={10} />
						</TabPanel>
						<TabPanel value={value} index={11} dir={theme.direction}>
							<TabContent dataList={lookUpList} index={11} />
						</TabPanel>
						<TabPanel value={value} index={12} dir={theme.direction}>
							<TabContent dataList={lookUpList} index={12} />
						</TabPanel>
						<TabPanel value={value} index={13} dir={theme.direction}>
							<TabContent dataList={lookUpList} index={13} />
						</TabPanel>
					</SwipeableViews>
				</Box>
				<div
					className="modal modal-lg fade"
					id="staticBackdrop"
					data-bs-backdrop="static"
					data-bs-keyboard="false"
					aria-labelledby="staticBackdropLabel"
					aria-hidden="true"
				>
					<div className="modal-dialog">
						<div className="modal-content">
							<div className="modal-header">
								<h5 className="modal-headline" id="staticBackdropLabel">
									Edit Look Up Data
								</h5>
								<button
									type="button"
									className="btn-close"
									data-bs-dismiss="modal"
									aria-label="Close"
								></button>
							</div>
							<div className="modal-body">
								<Container>
									<Card>
										<h3>Update look up value</h3>
										<div className="row">
											{lkpCat !== "coverDetail" && (
												<div className="col-4">
													<TextField
														label="Look up Value"
														id="lkpvalue"
														name="lkpvalue"
														autoComplete="lkpvalue"
														required
														fullWidth
														value={editValue}
														onChange={(e) => {
															setEditValue(e.target.value);
														}}
													/>
												</div>
											)}
											{lkpCat === "coverDetail" && (
												<div className="row">
													<div className="col-4">
														<FormControl fullWidth>
															<InputLabel id="coverType-label">
																Cover Type
															</InputLabel>
															<Select
																labelId="coverType-label"
																id="coverType-select"
																label="Cover Type"
																value={editValue}
																onChange={(event) =>
																	setEditValue(event.target.value)
																}
															>
																{lookUpList["coverType"]?.map((item) => {
																	return (
																		<MenuItem value={item.id}>
																			{item.lkp_value}
																		</MenuItem>
																	);
																})}
															</Select>
														</FormControl>
													</div>
													<div className="col-4">
														<TextField
															label="Sub Look up Value"
															id="lkpvalue"
															name="lkpvalue"
															autoComplete="lkpvalue"
															required
															fullWidth
															value={editSubValue}
															onChange={(e) => setEditSubValue(e.target.value)}
														/>
													</div>
												</div>
											)}
											<div className="col-4">
												<Button
													type="submit"
													variant="contained"
													onClick={() =>
														handleSubmit(editValue, editSubValue, selectedRowId)
													}
												>
													Update
												</Button>
											</div>
										</div>
									</Card>
								</Container>
							</div>
						</div>
					</div>
				</div>
			</Container>
		</>
	);
}
