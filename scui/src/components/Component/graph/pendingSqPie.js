import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Pie, Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

export default function PendingGroupedSqPie(props) {
	const options = {
		plugins: {
			datalabels: {
				backgroundColor: function (context) {
					return context.dataset.backgroundColor;
				},
				borderColor: "white",
				borderRadius: 25,
				borderWidth: 2,
				color: "black",
				padding: 6,
				font: {
					weight: "bold",
				},
				formatter: Math.round,
			},
			tooltip: {
				enabled: true,
			},
		},
	};
	const data = {
		labels: props.label,
		options,
		datasets: [
			{
				label: "# of Pending Sq Feet",
				data: props.data,
				backgroundColor: [
					"rgba(2, 192, 250)",
					"rgba(2, 110, 250)",
					"rgba(43, 2, 250)",
					"rgba(250, 250, 2)",
					"rgba(122, 250, 2)",
					"rgba(71, 161, 2)",
					"rgba(250, 120, 237)",
					"rgba(250, 2, 7)",
					"rgba(176, 2, 250)",
					"rgba(250, 143, 2)",
				],
				borderColor: [
					"rgba(2, 192, 250,0.2)",
					"rgba(2, 110, 250,0.2)",
					"rgba(43, 2, 250,0.2)",
					"rgba(250, 250, 2,0.2)",
					"rgba(122, 250, 2,0.2)",
					"rgba(71, 161, 2,0.2)",
					"rgba(250, 120, 237,0.2)",
					"rgba(250, 2, 7,0.2)",
					"rgba(176, 2, 250,0.2)",
					"rgba(250, 143, 2,0.2)",
				],
				borderWidth: 1,
				datalabels: {
					anchor: "end",
				},
			},
		],
	};
	return (
		<Pie
			key={"penPie" + 1000}
			data={data}
			options={options}
			plugins={[ChartDataLabels]}
		/>
	);
}
