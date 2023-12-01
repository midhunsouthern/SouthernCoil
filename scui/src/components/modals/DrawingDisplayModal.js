import {
	Button,
	Container,
	IconButton,
	ImageList,
	ImageListItem,
	TextField,
} from "@mui/material";
import React, { useEffect, useState, useContext } from "react";
import PreviewIcon from "@mui/icons-material/Preview";
import axios from "axios";
import { AccessContext } from "../../constant/accessContext";
import { getCustomersDataByID, setCustomersData } from "../../constant/url";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function DrawingDisplayModal(prop) {
	const epPhoto = prop.imageData.ep_photo;
	const assemblyPhoto = prop.imageData.assembly_Photo;
	const brazingPhoto = prop.imageData.brazing_Photo;
	return (
		<div
			className="modal fade modal-lg"
			id="staticDrawingBackdrop"
			data-bs-backdrop="static"
			data-bs-keyboard="false"
			tabIndex="-1"
			aria-labelledby="staticDrawingBackdropLabel"
			aria-hidden="true"
		>
			<div className="modal-dialog">
				<div className="modal-content">
					<div className="modal-header">
						<h5 className="modal-headline" id="staticDrawingBackdropLabel">
							Display Drawing
						</h5>
						<button
							type="button"
							className="btn-close"
							data-bs-dismiss="modal"
							aria-label="Close"
						></button>
					</div>
					<div className="modal-body">
						<div className="col">
							<h6>End Plate Drawing</h6>
							{
								<ImageList cols={2} rowHeight={164}>
									{epPhoto?.map((item, index) => (
										<ImageListItem key={"epphoto" + index}>
											<img
												src={item}
												srcSet={item}
												alt={"epphoto"}
												loading="lazy"
											/>
										</ImageListItem>
									))}
								</ImageList>
							}
						</div>
						<div className="col">
							<h6>Assembly Drawing</h6>
							{
								<ImageList cols={3} rowHeight={164}>
									{assemblyPhoto?.map((item, index) => (
										<ImageListItem key={"assembly" + index}>
											<img
												src={item}
												srcSet={item}
												alt={"Assembly"}
												loading="lazy"
											/>
										</ImageListItem>
									))}
								</ImageList>
							}
						</div>
						<div className="col">
							<h6>Brazing Drawing</h6>
							{
								<ImageList cols={3} rowHeight={164}>
									{brazingPhoto?.map((item, index) => (
										<ImageListItem key={"brazing" + index}>
											<img
												src={item}
												srcSet={item}
												alt={"brazing"}
												loading="lazy"
											/>
										</ImageListItem>
									))}
								</ImageList>
							}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
