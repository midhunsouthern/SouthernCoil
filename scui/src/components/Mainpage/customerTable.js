import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import CreateRoundedIcon from "@mui/icons-material/CreateRounded";
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
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import { visuallyHidden } from "@mui/utils";
import CustomerModal from "../modals/CustomerModal";
import { AccessContext } from "../../constant/accessContext";
import { getCustomersDataAll, delCustomersData } from "../../constant/url";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
	[`&.${tableCellClasses.head}`]: {
		backgroundColor: theme.palette.common.black,
		color: theme.palette.common.white,
	},
	[`&.${tableCellClasses.body}`]: {
		fontSize: 14,
	},
}));
function createData(name, email, contact, address, actions) {
	return {
		name,
		email,
		contact,
		address,
		actions,
	};
}

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
		id: "name",
		numeric: false,
		disablePadding: true,
		label: "Name",
	},
	{
		id: "email",
		numeric: true,
		disablePadding: false,
		label: "Email",
	},
	{
		id: "phone",
		numeric: true,
		disablePadding: false,
		label: "Phone",
	},
	{
		id: "contact",
		numeric: true,
		disablePadding: false,
		label: "Point of Contact",
	},
	{
		id: "address",
		numeric: true,
		disablePadding: false,
		label: "Address",
	},
	{
		id: "actions",
		numeric: true,
		disablePadding: false,
		label: "Actions",
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
				<TableCell></TableCell>

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
				Manage Customer
			</Typography>
			{/* <Tooltip title="Filter list">
				<IconButton>
					<FilterListIcon />
				</IconButton>
			</Tooltip> */}
		</Toolbar>
	);
}

export default function CustomerTable() {
	const access = useContext(AccessContext).authID;
	const [order, setOrder] = React.useState("asc");
	const [orderBy, setOrderBy] = React.useState("calories");
	const [selected, setSelected] = React.useState([]);
	const [selectedRowId, setSelectedRowId] = React.useState([]);
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(5);
	const [customerNameList, setCustomerNameList] = useState([]);
	const [isUpdated, setIsUpdate] = useState(false);

	const handleRequestSort = (event, property) => {
		const isAsc = orderBy === property && order === "asc";
		setOrder(isAsc ? "desc" : "asc");
		setOrderBy(property);
	};

	const handleCustomerDelete = (rowId) => {
		var bodyFormData = new FormData();
		bodyFormData.append("authId", access);
		bodyFormData.append("id", rowId);

		axios({
			method: "post",
			url: delCustomersData,
			data: bodyFormData,
			headers: { "Content-Type": "multipart/form-data" },
		})
			.then(function (response) {
				//handle success
				const res_data = response.data;
				if (res_data.status_code === 101) {
					toast("Api Aithentication failed. login again.");
				} else if (res_data.status_code === 200) {
					toast(res_data.status_msg, "success");
					setIsUpdate(true);
				} else {
					console.log(res_data.status_msg);
				}
			})
			.catch(function (response) {
				//handle error
				console.log(response);
			});
	};

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const isSelected = (name) => selected.indexOf(name) !== -1;

	// Avoid a layout jump when reaching the last page with empty rows.
	const emptyRows =
		page > 0
			? Math.max(0, (1 + page) * rowsPerPage - customerNameList.length)
			: 0;

	const handleCustomerList = (authID) => {
		var bodyFormData = new FormData();
		bodyFormData.append("authId", authID);

		axios({
			method: "post",
			url: getCustomersDataAll,
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

	React.useEffect(() => {
		handleCustomerList(access);
	}, []);
	React.useEffect(() => {
		if (isUpdated) {
			handleCustomerList(access);
			setIsUpdate(false);
		}
	}, [isUpdated]);
	return (
		<div style={{ marginTop: "105px", width: "100%" }}>
			<main className="main pt-0">
				<div className="content">
					<ToastContainer />
					<div className="row">
						<div className="col-12">
							<div className="card shadow-card glass-card">
								<div className="card-body">
									<Box sx={{ width: "100%" }}>
										<Paper sx={{ width: "100%", mb: 2, boxShadow: "none" }}>
											<EnhancedTableToolbar numSelected={selected.length} />
											<TableContainer sx={{ maxHeight: "100%" }}>
												<Table
													stickyHeader
													sx={{ minWidth: 750, boxShadow: "none", border: 0 }}
													aria-labelledby="tableTitle"
												>
													<EnhancedTableHead
														numSelected={selected.length}
														order={order}
														className="text-secondary"
														orderBy={orderBy}
														onRequestSort={handleRequestSort}
														rowCount={customerNameList.length}
													/>
													<TableBody>
														{stableSort(
															customerNameList,
															getComparator(order, orderBy)
														)
															.slice(
																page * rowsPerPage,
																page * rowsPerPage + rowsPerPage
															)
															.map((row, index) => {
																const isItemSelected = isSelected(row.name);
																const labelId = `enhanced-table-checkbox-${index}`;
																return (
																	<TableRow
																		hover
																		aria-checked={isItemSelected}
																		tabIndex={-1}
																		key={customerNameList.fname}
																		selected={isItemSelected}
																	>
																		<TableCell padding="checkbox"></TableCell>
																		<TableCell align="center" id={labelId}>
																			{row.fname}
																		</TableCell>
																		<TableCell align="center">
																			{row.email}
																		</TableCell>
																		<TableCell align="center">
																			{row.phone}
																		</TableCell>
																		<TableCell align="center">
																			{row.poc}
																		</TableCell>
																		<TableCell align="center">
																			{row.address}
																		</TableCell>
																		<TableCell align="center">
																			<Tooltip title="Edit" color="info">
																				<IconButton
																					data-bs-toggle="modal"
																					data-bs-target="#staticBackdrop"
																					onClick={() =>
																						setSelectedRowId(row.id)
																					}
																				>
																					<CreateRoundedIcon />
																				</IconButton>
																			</Tooltip>
																			<Tooltip title="Delete">
																				<IconButton
																					onClick={() =>
																						handleCustomerDelete(row.id)
																					}
																					color="error"
																				>
																					<DeleteIcon />
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
											<TablePagination
												rowsPerPageOptions={[5, 10, 25]}
												component="div"
												count={customerNameList.length}
												rowsPerPage={rowsPerPage}
												page={page}
												onPageChange={handleChangePage}
												onRowsPerPageChange={handleChangeRowsPerPage}
											/>
										</Paper>
									</Box>
								</div>
							</div>
						</div>
					</div>
				</div>
			</main>
			<CustomerModal
				custId={selectedRowId}
				isUpdate={(status) => setIsUpdate(status)}
			/>
		</div>
	);
}
