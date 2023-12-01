import { Button, Container, TextField } from "@mui/material";
import React from "react";

export default function ViewPopup() {
	return (
		<div>
			{/* <!-- Modal --> */}
			<div
				className="modal fade"
				id="viewPopup"
				data-bs-backdrop="static"
				data-bs-keyboard="false"
				tabIndex="-1"
				aria-labelledby="staticBackdropLabel"
				aria-hidden="true"
			>
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal- headline" id="staticBackdropLabel">
								View
							</h5>
							<button
								type="button"
								className="btn-close"
								data-bs-dismiss="modal"
								aria-label="Close"
							></button>
						</div>
						<div className="modal-body">
							<Container></Container>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
