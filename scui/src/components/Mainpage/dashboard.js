import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import axios from "axios";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

import { dashboardGraphData } from "../../constant/url";
import { AccessContext } from "../../constant/accessContext";

import PendingSqPie from "../Component/graph/pendingSqPie";
import PendingGroupedSqPie from "../Component/graph/pendingSqPie";
import LastModuleWiseLine from "../Component/graph/lastModuleWiseLine";
import LastModuleOverAllLine from "../Component/graph/lastModuleOverAllLine";

export default function Dashboard() {
	const access = React.useContext(AccessContext).authID;
	const [pendingSqPie, setPendingSqPie] = React.useState({
		label: [],
		data: [],
	});
	const [pendingGroupedSqPie, setPendingGroupedSqPie] = React.useState({
		label: [],
		data: [],
	});
	const [lastModuleWiseSQLine, setLastModuleWiseSQLine] = React.useState({
		label: [],
		data: [],
		allData: [],
	});
	const [lastModuleOverAllSQLine, setLastModuleOverAllSQLine] = React.useState({
		label: [],
		data: [],
	});

	const [summaryData, setSummaryData] = React.useState({
		live_order: 0,
		live_sq: 0,
		coil_qty: 0,
		completed_order: 0,
		pending_orders: 0,
		last_ready: "0000-00-00",
		completed_work: 0,
		pending_work: 0,
		completed_work_cent: 0,
		pending_work_cent: 0,
		pending_man_hours: 0,
	});

	const [compPendingSQCountGraph, setCompPendingSQCountGraph] =
		React.useState();

	const [compPendingGroupedSQCountGraph, setCompPendingGroupedSQCountGraph] =
		React.useState();
	const [compLastModuleLineSQCountGraph, setCompLastModuleLineSQCountGraph] =
		React.useState();

	const [
		compLastModuleOverAllLineSQCountGraph,
		setCompLastModuleOverAllLineSQCountGraph,
	] = React.useState();

	const rowTotal = (dataArray) => {
		// create an array
		const myNums = [
			parseInt(dataArray.cnc_nest_compsq),
			parseInt(dataArray.cnc_punch_compsq),
			parseInt(dataArray.bending_compsq),
			parseInt(dataArray.brazing_compsq),
			parseInt(dataArray.ca_compsq),
			parseInt(dataArray.ce_compsq),
			parseInt(dataArray.dispatch_compsq),
			parseInt(dataArray.finpunch_compsq),
			parseInt(dataArray.pp_compsq),
			parseInt(dataArray.tcutting_compsq),
		];

		// create a variable for the sum and initialize it
		let sum = 0;

		// calculate sum using forEach() method
		myNums.forEach((num) => {
			sum += num;
		});

		return sum;
	};

	const colTotal = (dataArray, colName) => {
		// create a variable for the sum and initialize it
		let sum = 0;
		let idx = 0;
		// calculate sum using forEach() method
		dataArray.forEach((row, index) => {
			idx = index + 1;
			sum = sum + parseInt(row[colName]);
		});
		return sum / idx;
	};

	const handlePendingSqCount = (authID) => {
		var bodyFormData = new FormData();
		bodyFormData.append("authId", authID);
		axios({
			method: "post",
			url: dashboardGraphData,
			data: bodyFormData,
			headers: { "Content-Type": "multipart/form-data" },
		})
			.then(function (response) {
				//handle success
				const res_data = response.data;
				if (res_data.status_code === 101) {
					// toast("Api Authentication failed. login again.");
				} else if (res_data.status_code === 200) {
					setPendingSqPie({
						label: res_data.pendingCount.Label,
						data: res_data.pendingCount.Count,
					});
					setPendingGroupedSqPie({
						label: res_data.pendingGroupCount.Label,
						data: res_data.pendingGroupCount.Count,
					});
					setLastModuleWiseSQLine({
						label: res_data.completedModelWise.Label,
						data: res_data.completedModelWise.CountData,
						allData: res_data.completedModelWise.AllData,
					});
					setLastModuleOverAllSQLine({
						label: res_data.completedModelOverAll.Label,
						data: res_data.completedModelOverAll.Count,
					});
					setSummaryData({
						live_order: res_data.summaryData.live_orders,
						live_sq: res_data.summaryData.live_sq,
						coil_qty: res_data.summaryData.coil_qty,
						completed_order: res_data.summaryData.completed_orders,
						pending_orders: res_data.summaryData.pending_orders,
						last_ready: res_data.summaryData.last_ready,
						completed_work: res_data.summaryData.completed_work,
						pending_work: res_data.summaryData.pending_work,
						completed_work_cent: res_data.summaryData.completed_work_cent,
						pending_work_cent: res_data.summaryData.pending_work_cent,
						pending_man_hours: res_data.summaryData.pending_man_hours,
					});
				} else {
					console.log(res_data.status_msg);
				}
			})
			.catch(function (response) {
				//handle error
				console.log(response);
			});
	};

	const renderPendingSQPie = () => {
		return <PendingSqPie label={pendingSqPie.label} data={pendingSqPie.data} />;
	};

	const renderPendingGroupedSQPie = () => {
		return (
			<PendingGroupedSqPie
				label={pendingGroupedSqPie.label}
				data={pendingGroupedSqPie.data}
			/>
		);
	};

	const renderLastModuleWiseSQLine = () => {
		return (
			<LastModuleWiseLine
				label={lastModuleWiseSQLine.label}
				data={lastModuleWiseSQLine.data}
			/>
		);
	};

	const renderLastModuleOverAllSQLine = () => {
		return (
			<LastModuleOverAllLine
				label={lastModuleOverAllSQLine.label}
				data={lastModuleOverAllSQLine.data}
			/>
		);
	};

	//module performance table
	const columns = [
		{
			field: "ol_date",
			headerName: "Order Date",
			flex: 1,
		},
		{
			field: "cnc_nest_compsq",
			headerName: "CNC Nest",
			flex: 1,
		},
		{
			field: "cnc_punch_compsq",
			headerName: "CNC Punch",
			flex: 1,
		},
		{
			field: "bending_compsq",
			headerName: "Bending",

			flex: 1,
		},
		{
			field: "tcutting_compsq",
			headerName: "Tube Cutting",
			flex: 1,
		},
		{
			field: "finpunch_compsq",
			headerName: "Fin Punch",
			flex: 1,
		},
		{
			field: "ca_compsq",
			headerName: "Coil Assembly",
			flex: 1,
		},
		{
			field: "ce_compsq",
			headerName: "Coil Expansion",
			flex: 1,
		},
		{
			field: "brazing_compsq",
			headerName: "Brazing",
			flex: 1,
		},
		{
			field: "pp_compsq",
			headerName: "Paint & Packing",
			flex: 1,
		},
		{
			field: "dispatch_compsq",
			headerName: "Dispatch",
			flex: 1,
		},
		{
			field: "CustomField",
			headerName: "Total",
			valueGetter: (params) => {
				return rowTotal(params.row);
			},
			flex: 1,
		},
	];

	React.useEffect(function () {
		handlePendingSqCount(access);
	}, []);

	React.useEffect(
		function () {
			if (pendingSqPie.data?.length > 0) {
				setCompPendingSQCountGraph(renderPendingSQPie());
			}
			if (pendingGroupedSqPie.data?.length > 0) {
				setCompPendingGroupedSQCountGraph(renderPendingGroupedSQPie());
			}
			if (lastModuleWiseSQLine.label?.length > 0) {
				setCompLastModuleLineSQCountGraph(renderLastModuleWiseSQLine());
			}
			if (lastModuleOverAllSQLine.data?.length > 0) {
				setCompLastModuleOverAllLineSQCountGraph(
					renderLastModuleOverAllSQLine()
				);
			}
		},
		[
			pendingSqPie.data,
			pendingGroupedSqPie.data,
			lastModuleWiseSQLine.label,
			lastModuleOverAllSQLine.data,
		]
	);
	return (
		<div className="container">
			<div className="row">
				<div className="col-4 ">
					<div className="card" style={{ height: "100%" }}>
						<h4 className="text-center">Module Status</h4>
						{compPendingSQCountGraph}
					</div>
				</div>
				<div className="col-4">
					<div className="card " style={{ height: "100%" }}>
						<h4 className="text-center">Summary</h4>
						<div>
							<table className="table table-bordered table-striped">
								<tbody>
									<tr>
										<td>Orders</td>
										<td>{summaryData.live_order}</td>
									</tr>
									<tr>
										<td>Sq.ft.</td>
										<td>{summaryData.live_sq}</td>
									</tr>
									<tr>
										<td>Coils</td>
										<td>{summaryData.coil_qty}</td>
									</tr>
									<tr>
										<td>Completed orders</td>
										<td>{summaryData.completed_order}</td>
									</tr>
									<tr>
										<td>Pending orders</td>
										<td>{summaryData.pending_orders}</td>
									</tr>
									<tr>
										<td>Last Ready date</td>
										<td>{summaryData.last_ready}</td>
									</tr>
									<tr>
										<td>Completed work</td>
										<td>{summaryData.completed_work}</td>
									</tr>
									<tr>
										<td>Completed work %</td>
										<td>{summaryData.completed_work_cent} %</td>
									</tr>
									<tr>
										<td>Pending work</td>
										<td>{summaryData.pending_work}</td>
									</tr>
									<tr>
										<td>Pending work %</td>
										<td>{summaryData.pending_work_cent} %</td>
									</tr>
									<tr>
										<td>Pending as per man hours</td>
										<td>{summaryData.pending_man_hours}</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</div>
				<div className="col-4 ">
					<div className="card" style={{ height: "100%" }}>
						<h4 className="text-center">Section Status</h4>
						{compPendingGroupedSQCountGraph}
					</div>
				</div>
			</div>
			<div className="row mt-2">
				<div className="col p-2">
					<div className="card">
						<h4 className="text-center">Module Performance</h4>
						{compLastModuleLineSQCountGraph}
					</div>
				</div>
			</div>

			<div className="row mt-2">
				<div className="col p-2">
					<div className="card">
						<h4 className="text-center">Over All Performance</h4>
						{compLastModuleOverAllLineSQCountGraph}
					</div>
				</div>
			</div>
			<div className="row mt-2">
				<div className="col p-2">
					<div className="mt-3">
						<table className="table table-striped table-bordered">
							<tbody>
								<tr>
									<th>Average</th>
									<td>
										{colTotal(lastModuleWiseSQLine.allData, "cnc_nest_compsq")}
									</td>
									<td>
										{colTotal(lastModuleWiseSQLine.allData, "cnc_punch_compsq")}
									</td>
									<td>
										{colTotal(lastModuleWiseSQLine.allData, "bending_compsq")}
									</td>
									<td>
										{colTotal(lastModuleWiseSQLine.allData, "tcutting_compsq")}
									</td>
									<td>
										{colTotal(lastModuleWiseSQLine.allData, "finpunch_compsq")}
									</td>
									<td>{colTotal(lastModuleWiseSQLine.allData, "ca_compsq")}</td>
									<td>{colTotal(lastModuleWiseSQLine.allData, "ce_compsq")}</td>
									<td>
										{colTotal(lastModuleWiseSQLine.allData, "brazing_compsq")}
									</td>
									<td>{colTotal(lastModuleWiseSQLine.allData, "pp_compsq")}</td>
									<td>
										{colTotal(lastModuleWiseSQLine.allData, "dispatch_compsq")}
									</td>
								</tr>
							</tbody>
						</table>
						<DataGrid
							slots={{ toolbar: GridToolbar }}
							getRowId={(row) => Math.random()}
							getRowClassName={(params) => {
								if (params.indexRelativeToCurrentPage % 2 === 0) {
									if (params.row.priority === "true") {
										return "secon-bg";
									} else if (
										params.row.tcutting_status === "true" &&
										params.row.finpunch_status === "true"
									) {
										return "partial-comp-bg";
									} else {
										return "Mui-even";
									}
								} else {
									if (params.row.priority === "true") {
										return "secon-bg";
									} else if (
										params.row.tcutting_status === "true" &&
										params.row.finpunch_status === "true"
									) {
										return "partial-comp-bg";
									} else {
										return "Mui-odd";
									}
								}
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
							rowHeight={50}
							columns={columns}
							rows={lastModuleWiseSQLine.allData}
							editMode="row"
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
