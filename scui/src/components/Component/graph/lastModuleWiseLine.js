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
// import faker from "faker";

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
);

export default function LastModuleWiseLine(props) {
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

	const ds = props.data;
	const data = {
		labels: ds?.ol_date,
		datasets: [
			{
				label: "CNC Nesting",
				data: ds?.cnc_nest_compsq,
				borderColor: "rgba(255, 99, 132, 1)",
				backgroundColor: "rgba(255, 99, 132, 0.2)",
			},
			{
				label: "CNC Punching",
				data: ds?.cnc_punch_compsq,
				borderColor: "rgb(54, 162, 235,1)",
				backgroundColor: "rgba(254, 162, 235, 0.2)",
			},
			{
				label: "Bending",
				data: ds?.bending_compsq,
				borderColor: "rgb(255, 206, 86,1)",
				backgroundColor: "rgba(255, 206, 86, 0.2)",
			},
			{
				label: "Tube Cutting",
				data: ds?.tcutting_compsq,
				borderColor: "rgb(52, 235, 229,1)",
				backgroundColor: "rgba(52, 235, 229, 0.2)",
			},
			{
				label: "Fin Punch",
				data: ds?.finpunch_compsq,
				borderColor: "rgb(52, 64, 235,1)",
				backgroundColor: "rgba(52, 64, 235, 0.2)",
			},
			{
				label: "Coil Assembly",
				data: ds?.ca_compsq,
				borderColor: "rgb(214, 52, 235,1)",
				backgroundColor: "rgba(214, 52, 235, 0.2)",
			},
			{
				label: "Coil Expansion",
				data: ds?.ce_compsq,
				borderColor: "rgb(235, 52, 140,1)",
				backgroundColor: "rgba(235, 52, 140,0.2)",
			},
			{
				label: "Brazing",
				data: ds?.brazing_compsq,
				borderColor: "rgb(128, 52, 235,1)",
				backgroundColor: "rgba(128, 52, 235, 0.2)",
			},
			{
				label: "Paint & Pack",
				data: ds?.pp_compsq,
				borderColor: "rgb(52, 235, 143,1)",
				backgroundColor: "rgba(52, 235, 143, 0.2)",
			},
			{
				label: "Dispatch",
				data: ds?.dispatch_compsq,
				borderColor: "rgb(198, 235, 52,1)",
				backgroundColor: "rgba(198, 235, 52, 0.2)",
			},
		],
	};
	return <Line key={"modWise" + 1000} data={data} options={options} />;
}
