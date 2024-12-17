import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import {
	GridRowModes,
	DataGrid,
	GridToolbarContainer,
	GridActionsCellItem,
	GridRowEditStopReasons,
	GridToolbarExport,
} from "@mui/x-data-grid";
import axios from "axios";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";
import { AccessContext } from "../../../constant/accessContext";
import {
	get_wip_fins,
	set_wip_fins,
	del_wip_fins,
} from "../../../constant/url";

const fin_model = ["", "3/8''", "3/8 Blue", "7mm", "1/2''"];
const fin_hole = ["", "156", "163.2", "106.7", "336.9"];

function EditToolbar(props) {
	const { setRows, setRowModesModel } = props;
	const handleClick = () => {
		const id = Date.now();
		setRows((oldRows) => [...oldRows, { id: id, isNew: true }]);
		setRowModesModel((oldModel) => ({
			...oldModel,
			[id]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
		}));
	};

	return (
		<GridToolbarContainer>
			<Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
				Add record
			</Button>
			<GridToolbarExport />
		</GridToolbarContainer>
	);
}

export default function WIP_Fins() {
	const access = React.useContext(AccessContext).authID;
	const [rows, setRows] = React.useState([]);
	const [rowModesModel, setRowModesModel] = React.useState({});

	const handleRowEditStop = (params, event) => {
		if (params.reason === GridRowEditStopReasons.rowFocusOut) {
			event.defaultMuiPrevented = true;
		}
	};

	const handleEditClick = (id) => () => {
		setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
	};

	const handleSaveClick = (id) => () => {
		setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
	};

	const handleDeleteClick = (id) => async () => {
		try {
			await handleDelData(id);
			setRows(rows.filter((row) => row.id !== id));
		} catch (error) {
			console.error("Error updating row:", error);
		}
	};

	const handleCancelClick = (id) => () => {
		setRowModesModel({
			...rowModesModel,
			[id]: { mode: GridRowModes.View, ignoreModifications: true },
		});

		const editedRow = rows.find((row) => row.id === id);
		if (editedRow.isNew) {
			setRows(rows.filter((row) => row.id !== id));
		}
	};

	const processRowUpdate = async (newRow, oldRow) => {
		try {
			await handleSetData(newRow);
		} catch (error) {
			console.error("Error updating row:", error);
		}

		const updatedRow = { ...newRow, isNew: false };
		setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
		return updatedRow;
	};

	const handleRowModesModelChange = (newRowModesModel) => {
		setRowModesModel(newRowModesModel);
	};

	const handleGetData = () => {
		var bodyFormData = new FormData();
		bodyFormData.append("authId", access);
		axios({
			method: "post",
			url: get_wip_fins,
			data: bodyFormData,
			headers: { "Content-Type": "multipart/form-data" },
		})
			.then(function (response) {
				//handle success
				const res_data = response.data;
				if (res_data.status_code === 101) {
					toast("Api Authentication failed. login again.");
				} else if (res_data.status_code === 200) {
					const ret_data_cd = res_data.data;
					if (res_data.data.length > 0) {
						setRows(ret_data_cd);
					}
					toast("Data Retrieved");
				} else {
					console.log(res_data.status_msg);
				}
			})
			.catch(function (response) {
				//handle error
				console.log(response);
			});
	};

	const handleSetData = async (findata) => {
		var bodyFormData = new FormData();
		bodyFormData.append("authId", access);
		bodyFormData.append(
			"id",
			typeof findata?.id === "undefined" ? "" : findata?.id
		);
		bodyFormData.append(
			"length",
			typeof findata?.length === "undefined" ? "" : findata?.length
		);
		bodyFormData.append(
			"height",
			typeof findata?.height === "undefined" ? "" : findata?.height
		);
		bodyFormData.append(
			"rows",
			typeof findata?.rows === "undefined" ? "" : findata?.rows
		);
		bodyFormData.append(
			"model",
			typeof findata?.model === "undefined" ? "" : findata?.model
		);
		bodyFormData.append(
			"fpi",
			typeof findata?.fpi === "undefined" ? "" : findata?.fpi
		);
		bodyFormData.append(
			"comments",
			typeof findata?.comments === "undefined" ? "" : findata?.comments
		);
		bodyFormData.append(
			"gm_holes",
			typeof findata?.gm_holes === "undefined" ? "" : findata?.gm_holes
		);
		bodyFormData.append(
			"age",
			typeof findata?.age === "undefined" ? "" : findata?.age
		);
		bodyFormData.append(
			"weight",
			typeof findata?.weight === "undefined" ? "" : findata?.weight
		);

		await axios({
			method: "post",
			url: set_wip_fins,
			data: bodyFormData,
			headers: { "Content-Type": "multipart/form-data" },
		})
			.then(function (response) {
				//handle success
				const res_data = response.data;
				if (res_data.status_code === 101) {
					toast("Api Authentication failed. login again.");
				} else if (res_data.status_code === 200) {
					const ret_data_cd = res_data.data;
					setRows(ret_data_cd);
					toast("Data is set");
				} else {
					console.log(res_data.status_msg);
				}
			})
			.catch(function (response) {
				//handle error
				console.log(response);
			});
	};

	const handleDelData = async (id) => {
		var bodyFormData = new FormData();
		bodyFormData.append("authId", access);
		bodyFormData.append("id", id);
		await axios({
			method: "post",
			url: del_wip_fins,
			data: bodyFormData,
			headers: { "Content-Type": "multipart/form-data" },
		})
			.then(function (response) {
				//handle success
				const res_data = response.data;
				if (res_data.status_code === 101) {
					toast("Api Authentication failed. login again.");
				} else if (res_data.status_code === 200) {
					toast("Data Deleted");
				} else {
					console.log(res_data.status_msg);
				}
			})
			.catch(function (response) {
				//handle error
				console.log(response);
			});
	};

	const columns = [
		{
			field: "length",
			headerName: "Length",
			width: 180,
			editable: true,
		},
		{
			field: "height",
			headerName: "Height",
			type: "number",
			width: 80,
			align: "left",
			headerAlign: "left",
			editable: true,
		},
		{
			field: "rows",
			headerName: "Rows",
			width: 80,
			editable: true,
		},
		{
			field: "model",
			headerName: "Model",
			width: 120,
			editable: true,
			type: "singleSelect",
			valueOptions: fin_model,
		},
		{
			field: "fpi",
			headerName: "FPI",
			width: 100,
			editable: true,
		},
		{
			field: "comments",
			headerName: "Comments",
			width: 180,
			editable: true,
		},
		{
			field: "gm_holes",
			headerName: "gm/1000 holes",
			width: 120,
			valueGetter: (value) => {
				return fin_hole[fin_model.indexOf(value.row.model)];
			},
		},
		{
			field: "age",
			headerName: "Age",
			width: 80,
			valueGetter: (value) => {
				return moment().diff(value.row.create_dt, "days");
			},
		},
		{
			field: "weight",
			headerName: "Weight",
			width: 120,
			valueGetter: (value) => {
				const gm_holes = fin_hole[fin_model.indexOf(value.row.model)];
				return (
					(((parseFloat(value.row.length) *
						parseFloat(value.row.height) *
						parseFloat(value.row.rows)) /
						1000) *
						parseFloat(gm_holes)) /
					1000
				);
			},
		},
		{
			field: "actions",
			type: "actions",
			headerName: "Actions",
			width: 100,
			cellClassName: "actions",
			getActions: ({ id }) => {
				const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

				if (isInEditMode) {
					return [
						<GridActionsCellItem
							icon={<SaveIcon />}
							label="Save"
							sx={{
								color: "primary.main",
							}}
							onClick={handleSaveClick(id)}
						/>,
						<GridActionsCellItem
							icon={<CancelIcon />}
							label="Cancel"
							className="textPrimary"
							onClick={handleCancelClick(id)}
							color="inherit"
						/>,
					];
				}

				return [
					<GridActionsCellItem
						icon={<EditIcon />}
						label="Edit"
						className="textPrimary"
						onClick={handleEditClick(id)}
						color="inherit"
					/>,
					<GridActionsCellItem
						icon={<DeleteIcon />}
						label="Delete"
						onClick={handleDeleteClick(id)}
						color="inherit"
					/>,
				];
			},
		},
	];
	React.useEffect(() => {
		handleGetData();
	}, []);

	return (
		<Box style={{ marginTop: "105px", width: "100%" }}>
			<ToastContainer />
			<h2 className="text-center">Fin WIP Stock Module</h2>
			<Box
				sx={{
					height: 500,
					width: 1150,
					"& .actions": {
						color: "text.secondary",
					},
					"& .textPrimary": {
						color: "text.primary",
					},
				}}
			>
				<DataGrid
					rows={rows}
					columns={columns}
					editMode="row"
					rowModesModel={rowModesModel}
					onRowModesModelChange={handleRowModesModelChange}
					onRowEditStop={handleRowEditStop}
					processRowUpdate={processRowUpdate}
					slots={{
						toolbar: EditToolbar,
					}}
					slotProps={{
						toolbar: { setRows, setRowModesModel },
					}}
					sx={{
						"& .MuiDataGrid-columnHeader": {
							backgroundColor: "#943612",
							color: "white",
						},
						".MuiDataGrid-row.Mui-odd ": {
							backgroundColor: "#FFE1D6",
						},
						".MuiDataGrid-row.Mui-even ": {
							backgroundColor: "#F2F2F2",
						},
						".MuiDataGrid-row:not(.MuiDataGrid-row--dynamicHeight)>.MuiDataGrid-cell":
							{
								overflow: "visible !important",
								whiteSpace: "break-spaces",
								padding: 0,
								display: "flex",
								justifyContent: "center",
								fontSize: "0.75rem",
							},
						".MuiDataGrid-columnHeaderTitleContainer": {
							display: "flex",
							justifyContent: "center",
							fontSize: "0.75rem",
						},
						"& .MuiDataGrid-columnHeader, .MuiDataGrid-cell": {
							border: ".5px solid white",
						},
						"& .MuiInputBase-input": {
							fontSize: "0.74rem",
							padding: "16.5px 1px ",
						},
					}}
					getRowClassName={(params) => {
						if (params.indexRelativeToCurrentPage % 2 === 0) {
							if (params.row.priority === "true") {
								return "secon-bg";
							} else {
								return "Mui-even";
							}
						} else {
							if (params.row.priority === "true") {
								return "secon-bg";
							} else {
								return "Mui-odd";
							}
						}
					}}
				/>
			</Box>
		</Box>
	);
}
