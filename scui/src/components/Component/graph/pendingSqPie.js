import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Pie, Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

export default function PendingSqPie(props) {
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
					"rgba(108,255,255,255)",
					"rgba(110,170,255,255)",
					"rgba(139,109,255,255)",
					"rgba(221,255,107,255)",
					"rgba(110,255,172,255)",
					"rgba(138,255,105,255)",
					"rgba(255,193,108,255)",
					"rgba(254,118,112,255)",
					"rgba(255,107,199,255)",
					"rgba(223,109,255,255)",
				],
				borderColor: "white",
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
