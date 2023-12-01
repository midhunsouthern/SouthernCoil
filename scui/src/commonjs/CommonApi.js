import axios from "axios";
import { setOrderGeneric } from "../constant/url";
import { toast } from "react-toastify";

export const handleGenericUpdateRow = async (access, fields, rowData) => {
	var bodyFormData = new FormData();
	bodyFormData.append("authId", access);
	bodyFormData.append("id", rowData.id);
	fields.forEach((element) => {
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
					resolve("Resolved");
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
