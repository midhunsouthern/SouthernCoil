import * as React from "react";
import axios from "axios";
import Moment from 'react-moment';
import Box from "@mui/material/Box";
import { AccessContext } from '../../constant/accessContext';
import CreateRoundedIcon from '@mui/icons-material/CreateRounded';
import { getSaveOrderGeneric} from "../../constant/url";
import { ToastContainer, toast } from 'react-toastify';
import { DataGrid, GridToolbar, esES } from "@mui/x-data-grid";

import { handleSize } from "../../commonjs/CommonFun";
import { Typography } from "@mui/material";

export default function SavedTempOrders(prop) {
  const access = React.useContext(AccessContext).authID;
  const [orderList, setOrderList ] = React.useState([]);
  const columns = [
    {
      field: 'order_date',
      headerName: 'Order Date',
      width: 150,
    },
    {
      field: 'sq_feet',
      headerName: 'Sq Feet',
      width: 75,
    },
    {
      headerName:  'Size',
      type: 'number',
      width: 150,
      valueGetter: (params) => handleSize(params.row.length, params.row.height, params.row.rows, params.row.quantity),
    },
    {
      field: 'full_customer_name',
      headerName: 'Full name',
      sortable: false,
      width: 150,
    },
  ];

    const handleOrderList = (authID) => {
      console.log("executing saved order template");
      var bodyFormData = new FormData();
      bodyFormData.append('authId', authID);
      axios({
        method: "post",
        url: getSaveOrderGeneric,
        data: bodyFormData,
        headers: { "Content-Type": "multipart/form-data" },
      })
        .then(function (response) {
          //handle success
          const res_data = response.data;
          if (res_data.status_code === 101){
            toast('Api Authentication failed. login again.')
          }else if(res_data.status_code === 200){
            const ret_data_cd = res_data.data;
            setOrderList(ret_data_cd);
          }else {
            console.log(res_data.status_msg)
          }
        })
        .catch(function (response) {
          //handle error
          console.log(response);
        });
    }

    React.useEffect(() => {
        handleOrderList(access);
    },[]);

  return (
    <div className="modal-body">
        <div className="content">
          <Typography variant="h5">Saved Order Data</Typography>
            <div className="row">
              <Box sx={{ height: 400, width: '60%', marginLeft:'10%' }}>
                <DataGrid
                  rows={orderList}
                  columns={columns}
                  slots={{ toolbar: GridToolbar }}
                  initialState={{
                    pagination: {
                      paginationModel: {
                        pageSize: 5,
                      },
                    },
                  }}
                  pageSizeOptions={[5]}
                  onSelectionModelChange={(ids) => {
                    console.log(ids);
                  }}
                  onRowClick={(param) => prop.selectedRow(param.id)}
                />
              </Box>
            </div>
        </div>
      </div>
  );
}
