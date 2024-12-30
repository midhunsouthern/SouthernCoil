import React, { useEffect, useState, useContext } from "react";
import { NavLink, useNavigate, useResolvedPath } from "react-router-dom";
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
import user from "../../assets/img/prof-img.jpeg";
import prg_mst from "../../assets/img/appIcons/prg_mst.png";
import brazing_cl from "../../assets/img/appIcons/br-braz.png";
import ca_cl from "../../assets/img/appIcons/br-ca.png";
import ce_cl from "../../assets/img/appIcons/br-ce.png";
import dash_cl from "../../assets/img/appIcons/br-dash.png";
import disp_cl from "../../assets/img/appIcons/br-disp.png";
import oentry_cl from "../../assets/img/appIcons/br-entry.png";
import ep_bend_cl from "../../assets/img/appIcons/br-ep_bend.png";
import fin_cl from "../../assets/img/appIcons/br-fin.png";
import nesting_cl from "../../assets/img/appIcons/br-nesting.png";
import paint_cl from "../../assets/img/appIcons/br-paint.png";
import porder_cl from "../../assets/img/appIcons/br-pend-order.png";
import prg_mst_cl from "../../assets/img/appIcons/br-prg_mst.png";
import punch_cl from "../../assets/img/appIcons/br-punch.png";
import status_cl from "../../assets/img/appIcons/br-status.png";
import tc_cl from "../../assets/img/appIcons/br-tc.png";
import wip_cl from "../../assets/img/appIcons/br-wip.png";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import { IconButton, Tooltip } from "@mui/material";
import { AccessContext } from "../../constant/accessContext";

