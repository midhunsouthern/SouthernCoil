import React, { useContext, useEffect, useState } from "react";
import profile from "../../../assets/img/prof-img.jpeg";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { AccessContext } from '../../../constant/accessContext';
import ReactFileReader from "react-file-reader";
import {
  FormControl,
  Select,
  FormHelperText,
  Input,
  MenuItem,
  InputLabel,
  TextField,
} from "@mui/material";
import { Container } from "@mui/system";
import axios from "axios";
import { getProfileDataURL, setProfileDataURL } from '../../../constant/url';
import { Form, json } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Profile() {
  // The first commit of Material-UI
  const access = useContext(AccessContext).authID;
  const [ selectedDate, setSelectedDate ] = useState(
    new Date()
  );
  const [ empImg, setempImg ] = useState(profile);
  const [ empId, setEmpId] = useState(null);
  const [ fullName, setFullName] = useState(null);
  const [ mobileId, setMobileId] = useState(null);
  const [ email, setEmail] = useState(null);
  const [ accessType, setAccessType] = useState(null);
  const [ password, setPassword] = useState(null);
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    var bodyFormData = new FormData();
    bodyFormData.append('profile_image',empImg);
    bodyFormData.append('authId', access);
    bodyFormData.append('fname', fullName);
    bodyFormData.append('email', email);
    bodyFormData.append('dob', selectedDate);
    bodyFormData.append('mobile_no', mobileId);
    bodyFormData.append('emp_no', empId);
    bodyFormData.append('password', password);
    bodyFormData.append('access_type', accessType);

    axios({
      method: "post",
      url: setProfileDataURL ,
      data: bodyFormData,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then(function (response) {
        //handle success
        const res_data = response.data;
        if(res_data.status_code === 200){
          toast("Update Successful");
//return data
        }else {
          console.log(res_data.status_msg)
        }
        
      })
      .catch(function (response) {
        //handle error
        console.log(response);
      });
  }

  const handleGetProfileData = (authID) => {
    var bodyFormData = new FormData();
    bodyFormData.append('authId', authID);

    axios({
      method: "post",
      url: getProfileDataURL ,
      data: bodyFormData,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then(function (response) {
        //handle success
        const res_data = response.data;
        if (res_data.status_code === 101){
          toast('Api Aithentication failed. login again.')
        }else if(res_data.status_code === 200){
          const ret_data_at = response.data.data_access_type;
          const ret_data_dp = response.data.data_profile;
          setempImg(ret_data_dp[0].profile_image);
          setEmpId(ret_data_dp[0].emp_no);
          setFullName(ret_data_dp[0].fname);
          setEmail(ret_data_dp[0].email);
          setMobileId(ret_data_dp[0].mobile_no);
          setSelectedDate(ret_data_dp[0].dob);
          setAccessType(ret_data_dp[0].access_type);
          setPassword(ret_data_dp[0].password);
          
        }else {
          console.log(res_data.status_msg)
        }
        
      })
      .catch(function (response) {
        //handle error
        console.log(response);
      });
  }

  function handleSelectImg(files) {
    setempImg(files.base64);
  }

  useEffect(() => {
    handleGetProfileData(access);
  },[]);

  return (
    <div>
      <main className="main mt-0 p-0">
      <ToastContainer />
        <div className="content pt-0">
          <div className="container mb-0">
            <div className="d-flex mb-2 mt-0 justify-content-center position-relative">
              <div className="App">
                <>
                    <img src={empImg} alt="Avatar Placeholder" />
                  <ReactFileReader
                    fileTypes={[".png", ".jpg"]}
                    base64={true}
                    handleFiles={handleSelectImg}
                  >
                    <PhotoCamera fontSize="small" />
                  </ReactFileReader>
                </>
              </div>
            </div>
            <div className="text-center prof-txt">
              <p className="mb-2">{fullName}</p>
              <p className="role">{accessType}</p>
            </div>
            <div className="col-12 position-relative my-4">
              <div className="row">
                <div className="col-sm-12">
                  <div className="card shadow-card">
                    <div className="card-body">
                      <form action="#"  onSubmit={handleSubmit} >
                        <div className="row">
                          <div className="col-sm-6">
                            <Container>
                              <TextField
                                margin="normal"
                                fullWidth
                                id="name"
                                label="Employee ID"
                                name="name"
                                autoComplete="Employee ID"
                                autoFocus
                                InputLabelProps={{
                                  shrink: ((empId !== '')? true : false),
                                }}
                                value={empId}
                                onChange={(e) => setEmpId(e.target.value)}
                              />
                              <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="name"
                                label="Full Name"
                                name="name"
                                autoComplete="name"
                                autoFocus
                                InputLabelProps={{
                                  shrink: ((fullName !== '')? true : false),
                                }}
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                              />
                              <TextField
                                margin="normal"
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                value={email}
                                InputLabelProps={{
                                  shrink: ((email !== '')? true : false),
                                }}
                                onChange={(e) => setEmail(e.target.value)}
                              />
                              <TextField
                                type='password'
                                margin="normal"
                                required
                                fullWidth
                                id="password"
                                label="Password"
                                name="password"
                                InputLabelProps={{
                                  shrink: ((password !== '')? true : false),
                                }}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                              />
                            </Container>
                          </div>
                          <div className="col-sm-6">
                            <Container>
                              <TextField
                                margin="normal"
                                id="date"
                                label="Date Of Birth"
                                fullWidth
                                type="date"
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                              />
                              <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="mobile"
                                label="Mobile Number"
                                name="mobile"
                                InputLabelProps={{
                                  shrink: ((mobileId !== '')? true : false),
                                }}
                                value={mobileId}
                                onChange={(e) => setMobileId(e.target.value)}
                              />
                              <TextField
                                margin="normal"
                                fullWidth
                                id="AccessType"
                                label="Access Type (Read Only)"
                                name="access_TYpe"
                                InputLabelProps={{
                                  shrink: ((mobileId !== '')? true : false),
                                }}
                                value={accessType}
                              />
                              <div className="float-right my-2 ">
                                <Button variant="contained" size="large" type="submit">
                                  Save
                                </Button>
                              </div>
                            </Container>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
