import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PendingGroupedSqPie(props) {
	const data = {
		labels: props.label,
		datasets: [
			{
				label: "# of Pending Sq Feet",
				data: props.data,
				backgroundColor: [
					"rgba(139,109,255,255)",
					"rgba(221,255,107,255)",
					"rgba(138,255,105,255)",
					"rgba(254,118,112,255)",
					"rgba(223,109,255,255)",
				],
				borderColor: "white",
				borderWidth: 1,
			},
		],
	};
	return <Doughnut key={"pengroupPie" + 1000} data={data} />;
}
