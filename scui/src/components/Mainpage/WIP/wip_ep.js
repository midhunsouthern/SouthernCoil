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
import { get_wip_ep, set_wip_ep, del_wip_ep } from "../../../constant/url";

const ep_model = ["", "WP", "PP", "EP"];
const ep_orientation = ["", "RH", "LH"];
const ep_material = [
	"",
	"GI 1.6mm",
	"GI 1.2mm",
	"AL 2mm",
	"AL 1.5mm",
	"SS 1.2mm",
];
const ep_gm_sq = [0, 6.1, 5.4, 3.5, 2.6, 6.4];
const ep_type = ["7mm", '3/8"', '1/2"'];

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

export default function WIP_EP() {
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
			url: get_wip_ep,
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

	const handleSetData = async (epdata) => {
		var bodyFormData = new FormData();
		bodyFormData.append("authId", access);
		bodyFormData.append(
			"id",
			typeof epdata?.id === "undefined" ? "" : epdata?.id
		);
		bodyFormData.append(
			"customer_name",
			typeof epdata?.customer_name === "undefined" ? "" : epdata?.customer_name
		);
		bodyFormData.append(
			"height",
			typeof epdata?.height === "undefined" ? "" : epdata?.height
		);
		bodyFormData.append(
			"type",
			typeof epdata?.type === "undefined" ? "" : epdata?.type
		);
		bodyFormData.append(
			"rows",
			typeof epdata?.rows === "undefined" ? "" : epdata?.rows
		);
		bodyFormData.append(
			"model",
			typeof epdata?.model === "undefined" ? "" : epdata?.model
		);
		bodyFormData.append(
			"orientation",
			typeof epdata?.orientation === "undefined" ? "" : epdata?.orientation
		);
		bodyFormData.append(
			"material",
			typeof epdata?.material === "undefined" ? "" : epdata?.material
		);
		bodyFormData.append(
			"quantity",
			typeof epdata?.quantity === "undefined" ? "" : epdata?.quantity
		);
		bodyFormData.append(
			"comments",
			typeof epdata?.comments === "undefined" ? "" : epdata?.comments
		);
		bodyFormData.append(
			"gm_sq_inch",
			typeof epdata?.gm_sq_inch === "undefined" ? "" : epdata?.gm_sq_inch
		);
		bodyFormData.append(
			"age",
			typeof epdata?.age === "undefined" ? "" : epdata?.age
		);
		bodyFormData.append(
			"weight",
			typeof epdata?.weight === "undefined" ? "" : epdata?.weight
		);

		await axios({
			method: "post",
			url: set_wip_ep,
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
			url: del_wip_ep,
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
			field: "customer_name",
			headerName: "Customer Name (or) EP Model",
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
			field: "type",
			headerName: "Type",
			width: 120,
			editable: true,
			type: "singleSelect",
			valueOptions: ep_type,
			default: "",
		},
		{
			field: "model",
			headerName: "Model",
			width: 80,
			editable: true,
			type: "singleSelect",
			valueOptions: ep_model,
			default: "",
		},
		{
			field: "orientation",
			headerName: "Orientation",
			width: 100,
			editable: true,
			type: "singleSelect",
			valueOptions: ep_orientation,
			default: "",
		},
		{
			field: "material",
			headerName: "Material",
			width: 180,
			editable: true,
			type: "singleSelect",
			valueOptions: ep_material,
		},
		{
			field: "quantity",
			headerName: "Quantity",
			width: 80,
			editable: true,
			type: "number",
		},
		{
			field: "comments",
			headerName: "Comments",
			width: 220,
			editable: true,
		},
		{
			field: "gm_sq_inch",
			headerName: "gm/sq.inch",
			width: 90,
			valueGetter: (value) => {
				return ep_gm_sq[ep_material.indexOf(value.row.material)];
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
				const gm_sq = ep_gm_sq[ep_material.indexOf(value.row.material)];
				return (
					((parseFloat(value.row.height) + 2) *
						(parseFloat(value.row.rows) + 2) *
						parseFloat(value.row.quantity) *
						parseFloat(gm_sq)) /
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
			<h2 className="text-center">End Plate WIP Stock Module</h2>
			<Box
				sx={{
					height: 500,
					width: 1510,
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
