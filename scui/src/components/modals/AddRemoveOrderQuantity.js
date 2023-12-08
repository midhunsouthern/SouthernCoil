import { useState, useEffect, useContext } from "react";
import axios from "axios";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { IconButton, Button } from "@mui/material";
import { toast } from "react-toastify";
import {
	getBrazingDetail,
	setAddBrazingQuantity,
	setDeleteBrazingQuantity,
} from "../../constant/url";
import { AccessContext } from "../../constant/accessContext";

export default function AddRemoveOrderQuantity(prop) {
	const access = useContext(AccessContext).authID;
	const orderId = prop.orderId;
	const splitId = prop.splitId;

	const [addQty, setAddQty] = useState(0);
	const [parentSeriesList, setParentSeriesList] = useState([]);
	const [childSriesList, setChildSeriesList] = useState([]);

	const handleContentGet = (orderId, splitId) => {
		console.log("content get called");
		var bodyFormData = new FormData();
		bodyFormData.append("orderId", orderId);
		bodyFormData.append("splitId", splitId);
		bodyFormData.append("authId", access);
		axios({
			method: "post",
			url: getBrazingDetail,
			data: bodyFormData,
			headers: { "Content-Type": "multipart/form-data" },
		})
			.then(function (response) {
				//handle success
				const res_data = response.data;
				if (res_data.status_code === 200) {
					console.log("content get", res_data.data);
					setParentSeriesList(res_data.data);
					setChildSeriesList([]);
					toast(res_data.status_msg);
				} else if (res_data.status_code === 202) {
					toast(res_data.status_msg);
				} else {
					toast(res_data.status_msg);
				}
			})
			.catch(function (response) {
				//handle error
				console.log(response);
			});
	};

	const handelDeleteContent = (paramOrder, paramSplit, deleteSeries) => {
		var bodyFormData = new FormData();
		bodyFormData.append("orderId", paramOrder);
		bodyFormData.append("splitId", paramSplit);
		bodyFormData.append("deleteSeries", JSON.stringify(deleteSeries));
		bodyFormData.append("authId", access);
		axios({
			method: "post",
			url: setDeleteBrazingQuantity,
			data: bodyFormData,
			headers: { "Content-Type": "multipart/form-data" },
		})
			.then(function (response) {
				//handle success
				const res_data = response.data;
				if (res_data.status_code === 200) {
					handleContentGet(paramOrder, paramSplit);
					prop.isUpdated(true);
					toast(res_data.status_msg);
				} else if (res_data.status_code === 202) {
				} else {
					toast(res_data.status_msg);
				}
			})
			.catch(function (response) {
				//handle error
				console.log(response);
			});
	};
	const addQuantitySeries = (paramOrder, paramSplit, paramQth) => {
		if (paramQth < 1) {
			toast("Enter Quantity Greater than 0.");
			return;
		}
		var bodyFormData = new FormData();
		bodyFormData.append("orderId", paramOrder);
		bodyFormData.append("splitId", paramSplit);
		bodyFormData.append("qtyCount", paramQth);
		bodyFormData.append("authId", access);
		axios({
			method: "post",
			url: setAddBrazingQuantity,
			data: bodyFormData,
			headers: { "Content-Type": "multipart/form-data" },
		})
			.then(function (response) {
				//handle success
				const res_data = response.data;
				if (res_data.status_code === 200) {
					prop.isUpdated(true);
					handleContentGet(orderId, splitId);
					toast(res_data.status_msg);
				} else if (res_data.status_code === 202) {
				} else {
					toast(res_data.status_msg);
				}
			})
			.catch(function (response) {
				//handle error
				console.log(response);
			});
	};

	const getBtnColor = (itemId) => {
		const idx = childSriesList.findIndex((item) => item.id === itemId);
		if (idx !== -1) {
			return "bg-success";
		} else {
			return "";
		}
	};

	const handleParentToChild = (id) => {
		const idx = parentSeriesList.findIndex((item) => item.id === id);
		const cidx = childSriesList.findIndex((item) => item.id === id);

		let childSeries = [];
		let parentSeries = parentSeriesList;

		if (idx !== -1 && cidx === -1) {
			childSeries = [...childSriesList, parentSeriesList[idx]];
			parentSeries.splice(idx, 1);
		}
		setChildSeriesList(childSeries);
		setParentSeriesList(parentSeries);
	};

	const handleChildToParent = (id) => {
		const idx = childSriesList.findIndex((item) => item.id === id);
		const pidx = parentSeriesList.findIndex((item) => item.id === id);

		let childSeries = childSriesList;
		let parentSeries = parentSeriesList;

		if (idx !== -1 && pidx === -1) {
			parentSeries = [...parentSeriesList, childSriesList[idx]];
			childSeries.splice(idx, 1);
		}

		setChildSeriesList(childSeries);
		setParentSeriesList(parentSeries);
	};

	const ParentSeriesComponent = () => {
		return parentSeriesList?.map((item, index) => {
			return (
				<div className="col-6 p-2" key={index}>
					<Button
						variant="contained"
						key={"parentSeries" + Math.random()}
						onClick={() => handleParentToChild(item.id)}
					>
						{item.series_ref}
					</Button>
				</div>
			);
		});
	};

	const ChildSeriesComponent = () => {
		return childSriesList?.map((item, index) => {
			return (
				<div className="col p-2" key={index}>
					<Button
						variant="contained"
						key={"childSeries" + Math.random()}
						onClick={() => handleChildToParent(item.id)}
					>
						{item.series_ref}
					</Button>
				</div>
			);
		});
	};

	const handleInc = (name) => {
		if (name === "qty") {
			setAddQty((item) => item + 1);
		}
	};

	const handleDesc = (name) => {
		if (name === "qty") {
			setAddQty((item) => item - 1);
		}
	};

	useEffect(() => {
		setParentSeriesList([]);
		setChildSeriesList([]);
		handleContentGet(orderId, splitId);
	}, []);

	return (
		<div className="col">
			<h3 className="text-center">
				<AddIcon /> / <RemoveIcon /> Quantities @ {orderId + splitId}
			</h3>
			<p className="text-center">
				Input the number of Quantity you want to add.
			</p>
			<div className="col-12 d-flex justify-content-right">
				<div className="col-6">
					<div className="input-group">
						<button
							className="btn secon-bg text-white p-0"
							onClick={() => handleDesc("qty")}
						>
							<RemoveIcon fontSize="small" />
						</button>
						<input
							type="text"
							className="form-control prime-border p-0"
							value={addQty}
							name="qty"
						/>
						<button
							className="btn secon-bg text-white p-0"
							onClick={() => handleInc("qty")}
						>
							<AddIcon fontSize="small" />
						</button>
						<button
							className="btn prime-bg text-white p-0"
							onClick={() => addQuantitySeries(orderId, splitId, addQty)}
						>
							Add Quantity
						</button>
					</div>
				</div>
			</div>
			<p className="text-center">
				Select the Quantity that you what to Remove before spliting
			</p>
			<div className="row">
				<div className="col border ">
					<p>Parent Order Series</p>
					<div className="row">{<ParentSeriesComponent />}</div>
				</div>
				<div className="col border">
					<p>Delete Order Series</p>
					<div className="row">{<ChildSeriesComponent />}</div>
				</div>
			</div>
			<div>
				<Button
					onClick={() => handelDeleteContent(orderId, splitId, childSriesList)}
					variant="contained"
					className="mt-2 secon-bg"
				>
					Delete Selected Series
				</Button>
			</div>
		</div>
	);
}
