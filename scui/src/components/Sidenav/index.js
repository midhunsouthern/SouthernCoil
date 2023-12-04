import React from 'react';
import { NavLink } from 'react-router-dom';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LoginIcon from '@mui/icons-material/Login';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import ListAltIcon from '@mui/icons-material/ListAlt';
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';
import DvrSharpIcon from '@mui/icons-material/DvrSharp';
import RoofingIcon from '@mui/icons-material/Roofing';
import Tooltip from '@mui/material/Tooltip';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ScheduleIcon from '@mui/icons-material/Schedule';
import brandLogo from '../../assets/img/logo1.png';
export default function SideNav() {
  return (
    <div>
      <main className='main'>
        <nav className="nav">
          <div className="burger-menu">
          <NavigateNextRoundedIcon/>
          </div>
          <div className="top">
            <div style={{backgroundColor:"#FFD7C8",height: "105px"}}>
              <img src={brandLogo} className="navbar-brand img-fluid"/>
            </div>
            <ul className="navigation navbar-top">
              <li className="item">
                <div className="link" >
                  <NavLink className="inactive" exact activeClassName="active" to='/'>
                    <Tooltip title="Home"  placement="left-end">
                        <RoofingIcon fontSize='large'/>
                    </Tooltip>
                  </NavLink>
                </div>
              </li>
              <li className="item">
                <div className="link" >
                  <NavLink className="inactive" exact activeClassName="active" to='/myprofile'>
                    <Tooltip title="My Profile"  placement="left-end">
                      <PersonOutlineIcon fontSize='large' />
                    </Tooltip>
                  </NavLink> 
                </div>
              </li>
              <li className="item">
                <div className="link" >
                  <NavLink className="inactive" exact activeClassName="active" to='/createAccessTypes'>
                    <Tooltip title="Create Access"  placement="left-end">
                      <LoginIcon fontSize='large'/>
                    </Tooltip>
                  </NavLink> 
                </div>
              </li>
              <li className="item">
                <div className="link" >
                  <NavLink className="inactive" exact activeClassName="active" to='/Users'>
                    <Tooltip title="Create Users"  placement="left-end">
                      <PeopleOutlineIcon fontSize='large'/>
                    </Tooltip>
                  </NavLink> 
                </div>
              </li>
              <li className="item">
                <div className="link" >
                  <NavLink className="inactive" exact activeClassName="active" to='/createCustomer'>
                    <Tooltip title="Create Customer"  placement="left-end">
                      <PersonAddAltIcon fontSize='large'/>
                    </Tooltip>
                  </NavLink> 
                </div>
              </li>
              <li className="item">
                <div className="link" >
                  <NavLink className="inactive" exact activeClassName="active" to='/lookupentry'>
                    <Tooltip title="Look-up Entried"  placement="left-end">
                    <ListAltIcon fontSize='large'/>
                    </Tooltip>
                  </NavLink> 
                </div>
              </li>
              <li className="item">
                <div className="link" >
                  <NavLink className="inactive" exact activeClassName="active" to='/listcustomer'>
                    <Tooltip title="Manage Customer"  placement="left-end">
                      <GroupAddOutlinedIcon fontSize='large'/>
                    </Tooltip>
                  </NavLink> 
                </div>
              </li>
              <li className="item">
                <div className="link" >
                  <NavLink className="inactive" exact activeClassName="active" to='/orderList'>
                    <Tooltip title="Manage Order"  placement="left-end">
                      <DvrSharpIcon fontSize='large'/>
                    </Tooltip>
                  </NavLink> 
                </div>
              </li>
              <li className="item">
                <div className="link" >
                  <NavLink className="inactive" exact activeClassName="active" to='/createOrder'>
                    <Tooltip title="Create Order"  placement="left-end">
                      <AddShoppingCartIcon fontSize='large'/>
                    </Tooltip>
                  </NavLink> 
                </div>
              </li>
              <li className="item">
                <div className="link" >
                  <NavLink className="inactive" exact activeClassName="active" to='/scheduler'>
                    <Tooltip title="Scheduler"  placement="left-end">
                      <ScheduleIcon fontSize='large'/>
                    </Tooltip>
                  </NavLink>
                </div>
              </li>
            </ul>
          </div>
        </nav>
      </main>
    </div>
  )
}
