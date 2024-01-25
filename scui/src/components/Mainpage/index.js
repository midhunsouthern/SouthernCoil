import { Container, Card } from "@mui/material";
import React from "react";
import brazing from "../../assets/img/appIcons/br-braz.png";
import ca from "../../assets/img/appIcons/br-ca.png";
import ce from "../../assets/img/appIcons/br-ce.png";
import dash from "../../assets/img/appIcons/br-dash.png";
import disp from "../../assets/img/appIcons/br-disp.png";
import oentry from "../../assets/img/appIcons/br-entry.png";
import ep_bend from "../../assets/img/appIcons/br-ep_bend.png";
import fin from "../../assets/img/appIcons/br-fin.png";
import nesting from "../../assets/img/appIcons/br-nesting.png";
import paint from "../../assets/img/appIcons/br-paint.png";
import porder from "../../assets/img/appIcons/br-pend-order.png";
import prg_mst from "../../assets/img/appIcons/br-prg_mst.png";
import punch from "../../assets/img/appIcons/br-punch.png";
import status from "../../assets/img/appIcons/br-status.png";
import tc from "../../assets/img/appIcons/br-tc.png";
import wip from "../../assets/img/appIcons/br-wip.png";
import { NavLink } from "react-router-dom";
const Mainpage = () => {
	return (
		<div className="homebg">
			<div className="container">
				<div className="col">
					<Card className="p-4">
						<div className="row ">
							<div className="col-2">
								<NavLink className="btn" exact to="/dashboard">
									<img src={dash} alt="Dashboard" className="btn-img" />{" "}
									Dashboard
								</NavLink>
							</div>
							<div className="col-2">
								<NavLink to="/createOrder" className="btn " exact>
									<img src={oentry} alt="CNC Nesting" className="btn-img" />{" "}
									Order Entry
								</NavLink>
							</div>
							<div className="col-2">
								<NavLink to="/orderList" className="btn " exact>
									<img src={status} alt="CNC Nesting" className="btn-img" />
									Order Status
								</NavLink>
							</div>
							<div className="col-3">
								<NavLink to="/orderhistory" className="btn " exact>
									<img src={porder} alt="CNC Nesting" className="btn-img" />
									Order History
								</NavLink>
							</div>
						</div>
					</Card>
					<Card className="mt-4 p-3">
						<div className="row">
							<div className="col-2">
								<NavLink to="/cncnesting" className="btn">
									<img src={nesting} alt="CNC Nesting" className="btn-img" />
									CNC Nesting
								</NavLink>
							</div>
							<div className="col-3">
								<NavLink to="/cncpunching" className="btn " exact>
									<img src={punch} alt="CNC Nesting" className="btn-img" />
									CNC Punching & Numbering
								</NavLink>
							</div>
							<div className="col-2">
								<NavLink to="/epBending" className="btn " exact>
									<img src={ep_bend} alt="CNC Nesting" className="btn-img" />
									End Plate Bending
								</NavLink>
							</div>
							<div className="col-3">
								<NavLink to="/cncpgmmaster" className="btn " exact>
									<img src={prg_mst} alt="CNC Nesting" className="btn-img" />
									CNC Program Master
								</NavLink>
							</div>
							<div className="col-2">
								<NavLink to="/m1_wip" className="btn " exact>
									<img src={wip} alt="CNC Nesting" className="btn-img" />
									EP WIP Stock
								</NavLink>
							</div>
						</div>
					</Card>
					<div className="row">
						<div className="col">
							<Card className="mt-4 p-3">
								<div className="row">
									<div className="col-6">
										<NavLink to="/tubecutting" className="btn">
											<img src={tc} alt="CNC Nesting" className="btn-img" />
											Tube Cutting & Bending
										</NavLink>
									</div>
									<div className="col-6">
										<NavLink to="/m2_wip" className="btn " exact>
											<img src={wip} alt="CNC Nesting" className="btn-img" />
											Pipe WIP Stock
										</NavLink>
									</div>
								</div>
							</Card>
						</div>
						<div className="col">
							<Card className="mt-4 p-3">
								<div className="row">
									<div className="col-6">
										<NavLink to="/finpunching" className="btn">
											<img src={fin} alt="CNC Nesting" className="btn-img" />
											FINS Punching
										</NavLink>
									</div>
									<div className="col-6">
										<NavLink to="/m3_wip" className="btn " exact>
											<img src={wip} alt="CNC Nesting" className="btn-img" />
											WIP Stock
										</NavLink>
									</div>
								</div>
							</Card>
						</div>
					</div>
					<div className="row">
						<div className="col">
							<Card className="mt-4 p-3">
								<div className="row">
									<div className="col-6">
										<NavLink to="/coilassembly" className="btn " exact>
											<img src={ca} alt="CNC Nesting" className="btn-img" />
											Coil Assembly
										</NavLink>
									</div>
									<div className="col-6">
										<NavLink to="/coilexpansion" className="btn " exact>
											<img src={ce} alt="CNC Nesting" className="btn-img" />
											Coil Expansion
										</NavLink>
									</div>
								</div>
							</Card>
						</div>
						<div className="col">
							<Card className="mt-4 p-3">
								<div className="row">
									<div className="col-4">
										<NavLink to="/brazing" className="btn">
											<img
												src={brazing}
												alt="CNC Nesting"
												className="btn-img"
											/>
											Brazin & Leak
										</NavLink>
									</div>
									<div className="col-4">
										<NavLink to="/paintingpacking" className="btn " exact>
											<img src={paint} alt="CNC Nesting" className="btn-img" />
											Painting and Packing
										</NavLink>
									</div>
									<div className="col-4  ">
										<NavLink to="/m4_wip" className="btn " exact>
											<img src={wip} alt="CNC Nesting" className="btn-img" />
											WIP Stock
										</NavLink>
									</div>
								</div>
							</Card>
						</div>
					</div>
					<div className="row">
						<div className="col d-flex justify-content-center">
							<Card className="mt-4 p-3 ">
								<div className="row">
									<div className="col-6">
										<NavLink to="/dispatch" className="btn">
											<img src={disp} alt="CNC Nesting" className="btn-img" />
											Dispatch
										</NavLink>
									</div>
									<div className="col-6">
										<NavLink to="/finishedstock" className="btn " exact>
											<img src={wip} alt="CNC Nesting" className="btn-img" />
											Finished Stock
										</NavLink>
									</div>
								</div>
							</Card>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
export default Mainpage;
