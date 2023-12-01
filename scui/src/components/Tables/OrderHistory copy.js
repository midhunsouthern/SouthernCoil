import * as React from "react";
import axios from "axios";
import Moment from "react-moment";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Switch, { SwitchProps } from "@mui/material/Switch";
import {
	Stack,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Dialog,
	DialogTitle,
	DialogActions,
} from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import FilterListIcon from "@mui/icons-material/FilterList";
import { visuallyHidden } from "@mui/utils";
import OrderEditModal from "../modals/OrderEditModal";
import { Button } from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import { AccessContext } from "../../constant/accessContext";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import {
	getOrderHistory,
	setOrderGeneric,
	setOrderHold,
	setOrderDelete,
} from "../../constant/url";
import Slide from "@mui/material/Slide";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import StatusBar from "../modals/StatsBar";
import OrderViewModal from "../modals/OrderViewModal";
import { saveAsExcel } from "../../commonjs/CommonFun";

const IOSSwitch = styled((props) => (
	<Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
	width: 42,
	height: 26,
	padding: 0,
	"& .MuiSwitch-switchBase": {
		padding: 0,
		margin: 2,
		transitionDuration: "300ms",
		"&.Mui-checked": {
			transform: "translateX(16px)",
			color: "#fff",
			"& + .MuiSwitch-track": {
				backgroundColor: theme.palette.mode === "dark" ? "#338eda" : "#338eda",
				opacity: 1,
				border: 0,
			},
			"&.Mui-disabled + .MuiSwitch-track": {
				opacity: 0.5,
			},
		},
		"&.Mui-focusVisible .MuiSwitch-thumb": {
			color: "#338eda",
			border: "6px solid #fff",
		},
		"&.Mui-disabled .MuiSwitch-thumb": {
			color:
				theme.palette.mode === "light"
					? theme.palette.grey[100]
					: theme.palette.grey[600],
		},
		"&.Mui-disabled + .MuiSwitch-track": {
			opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
		},
	},
	"& .MuiSwitch-thumb": {
		boxSizing: "border-box",
		width: 18,
		height: 18,
	},
	"& .MuiSwitch-track": {
		borderRadius: 26 / 2,
		width: 38,
		height: 23,
		backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
		opacity: 1,
		transition: theme.transitions.create(["background-color"], {
			duration: 500,
		}),
	},
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
	[`&.${tableCellClasses.head}`]: {
		backgroundColor: theme.palette.common.black,
		color: theme.palette.common.white,
	},
	[`&.${tableCellClasses.body}`]: {
		fontSize: 14,
	},
}));

function descendingComparator(a, b, orderBy) {
	if (b[orderBy] < a[orderBy]) {
		return -1;
	}
	if (b[orderBy] > a[orderBy]) {
		return 1;
	}
	return 0;
}

