import { Button, TextareaAutosize, TextField } from "@mui/material";
import { Container } from "@mui/system";
import customer from "../../assets/img/customer.jpg";
import React from "react";

export default function createCustomer() {
  return (
    <div>
      <div className="main mt-0 pt-0">
        <div className="content">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div>
                  <h5 className="headline mb-2 mx-2">Create Customer</h5>
                </div>
                <div className="card shadow-card">
                  <div className="card-body">
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
                          />
                          <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            size="small"
                            label="Email"
                            name="email"
                            autoComplete="email"
                          />
                          <TextField
                            margin="normal"
                            required
                            fullWidth
                            type={"number"}
                            id="phone"
                            size="small"
                            label="Phone"
                            name="phone"
                            autoComplete="phone"
                          />
                          <TextField
                            margin="normal"
                            id="outlined-multiline-static"
                            label="Address"
                            multiline
                            rows={4}
                            fullWidth
                            variant="outlined"
                          />
                          <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="contact"
                            size="small"
                            label="Point of Contact"
                            name="contact"
                            autoComplete="contact"
                          />
                          <Button
                            className="float-right mt-2"
                            variant="contained"
                            size="small"
                          >
                            Submit
                          </Button>
                        </div>
                        <div className="col-lg-6 d-flex justify-content-center align-items-center">
                          <img src={customer} className="img-fluid" />
                        </div>
                      </div>
                    </Container>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
