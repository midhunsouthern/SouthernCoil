import { useState, useContext, useEffect, forwardRef } from "react";
import axios from "axios";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

import { AccessContext } from "../../../constant/accessContext";
import {
    Button,
    Dialog,
    DialogTitle,
    DialogActions,
    Card,
    CardContent,
    Box,
} from "@mui/material";
import Slide from "@mui/material/Slide";
import OrderViewModal from "../../modals/OrderViewModal";
import {
    getSchedulerOrders,
    setOrderGeneric,
    setOrderDelete,
    ordersToBeDispatched,
    updateSchedulerHoliday,
    updateSchedulerOrderDate,
    getOrderAllLakVal,
} from "../../../constant/url";
import Checkbox from "@mui/material/Checkbox";
import NoRowsOverlay from "../../Component/NoRowOverlay";

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function EnhancedTable() {
    const navigate = useNavigate();
    const access = useContext(AccessContext).authID;
    const [selectedRowId, setSelectedRowId] = useState(null);
    const [orderList, setOrderList] = useState([]);
    const [ordersToBeDispatchList, setOrdersToBeDispatchList] = useState([]);

    const [isLoadingDispatchList, setIsLoadingDispatchList] = useState(true);

    const [isUpdated, setIsUpdate] = useState(false);
    const [selEvent, setSelEvent] = useState({
        target: { name: "", checked: null },
    });

    //Dialog States
    const [openOrderView, setOpenOrderView] = useState(false);

    const handleOrderList = (authID) => {
        var bodyFormData = new FormData();
        bodyFormData.append("authId", authID);
        //bodyFormData.append("pageType", "scheduler")
        axios({
            method: "post",
            url: getOrderAllLakVal,
            data: bodyFormData,
            headers: { "Content-Type": "multipart/form-data" },
        })
            .then(function (response) {
                //handle success
                const res_data = response.data;
                if (res_data.status_code === 101) {
                    toast("Api Authentication failed. login again.");
                } else if (res_data.status_code === 200) {
                    const ret_data_cd = res_data.data_orders;
                    setOrderList(ret_data_cd);
                } else {
                    console.log("handleOrderList else", res_data.status_msg);
                }
            })
            .catch(function (response) {
                //handle error
                console.error(response);
            });
        setIsUpdate(false);
    };

    const handleOrdersToBeDispatchedList = (authID) => {

        setIsLoadingDispatchList(true)
        var bodyFormData = new FormData();
        bodyFormData.append("authId", authID);
        axios({
            method: "post",
            url: ordersToBeDispatched,
            data: bodyFormData,
            headers: { "Content-Type": "multipart/form-data" },
        })
            .then(function (response) {
                //handle success

                setIsLoadingDispatchList(false)
                const res_data = response.data;
                if (res_data.status_code === 101) {
                    toast("Api Authentication failed. login again.");
                } else if (res_data.status_code === 200) {
                    setOrdersToBeDispatchList(res_data.data.map((row, index) => ({id: index,...row})));
                } else {
                    console.log("handleOrderList else", res_data.status_msg);
                }
            })
            .catch(function (response) {
                //handle error
                console.error(response);
                setIsLoadingDispatchList(false)
            });
        setIsUpdate(false);
    };

    const schedulerDateChangeHandler = (row, date, column) => {

        setOrderList( orderList.map(r => ({...r, [column]: (r.id === row.id ? date : r[column])})))
        var bodyFormData = new FormData();
        bodyFormData.append("authId", access);
        bodyFormData.append("date", date)
        bodyFormData.append("column", column)
        bodyFormData.append("id", row.id)

        axios({
            method: "post",
            url: updateSchedulerOrderDate,
            data: bodyFormData,
            headers: { "Content-Type": "multipart/form-data" },
        })
            .then(function (response) {
                //handle success
                const res_data = response.data;
                if (res_data.status_code === 101) {
                    toast("Api Authentication failed. login again.");
                }

                handleOrdersToBeDispatchedList();
            })
            .catch(function (response) {
                //handle error
                console.error(response);
            });
    }

    const columns = [
        {
            field: "order_id",
            headerName: "Order No",
            renderCell: (params) => {
                return (
                    <Button
                        fullWidth
                        onClick={() => {
                            setSelectedRowId(params.row.id);
                            setOpenOrderView(true);
                        }}
                        color="info"
                        className="toolButton-grid "
                    >
                        {params.row.order_id}{" "}
                    </Button>
                );
            },
            maxWidth: 90,
            flex: 1,
        },
        {
            field: "order_date",
            headerName: "Order Date",
            maxWidth: 100,
            valueFormatter: (params) => {
                return moment(params?.value, "DD/MM/YYYY").format("Do MMM");
            },

            flex: 1,
        },
        {
            field: "full_customer_name",
            headerName: "Customer Name",
            width: 500,
            flex: 1,
        },
        {
            field: "size",
            headerName: "Size",
            width: 200,
            flex: 1,
        },
        {
            field: "sq_feet",
            headerName: "SQ Feet",
            flex: 1,
            maxWidth: 80,
            type: "number",
        },
        {
            field: "pipe_type",
            headerName: "Pipe Type",
            flex: 1,
            maxWidth: 150,
        },
        {
            field: "status",
            headerName: "Status",
            width: 100,
            maxWidth: 100,
            // renderCell: (params) => {
            //     return (
            //         <div className="position-relative">
            //             <StatusBar statusData={params.row} source="Table" />
            //         </div>
            //     );
            // },
            flex: 1,
        },
        {
            field: "coil_ready_at",
            headerName: "Ready Date",
            flex: 1,
            maxWidth: 130,
            renderCell: params => {

                if(params.row.pp_status === "true") return "Ready";

                return <>
                    <input type="date" value={params.row.coil_ready_at} onChange={event => schedulerDateChangeHandler(params.row, event.target.value, "coil_ready_at")} />
                </>
            }
        },
        {
            field: "est_delivery_date",
            headerName: "CTD",
            flex: 1,
            maxWidth: 130,
            renderCell: params => {
                return <>
                    <input type="date" value={params.row.est_delivery_date}  onChange={event => schedulerDateChangeHandler(params.row, event.target.value, "est_delivery_date")} />
                </>
            }
        },
        {
            field: "lead_time",
            headerName: "Lead Time",
            flex: 1,
            maxWidth: 100,
            width: 100,
            renderCell: params => getLeadTime(params.row.coil_ready_at, params.row.order_date)
        }
    ];

    const holidayCheckboxHandler = (date, checked) => {

        setOrdersToBeDispatchList( ordersToBeDispatchList.map(row => ({...row, is_holiday: (row.row_labels === date ? checked : row.is_holiday)})))
        var bodyFormData = new FormData();
        bodyFormData.append("authId", access);
        bodyFormData.append("date", date)
        bodyFormData.append("is_holiday", checked)

        axios({
            method: "post",
            url: updateSchedulerHoliday,
            data: bodyFormData,
            headers: { "Content-Type": "multipart/form-data" },
        })
            .then(function (response) {
                //handle success
                const res_data = response.data;
                if (res_data.status_code === 101) {
                    toast("Api Authentication failed. login again.");
                }
            })
            .catch(function (response) {
                //handle error
                console.error(response);
            });
    }

    const dispatcherColumns = [
        {
            field: "is_holiday",
            headerName: "H",
            flex: 1,
            renderCell: params => {

                if (!["unassigned", "ready"].includes(params.row.row_labels)) {

                    return <div>
                        <Checkbox
                            color="primary"
                            checked={params.row.is_holiday}
                            onChange={(event, checked) => holidayCheckboxHandler(params.row.row_labels, checked)}
                        />
                    </div>
                }

                return <></>
            }
        },
        {
            field: "row_labels",
            headerName: "Date",
            valueFormatter: (params) => {

                if (!["ready", "unassigned"].includes(params.value)) {

                    return moment(params.value, "YYYY-MM-DD").format("Do MMM");
                }

                return params.value;
            },
            flex: 1,
        },
        {
            field: "total_orders",
            headerName: "Orders",
            flex: 1,
        },
        {
            field: "total_sq_feet",
            headerName: "Sq. Feet",
            flex: 1,
        }
    ];

    const getLeadTime = (coilReadyDate, orderDate) => {

        if (!coilReadyDate || !orderDate) return "--";

        return moment(coilReadyDate).diff(moment(orderDate, "DD/MM/YYYY"), "days");
    }

    useEffect(() => {
        handleOrderList(access);
        handleOrdersToBeDispatchedList(access);
    }, []);

    return (
        <Box>
            <ToastContainer />
            <div className="row">
                <div className="col-4">
                    <Card>
                        <CardContent>
                            <Box sx={{height: '84vh', width: '100%'}}>
                                <DataGrid
                                    rowHeight={50}
                                    getRowClassName={(params) => {
                                        if (params.indexRelativeToCurrentPage % 2 === 0) {
                                            return params.row.is_holiday
                                                ? "Mui-even secon-bg"
                                                : "Mui-even";
                                        } else {
                                            return params.row.is_holiday
                                                ? "Mui-odd secon-bg"
                                                : "Mui-odd";
                                        }
                                    }}
                                    loading={isLoadingDispatchList}
                                    columns={dispatcherColumns}
                                    rows={ordersToBeDispatchList}
                                    // getRowClassName={(params) => params.row.is_holiday && "secon-bg"}
                                    editMode="row"
                                    slots={{noRowsOverlay: NoRowsOverlay}}
                                    sx={{
                                        '--DataGrid-overlayHeight': '300px',
                                        "& .MuiDataGrid-columnHeader": {
                                            backgroundColor: "#943612",
                                            color: "white",
                                        },
                                        ".MuiDataGrid-row.Mui-odd ": {
                                            backgroundColor: "#FFE1D6",
                                        },
                                        ".MuiDataGrid-row.Mui-even ": {
                                            backgroundColor: "#F2F2F2",
                                        },
                                        ".MuiDataGrid-row:not(.MuiDataGrid-row--dynamicHeight)>.MuiDataGrid-cell":
                                            {
                                                overflow: "visible !important",
                                                whiteSpace: "break-spaces",
                                                padding: 0,
                                                display: "flex",
                                                justifyContent: "center",
                                                fontSize: "0.95rem",
                                            },
                                        ".MuiDataGrid-columnHeaderTitleContainer": {
                                            display: "flex",
                                            justifyContent: "center",
                                            fontSize: "0.95rem",
                                        },
                                        "& .MuiDataGrid-columnHeader, .MuiDataGrid-cell": {
                                            border: ".5px solid white",
                                        },
                                        "& .MuiInputBase-input": {
                                            fontSize: "0.74rem",
                                            padding: "16.5px 1px ",
                                        },
                                    }}
                                />
                            </Box>
                        </CardContent>
                    </Card>
                </div>

                <div className="col-8">
                    <Card>
                        <CardContent>
                            <Box sx={{height: '84vh', width: '100%'}}>
                                <DataGrid
                                    slots={{ toolbar: GridToolbar, noRowsOverlay: NoRowsOverlay }}
                                    loading={orderList.length === 0}
                                    getRowClassName={(params) => {
                                        if (params.indexRelativeToCurrentPage % 2 === 0) {
                                            return params.row.priority === "true"
                                                ? "Mui-even secon-bg"
                                                : "Mui-even";
                                        } else {
                                            return params.row.priority === "true"
                                                ? "Mui-odd secon-bg"
                                                : "Mui-odd";
                                        }
                                    }}
                                    sx={{
                                        '--DataGrid-overlayHeight': '300px',
                                        "& .MuiDataGrid-columnHeader": {
                                            backgroundColor: "#943612",
                                            color: "white",
                                        },
                                        ".MuiDataGrid-row.Mui-odd ": {
                                            backgroundColor: "#FFE1D6",
                                        },
                                        ".MuiDataGrid-row.Mui-even ": {
                                            backgroundColor: "#F2F2F2",
                                        },
                                        ".MuiDataGrid-row:not(.MuiDataGrid-row--dynamicHeight)>.MuiDataGrid-cell":
                                            {
                                                overflow: "visible !important",
                                                whiteSpace: "break-spaces",
                                                padding: 0,
                                                display: "flex",
                                                justifyContent: "center",
                                                fontSize: "0.95rem",
                                            },
                                        ".MuiDataGrid-columnHeaderTitleContainer": {
                                            display: "flex",
                                            justifyContent: "center",
                                            fontSize: "0.95rem",
                                        },
                                        "& .MuiDataGrid-columnHeader, .MuiDataGrid-cell": {
                                            border: ".5px solid white",
                                        },
                                        "& .MuiInputBase-input": {
                                            fontSize: "0.74rem",
                                            padding: "16.5px 1px ",
                                        },
                                    }}
                                    rowHeight={50}
                                    columns={columns}
                                    rows={orderList}
                                    editMode="row"
                                />
                            </Box>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Dialog
                open={openOrderView}
                TransitionComponent={Transition}
                keepMounted
                onClose={() => setOpenOrderView(false)}
                key={Math.random(1, 100)}
            >
                <OrderViewModal orderId={selectedRowId} key={Math.random(1, 100)} />
            </Dialog>
        </Box>
    );
}
