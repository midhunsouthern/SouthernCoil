import { Button, TextareaAutosize, TextField } from "@mui/material";
import { Container } from "@mui/system";
import customer from '../../assets/img/customer.jpg';
import { setCustomersData } from '../../constant/url';
import { AccessContext } from '../../constant/accessContext';
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CreateCustomer() {
  const access = useContext(AccessContext).authID;
  const [ custId, setCustId] = useState(null);
  const [ fullName, setFullName] = useState(null);
  const [ mobileId, setMobileId] = useState(null);
  const [ email, setEmail] = useState(null);
  const [ address, setAddress] = useState(null);
  const [ poc, setPoc] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    var bodyFormData = new FormData();
    bodyFormData.append('authId', access);
    bodyFormData.append('id', custId);
    bodyFormData.append('fname', fullName);
    bodyFormData.append('email', email);
    bodyFormData.append('phone', mobileId);
    bodyFormData.append('address', address);
    bodyFormData.append('poc', poc);

    axios({
      method: "post",
      url: setCustomersData ,
      data: bodyFormData,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then(function (response) {
        //handle success
        const res_data = response.data;
        console.log(res_data);
        if(res_data.status_code === 200){
          toast(res_data.status_msg,"success");
          setAddress('');
          setEmail('');
          setFullName('');
          setMobileId('');
          setPoc('');
        }else {
          console.log(res_data.status_msg)
        }
        
      })
      .catch(function (response) {
        //handle error
        console.log(response);
      });
  }

  return (
    <div>
      <div className="main mt-0 pt-0">
        <div className="content">
          <ToastContainer />
            <div className="row">
              <div className="col-12">
                <div>
                  <h5 className="headline mb-2 mx-2">Create Customer</h5>
                </div>
                <div className="card shadow-card">
                  <div className="card-body">
                    <form onSubmit={handleSubmit}>
                      <Container>
                        <div className="row">
                        <div className="col-lg-6">
                          <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="name"
                            size="small"
                            label="Name"
                            name="name"
                            autoComplete="name"
                            onChange={(e) => setFullName(e.target.value)}
                            value={fullName}
                          />
                          <TextField
                            margin="normal"
                            fullWidth
                            id="email"
                            size="small"
                            label="Email"
                            name="email"
                            autoComplete="email"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                          />
                          <TextField
                            margin="normal"
                            fullWidth
                            type={'number'}
                            id="phone"
                            size="small"
                            label="Phone"
                            name="phone"
                            autoComplete="phone"
                            onChange={(e) => setMobileId(e.target.value)}
                            value={mobileId}
                          />
                          <TextField
                            margin="normal"
                            id="outlined-multiline-static"
                            label="Address"
                            multiline
                            rows={4}
                            fullWidth
                            variant="outlined"
                            onChange={(e) => setAddress(e.target.value)}
                            value={address}
                          />
                          <TextField
                            margin="normal"
                            fullWidth
                            id="contact"
                            size="small"
                            label="Point of Contact"
                            name="contact"
                            autoComplete="contact"
                            onChange={(e) => setPoc(e.target.value)}
                            value={poc}
                          />
                            <Button className="float-right mt-2" variant="contained" size="large" type="submit">
                              Submit
                            </Button>
                        </div>
                        <div className="col-lg-6 d-flex justify-content-center align-items-center">
                          {/** Make the list of customers created. */}
                          <img src={customer}  className='img-fluid'/>
                        </div>
                        </div>
                      </Container>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
      </div>
    </div>
  );
}
