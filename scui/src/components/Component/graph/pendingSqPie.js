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
					"rgba(255, 99, 132, 0.2)",
					"rgba(54, 162, 235, 0.2)",
					"rgba(255, 206, 86, 0.2)",
					"rgba(52, 235, 229, 0.2)",
					"rgba(52, 64, 235, 0.2)",
					"rgba(214, 52, 235, 0.2)",
					"rgba(235, 52, 140, 0.2)",
					"rgba(128, 52, 235, 0.2)",
					"rgba(52, 235, 143, 0.2)",
					"rgba(198, 235, 52, 0.2)",
				],
				borderColor: [
					"rgba(255, 99, 132, 1)",
					"rgba(54, 162, 235, 1)",
					"rgba(255, 206, 86, 1)",
					"rgba(52, 235, 229, 1)",
					"rgba(52, 64, 235,  1)",
					"rgba(214, 52, 235, 1)",
					"rgba(235, 52, 140, 1)",
					"rgba(128, 52, 235, 1)",
					"rgba(52, 235, 143, 1)",
					"rgba(198, 235, 52, 1)",
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