const Header = () => {
	const access = useContext(AccessContext);
	const accessModuleList = useContext(AccessContext).accessModuleList;
	const resolvePath = useResolvedPath().pathname;
	const [greetings, setGreetings] = useState("");
	const navigate = useNavigate();
	function handleLogout() {
		localStorage.clear();
		access.handleLogout();
	}

	const getActivePage = (pathMatch) => {
		return resolvePath === pathMatch;
	};

	useEffect(() => {
		var myDate = new Date();
		var hrs = myDate.getHours();

		var greet;

		if (hrs < 12) greet = "Good Morning";
		else if (hrs >= 12 && hrs <= 17) greet = "Good Afternoon";
		else if (hrs >= 17 && hrs <= 24) greet = "Good Evening";
		setGreetings(greet);
	});

	return (
		<div>
			<main className="main prime-bg top-header">
				<div className="content">
					<div className="nav-horizontal">
						<ul className="navbar-horizontal ">
							{accessModuleList.filter(
								(x) => x.module_name === "M1cncNesting"
							)[0].access_rw === "1" && (
								<li
									className={`top-menu-Item ${
										getActivePage("/cncnesting") ? "top-menu-Item-active" : ""
									}`}
								>
									<NavLink
										className="inactive-tm top-menu-link"
										exact
										activeClassName="active-tm"
										to="/cncnesting"
									>
										<Tooltip title="CNC Nesting" placement="left-end">
											<img
												src={
													getActivePage("/cncnesting") ? nesting_cl : Nesting
												}
												height={45}
												width={45}
												alt="modules"
											/>
										</Tooltip>
									</NavLink>
								</li>
							)}

							{accessModuleList.filter(
								(x) => x.module_name === "M1epBending"
							)[0].access_rw === "1" && (
								<li
									className={`top-menu-Item ${
										getActivePage("/cncpgmmaster") ? "top-menu-Item-active" : ""
									}`}
								>
									{/* <img src={prg_mst} alt="CNC Nesting" className="btn-img" /> */}
									
									<NavLink
										className="inactive-tm top-menu-link"
										exact
										activeClassName="active-tm"
										to="/cncpgmmaster"
									>
										<Tooltip title="CNC Program Master" placement="left-end">
											<img
												src={getActivePage("/cncpgmmaster") ? prg_mst_cl : prg_mst}
												height={45}
												width={45}
												alt="modules"
											/>
										</Tooltip>
									</NavLink>
								</li>
							)}

							
							{accessModuleList.filter(
								(x) => x.module_name === "M1cncPunching"
							)[0].access_rw === "1" && (
								<li
									className={`top-menu-Item ${
										getActivePage("/cncpunching") ? "top-menu-Item-active" : ""
									}`}
								>
									<NavLink
										className="inactive-tm top-menu-link"
										exact
										activeClassName="active-tm"
										to="/cncpunching"
									>
										<Tooltip title="CNC Puching" placement="left-end">
											<img
												src={
													getActivePage("/cncpunching") ? punch_cl : Punching
												}
												height={35}
												width={35}
												alt="modules"
											/>
										</Tooltip>
									</NavLink>
								</li>
							)}
							{accessModuleList.filter(
								(x) => x.module_name === "M1epBending"
							)[0].access_rw === "1" && (
								<li
									className={`top-menu-Item ${
										getActivePage("/epBending") ? "top-menu-Item-active" : ""
									}`}
								>
									<NavLink
										className="inactive-tm top-menu-link"
										exact
										activeClassName="active-tm"
										to="/epBending"
									>
										<Tooltip title="End Plate Bending" placement="left-end">
											<img
												src={getActivePage("/epBending") ? ep_bend_cl : Bending}
												height={45}
												width={45}
												alt="modules"
											/>
										</Tooltip>
									</NavLink>
								</li>
							)}
							{accessModuleList.filter(
								(x) => x.module_name === "M2tubeCutting"
							)[0].access_rw === "1" && (
								<li
									className={`top-menu-Item ${
										getActivePage("/tubecutting") ? "top-menu-Item-active" : ""
									}`}
								>
									<NavLink
										className="inactive-tm top-menu-link"
										exact
										activeClassName="active-tm"
										to="/tubecutting"
									>
										<Tooltip title="Tube Cutting" placement="left-end">
											<img
												src={getActivePage("/tubecutting") ? tc_cl : Tube}
												height={45}
												width={45}
												alt="modules"
											/>
										</Tooltip>
									</NavLink>
								</li>
							)}
							{accessModuleList.filter(
								(x) => x.module_name === "M3finsPunching"
							)[0].access_rw === "1" && (
								<li
									className={`top-menu-Item ${
										getActivePage("/finpunching") ? "top-menu-Item-active" : ""
									}`}
								>
									<NavLink
										className="inactive-tm top-menu-link"
										exact
										activeClassName="active-tm"
										to="/finpunching"
									>
										<Tooltip title="Fin Punching" placement="left-end">
											<img
												src={getActivePage("/finpunching") ? fin_cl : Fins}
												height={45}
												width={45}
												alt="modules"
											/>
										</Tooltip>
									</NavLink>
								</li>
							)}
							{accessModuleList.filter(
								(x) => x.module_name === "M3coilAssembly"
							)[0].access_rw === "1" && (
								<li
									className={`top-menu-Item ${
										getActivePage("/coilassembly") ? "top-menu-Item-active" : ""
									}`}
								>
									<NavLink
										className="inactive-tm top-menu-link"
										exact
										activeClassName="active-tm"
										to="/coilassembly"
									>
										<Tooltip title="Coil Assembly" placement="left-end">
											<img
												src={getActivePage("/coilassembly") ? ca_cl : Assembly}
												height={45}
												width={45}
												alt="modules"
											/>
										</Tooltip>
									</NavLink>
								</li>
							)}
							{accessModuleList.filter(
								(x) => x.module_name === "M3coilExpansion"
							)[0].access_rw === "1" && (
								<li
									className={`top-menu-Item ${
										getActivePage("/coilexpansion")
											? "top-menu-Item-active"
											: ""
									}`}
								>
									<NavLink
										className="inactive-tm top-menu-link"
										exact
										activeClassName="active-tm"
										to="/coilexpansion"
									>
										<Tooltip title="Coil Expansion" placement="left-end">
											<img
												src={getActivePage("/coilexpansion") ? ce_cl : CEx}
												height={45}
												width={45}
												alt="modules"
											/>
										</Tooltip>
									</NavLink>
								</li>
							)}
							{accessModuleList.filter(
								(x) => x.module_name === "M4brazingLeak"
							)[0].access_rw === "1" && (
								<li
									className={`top-menu-Item ${
										getActivePage("/brazing") ? "top-menu-Item-active" : ""
									}`}
								>
									<NavLink
										className="inactive-tm top-menu-link"
										exact
										activeClassName="active-tm"
										to="/brazing"
									>
										<Tooltip title="Brazing and Testing" placement="left-end">
											<img
												src={getActivePage("/brazing") ? brazing_cl : Brazing}
												height={45}
												width={45}
												alt="modules"
											/>
										</Tooltip>
									</NavLink>
								</li>
							)}
							{accessModuleList.filter(
								(x) => x.module_name === "M4paintPacking"
							)[0].access_rw === "1" && (
								<li
									className={`top-menu-Item ${
										getActivePage("/paintingpacking")
											? "top-menu-Item-active"
											: ""
									}`}
								>
									<NavLink
										className="inactive-tm top-menu-link"
										exact
										activeClassName="active-tm"
										to="/paintingpacking"
									>
										<Tooltip title="Painting" placement="left-end">
											<img
												src={
													getActivePage("/paintingpacking")
														? paint_cl
														: Painting
												}
												height={45}
												width={45}
												alt="modules"
											/>
										</Tooltip>
									</NavLink>
								</li>
							)}
							{accessModuleList.filter((x) => x.module_name === "Dispatch")[0]
								.access_rw === "1" && (
								<li
									className={`top-menu-Item ${
										getActivePage("/dispatch") ? "top-menu-Item-active" : ""
									}`}
								>
									<NavLink
										className="inactive-tm top-menu-link"
										exact
										activeClassName="active-tm"
										to="/dispatch"
									>
										<Tooltip title="Dispatch" placement="left-end">
											<img
												src={getActivePage("/dispatch") ? disp_cl : Disp}
												height={45}
												width={45}
												alt="modules"
											/>
										</Tooltip>
									</NavLink>
								</li>
							)}
							{
								<li
									className={`top-menu-Item ${
										getActivePage("/myprofile") ? "top-menu-Item-active" : ""
									}`}
								>
									<NavLink
										className="inactive-tm top-menu-link"
										exact
										activeClassName="active-tm"
										to="/myprofile"
									>
										<img
											src={user}
											style={{
												width: "50px",
												height: "50px",
												borderRadius: "15px",
											}}
											alt="user"
										/>
									</NavLink>
								</li>
							}
							{
								<li className={`top-menu-Item top-menu-link`}>
									<IconButton
										onClick={handleLogout}
										className="btn btn-primary top-menu-link"
										variant="contained"
										style={{ backgroundColor: "#943612", color: "white" }}
									>
										<PowerSettingsNewIcon />
									</IconButton>
								</li>
							}
						</ul>
					</div>
				</div>
			</main>
		</div>
	);
};
export default Header;
