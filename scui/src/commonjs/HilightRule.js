import { green, yellow } from "@mui/material/colors";

import tc from "../assets/img/taskcompleted.gif";

export function HilightRule(pageName, orderData) {
	if (pageName === "cncNesting") {
		if (
			orderData.finpunch_status === "true" &&
			orderData.tcutting_status === "true"
		) {
			return green[500];
		} else if (
			orderData.finpunch_status === "true" ||
			orderData.tcutting_status === "true"
		) {
			return yellow[500];
		}
	} else if (pageName === "cncPunching") {
		if (
			orderData.finpunch_status === "true" &&
			orderData.tcutting_status === "true"
		) {
			return green[500];
		} else if (
			orderData.finpunch_status === "true" ||
			orderData.tcutting_status === "true"
		) {
			return yellow[500];
		}
	} else if (pageName === "epBending") {
		if (
			orderData.finpunch_status === "true" &&
			orderData.tcutting_status === "true"
		) {
			return green[500];
		} else if (
			orderData.finpunch_status === "true" ||
			orderData.tcutting_status === "true"
		) {
			return yellow[500];
		}
	} else if (pageName === "tCutting") {
		if (
			orderData.finpunch_status === "true" &&
			orderData.bending_status === "true"
		) {
			return green[500];
		} else if (
			orderData.finpunch_status === "true" ||
			orderData.bending_status === "true"
		) {
			return yellow[500];
		}
	}
}

export const TickGif = (prop) => {
	if (prop.show === null) {
		return;
	}
	const show = prop.show;
	return (
		<>
			{show && (
				<div>
					<img
						src={tc}
						srcSet={tc}
						alt="task_completed"
						style={{
							height: "200px",
							width: "200px",
							position: "fixed",
							zIndex: 1,
							left: "40%",
							top: "40%",
						}}
					/>
				</div>
			)}
		</>
	);
};
