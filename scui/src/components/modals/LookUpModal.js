import * as React from "react";
import { AccessContext } from "../../constant/accessContext";
import { getLookupData, setLookupData } from "../../constant/url";
import {
	Container,
	TextField,
	Card,
	Button,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
} from "@mui/material";
import axios from "axios";

export default function LookUpModel(props) {
	const access = React.useContext(AccessContext).authID;
	const [value, setValue] = React.useState(0);
	const [lookUpList, setLookupList] = React.useState([]);
	const [lkpCat, setLkpCat] = React.useState();
	const [subValue, setSubValue] = React.useState("");

	function handleGetLookup(lkpId) {
		var bodyFormData = new FormData();
		bodyFormData.append("authId", access);
		bodyFormData.append("lkpId", lkpId);

		/**add photos */
		axios({
			method: "post",
			url: getLookupData,
			data: bodyFormData,
			headers: { "Content-Type": "multipart/form-data" },
		})
			.then(function (response) {
				//handle success
				const res_data = response.data;
				if (res_data.status_code === 200) {
					setLookupList(res_data);
				} else {
					console.log(res_data.status_msg);
				}
			})
			.catch(function (response) {
				//handle error
				console.log(response);
			});
	}

	React.useEffect(() => {
		//handleGetLookup(props.lkpId);
	}, [props]);
	return (
		<div
			className="modal modal-lg fade"
			id="staticBackdrop"
			data-bs-backdrop="static"
			data-bs-keyboard="false"
			aria-labelledby="staticBackdropLabel"
			aria-hidden="true"
		>
			<div className="modal-dialog">
				<div className="modal-content">
					<div className="modal-header">
						<h5 className="modal-headline" id="staticBackdropLabel">
							Edit Customer
						</h5>
						<button
							type="button"
							className="btn-close"
							data-bs-dismiss="modal"
							aria-label="Close"
						></button>
					</div>
					<div className="modal-body">
						<Container>
							<Card>
								<h3>Update look up value</h3>
								<div className="row">
									{lkpCat !== "coverDetail" && (
										<div className="col-4">
											<TextField
												label="Look up Value"
												id="lkpvalue"
												name="lkpvalue"
												autoComplete="lkpvalue"
												required
												fullWidth
												value={value}
												onChange={(e) => {
													setValue(e.target.value);
												}}
											/>
										</div>
									)}
									{lkpCat === "coverDetail" && (
										<div className="row">
											<div className="col-4">
												<FormControl fullWidth>
													<InputLabel id="coverType-label">
														Cover Type
													</InputLabel>
													<Select
														labelId="coverType-label"
														id="coverType-select"
														label="Cover Type"
														value={value}
														onChange={(event) => setValue(event.target.value)}
													>
														{lookUpList["coverType"]?.map((item) => {
															return (
																<MenuItem value={item.id}>
																	{item.lkp_value}
																</MenuItem>
															);
														})}
													</Select>
												</FormControl>
											</div>
											<div className="col-4">
												<TextField
													label="Sub Look up Value"
													id="lkpvalue"
													name="lkpvalue"
													autoComplete="lkpvalue"
													required
													fullWidth
													value={subValue}
													onChange={(e) => {
														setSubValue(e.target.value);
													}}
												/>
											</div>
										</div>
									)}
									<div className="col-4">
										<Button type="submit" variant="contained">
											Update
										</Button>
									</div>
								</div>
							</Card>
						</Container>
					</div>
				</div>
			</div>
		</div>
	);
}
