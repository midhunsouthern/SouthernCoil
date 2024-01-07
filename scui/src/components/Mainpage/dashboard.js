import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import axios from "axios";

import { piePendingSqGraph } from "../../constant/url";
import { AccessContext } from "../../constant/accessContext";

import PendingSqPie from "../Component/graph/pendingSqPie";
ChartJS.register(ArcElement, Tooltip, Legend);

export default function Dashboard() {
	const access = React.useContext(AccessContext).authID;
	const [pendingSqPie, setPendingSqPie] = React.useState({
		label: [],
		data: [],
	});
	const [compPendingSQCountGraph, setCompPendingSQCountGraph] =
		React.useState();

	const handlePendingSqCount = (authID) => {
		console.log("pendingSqPie", pendingSqPie);
		var bodyFormData = new FormData();
		bodyFormData.append("authId", authID);
		axios({
			method: "post",
			url: piePendingSqGraph,
			data: bodyFormData,
			headers: { "Content-Type": "multipart/form-data" },
		})
			.then(function (response) {
				//handle success
				const res_data = response.data;
				if (res_data.status_code === 101) {
					// toast("Api Authentication failed. login again.");
				} else if (res_data.status_code === 200) {
					const ret_data_cd = res_data.data;
					console.log("tsting data", ret_data_cd.Label);
					setPendingSqPie({
						label: ret_data_cd.Label,
						data: ret_data_cd.Count,
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

	React.useEffect(function () {
		handlePendingSqCount(access);
	}, []);

	React.useEffect(
		function () {
			if (pendingSqPie.data?.length > 0) {
				console.log("rendering q Data", renderPendingSQPie());
				setCompPendingSQCountGraph(renderPendingSQPie());
			} else {
				console.log("Data", pendingSqPie.data);
			}
		},
		[pendingSqPie.data]
	);
	return (
		<div className="container">
			<div className="row">
				<div className="col-4">
					<h4 className="text-center">Pending Sq Feet</h4>
					{compPendingSQCountGraph}
				</div>
				<div className="col-4"></div>
			</div>
		</div>
	);
}
