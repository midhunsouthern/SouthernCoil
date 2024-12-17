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
	get_wip_pipe,
	set_wip_pipe,
	del_wip_pipe,
} from "../../../constant/url";

const pipe_type = [
	"",
	"3/8'' Plain",
	"3/8'' IG",
	"7mm IG",
	"1/2'' Plain",
	"1/2'' Thick",
];
const pipe_gm_m = ["", "72", "82", "57", "125", "198"];
const pipe_model = ["", "Single", "Cross", "Straight"];

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

export default function WIP_Pipe() {
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
			url: get_wip_pipe,
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

	const handleSetData = async (pipdata) => {
		var bodyFormData = new FormData();
		bodyFormData.append("authId", access);
		bodyFormData.append(
			"id",
			typeof pipdata?.id === "undefined" ? "" : pipdata?.id
		);
		bodyFormData.append(
			"pipe_type",
			typeof pipdata?.pipe_type === "undefined" ? "" : pipdata?.pipe_type
		);
		bodyFormData.append(
			"length",
			typeof pipdata?.length === "undefined" ? "" : pipdata?.length
		);
		bodyFormData.append(
			"model",
			typeof pipdata?.model === "undefined" ? "" : pipdata?.model
		);
		bodyFormData.append(
			"quantity",
			typeof pipdata?.quantity === "undefined" ? "" : pipdata?.quantity
		);
		bodyFormData.append(
			"gm_m",
			typeof pipdata?.gm_m === "undefined" ? "" : pipdata?.gm_m
		);
		bodyFormData.append(
			"age",
			typeof pipdata?.age === "undefined" ? "" : pipdata?.age
		);
		bodyFormData.append(
			"weight",
			typeof pipdata?.weight === "undefined" ? "" : pipdata?.weight
		);

		await axios({
			method: "post",
			url: set_wip_pipe,
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
			url: del_wip_pipe,
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
			field: "pipe_type",
			headerName: "Pipe Type",
			width: 180,
			editable: true,
			type: "singleSelect",
			valueOptions: pipe_type,
		},
		{
			field: "length",
			headerName: "Length",
			type: "number",
			width: 80,
			align: "left",
			headerAlign: "left",
			editable: true,
		},
		{
			field: "model",
			headerName: "Model",
			width: 120,
			editable: true,
			type: "singleSelect",
			valueOptions: pipe_model,
		},
		{
			field: "quantity",
			headerName: "Quantity",
			width: 80,
			editable: true,
		},
		{
			field: "gm_m",
			headerName: "gm/m",
			width: 100,
			valueGetter: (value) => {
				return pipe_gm_m[pipe_type.indexOf(value.row.pipe_type)];
			},
		},
		{
			field: "age",
			headerName: "Age",
			width: 80,
			type: "number",
			valueGetter: (value) => {
				return moment().diff(value.row.create_dt, "days");
			},
		},
		{
			field: "weight",
			headerName: "Weight",
			width: 120,
			valueGetter: (value) => {
				const gm_m = pipe_gm_m[pipe_type.indexOf(value.row.pipe_type)];
				return (
					(((parseFloat(value.row.length) * 2 + 1.5) / 39.37) *
						parseFloat(value.row.quantity) *
						parseFloat(gm_m)) /
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
			<h2 className="text-center">Pipe WIP Stock Module</h2>
			<Box
				sx={{
					height: 500,
					width: 850,
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