function getComparator(order, orderBy) {
	return order === "desc"
		? (a, b) => descendingComparator(a, b, orderBy)
		: (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
	const stabilizedThis = array.map((el, index) => [el, index]);
	stabilizedThis.sort((a, b) => {
		const order = comparator(a[0], b[0]);
		if (order !== 0) {
			return order;
		}
		return a[1] - b[1];
	});
	return stabilizedThis.map((el) => el[0]);
}

const headCells = [
	{
		id: "oderno",
		numeric: false,
		disablePadding: true,
		label: "Order No",
	},
	{
		id: "date",
		numeric: true,
		disablePadding: false,
		label: "Order Date",
	},
	{
		id: "custname",
		numeric: true,
		disablePadding: false,
		label: "Customer Name",
	},
	{
		id: "size",
		numeric: true,
		disablePadding: false,
		label: "Size",
	},
	{
		id: "sq_ft",
		numeric: true,
		disablePadding: false,
		label: "Sq Feet",
	},
	{
		id: "status",
		numeric: true,
		disablePadding: false,
		label: "Status",
	},
	{
		id: "Action",
		label: "Action",
	},
];

function EnhancedTableHead(props) {
	const {
		onSelectAllClick,
		order,
		orderBy,
		numSelected,
		rowCount,
		onRequestSort,
	} = props;
	const createSortHandler = (property) => (event) => {
		onRequestSort(event, property);
	};

	return (
		<TableHead>
			<TableRow>
				{headCells.map((headCell) => (
					<TableCell
						sx={{ color: "grey" }}
						key={headCell.id}
						align={"center"}
						padding={headCell.disablePadding ? "none" : "normal"}
						sortDirection={orderBy === headCell.id ? order : false}
					>
						<TableSortLabel
							active={orderBy === headCell.id}
							direction={orderBy === headCell.id ? order : "asc"}
							onClick={createSortHandler(headCell.id)}
						>
							{headCell.label}
							{orderBy === headCell.id ? (
								<Box component="span" sx={visuallyHidden}>
									{order === "desc" ? "sorted descending" : "sorted ascending"}
								</Box>
							) : null}
						</TableSortLabel>
					</TableCell>
				))}
			</TableRow>
		</TableHead>
	);
}

function EnhancedTableToolbar(props) {
	return (
		<Toolbar
			sx={{
				pl: { sm: 2 },
				pr: { xs: 1, sm: 1 },
			}}
		>
			<Typography
				sx={{ flex: "1 1 100%" }}
				variant="h6"
				id="tableTitle"
				component="div"
			>
				Order History
			</Typography>
			<Tooltip title="Download Excel list">
				<IconButton color="info" onClick={() => saveAsExcel(props.orderList)}>
					<DownloadIcon />
				</IconButton>
			</Tooltip>
		</Toolbar>
	);
}

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function OrderHistory() {
	const navigate = useNavigate();
	const access = React.useContext(AccessContext).authID;
	const [order, setOrder] = React.useState("asc");
	const [orderBy, setOrderBy] = React.useState("calories");
	const [selected, setSelected] = React.useState([]);
	const [selectedRowId, setSelectedRowId] = React.useState(null);
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(10000);
	const [orderList, setOrderList] = React.useState([]);
	const [isUpdated, setIsUpdate] = React.useState(false);
	const [isEdit, setIsEdit] = React.useState(false);
	const [selEvent, setSelEvent] = React.useState({
		target: { name: "", checked: null },
	});
	const [openStatusCnf, setOpenStatusCnf] = React.useState(false);
	const [openProgressBardialog, setOpenProgressBardialog] =
		React.useState(false);

	const handleClickOpenStatus = (rowId, e) => {
		setSelectedRowId(rowId);
		setSelEvent(e);
		setOpenStatusCnf(true);
	};

	const handleCloseStatus = (response) => {
		if (response === "yes") {
			if (selEvent.target.name === "delete") {
				handleOrderDelete(selectedRowId);
			} else {
				handleGeneric(selectedRowId, selEvent);
			}
		}
		setOpenStatusCnf(false);
	};

	const handleRequestSort = (event, property) => {
		const isAsc = orderBy === property && order === "asc";
		setOrder(isAsc ? "desc" : "asc");
		setOrderBy(property);
	};

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const isSelected = (name) => selected.indexOf(name) !== -1;
	const emptyRows =
		page > 0 ? Math.max(0, (1 + page) * rowsPerPage - orderList.length) : 0;

	const handleSize = (length, height, row, quantity) => {
		const len = length === null ? 0 : length;
		const heig = height === null ? 0 : height;
		const rowval = row === null ? 0 : row;
		const qty = quantity === null ? 0 : quantity;

		return (
			String(len) +
			" x " +
			String(heig) +
			" x " +
			String(rowval) +
			"R - " +
			String(qty)
		);
	};

	const handleOrderList = (authID) => {
		var bodyFormData = new FormData();
		bodyFormData.append("authId", authID);
		axios({
			method: "post",
			url: getOrderHistory,
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
				} else {
					console.log(res_data.status_msg);
				}
			})
			.catch(function (response) {
				//handle error
				console.log(response);
			});
		setIsUpdate(false);
	};

	const handleGeneric = (rowId, eTarget) => {
		const { name, checked } = {
			name: eTarget.target.name,
			checked: eTarget.target.checked ? false : true,
		};
		var editData;
		if (name.includes("status")) {
			editData = orderList.splice(
				orderList.findIndex((item) => item.id === rowId),
				1
			);
		} else {
			editData = orderList.map((item) =>
				item.id === rowId && name ? { ...item, [name]: String(checked) } : item
			);
			setOrderList(editData);
		}
		handleGenericUpdate(rowId, name, String(checked));
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
					toast(res_data.status_msg);
					return true;
					//return data
				} else {
					toast(res_data.status_msg);
					return false;
				}
			})
			.catch(function (response) {
				//handle error
				console.log(response);
			});
	};

	const handleOrderDelete = (rowid) => {
		var bodyFormData = new FormData();
		bodyFormData.append("authId", access);
		bodyFormData.append("id", rowid);
		axios({
			method: "post",
			url: setOrderDelete,
			data: bodyFormData,
			headers: { "Content-Type": "multipart/form-data" },
		})
			.then(function (response) {
				//handle success
				const res_data = response.data;
				console.log(res_data);
				if (res_data.status_code === 101) {
					toast("Api Authentication failed. login again.");
				} else if (res_data.status_code === 200) {
					handleOrderList(access);
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

	React.useEffect(() => {
		handleOrderList(access);
	}, []);

	React.useEffect(() => {
		if (isUpdated) {
			handleOrderList(access);
		}
	}, [isUpdated]);
	return (
		<div>
			<main className="main pt-0">
				<div className="content">
					<ToastContainer />
					<div className="row">
						<div className="col-12">
							<div className="card shadow-card glass-card">
								<div className="card-body">
									<Box sx={{ width: "100%" }}>
										<Paper sx={{ width: "100%", mb: 2, boxShadow: "none" }}>
											<EnhancedTableToolbar
												numSelected={selected.length}
												orderList={orderList}
											/>
											<TableContainer>
												<Table
													stickyHeader
													sx={{ boxShadow: "none", border: 0 }}
													aria-labelledby="tableTitle"
												>
													<EnhancedTableHead
														numSelected={selected.length}
														order={order}
														className="text-secondary"
														orderBy={orderBy}
														onRequestSort={handleRequestSort}
														rowCount={orderList.length}
													/>
													<TableBody>
														{stableSort(
															orderList,
															getComparator(order, orderBy)
														)
															.slice(
																page * rowsPerPage,
																page * rowsPerPage + rowsPerPage
															)
															.map((row, index) => {
																const isItemSelected = isSelected(row.name);
																const labelId = `enhanced-table-checkbox-${index}`;
																const d = row.order_date;
																return (
																	<TableRow
																		hover
																		aria-checked={isItemSelected}
																		tabIndex={-1}
																		key={row.id}
																		selected={isItemSelected}
																	>
																		<TableCell align="center">
																			<Button
																				data-bs-toggle="modal"
																				data-bs-target="#staticOrderViewBackdrop"
																				onClick={() => {
																					setSelectedRowId(row.id);
																					setIsEdit(false);
																				}}
																				color="info"
																			>
																				{row.order_id}{" "}
																			</Button>
																		</TableCell>
																		<TableCell align="center">
																			<Moment format="D MMM" parse="D/MM/YYYY">
																				{row.order_date}
																			</Moment>
																		</TableCell>
																		<TableCell align="center">
																			{row.full_customer_name}
																		</TableCell>
																		<TableCell align="center">
																			{handleSize(
																				row.length,
																				row.height,
																				row.rows,
																				row.quantity
																			)}
																		</TableCell>
																		<TableCell align="center">
																			{row.sq_feet}
																		</TableCell>
																		<TableCell align="center">
																			<IconButton
																				onClick={() => {
																					setSelectedRowId(row);
																					setOpenProgressBardialog(true);
																				}}
																				style={{ position: "relative" }}
																			>
																				<StatusBar
																					statusData={row}
																					source="Table"
																				/>
																			</IconButton>
																		</TableCell>
																		<TableCell>
																			<Tooltip title="Delete">
																				<IconButton
																					onClick={() =>
																						navigate("/createOrder", {
																							state: { orderRowid: row.id },
																						})
																					}
																					name="delete"
																					color="success"
																				>
																					<HistoryEduIcon />
																				</IconButton>
																			</Tooltip>
																		</TableCell>
																	</TableRow>
																);
															})}
														{emptyRows > 0 && (
															<TableRow>
																<TableCell colSpan={6} />
															</TableRow>
														)}
													</TableBody>
												</Table>
											</TableContainer>
										</Paper>
									</Box>
								</div>
							</div>
						</div>
					</div>
				</div>
			</main>
			<OrderEditModal
				orderId={selectedRowId}
				isUpdate={(status) => setIsUpdate(status)}
				isEdit={isEdit}
			/>
			<OrderViewModal orderId={selectedRowId} />
			<Dialog
				open={openStatusCnf}
				TransitionComponent={Transition}
				keepMounted
				onClose={handleCloseStatus}
				aria-describedby="alert-dialog-slide-description"
			>
				<DialogTitle>{"Do you want to update the order?"}</DialogTitle>
				<DialogActions>
					<Button onClick={() => handleCloseStatus("no")}>No</Button>
					<Button onClick={() => handleCloseStatus("yes")}>Yes</Button>
				</DialogActions>
			</Dialog>

			<Dialog
				open={openProgressBardialog}
				TransitionComponent={Transition}
				keepMounted
				onClose={() => setOpenProgressBardialog(false)}
				aria-describedby="alert-dialog-slide-description"
			>
				<div
					style={{
						width: "600px",
						marginTop: "10px",
						display: "flex",
						justifyContent: "center",
					}}
				>
					<StatusBar statusData={selectedRowId} source="Dialog" />
				</div>
				<DialogActions>
					<Button onClick={() => setOpenProgressBardialog(false)}>Close</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
