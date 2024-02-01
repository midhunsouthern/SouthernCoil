import React from "react";
import { Line } from "react-chartjs-2";
function LineChart({ chartData }) {
	return (
		<div className="chart-container">
			<h2 style={{ textAlign: "center" }}> </h2>
			<Line
				data={chartData}
				options={{
					responsive: true,
					tooltipTemplate: "<%= value %>",
					showTooltips: true,
					scales: {
						y: {
							beginAtZero: true,
						},
					},
					plugins: {
						title: {
							display: true,
							text: "Completed Sq Ft.",
						},
						legend: {
							display: false,
						},
					},
				}}
			/>
		</div>
	);
}
export default LineChart;
