import axios from "axios";
import { accessVerify } from "../constant/url";
import { toast } from "react-toastify";

export const handleVerifyLogin = async (access) => {
	var bodyFormData = new FormData();
	bodyFormData.append("access_code", access);

	return new Promise((resolve, reject) => {
		axios({
			method: "post",
			url: accessVerify,
			data: bodyFormData,
			headers: { "Content-Type": "multipart/form-data" },
		})
			.then((response) => {
				const res_data = response.data;
				if (res_data.status_code === 200) {
					toast(res_data.status_msg, "success");
					resolve("Resolved");
				} else {
					localStorage.clear();
					localStorage.removeItem("authId");
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
