import React, { useEffect, useState,useContext } from "react";
import { NavLink, useNavigate,useResolvedPath } from "react-router-dom";
import Assembly from '../../assets/img/appIcons/Assembly.png';
import Bending from '../../assets/img/appIcons/Bending.png';
import Brazing from '../../assets/img/appIcons/Brazing.png';
import CEx from '../../assets/img/appIcons/Coil Expansion.png';
import Disp from '../../assets/img/appIcons/Dispatch.png';
import Fins from '../../assets/img/appIcons/Fins.png';
import Nesting from '../../assets/img/appIcons/Nesting.png';
import Painting from '../../assets/img/appIcons/Painting.png';
import Punching from '../../assets/img/appIcons/Punching.png';
import Tube from '../../assets/img/appIcons/Tube.png';
import user from '../../assets/img/prof-img.jpeg';

import brazing_cl from '../../assets/img/appIcons/br-braz.png';
import ca_cl from '../../assets/img/appIcons/br-ca.png';
import ce_cl from '../../assets/img/appIcons/br-ce.png';
import dash_cl from '../../assets/img/appIcons/br-dash.png';
import disp_cl from '../../assets/img/appIcons/br-disp.png';
import oentry_cl from '../../assets/img/appIcons/br-entry.png';
import ep_bend_cl from '../../assets/img/appIcons/br-ep_bend.png';
import fin_cl from '../../assets/img/appIcons/br-fin.png';
import nesting_cl from '../../assets/img/appIcons/br-nesting.png';
import paint_cl from '../../assets/img/appIcons/br-paint.png';
import porder_cl from '../../assets/img/appIcons/br-pend-order.png';
import prg_mst_cl from '../../assets/img/appIcons/br-prg_mst.png';
import punch_cl from '../../assets/img/appIcons/br-punch.png';
import status_cl from '../../assets/img/appIcons/br-status.png';
import tc_cl from '../../assets/img/appIcons/br-tc.png';
import wip_cl from '../../assets/img/appIcons/br-wip.png';

import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import { IconButton, Tooltip } from "@mui/material";
import { AccessContext } from '../../constant/accessContext';

