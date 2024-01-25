import React from "react";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
// import faker from "faker";

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
	ChartDataLabels
);

export default function LastModuleOverAllLine(props) {
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
				font: {
					weight: "bold",
				},
				padding: 6,
				formatter: Math.round,
			},
			tooltip: {
				enabled: true,
			},
		},
	};

	const data = {
		labels: props.label,
		datasets: [
			{
				label: "Last 10 Days Module Wise Sq Feet",
				data: props.data,
				borderColor: "rgb(255, 99, 132)",
				backgroundColor: "rgba(255, 99, 132, 0.5)",
				yAxisID: "y",
			},
		],
	};
	return <Line key={"overallLine" + 1000} data={data} options={options} />;
}
