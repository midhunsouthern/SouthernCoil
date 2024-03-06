import * as React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { ReactCalculator } from "simple-react-calculator";
import {
	Box,
	Button,
	CardContent,
	IconButton,
	Typography,
} from "@mui/material";
import CalculateIcon from "@mui/icons-material/Calculate";
import { AccessContext } from "../../constant/accessContext";
import { getPendingCompletedSQ } from "../../constant/url";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoopIcon from "@mui/icons-material/Loop";
import LineChart from "./chart/LineChart";
import { Data } from "./chart/Data";

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function ModuleTools(props) {
	const access = React.useContext(AccessContext).authID;
	const navigate = useNavigate();
	const pageName = props.pageName;
	const orderData = props.OrderData;

	const [openStatusCalc, setOpenStatusCalc] = React.useState(false);
	const [openStatuSqGraph, setOpenStatusSqGraph] = React.useState(false);
	const [pendingSq, setPendingSqft] = React.useState(0);
	const [completedCount, setCompletedCount] = React.useState(0);
	const [chartData, setChartData] = React.useState({
		labels: Data.map((data) => data.year),
		datasets: [
			{
				label: "Completed Data",
				data: Data.map((data) => data.userGain),
				borderColor: "black",
				borderWidth: 2,
			},
		],
	});

	const handleClickOpenCalc = () => {
		setOpenStatusCalc(true);
	};

	const handleCloseStatusCalc = (response) => {
		setOpenStatusCalc(false);
	};

	const handleClickOpenSqGraph = () => {
		setOpenStatusSqGraph(true);
	};

	const handleCloseStatusSqGraph = (response) => {
		setOpenStatusSqGraph(false);
	};

	function handlePendingSq(pageName) {
		var bodyFormData = new FormData();
		bodyFormData.append("authId", access);
		bodyFormData.append("pageName", pageName);
		/**add photos */
		axios({
			method: "post",
			url: getPendingCompletedSQ,
			data: bodyFormData,
			headers: { "Content-Type": "multipart/form-data" },
		})
			.then(function (response) {
				//handle success
				const res_data = response.data;
				if (res_data.status_code === 200) {
					setPendingSqft(res_data["pendingsq"]["pendingsq"]);
					setCompletedCount(res_data["completed_count"]["completed_count"]);
					const cData = res_data["completedSq"];
					setChartData({
						labels: cData.map((data) => data.stat_date),
						datasets: [
							{
								label: "Completed Data",
								data: cData.map((data) => data.compsq),
								backgroundColor: cData.map(() => "rgba(75,192,192,1)"),
								borderColor: "black",
								borderWidth: 2,
							},
						],
					});
				} else {
					toast(res_data.status_msg, "error");
				}
			})
			.catch(function (response) {
				//handle error
				console.log(response);
			});
	}
	const refreshPage = () => {
		props.refreshPage(true);
	};
	React.useEffect(() => {
		handlePendingSq(pageName);
	}, [pageName]);
	return (
		<>
			<Button onClick={() => handleClickOpenCalc()} className="toolButton">
				<CalculateIcon style={{ color: "#BC1921" }} /> Calculator
			</Button>
			<Button onClick={() => handleClickOpenSqGraph()} className="toolButton">
				<Typography variant="p">
					Pending Sq:<br></br>
					<span style={{ color: "#BC1921" }}>
						{pendingSq} / {completedCount}
					</span>
				</Typography>
			</Button>
			<Button onClick={() => refreshPage()} className="toolButton">
				<LoopIcon />
			</Button>
			<Dialog
				fullWidth={true}
				open={openStatusCalc}
				TransitionComponent={Transition}
				keepMounted
				onClose={handleCloseStatusCalc}
				aria-describedby="alert-dialog-slide-description"
				key={"dialogBx-1"}
			>
				<div className="p-2">
					<ReactCalculator />
				</div>

				<DialogActions>
					<Button onClick={() => handleCloseStatusCalc("yes")}>Close</Button>
				</DialogActions>
			</Dialog>
			<Dialog
				fullWidth={true}
				open={openStatuSqGraph}
				TransitionComponent={Transition}
				keepMounted
				onClose={handleCloseStatusSqGraph}
				aria-describedby="alert-dialog-slide-description"
				key={"dialogBx-2"}
			>
				<div className="p-2">
					{<LineChart chartData={chartData} key="chart1" />}
				</div>

				<DialogActions>
					<Button onClick={() => handleCloseStatusSqGraph("yes")}>Close</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}