const Header = () => {
  const access = useContext(AccessContext);
  const resolvePath = useResolvedPath().pathname;
  const [greetings, setGreetings] = useState("");
  const navigate = useNavigate();
  function handleLogout(){
    localStorage.clear();
    access.handleLogout();
  }

  const getActivePage = (pathMatch) => {
    return resolvePath === pathMatch;
  }

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
      <main className="main prime-bg" >
        <div className="content" >
          <div className="nav-horizontal">
            <ul className="navbar-horizontal ">
              <li className={`top-menu-Item p-4 ${getActivePage('/cncnesting')? 'top-menu-Item-active':''}`}>
                  <NavLink className="inactive-tm" exact activeClassName="active-tm" to='/cncnesting'>
                    <Tooltip title="CNC Nesting"  placement="left-end">
                        <img src={getActivePage('/cncnesting') ? nesting_cl:Nesting } height={45} width={45} alt="modules"/>
                    </Tooltip>
                  </NavLink>
              </li>
              <li className={`top-menu-Item p-4 ${getActivePage('/cncpunching')? 'top-menu-Item-active':''}`}>
                  <NavLink className="inactive-tm " exact activeClassName="active-tm" to='/cncpunching'>
                    <Tooltip title="CNC Puching"  placement="left-end">
                      <img src={getActivePage('/cncpunching') ? punch_cl:Punching} height={35} width={35} alt="modules"/>
                    </Tooltip>
                  </NavLink>
              </li>
              <li className={`top-menu-Item p-4 ${getActivePage('/epBending')? 'top-menu-Item-active':''}`}>
                  <NavLink className="inactive-tm" exact activeClassName="active-tm" to='/epBending'>
                    <Tooltip title="End Plate Bending"  placement="left-end">
                        <img src={getActivePage('/epBending') ?ep_bend_cl:Bending} height={45} width={45} alt="modules"/>
                    </Tooltip>
                  </NavLink>
              </li>
              <li className={`top-menu-Item p-4 ${getActivePage('/tubecutting')? 'top-menu-Item-active':''}`}>
                  <NavLink className="inactive-tm" exact activeClassName="active-tm" to='/tubecutting'>
                    <Tooltip title="Tube Cutting"  placement="left-end">
                        <img src={getActivePage('/tubecutting') ?tc_cl:Tube} height={45} width={45} alt="modules"/>
                    </Tooltip>
                  </NavLink>
              </li>
              <li className={`top-menu-Item p-4 ${getActivePage('/finpunching')? 'top-menu-Item-active':''}`}>
                  <NavLink className="inactive-tm" exact activeClassName="active-tm" to='/finpunching'>
                    <Tooltip title="Fin Punching"  placement="left-end">
                        <img src={getActivePage('/finpunching') ?fin_cl:Fins} height={45} width={45} alt="modules"/>
                    </Tooltip>
                  </NavLink>
              </li>
              <li className={`top-menu-Item p-4 ${getActivePage('/coilassembly')? 'top-menu-Item-active':''}`}>
                  <NavLink className="inactive-tm" exact activeClassName="active-tm" to='/coilassembly'>
                    <Tooltip title="Coil Assembly"  placement="left-end">
                        <img src={getActivePage('/coilassembly') ?ca_cl:Assembly} height={45} width={45} alt="modules"/>
                    </Tooltip>
                  </NavLink>
              </li>
              <li className={`top-menu-Item p-4 ${getActivePage('/coilexpansion')? 'top-menu-Item-active':''}`}>
                  <NavLink className="inactive-tm" exact activeClassName="active-tm" to='/coilexpansion'>
                    <Tooltip title="Coil Expansion"  placement="left-end">
                        <img src={getActivePage('/coilexpansion') ?ce_cl:CEx} height={45} width={45} alt="modules"/>
                    </Tooltip>
                  </NavLink>
              </li>
              <li className={`top-menu-Item p-4 ${getActivePage('/brazing')? 'top-menu-Item-active':''}`}>
                  <NavLink className="inactive-tm" exact activeClassName="active-tm" to='/brazing'>
                    <Tooltip title="Brazing and Testing"  placement="left-end">
                        <img src={getActivePage('/brazing') ?brazing_cl:Brazing} height={45} width={45} alt="modules"/>
                    </Tooltip>
                  </NavLink>
              </li>
              <li className={`top-menu-Item p-4 ${getActivePage('/paintingpacking')? 'top-menu-Item-active':''}`}>
                  <NavLink className="inactive-tm" exact activeClassName="active-tm" to='/paintingpacking'>
                    <Tooltip title="Painting"  placement="left-end">
                        <img src={getActivePage('/paintingpacking') ?paint_cl:Painting} height={45} width={45} alt="modules"/>
                    </Tooltip>
                  </NavLink>
              </li>
              <li className={`top-menu-Item p-4 ${getActivePage('/dispatch')? 'top-menu-Item-active':''}`}>
                  <NavLink className="inactive-tm" exact activeClassName="active-tm" to='/dispatch'>
                    <Tooltip title="Dispatch"  placement="left-end">
                        <img src={getActivePage('/dispatch') ?disp_cl :Disp} height={45} width={45} alt="modules"/>
                    </Tooltip>
                  </NavLink>
              </li>
              <li className={`top-menu-Item p-4 ${getActivePage('/myprofile')? 'top-menu-Item-active':''}`}>
                <NavLink className="inactive-tm" exact activeClassName="active-tm" to='/myprofile'>
                  <img src={user} style={{  width:'50px',  height: '50px',borderRadius: '15px'}} alt="user"/>
                </NavLink>
              </li>
              <li className={`top-menu-Item p-4`}>
                <IconButton onClick={handleLogout} className="btn btn-primary" variant="contained" style={{    backgroundColor: "#943612", color: "white"}}>
                  <PowerSettingsNewIcon />
                </IconButton>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};
export default Header;
