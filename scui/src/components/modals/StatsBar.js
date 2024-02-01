//imgs
import { lightGreen, orange, red, teal, yellow } from "@mui/material/colors";
import { Tooltip } from "@mui/material";
import Assembly from "../../assets/img/appIcons/Assembly.png";
import Bending from "../../assets/img/appIcons/Bending.png";
import Brazing from "../../assets/img/appIcons/Brazing.png";
import CEx from "../../assets/img/appIcons/Coil Expansion.png";
import Disp from "../../assets/img/appIcons/Dispatch.png";
import Fins from "../../assets/img/appIcons/Fins.png";
import Nesting from "../../assets/img/appIcons/Nesting.png";
import Painting from "../../assets/img/appIcons/Painting.png";
import Punching from "../../assets/img/appIcons/Punching.png";
import Tube from "../../assets/img/appIcons/Tube.png";

const styles = {
	outerBox: {
		border: "1px",
	},
	bar: { display: "block", width: "10%", height: "100%", float: "left" },
	leftBar: { borderTopLeftRadius: "20px", borderBottomLeftRadius: "20px" },
	rightBar: { borderTopRightRadius: "20px", borderBottomRightRadius: "20px" },
};
export default function StatusBar(prop) {
	if (prop.statusData === null) {
		return;
	}

	const size =
		prop.source === "Dialog" ? "status-main-big-box " : "status-main-small-box";
	const statusData = {
		cncnesting: prop.statusData.cnc_nesting_status,
		cncpunching: prop.statusData.cnc_punching_status,
		epBending: prop.statusData.bending_status ?? "false",
		tcutting: prop.statusData.tcutting_status ?? "false",
		finpunching: prop.statusData.finpunch_status ?? "false",
		ca: prop.statusData.ca_status,
		ce: prop.statusData.ce_status,
		bnl: prop.statusData.brazing_status,
		pp: prop.statusData.pp_status,
		disp: prop.statusData.dispatch_status,
	};
	const statusPercentage = () => {
		let status = 0;
		status =
			(statusData.cncnesting === "true" ? 10 : 0) +
			(statusData.cncpunching === "true" ? 10 : 0) +
			(statusData.epBending === "true" ? 10 : 0) +
			(statusData.tcutting === "true" ? 10 : 0) +
			(statusData.finpunching === "true" ? 10 : 0) +
			(statusData.ca === "true" ? 10 : 0) +
			(statusData.ce === "true" ? 10 : 0) +
			(statusData.bnl === "true" ? 10 : 0) +
			(statusData.pp === "true" ? 10 : 0) +
			(statusData.disp === "true" ? 10 : 0);
		return status;
	};
	return (
		<div className="status-bar-outer">
			<div className="status-bar">
				{statusData.cncnesting === "true" && (
					<Tooltip arrow title="CNCNESTING">
						<div
							style={{
								...styles.bar,
								...styles.leftBar,
								backgroundColor: red[900],
							}}
						>
							<img
								src={Nesting}
								alt="brazing"
								style={{
									width: "50%",
									height: "50%",
									marginLeft: "25%",
									marginTop: "30%",
								}}
							/>
						</div>
					</Tooltip>
				)}
				{statusData.cncpunching === "true" && (
					<Tooltip arrow title="CNCPUNCHING & NUMBERING">
						<div style={{ ...styles.bar, backgroundColor: orange[900] }}>
							<img
								src={Punching}
								alt="brazing"
								style={{
									width: "50%",
									height: "50%",
									marginLeft: "25%",
									marginTop: "30%",
								}}
							/>
						</div>
					</Tooltip>
				)}
				{statusData.epBending === "true" && (
					<Tooltip arrow title="END PLATE BENDING">
						<div style={{ ...styles.bar, backgroundColor: orange[700] }}>
							<img
								src={Bending}
								alt="brazing"
								style={{
									width: "50%",
									height: "50%",
									marginLeft: "25%",
									marginTop: "30%",
								}}
							/>
						</div>
					</Tooltip>
				)}
				{statusData.tcutting === "true" && (
					<Tooltip arrow title="TUBE CUTTING & BENDING">
						<div style={{ ...styles.bar, backgroundColor: orange[600] }}>
							<img
								src={Tube}
								alt="brazing"
								style={{
									width: "50%",
									height: "50%",
									marginLeft: "25%",
									marginTop: "30%",
								}}
							/>
						</div>
					</Tooltip>
				)}
				{statusData.finpunching === "true" && (
					<Tooltip arrow title="FINS PUNCHING">
						<div style={{ ...styles.bar, backgroundColor: yellow[700] }}>
							<img
								src={Fins}
								alt="brazing"
								style={{
									width: "50%",
									height: "50%",
									marginLeft: "25%",
									marginTop: "30%",
								}}
							/>
						</div>
					</Tooltip>
				)}
				{statusData.ca === "true" && (
					<Tooltip arrow title="COIL ASSEMBLY">
						<div style={{ ...styles.bar, backgroundColor: yellow[500] }}>
							<img
								src={Assembly}
								alt="brazing"
								style={{
									width: "50%",
									height: "50%",
									marginLeft: "25%",
									marginTop: "30%",
								}}
							/>
						</div>
					</Tooltip>
				)}
				{statusData.ce === "true" && (
					<Tooltip arrow title="COIL EXPANSION">
						<div style={{ ...styles.bar, backgroundColor: teal["A400"] }}>
							<img
								src={CEx}
								alt="brazing"
								style={{
									width: "50%",
									height: "50%",
									marginLeft: "25%",
									marginTop: "30%",
								}}
							/>
						</div>
					</Tooltip>
				)}
				{statusData.bnl === "true" && (
					<Tooltip arrow title="BRAZING & LEAK">
						<div style={{ ...styles.bar, backgroundColor: teal["A700"] }}>
							<img
								src={Brazing}
								alt="brazing"
								style={{
									width: "50%",
									height: "50%",
									marginLeft: "25%",
									marginTop: "30%",
								}}
							/>
						</div>
					</Tooltip>
				)}
				{statusData.pp === "true" && (
					<Tooltip arrow title="PAINTING & PACKING">
						<div style={{ ...styles.bar, backgroundColor: lightGreen[500] }}>
							<img
								src={Painting}
								alt="brazing"
								style={{
									width: "50%",
									height: "50%",
									marginLeft: "25%",
									marginTop: "30%",
								}}
							/>
						</div>
					</Tooltip>
				)}
				{statusData.disp === "true" && (
					<Tooltip arrow title="DISPATCH">
						<div
							style={{
								...styles.bar,
								...styles.rightBar,
								backgroundColor: lightGreen[700],
							}}
						>
							<img
								src={Disp}
								alt="brazing"
								style={{
									width: "50%",
									height: "50%",
									marginLeft: "25%",
									marginTop: "30%",
								}}
							/>
						</div>
					</Tooltip>
				)}
			</div>
		</div>
	);
}
