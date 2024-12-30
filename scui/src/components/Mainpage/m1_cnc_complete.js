import { useState, useEffect } from 'react'
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AccessContext } from '../../constant/accessContext';
import { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import RemoveIcon from '@mui/icons-material/Remove';
import { ToastContainer } from 'react-toastify';
import ModuleTools from '../modals/ModuleTools';
import {
    Container,
    Card,
    CardContent,
    Typography,
    Stack,
} from '@mui/material';
import {
    getOrderAllLakVal,
    getCncProgramList,
    getCncCompletedPrograms,
    axiosInstances
} from '../../constant/url';



import {
    GridToolbar,
    GridToolbarContainer,
} from '@mui/x-data-grid';
import useAxiosInterceptor from '../Interceptors/axios';

export default function M1cncProgramMasterComplete() {
    const accessModuleList = useContext(AccessContext).accessModuleList;
    const [selectedOrderList, setSelectedOrderList] = useState([])
    const [orderList, setOrderList] = useState([]);
    const [flattenedRows, setFlattenedRows] = useState([]);
    useAxiosInterceptor(axiosInstances)
    const access = useContext(AccessContext).authID;
    const slotColumnCommonFields = {
        sortable: false,
        filterable: false,
        pinnable: false,
        hideable: false,
        cellClassName: (params) => {
            return `${params?.field}-${params.row?.primaryId % 2 === 0 ? 'even' : 'odd'
                }`;
        },
    };

    const handleOrderList = () => {
        var bodyFormData = new FormData();
        bodyFormData.append('authId', access);
        bodyFormData.append('pageType', 'endPlateBending');
        axiosInstances({
            method: 'post',
            url: getOrderAllLakVal,
            data: bodyFormData,
            headers: { 'Content-Type': 'multipart/form-data' },
        })
            .then(function (response) {
                //handle success
                const res_data = response.data;
                if (res_data.status_code === 101) {
                    toast('Api Authentication failed. login again.');
                } else if (res_data.status_code === 200) {
                    const data = res_data.data_orders;
                    setSelectedOrderList(data)
                    const ret_data_cd = [
                        {
                            id: 1,
                            program: '',
                            complete: '',
                            cnc_row_delete: 1,
                            orders: [
                                {
                                    orderNo: '',
                                    customerName: '',
                                    size: '',
                                    model: '',
                                    quantity: 0,
                                    ok: 0,
                                    rejection: 0,
                                    reason: '',
                                },
                                //   {
                                //     orderNo: '240624',
                                //     customerName: 'Aries Appliances',
                                //     size: 'F',
                                //     model: 'EP',
                                //     quantity: 12,
                                //     ok:0,
                                //     rejection: 0,
                                //     reason: '',
                                //   },
                                //   {
                                //     orderNo: '240608',
                                //     customerName: 'Chennai Ref',
                                //     size: '8 x 8 x 3R - 2',
                                //     model: 'EP',
                                //     quantity: 4,
                                //     ok: 0,
                                //     rejection: 0,
                                //     reason: '',
                                //   },
                                //   {
                                //     orderNo: '240614',
                                //     customerName: 'Chennai Ref',
                                //     size: '8 x 8 x 3R - 2',
                                //     model: 'EP',
                                //     quantity: 4,
                                //     ok: 0,
                                //     rejection: 0,
                                //     reason: '',
                                //   },
                            ],
                        },
                        // {
                        //   id: 2,
                        //   program: 'CCAL 2mm Feb 2024',
                        //   complete: '3/7/2024 04:40pm',
                        //   cnc_row_delete: 2,

                        //   orders: [
                        //     {
                        //       orderNo: '240608',
                        //       customerName: 'Chennai Ref',
                        //       size: '8 x 8 x 3R - 2',
                        //       model: 'EP',
                        //       quantity: 4,
                        //       ok: 0,
                        //       rejection: 0,
                        //       reason: '',
                        //     },
                        //     {
                        //       orderNo: '240614',
                        //       customerName: 'Air Cool Centre & Co',
                        //       size: '32 x 4 x 4R - 1',
                        //       model: 'EP',
                        //       quantity: 2,
                        //       ok: 0,
                        //       rejection: 0,
                        //       reason: '',
                        //     },
                        //     {
                        //       orderNo: '240624',
                        //       customerName: 'Aries Appliances',
                        //       size: 'F',
                        //       model: 'EP',
                        //       quantity: 12,
                        //       ok: 0,
                        //       rejection: 0,
                        //       reason: '',
                        //     },
                        //     {
                        //       orderNo: '240626',
                        //       customerName: 'Aries Appliances',
                        //       size: '12 x 8 x 4R - 6',
                        //       model: 'EP',
                        //       quantity: 12,
                        //       ok: 0,
                        //       rejection: 0,
                        //       reason: '',
                        //     },
                        //   ],
                        // },
                    ];
                    setOrderList(ret_data_cd);
                    toast('Order Retrieved');
                } else {
                    console.log(res_data.status_msg);
                }
            })
            .catch(function (response) {
                //handle error
                console.log(response);
            });
    };

    useEffect(() => {
        handleProgramList(access);
    }, [])

    const handleProgramList = () => {
        var bodyFormData = new FormData();
        bodyFormData.append('authId', access);
        bodyFormData.append('pageType', 'endPlateBending');
        axios({
            method: 'post',
            url: getCncCompletedPrograms,
            data: bodyFormData,
            headers: { 'Content-Type': 'multipart/form-data' },
        })
            .then(function (response) {
                // Handle success
                const res_data = response.data;
                console.log(res_data);
                if (res_data.status_code === 101) {
                    toast('API Authentication failed. Please log in again.');
                } else if (res_data.status_code === 200) {
                    const data = res_data.data;
                    if (data.length !== 0) {
                        const originalData = data;
                        if (Array.isArray(originalData)) {
                            const transformedData = originalData.map(transformObject);
                            setOrderList(transformedData);
                        }
                        else {
                            const transformedData = transformObject(originalData);
                            setOrderList([transformedData]);
                        }
                        toast('Completed Records retrived successfully.');
                    } else {
                        setOrderList([]);
                    }
                } else {
                    console.log(res_data.status_msg);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    };
    const transformObject = (obj) => {
        return {
            cnc_pgm_id: obj.cnc_pgm_id ? parseInt(obj.cnc_pgm_id) : 0,
            program: obj.program_name ? obj.program_name : '',
            createdDate: obj.creation_datetime ? obj.creation_datetime : '',
            orders: obj.orders.map((item) => ({
                order_id: item.id ? item.id : 0,
                orderNo: item.order_no ? item.order_no : '',
                customerName: item.customer_name ? item.customer_name : '',
                size: item.size ? item.size : '',
                model: item.model ? item.model : '',
                quantity: item.quantity ? parseInt(item.quantity, 10) : 0,
                ok: item.ok_count ? parseInt(item.ok_count, 10) : 0,
                rejection: item.rejection_count ? parseInt(item.rejection_count, 10) : 0,
                reason: item.reason ? item.reason : '',
            })),
        };
    };

    useEffect(() => {
        const flattenedRowsfn = () => {
            return orderList.map((programData, index) => [
                ...programData.orders?.map((order, orderIndex) => ({
                    primaryId: programData.cnc_pgm_id,
                    id: `${programData.cnc_pgm_id}-${orderIndex}`,
                    program: programData.program,
                    createdDate: programData.createdDate,
                    cnc_row_delete: programData.is_completed,
                    orderNo: order.orderNo,
                    customerName: order.customerName,
                    size: order.size,
                    model: order.model,
                    quantity: order.quantity,
                    ok: order.ok,
                    rejection: order.rejection,
                    reason: order.reason,
                    isFirstRow: orderIndex === 0,
                })) || [],
                
            ]).flat(); // Use .flat() to flatten the array

        };

        setFlattenedRows(flattenedRowsfn());
        console.log(flattenedRows);
    }, [orderList]);

    const refreshData = (request) => {
        if (request) {
            handleOrderList(access);
        }
    };

    const columns = [
        {
            field: 'program',
            headerName: 'Program',
        },
        {
            field: 'createdDate',
            headerName: 'Creation Date',
            width: 250,
            renderCell: (params) => {
                if (params.row.createdDate !== null && params.row.createdDate !== '') {
                    return params.row.createdDate;
                }
            }
        },
        {
            field: 'orderNo',
            headerName: 'OrderNo',
        },
        { field: 'customerName', headerName: 'Customer' },
        { field: 'size', headerName: 'Size' },
        {
            field: 'model', headerName: 'Model',
        },
        { field: 'quantity', headerName: 'Quantity', editable: true, editable: true },
        { field: 'reason', headerName: 'Reason', editable: true },
    ];


    function CustomToolbar() {
        return (
          <GridToolbarContainer sx={{ margintop: '10px' }}>
            <GridToolbar />
          </GridToolbarContainer>
        );
      }


    const rootStyles = {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        '& .program-odd, & .complete-odd,': {
            backgroundColor: '#FFE1D6',
            'align-items': 'center',
        },
        '& .program-even, & .complete-even,': {
            backgroundColor: '#F2F2F2',
            'align-items': 'center',
        },
    };

    return (
        // <Container  style={{  width: "100%" }}>
            <Card>
                <CardContent style={{ marginTop: '105px  ' , padding: '20px' }}  >
                    <Stack direction={'row'} spacing={2}  >
                        <Typography
                            gutterBottom
                            variant="h6"
                            component="div"
                          
                        >
                            CNC Completed Records
                        </Typography>
                        <ModuleTools
                            pageName="endPlateBending"
                            OrderData={orderList}
                            refreshPage={(request) => refreshData(request)}
                        />
                        <div style={{ border: '1px solid grey' }}></div>
                        {accessModuleList.filter((x) => x.module_name === 'M1cncNesting')[0]
                            .access_rw === '1' && (
                                <NavLink to="/M1cncPunching" className="toolButton">
                                    <KeyboardDoubleArrowLeftIcon style={{ color: '#BC1921' }} />
                                    Prev Module
                                </NavLink>
                            )}
                        {accessModuleList.filter(
                            (x) => x.module_name === 'M2tubeCutting'
                        )[0].access_rw === '1' && (
                                <NavLink to="/tubecutting" className="toolButton">
                                    Next Module
                                    <KeyboardDoubleArrowRightIcon style={{ color: '#BC1921' }} />
                                </NavLink>
                            )}
                    </Stack>
                    <Box sx={{ rootStyles, width: "100%", marginTop:"40px" }}>
                      
                        <DataGrid
                              components={{
                                Toolbar: CustomToolbar,  
                              }}
                              
                            getRowClassName={(params) => {

                                if (params.indexRelativeToCurrentPage % 2 === 0) {
                                    if (params.row.priority === 'true') {
                                        return 'secon-bg';
                                    } else if (
                                        params.row.tcutting_status === 'true' &&
                                        params.row.finpunch_status === 'true'
                                    ) {
                                        return 'partial-comp-bg';
                                    } else {
                                        return 'Mui-even';
                                    }
                                } else {
                                    if (params.row.priority === 'true') {
                                        return 'secon-bg';
                                    } else if (
                                        params.row.tcutting_status === 'true' &&
                                        params.row.finpunch_status === 'true'
                                    ) {
                                        return 'partial-comp-bg';
                                    } else {
                                        return 'Mui-odd';
                                    }
                                }
                            }}
                            sx={{
                                '& .MuiDataGrid-columnHeader': {
                                    backgroundColor: '#943612',
                                    color: 'white',
                                },
                                '.MuiDataGrid-row.Mui-odd ': {
                                    backgroundColor: '#FFE1D6',
                                },
                                '.MuiDataGrid-row.Mui-even ': {
                                    backgroundColor: '#F2F2F2',
                                },
                                '.MuiDataGrid-row:not(.MuiDataGrid-row--dynamicHeight)>.MuiDataGrid-cell':
                                {
                                    overflow: 'visible !important',
                                    whiteSpace: 'break-spaces',
                                    padding: 0,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    fontSize: '0.75rem',
                                },
                                '.MuiDataGrid-columnHeaderTitleContainer': {
                                    display: 'flex',
                                    justifyContent: 'center',
                                    fontSize: '0.75rem',
                                },
                                '& .MuiDataGrid-columnHeader, .MuiDataGrid-cell': {
                                    border: '.5px solid white',
                                },
                                '& .MuiInputBase-input': {
                                    fontSize: '0.74rem',
                                    padding: '16.5px 1px ',
                                },
                            }}
                            rowHeight={50}
                            columns={columns.map((data) => ({
                                ...data,
                                ...(data.field === 'program' ||
                                    data.field === 'createdDate'
                                    ? { width: 170 }
                                    : {
                                        flex: 1,
                                        rowSpanValueGetter: (value, row) => {
                                            return data.field === 'program' || data.field === 'createdDate'
                                                ? value
                                                : row
                                                    ? `${row.Program}-${row.createdDate}-${row.id}`
                                                    : value;
                                        },
                                    }),
                                ...slotColumnCommonFields,
                                // editable: true,
                            }))}
                            rows={flattenedRows}
                            unstable_rowSpanning
                            disableRowSelectionOnClick
                        />
                    </Box>
                </CardContent>
            </Card>
        // </Container>
    );
}











