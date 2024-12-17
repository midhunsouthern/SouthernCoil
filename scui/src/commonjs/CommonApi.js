import axios from "axios";
import { setOrderGeneric } from "../constant/url";
import { toast } from "react-toastify";
import moment from "moment";

export const handleGenericUpdateRow = async (access, fields, rowData) => {
	var bodyFormData = new FormData();
	bodyFormData.append("authId", access);
	bodyFormData.append("id", rowData.id);

	const dateVariable = ["order_confirm_date", "est_delivery_date"];
	fields.forEach((element) => {
		if (dateVariable.includes(element)) {
			// Parse the input date with the specified timezone
			const parsedDate = moment(rowData[element]);

			// Format the parsed date in the desired format (YYYY-MM-DD)
			const formattedDate = parsedDate.format("YYYY-MM-DD");

			rowData[element] = formattedDate;
		}
		bodyFormData.append(element, rowData[element]);
	});
	return new Promise((resolve, reject) => {
		axios({
			method: "post",
			url: setOrderGeneric,
			data: bodyFormData,
			headers: { "Content-Type": "multipart/form-data" },
		})
			.then(function (response) {
				//handle success
				const res_data = response.data;
				if (res_data.status_code === 200) {
					toast(res_data.status_msg, "success");
					resolve(rowData);
				} else {
					toast(res_data.status_msg, "error");
					reject("Rejected");
				}
			})
			.catch(function (response) {
				//handle error
				console.log(response);
			});
	});
};
