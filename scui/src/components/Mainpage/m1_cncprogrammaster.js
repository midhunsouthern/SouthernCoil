import { useState, useContext, useEffect, forwardRef } from "react";
import axios from "axios";
import moment from "moment";
import { NavLink, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
// import AddIcon from '@mui/icons-material/Add';
import { AccessContext } from "../../constant/accessContext";
// import RemoveIcon from '@mui/icons-material/Remove';
import { TickGif } from "../../commonjs/HilightRule";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
// import { useCallback } from 'react';
import dayjs from "dayjs";
// import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDateTimePicker } from "@mui/x-date-pickers/DesktopDateTimePicker";
import { Input, TextField } from "@mui/material";
import { FormControl, Select, MenuItem, InputLabel } from "@mui/material";
import { isValid } from 'date-fns';
import { DataGrid, GridToolbar, GridToolbarContainer } from "@mui/x-data-grid";
import {
  Dialog,
  Button,
  Card,
  CardContent,
  Typography,
  Stack,
  DialogTitle,
  DialogActions,
  ImageList,
  ImageListItem,
  Box,
  IconButton,
  CircularProgress,
} from "@mui/material";

import Slide from "@mui/material/Slide";
import CloseIcon from "@mui/icons-material/Close";
import OrderViewModal from "../modals/OrderViewModal";
import ModuleTools from "../modals/ModuleTools";

import {
  getLookupData,
  setOrderGeneric,
  getOrderAllLakVal,
  imageURL,
  getCncProgramList,
  cnc_pgm_data,
  cnc_delete_order,
  axiosInstances,
} from "../../constant/url";

import CommentBoxModal from "../modals/CommentBoxModal";
import { DateTimePicker } from "@mui/x-date-pickers";
import useAxiosInterceptor from "../Interceptors/axios";
import { on } from "process";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function M1cncProgramMaster() {
  const navigate = useNavigate();
  // const access = useContext(AccessContext).authID;
  useAxiosInterceptor(axiosInstances)
  const access = localStorage.getItem("authId");
  const accessModuleList = useContext(AccessContext).accessModuleList;
  const [orderList, setOrderList] = useState([]);
  const [selectedRowId, setSelectedRowId] = useState(0);
  const [selComment, setSelComment] = useState("");
  const [imageBase64, setImageBase64] = useState([]);
  const [lookUpList, setLookupList] = useState([]);
  const [openStatusCnf, setOpenStatusCnf] = useState(false);
  const [confirmDeleteOrder, setconfirmDeleteOrder] = useState(false);
  const [openImgDialog, setOpenImgDialog] = useState(false);
  const [animeShow, setAnimeShow] = useState(false);
  const [deleteOrderData, setdeleteOrderData] = useState();
  const [openCommentDialog, setOpenCommentDialog] = useState(false);
  const [openOrderView, setOpenOrderView] = useState(false);
  const [flattenedRows, setFlattenedRows] = useState([]);
  // const [startDate, setStartDate] = useState(new Date());
  const [dateOk, setdateOk] = useState("");
  const [selectedOrderList, setSelectedOrderList] = useState([]);
  const [orderNoList, setorderNoList] = useState([]);
  const [confirmOk, setConfirmOk] = useState(false);
  const [confirmInput, setConfirmInput] = useState(false);
  const [confirmInputAction, setConfirmInputAction] = useState(null);
  const [completedRecords, setCompletedRecords] = useState();
  const [onConfirmAction, setOnConfirmAction] = useState(null);
  const [disabledOrderModel, setDisabledOrderModel] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modelList, setModelList] = useState([]);
  const [materialList, setMaterialList] = useState([]);
  const [customerName, setCustomerName] = useState();
  const [size, setSize] = useState();
  const [parts, setparts] = useState('')

  const dropdownOptions = [
    "EP",
    "WP",
    "PP",
    "CP",
    "Brazing Tray",
    "Rivet Tray",
    "Patti",
    "Fan Cover",
    "Top Tray",
    "Bottom Tray",
    "Side Support",
    "Tray 1",
    "Tray 2",
    "WP-LH",
    "WP-RH",
    "PP-LH",
    "PP-RH",
    "CP-LH",
    "CP-RH",
    "EP-LH",
    "EP-RH",
  ];

  useEffect(() => {
    setOrderList([]);
    handleProgramListPromise()
      .then(() => handleOrderListPromise())
      .then(() => {
        orderNoListfn();
        handleGetLookup();
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
  }, []);

  useEffect(() => {
    if (orderList == null || orderList.length === 0) {
      handleClick();
    }
  }, [orderList]);

  useEffect(() => {
    if (!dateOk) return;
    // if (dateOk.quantity === Number(dateOk.ok)) {
    //   toast("quantity and ok are equal");
    //   return;
    // }
    setOrderList((prevOrderList) =>
      prevOrderList.map((listItem) => {
        if (listItem.id === dateOk.primaryId) {
          const updatedOrders = listItem.orders.map((order) =>
            order.orderId === dateOk.orderId
              ? { ...order, quantity: dateOk.quantity, ok: dateOk.ok }
              : order
          );
          return { ...listItem, orders: updatedOrders };
        }
        return listItem;
      })
    );
  }, [dateOk]);


  useEffect(() => {
    const flattenedRowsfn = () => {
      return orderList
        .map((programData, index) => {
          let lastCncPgmId = programData.id ? programData.id - 1 : 0;
          const currentCncPgmId = programData.cnc_pgm_id
            ? programData.cnc_pgm_id
            : lastCncPgmId + 1;
          lastCncPgmId = currentCncPgmId;

          let lastOrderId = 0;

          const orders =
            programData.orders?.map((order, orderIndex) => {
              const currentOrderId = order.orderId
                ? order.orderId
                : lastOrderId + 1;
              lastOrderId = currentOrderId;

              return {
                primaryId: currentCncPgmId,
                id: `${currentCncPgmId}-${currentOrderId}`,
                combinedField: {
                  primaryId: currentCncPgmId,
                  program: programData.program || "",
                  createdDate: programData.createdDate || "",
                  material: programData.material || "",
                },
                submit: currentCncPgmId,
                orderNo: order.orderNo,
                orderId: currentOrderId,
                customerName: order.customerName,
                size: order.size,
                model: order.model,
                quantity: order.quantity,
                ok: order.ok,
                rejection: order.rejection,
                reason: order.reason,
                isFirstRow: orderIndex === 0,
              };
            }) || [];

          return [
            ...orders,
            {
              primaryId: currentCncPgmId,
              id: `${currentCncPgmId}-dummy`,
              combinedField: {
                primaryId: currentCncPgmId,
                program: programData.program,
                material: programData.material || "",
                createdDate: programData.createdDate,
              },
              submit: currentCncPgmId,
              orderId: 0,
              orderNo: "addOrderButton",
              customerName: "N/A",
              size: "N/A",
              model: "N/A",
              quantity: 0,
              ok: 0,
              rejection: 0,
              reason: "N/A",
              isFirstRow: false,
            },
          ];
        })
        .flat();
    };

    setFlattenedRows(flattenedRowsfn());
  }, [orderList]);


  const handleClick = () => {
    const cnc_id =
      orderList.length === 0
        ? 1
        : Number(orderList[orderList.length - 1].id) + 1;
    let orderId = 1;
    if (
      orderList.length > 0 &&
      orderList[orderList.length - 1].orders.length > 0
    ) {
      const orderLength = orderList[orderList.length - 1].orders.length;
      orderId =
        Number(
          orderList[orderList.length - 1].orders[orderLength - 1].orderId
        ) + 1;
    }
    setOrderList((oldRows) => [
      ...oldRows,
      {
        cnc_pgm_id: 0,
        id: cnc_id,
        program: "",
        material: "",
        createdDate: "",
        submit: "",
        orders: [
          {
            orderId: orderId,
            orderNo: "",
            customerName: "",
            size: "",
            material: "",
            model: "",
            quantity: 0,
            ok: 0,
            rejection: 0,
            reason: "",
          },
        ],
      },
    ]);
  };
  const handleCloseModal = (response) => {
    setOpenOrderView(false);
  };
  const handleCloseStatus = (response) => {
    if (response === "yes") {
      handleNested(selectedRowId, {
        target: { name: "bending_status", checked: true },
      });
    }
    setOpenStatusCnf(false);
  };
  const handleCloseImg = (response) => {
    setOpenImgDialog(false);
  };

  const transformObject = (obj) => {
    let lastCncPgmId = obj.id ? obj.id - 1 : 0;
    const currentCncPgmId = obj.cnc_pgm_id
      ? parseInt(obj.cnc_pgm_id)
      : lastCncPgmId + 1;
    lastCncPgmId = currentCncPgmId;
    return {
      cnc_pgm_id: currentCncPgmId,
      program: obj.program_name ? obj.program_name : "",
      createdDate: obj.creation_datetime ? obj.creation_datetime : "",
      material: obj.material ? obj.material : "",
      id: currentCncPgmId,
      submit: currentCncPgmId,
      orders: obj.orders.map((item) => ({
        orderId: item.orderId ? item.orderId : 0,
        orderNo: item.order_no ? item.order_no : "",
        customerName: item.customer_name ? item.customer_name : "",
        size: item.size ? item.size : "",
        model: item.model ? item.model : "",
        quantity: item.quantity ? parseInt(item.quantity) : 0,
        ok: item.ok_count ? parseInt(item.ok_count, 10) : 0,
        rejection: item.rejection_count
          ? parseInt(item.rejection_count, 10)
          : 0,
        reason: item.reason ? item.reason : "",
      })),
    };
  };

  const addDisabledOrderModel = (id, customerName, size, orderNo, model) => {
    setDisabledOrderModel((prevOrders) => {
      console.log('PrevOrders');
      console.log(JSON.stringify(prevOrders));
      const existingOrder = prevOrders.find((order) => order.id === id);
      console.log(`existingOrder`);
      console.log(existingOrder);
      if (existingOrder) {
        return prevOrders.map((order) => {
          if (order.id === id) {
            const existingOrderNo = order.orderNo?.find(
              (on) =>
                on.orderNo === orderNo &&
                on.customerName === customerName &&
                on.size === size
            );
            console.log(`existingOrderNo`);
            console.log(existingOrderNo);
            if (existingOrderNo) {
              return {
                ...order,
                orderNo: order.orderNo.map((on) =>
                  on.orderNo === orderNo &&
                  on.customerName === customerName &&
                  on.size === size
                    ? {
                        ...on,
                        models: Array.isArray(on.models)
                          ? [...on.models, model]
                          : [model],
                      }
                    : on
                ),
              };
            } else {
              return {
                ...order,
                orderNo: [
                  ...(order.orderNo || []),
                  { orderNo, customerName, size, models: [model] },
                ],
              };
            }
          }
          return order;
        });
      } else {
        return [
          ...prevOrders,
          {
            id,
            orderNo: [
              { orderNo, customerName, size, models: [model] },
            ],
          },
        ];
      }
    });
  };

  const removeDisabledOrder1 = (id, orderNo, model) => {
    setDisabledOrderModel((prevOrders) => {
      const existingOrder = prevOrders.find((order) => order.id === Number(id));
      if (!existingOrder) {
        return prevOrders;
      }
      const updatedOrderNo = existingOrder.orderNo
        .map((on) => {
          if (on.orderNo === orderNo) {
            return { ...on, models: on.models.filter((m) => m !== model) };
          }
          return on;
        })
        .filter((on) => on.models.length > 0);
      if (updatedOrderNo.length === 0) {
        return prevOrders.filter((order) => order.id !== Number(id));
      } else {
        return prevOrders.map((order) =>
          order.id === Number(id)
            ? { ...order, orderNo: updatedOrderNo }
            : order
        );
      }
    });
  };

  const removeDisabledOrder = (id, customerName, size, orderNo, model) => {
 
    const getModelsByOrderNo = (orderList, orderNo, id, customerName, size) => {
    
      const filteredList = orderList.filter((listItem) => listItem.id === id);
    
      const order = filteredList.flatMap((listItem) =>
        listItem.orders.filter(
          (order) =>
            String(order.orderNo) === String(orderNo) &&
            order.customerName === customerName &&
            order.size === size
        )
      );
    
      // Extract models
      const models = order.flatMap((order) => order.model || []);
      console.log("Models for this Order No with matching customerName and size:", models);
      return models;
    };
    

    const modelsForOrderNo = getModelsByOrderNo(orderList, orderNo, id,customerName, size);
    setDisabledOrderModel((prevOrders) => {
      console.log(prevOrders)
      const existingOrder = prevOrders.find((order) => order.id === Number(id));
      console.log(existingOrder)
      if (!existingOrder) {
        return prevOrders;
      }
      const updatedOrderNo = existingOrder.orderNo.map((on) => {
        if (String(on.orderNo) === String(orderNo) && on.customerName===customerName && on.size===size ) {
 
          return { ...on, models: [...modelsForOrderNo] };
        }
        return on;
      }
      ).filter((on) => on.models.length > 0);
      if (updatedOrderNo.length === 0) {
        return prevOrders.filter((order) => order.id !== Number(id));
      } else {
        return prevOrders.map((order) =>
          order.id === Number(id)
            ? { ...order, orderNo: updatedOrderNo }
            : order
        );
      }
    });
  };

  const handleProgramListPromise = () => {
    setIsLoading(true);
    return new Promise((resolve, reject) => {
      var bodyFormData = new FormData();
      bodyFormData.append("authId", access);
      bodyFormData.append("pageType", "endPlateBending");
      axiosInstances({
        method: "post",
        url: getCncProgramList,
        data: bodyFormData,
        headers: { "Content-Type": "multipart/form-data" },
      })
        .then(function (response) {
          const res_data = response.data;
          setIsLoading(false);
          if (res_data.status_code === 101) {
            toast.error("API Authentication failed. Please log in again.");
            reject("API Authentication failed.");
          } else if (res_data.status_code === 200) {
            const data = res_data.data;
            if (data.length !== 0) {
              const originalData = data;
              if (Array.isArray(originalData)) {
                const transformedData = originalData.map(transformObject);
                setOrderList(transformedData);
                transformedData.map((item) => {
                  item.orders.map((order) => {
                    addDisabledOrderModel(item.id, order.customerName, order.size, order.orderNo,
                      order.model);


                  });
                });
              } else {
                const transformedData = transformObject(originalData);
                setOrderList([transformedData]);
                transformedData.orders.map((order) => {
                  addDisabledOrderModel(
                    transformedData.id,
                    order.customerName,
                    order.size,
                    order.orderNo,
                    order.model
                  );
                });
              }
              toast("CNC Program List retrived successfully.");
            } else {
              setOrderList([]);
            }
            resolve();
          } else {
            console.log(res_data);

            console.log(res_data.status_msg);
            reject(res_data.status_msg);
          }
        })
        .catch(function (error) {
          console.log(error);
          setIsLoading(false);
          reject(error);
        });
    });
  };

  const handleOrderListPromise = () => {
    return new Promise((resolve, reject) => {
      var bodyFormData = new FormData();
      bodyFormData.append("authId", access);
      bodyFormData.append("pageType", "cncNesting");
      axios({
        method: "post",
        url: getOrderAllLakVal,
        data: bodyFormData,
        headers: { "Content-Type": "multipart/form-data" },
      })
        .then(function (response) {
          const res_data = response.data;

          if (res_data.status_code === 101) {
            toast("Api Authentication failed. login again.");
            reject("Api Authentication failed.");
          } else if (res_data.status_code === 200) {
            const data = res_data.data_orders;
            console.log(data)
            setSelectedOrderList(data);
            resolve();
            toast("Order retrived successfully.");
          } else {
            console.log(res_data.status_msg);
            reject(res_data.status_msg);
          }
        })
        .catch(function (error) {
          console.log(error);
          reject(error);
        });
    });
  };
  function handleGetLookup() {
    var bodyFormData = new FormData();
    bodyFormData.append("authId", access);
    axios({
      method: "post",
      url: getLookupData,
      data: bodyFormData,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then(function (response) {
        const res_data = response.data;
        if (res_data.status_code === 200) {
          res_data["epMaterial"].map((material) => {
            setMaterialList((prevData) => [...prevData, material.lkp_value]);
          });
          res_data.circuitModel.map((model) => {
            setModelList((prevData) => [
              ...prevData,
              { id: model.id, lkp_value: model.lkp_value },
            ]);
          });
        } else {
          toast(res_data.status_msg);
        }
      })
      .catch(function (response) {
        console.log(response);
      });
  }
  const handleNested = (rowId, e) => {
    const { name, checked } = e.target;
    var idx = orderList.findIndex((item) => item.id === rowId);
    if (name === "bending_status") {
      if (
        !moment(orderList.at(idx).ep_DateTime, "YYYY-MM-DD HH:mm:ss").isValid()
      ) {
        toast("Please check End Plate Before updating status.", "warning");
        return;
      }
    }
    var editData;
    if (name.includes("status")) {
      editData = orderList.filter((itemA) => rowId !== itemA.id);
    } else {
      editData = orderList.map((item) =>
        item.id === rowId && name ? { ...item, [name]: String(checked) } : item
      );
    }
    setOrderList(editData);
    handleGenericUpdate(rowId, name, String(checked));
  };
  const handleEPComments = (rowId, rowValue) => {
    handleGenericUpdate(rowId, "ep_comments", rowValue);
    const editData = orderList.map((item) =>
      item.id === rowId ? { ...item, ["ep_comments"]: rowValue } : item
    );
    setOrderList(editData);
  };

  const handleGenericUpdate = async (rowid, field, value) => {
    setIsLoading(true);
    var bodyFormData = new FormData();
    bodyFormData.append("authId", access);
    bodyFormData.append("id", rowid);
    bodyFormData.append(field, value);
    axios({
      method: "post",
      url: setOrderGeneric,
      data: bodyFormData,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then(function (response) {
        setIsLoading(false);
        const res_data = response.data;
        if (res_data.status_code === 200) {
          toast(res_data.status_msg, "success");
          handleOrderListPromise(access);
          if (field.includes("status")) {
            setAnimeShow(true);
            const timeId = setTimeout(() => {
              setAnimeShow(false);
            }, 4000);
            return () => {
              clearTimeout(timeId);
            };
          }
        } else {
          toast(res_data.status_msg, "error");
          return false;
        }
      })
      .catch(function (response) {
        setIsLoading(false);
        console.log(response);
      });
  };

  const refreshData = (request) => {
    setModelList([]);
    setOrderList([]);
    if (request) {
      setDisabledOrderModel([]);
      handleProgramListPromise()
        .then(() => handleOrderListPromise())
        .then(() => {
          orderNoListfn();
          handleGetLookup();
        })
        .catch((error) => {
          console.error("An error occurred:", error);
        });
    }
  };

  const slotColumnCommonFields = {
    sortable: false,
    filterable: false,
    pinnable: false,
    hideable: false,
    cellClassName: (params) => {
      return `${params?.field}-${params.row?.primaryId % 2 === 0 ? "even" : "odd"
        }`;
    },
  };

  const handleAddOrder = (data) => {
    const updatedOrderList = [...orderList];
    const programIndex = updatedOrderList.findIndex(
      (program) => program.id === Number(data.primaryId)
    );
    if (programIndex === -1) {
      toast(`Id ${data.primaryId} not found in orderList`);
      return;
    }
    const selectedorder = orderList.filter(
      (item) => item.id === data.primaryId
    )[0].orders;

    let orderId = 1;
    if (selectedorder.length > 0) {
      orderId = Number(selectedorder[selectedorder.length - 1].orderId) + 1;
    }

    const newEmptyOrder = {
      orderId: orderId,
      orderNo: "",
      customerName: "",
      size: "",
      model: "",
      quantity: 0,
      ok: 0,
      rejection: 0,
      reason: "",
    };
    updatedOrderList[programIndex].orders.push(newEmptyOrder);
    setOrderList(updatedOrderList);
  };
  
  const deleteOrder = () => {
    setconfirmDeleteOrder(false);
    const programId = Number(deleteOrderData.primaryId);
    const orderId = Number(deleteOrderData.orderId);
    let removedOrderNo = null;
    let isOrderInDb = false;
    let deleteOrderLength = 0;
    orderList.forEach((program) => {
      if (program.id === programId) {
        deleteOrderLength = program.orders.length;
      }
    });
    
    if (deleteOrderLength === 1) {
      toast.error("You cannot delete the last order");
      return;
    }

    const updatedOrderList = orderList.map((item) => {
      if (item.id === programId) {
        const updatedOrders = item.orders.filter((order) => {
          if (Number(order.orderId) === Number(orderId)) {
            removedOrderNo = order.orderNo;
            if (item.cnc_pgm_id !== 0) {
              isOrderInDb = true;
            }
            return false;
          }
          return true;
        });
        if (!updatedOrders || updatedOrders.length === 0) {
          const data = { primaryId: programId };
          handleAddOrder(data);
        }
        return {
          ...item,
          orders: updatedOrders,
        };
      }
      return item;
    });
    setOrderList(updatedOrderList);


    if (removedOrderNo) {
      removeDisabledOrder1(programId, removedOrderNo, deleteOrderData.model);
    }

    if (isOrderInDb) {
      var bodyFormData = new FormData();
      bodyFormData.append("authId", access);
      bodyFormData.append("orderId", deleteOrderData.orderId);
      axios({
        method: "post",
        url: cnc_delete_order,
        data: bodyFormData,
        headers: { "Content-Type": "multipart/form-data" },
      })
        .then(function (response) {
          const res_data = response.data;
          setIsLoading(false);
          if (res_data.status_code === 101) {
            toast.error("API Authentication failed. Please log in again.");
          } else if (res_data.status_code === 200) {
            toast("Order deleted from database.");
          } else {
            toast.error("Order not deleted");
          }
        })
        .catch(function (error) {
          console.log(error);
          setIsLoading(false);
          toast.error(error);
        });
    }
  };

  const handleDeleteOrder = (data) => {
    setconfirmDeleteOrder(true);
    setdeleteOrderData(data);
    setDisabledOrderModel((prev) => prev.filter((id) => id !== data.orderNo));
  };

  useEffect(() => {
    const { primaryId,customerName,size, orderNo } = parts;
    if (parts) {
      removeDisabledOrder(primaryId,customerName,size, orderNo)
    }
  }, [parts]);



  const handleModelChange = (data, value) => {
    let updatedRow = null;
    console.log(data);
    if (!data.orderNo || data.orderNo === "") {
      toast.error("Choose Order No first");
      return;
    }

    const updatedOrderList = orderList.map((listItem) => {
      if (listItem.id === data.primaryId) {
        const updatedOrders = listItem.orders.map((order) => {
          if (Number(data.orderId) === Number(order.orderId)) {
            updatedRow = { ...order, model: value, primaryId: data.primaryId };  // Create the updated row
            return updatedRow;  
          }
          return order;   
        });

        return { ...listItem, orders: updatedOrders };   
      }
      return listItem;   
    });


    setOrderList(updatedOrderList);

    if (updatedRow) {
      setparts(updatedRow);
    }

  
    addDisabledOrderModel(data.primaryId, data.customerName, data.size, data.orderNo, value);

  };


  const updateOrderWithDbObject = (order, dbObject) => {
    return {
      ...order,
      customerName: dbObject.full_customer_name,
      orderNo: dbObject.order_id,
      size: dbObject.size,
    };
  };

  const handleRejecClick = (data) => {
    const rowid = data.primaryId;
    const total = Number(data.ok) + Number(data.rejection);
    if (total >= data.quantity) {
      toast.error("You have exceeded the limit");
      return;
    }
    let updatedRow = null;
    const updatedOrderList = orderList.map((listItem) => {
      if (listItem.orders) {
        const updatedOrders = listItem.orders.map((order) => {
          if (Number(order.orderId) === Number(data.orderId) && Number(rowid)) {
            updatedRow = { ...order, rejection: order.rejection + 1 };
            return updatedRow;
          }
          return order;
        });
        return { ...listItem, orders: updatedOrders };
      }
      return listItem;
    });
    setOrderList(updatedOrderList);
  };

  const handleRejeReduClick = (data) => {
    const rowid = data.primaryId;
    if (data.rejection <= 0) {
      toast.error("Cannot decrement below zero or cross the limit");
      return;
    }
    let updatedRow = null;
    const updatedOrderList = orderList.map((listItem) => {
      if (listItem.orders) {
        const updatedOrders = listItem.orders.map((order) => {
          if (Number(order.orderId) === Number(data.orderId) && Number(rowid)) {
            updatedRow = { ...order, rejection: order.rejection - 1 };
            return updatedRow;
          }
          return order;
        });
        return { ...listItem, orders: updatedOrders };
      }
      return listItem;
    });
    setOrderList(updatedOrderList);
  };


  const handleOrderNoChange = (tableData, orderNo) => {

    console.log(tableData);
    console.log(orderNo);

    const dbData = selectedOrderList.find((item) => item.order_id === orderNo);
    if (!dbData) {
      toast("No matching order found");
      return;
    }
    console.log(orderList)
    const updatedOrderList = orderList.map((listItem) => {
      console.log(listItem.id);

      if (Number(listItem.id) === Number(tableData.primaryId)) {
        return {
          ...listItem,
          orders: listItem.orders.map((order) => {
            if (Number(order.orderId) === Number(tableData.orderId)) {
              return updateOrderWithDbObject(order, dbData);
            }
            return order;
          }),
        };
      }
      return listItem;
    });
    setOrderList(updatedOrderList);
  };

  const getModelsForOrder = (item) => {
    const order = disabledOrderModel.find(
      (disabledOrder) => disabledOrder.id === item.primaryId
    );
    if (!order) {
      return [];
    }
    const orderNoEntry = order.orderNo.find(
      (on) => String(on.orderNo) === String(item.orderNo) && on.customerName === item.customerName && on.size === item.size
    );
    if (!orderNoEntry) {
      return [];
    }
    return orderNoEntry.models;
  };

  const orderNoListfn = () => {
    setorderNoList(
      selectedOrderList.map((item) => {
        return item.order_id;
      })
    );
  };

  const handleCompleteRecords = () => {
    navigate("/complete");
  };



  const checkSubmitOrder = (submitedOrderList) => {
    let submitOrderErrorMessage = false;
    if (!submitedOrderList[0].program || submitedOrderList[0].program === "") {
      toast.error("Program is required");
      submitOrderErrorMessage = true;
    } else if (
      !submitedOrderList[0].createdDate ||
      submitedOrderList[0].createdDate === ""
    ) {
      toast.error("Created Date is required");
      submitOrderErrorMessage = true;
    } else if (
      !submitedOrderList[0].material ||
      submitedOrderList[0].material === ""
    ) {
      toast.error("Material is required");
      submitOrderErrorMessage = true;
    } else if (submitedOrderList[0].orders.length > 0) {
      submitedOrderList[0].orders.map((order) => {
        if (!order.orderNo || order.orderNo === "") {
          toast.error("Order Number is required");
          submitOrderErrorMessage = true;
        } else if (!order.model || order.model === "") {
          toast.error("Model is required");
          submitOrderErrorMessage = true;
        } else if (!order.quantity || order.quantity === 0) {
          toast.error("Quantity is required");
          submitOrderErrorMessage = true;
        }
      });
    } else {
      submitOrderErrorMessage = false;
    }
    return submitOrderErrorMessage;
  };
  const handleSubmit = (data) => {
    const submitedOrderList = orderList.filter(
      (item) => item.id === data.primaryId
    );
    setIsLoading(true);
    const checkSubmit = checkSubmitOrder(submitedOrderList);
    if (checkSubmit) {
      setIsLoading(false);
      return;
    }
    const completeRecords = getCompleteRecord(submitedOrderList);
    let updatedOrderList = [...orderList];
    let saveOrderList;
    if (completeRecords.length > 0) {
      updatedOrderList = orderList.filter(
        (item) =>
          !completeRecords.some((completeItem) => completeItem.id === item.id)
      );
      if (completeRecords.id === submitedOrderList.id) {
        saveOrderList = [{ ...submitedOrderList[0], is_completed: 1 }];
      }
      completeRecords[0].orders.map((order) => {
        removeDisabledOrder1(completeRecords[0].id, order.orderNo, order.model);
      });
    } else {
      saveOrderList = [{ ...submitedOrderList[0], is_completed: 0 }];
    }
    if (saveOrderList[0].cnc_pgm_id === 0) {
      saveOrderList[0].orders = submitedOrderList[0].orders.map((order) => {
        return { ...order, orderId: 0 };
      });
    }
    var bodyFormData = new FormData();
    bodyFormData.append("authId", access);
    bodyFormData.append("orderList", JSON.stringify(saveOrderList));
    axios({
      method: "post",
      url: cnc_pgm_data,
      data: bodyFormData,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then(function (response) {
        //handle success
        setIsLoading(false);
        const res_data = response.data;
        if (res_data.status_code === 200) {
          toast("Orders inserted successfully");
          setOrderList(updatedOrderList);
        } else {
          toast("Orders insertion failed");
        }
      })
      .catch(function (response) {
        setIsLoading(false);
        //handle error
        toast("Orders insertion failed");
        console.log(response);
      });
    setIsLoading(false);
  };
  const getCompleteRecord = (submitedOrderList) => {
    const completeRecords = [];
    let matchedOk = 0;
    submitedOrderList[0].orders.forEach((order) => {
      if (Number(order.ok) === Number(order.quantity)) {
        matchedOk += 1;
      }
    });
    if (matchedOk === submitedOrderList[0].orders.length) {
      completeRecords.push(submitedOrderList[0]);
    }
    return completeRecords;
  };
  const editTableCells = (data) => {
    setConfirmInput(true);
    setConfirmInputAction(() => (response, { customerName, size }) => {
      setConfirmInput(false);
      if (response === "confirm") {
        if (
          !customerName ||
          customerName === "" ||
          customerName === undefined
        ) {
          toast.error("Customer Name is required");
          return;
        }
        if (!size || size === "" || size === undefined) {
          toast.error("Size is required");
          return;
        }
        const updatedOrderList = orderList.map((item) => {
          const updatedOrders = item.orders.map((order) => {
            if (
              Number(item.id) === Number(data.primaryId) &&
              Number(order.orderId) === Number(data.orderId)
            ) {
              return {
                ...order,
                customerName: customerName,
                size: size,
                orderNo: "Stock",
              };
            }
            return order;
          });
          return {
            ...item,
            orders: updatedOrders,
          };
        });
        setOrderList(updatedOrderList);
      } else {
        return;
      }
    });
  };

  const handleKeyDown = (event, row) => {
    if (event.key === ' ') {
      event.preventDefault();
      event.stopPropagation();
      const input = event.target;
      const { selectionStart, selectionEnd, value } = input;
      const newValue = value.slice(0, selectionStart) + ' ' + value.slice(selectionEnd);
      input.value = newValue;
    }
  };

  const CombinedCellRenderer = (params) => {
    const { row } = params;

    const handleProgramChange = (row, value) => {
      let updatedRow = null;
      const updatedOrderList = orderList.map((listItem) => {
        if (Number(listItem.id) === Number(row.primaryId)) {
          updatedRow = { ...listItem, program: value };
          return updatedRow;
        }
        return listItem;
      });
      setOrderList(updatedOrderList);
    };
    const handleMaterialChange = (row, value) => {
      let updatedRow = null;
      const updatedOrderList = orderList.map((listItem) => {
        if (Number(listItem.id) === Number(row.primaryId)) {
          updatedRow = { ...listItem, material: value };
          return updatedRow;
        }
        return listItem;
      });
      setOrderList(updatedOrderList);
    };
    const handleDateChange = (primaryId, newValue) => {
      const formattedDate = newValue.format("YYYY-MM-DD hh:mm:A");
      const updatedOrderList = orderList.map((listItem) => {
        if (Number(listItem.id) === Number(primaryId)) {
          return { ...listItem, createdDate: formattedDate };
        }
        return listItem;
      });
      setOrderList(updatedOrderList);
    };

    if (!row.isFirstRow) {
      return null;
    }

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          lineHeight: 1.5,
        }}
      >
        <div className="programstyle">
          <p style={{ margin: 0 }}>Program </p>
          <span>:</span>
          <TextField
            id="standard-basic"
            variant="standard"
            defaultValue={row.combinedField.program}
            onBlur={(event) => handleProgramChange(row, event.target.value)}
            onKeyDown={handleKeyDown}
            sx={{
              width: "170px",
              "& .MuiInputBase-root": {
                padding: "5px",
              },
              "& .MuiInputBase-input": {
                padding: "5px",
              },
              "& .MuiOutlinedInput-root:hover fieldset": {
                borderColor: "gray",
              },
              "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                borderColor: "blue",
              },
            }}
          />
        </div>
        {/* Select */}
        <div className="programstyle">
          <p style={{ margin: 0 }}>Material </p>
          <span>:</span>
          <FormControl>
            <Select
              id="demo-simple-select-label"
              // label="Material"
              variant="standard"
              value={row.combinedField.material || ""}
              onChange={(event) =>
                handleMaterialChange(row, event.target.value)
              }
              sx={{
                width: "170px",
                "& .MuiInputBase-root": {
                  padding: "5px", // Remove padding from the root
                },
                "& .MuiInputBase-input": {
                  padding: "5px", // Remove padding from the input area
                },
                "& .MuiOutlinedInput-root fieldset": {
                  borderColor: "black",
                },
                "& .MuiOutlinedInput-root:hover fieldset": {
                  borderColor: "gray",
                },
                "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                  borderColor: "blue",
                },
              }}
            >
              {materialList.map((material, index) => (
                <MenuItem key={index} value={material}>
                  {material}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        {/* DateTimePicker */}
        <div className="programstyle">
          <p style={{ margin: 0 }}>Create Date </p>
          <span>:</span>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              value={dayjs(row.combinedField.createdDate)}
              onAccept={(newValue) => {
                if (newValue) {
                  handleDateChange(row.primaryId, newValue);
                } else {
                  toast.error("Invalid date selected or no date selected");
                }
              }}
              sx={{
                width: "170px",
                "& .MuiInputBase-root": {
                  padding: "5px",
                  marginTop: "7px",
                  border: "none",
                },
                "& .MuiInputBase-input": {
                  padding: "5px",
                },
                "& .MuiOutlinedInput-root:hover fieldset": {
                  borderColor: "gray",
                },
                "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                  borderColor: "blue",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
              }}
            />
          </LocalizationProvider>
        </div>
      </div>
    );
  };

  const SubmitCellRenderer = (params) => {
 
    const { row } = params;
    if (!row.isFirstRow) {
      return null;
    }
    return <Button onClick={() => handleSubmit(params.row)}>Submit</Button>;
  };

  const columns = [
    {
        field: "combinedField",
        headerName: "Combined Field",
        minWidth: 300,
        renderCell: (params) => <CombinedCellRenderer {...params} />,
        rowSpanValueGetter: (params) => {
            return params.primaryId;
          },   
      },
    {
      field: "orderNo",
      headerName: "Order No",
      colSpan: (value, row) => (value === "addOrderButton" ? 9 : undefined),
      renderCell: (params) => {
        if (params.value === "addOrderButton") {
          return (
            <div className="custom-colspan">
              <Button
                variant="text"
                size="small"
                onClick={() => handleAddOrder(params.row)}
              >
                Add Order
              </Button>
            </div>
          );
        } else {
          return (
            <Select
              value={params.value}
              onChange={(event) =>
                handleOrderNoChange(params.row, event.target.value)
              }
              sx={{
                width: "100%",
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
                "&.MuiOutlinedInput-root": {
                  border: "none",
                },
              }}
            >
              <MenuItem value={params.row.orderNo}>
                {params.row.orderNo}
              </MenuItem>
              {selectedOrderList.map((item) => (
                <MenuItem key={item.order_id} value={item.order_id}>
                  {item.order_id}
                </MenuItem>
              ))}
              <MenuItem>
                <Button onClick={() => editTableCells(params.row)}>
                  Stock
                </Button>
              </MenuItem>
            </Select>
          );
        }
      },
      rowSpanValueGetter: (params) => {
        return params.row;
      },
    },
    {
      field: "customerName",
      headerName: "Customer",
      rowSpanValueGetter: (params) => {
        return params.row;
      },
    },
    {
      field: "size",
      headerName: "Size",
      rowSpanValueGetter: (params) => {
        return params.row;
      },
    },
    {
      field: "model",
      headerName: "Parts",
      renderCell: (params) => {
        return (
          <FormControl>
            <Select
              value={params.row.model}
              onChange={(event) =>
                handleModelChange(params.row, event.target.value)
              }
              sx={{
                width: "100%",
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
                "&.MuiOutlinedInput-root": {
                  border: "none",
                },
              }}
            >
              {dropdownOptions.map((option, index) => (
                <MenuItem
                  key={index}
                  value={option}
                  disabled={getModelsForOrder(params.row).includes(option)}
                >
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      },
      rowSpanValueGetter: (params) => {
        return params.row;
      },
    },
    {
      field: "quantity",
      headerName: "Quantity",
      editable: true,
      rowSpanValueGetter: (params) => {
        return params.row;
      },
    },
    {
      field: "ok",
      headerName: "OK",
      editable: true,
      rowSpanValueGetter: (params) => {
        return params.row;
      },
    },
    {
      field: "rejection",
      headerName: "Rejection",
      renderCell: (params) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Button
            variant="text"
            color="primary"
            size="large"
            style={{ minWidth: "auto", padding: "0 4px" }}
            onClick={() => handleRejecClick(params.row)}
          >
            +
          </Button>
          <span style={{ margin: "0 4px" }}>{params.row.rejection}</span>
          <Button
            variant="text"
            color="error"
            size="large"
            style={{ minWidth: "auto", padding: "0 4px" }}
            onClick={() => handleRejeReduClick(params.row)}
          >
            -
          </Button>
        </div>
      ),
      editable: false,
      rowSpanValueGetter: (params) => {
        return params.row;
      },
    },
    {
      field: "reason",
      headerName: "Reason",
      editable: true,
      rowSpanValueGetter: (params) => {
        return params.row;
      },
    },
    {
      field: "cnc_order_delete",
      headerName: "Action",
      renderCell: (params) => (
        <Button
          variant="text"
          size="small"
          onClick={() => handleDeleteOrder(params.row)}
        >
          Delete
        </Button>
      ),
    },
    // {
    //   field: 'submit',
    //   headerName: 'Submit',
    //   renderCell: (params) => {
    //     return (<Button onClick={() => handleSubmit(params.row)}>Submit</Button>);
    //   },
    // },
    {
      field: "submit",
      headerName: "Submit",
      renderCell: (params) => <SubmitCellRenderer {...params} />,
      editable: true,
      minWidth: 100,
    },
  ];
  const updatedColumns = columns.map((data) => ({
    ...data,
    ...(data.field === "combinedField" || data.field === "customerName"
      ? {
        width: 150,
      }
      : {
        flex: 1,
        // rowSpanValueGetter: (value, row) => {
        //   return data.field === 'combinedField' ||
        //     data.field === 'submit'
        //     ? value
        //     : row
        //       ? `${row.combinedField}-${row.submit}-${row.id}`
        //       : value;
        // },
      }),
    ...slotColumnCommonFields,
  }));

  function EditToolbar(props) {
    return (
      <GridToolbarContainer>
        <GridToolbar />
        <Button color="primary" onClick={handleClick}>
          Add record
        </Button>
        <Button onClick={handleCompleteRecords}>Completed Records</Button>
      </GridToolbarContainer>
    );
  }
  const rootStyles = {
    display: "flex",
    flexDirection: "column",
    width: "100%",

    "& .combinedField-odd, & .submit-odd": {
      backgroundColor: "#FFE1D6",
      "align-items": "center",
    },
    "& .combinedField-even, & .submit-even": {
      backgroundColor: "#F2F2F2",
      "align-items": "center",
    },
  };

  const processRowUpdate = (updatedRow, currentRow) => {
    const { primaryId, combinedField, orderId } = updatedRow;
    const { program, createdDate, material } = combinedField;
    const changedColumns = Object.keys(updatedRow).filter(
      (key) => updatedRow[key] !== currentRow[key]
    );
    const isProgramOrComplete =
      changedColumns.includes("combinedField") ||
      // changedColumns.includes('createdDate') ||
      // changedColumns.includes('material') ||
      changedColumns.includes("submit");
    let singleOrderData = null;
    const updatedOrderList = orderList.map((programData) => {
      let lastCncPgmId = programData.id ? programData.id - 1 : 0;
      const currentCncPgmId = programData.cnc_pgm_id
        ? programData.cnc_pgm_id
        : lastCncPgmId + 1;
      lastCncPgmId = currentCncPgmId;
      if (currentCncPgmId === primaryId) {
        if (isProgramOrComplete) {
          return { ...programData, program, createdDate, material };
        }
        const updatedOrders = programData.orders.map((order) => {
          const isMatchingOrder = order.orderId === orderId;
          if (isMatchingOrder) {
            const updatedOrder = { ...order, ...updatedRow };
            if (Number(updatedOrder.ok) < 0) {
              updatedOrder.ok = 0;
            }
            if (Number(updatedOrder.quantity) < 0) {
              updatedOrder.quantity = 0;
            }
            if (Number(updatedOrder.ok) > Number(updatedOrder.quantity)) {
              toast.warn("OK value is greater than Quantity");
              // updatedOrder.ok = updatedOrder.quantity;
            }
            singleOrderData = updatedOrder;
            return updatedOrder;
          }
          return order;
        });
        return { ...programData, orders: updatedOrders };
      }
      return programData;
    });
    setOrderList(updatedOrderList);
    if (singleOrderData) {
      setdateOk(singleOrderData);
    }
    return singleOrderData ? singleOrderData : currentRow;
  };

  return (
    <Box style={{ marginTop: "105px", width: "100%" }} sx={rootStyles}>
      <ToastContainer />
      <TickGif show={animeShow} />
      <Card>
        <CardContent>
          <Stack direction={"row"} spacing={4}>
            <Typography
              gutterBottom
              variant="h5"
              component="div"
              className="mt-2"
            >
              CNC ProgramMaster
            </Typography>
            <ModuleTools
              pageName="endPlateBending"
              OrderData={orderList}
              refreshPage={(request) => refreshData(request)}
            />
            <div style={{ border: "1px solid grey" }}></div>
            {accessModuleList.filter((x) => x.module_name === "M1cncNesting")[0]
              .access_rw === "1" && (
                <NavLink to="/cncnesting" className="toolButton">
                  <KeyboardDoubleArrowLeftIcon style={{ color: "#BC1921" }} />
                  Prev Module
                </NavLink>
              )}
            {accessModuleList.filter((x) => x.module_name === "M1cncNesting")[0]
              .access_rw === "1" && (
                <NavLink to="/cncpunching" className="toolButton">
                  Next Module
                  <KeyboardDoubleArrowRightIcon style={{ color: "#BC1921" }} />
                </NavLink>
              )}
          </Stack>
          {isLoading ? (
            <div className="loading-container">
              <div className="loading">
                <CircularProgress />
              </div>
            </div>
          ) : (
            <div className="mt-3">
              <DataGrid
                slots={{ toolbar: EditToolbar }}
                getRowClassName={(params) => {
                  if (params.indexRelativeToCurrentPage % 2 === 0) {
                    if (params.row.priority === "true") {
                      return "secon-bg";
                    } else if (
                      params.row.tcutting_status === "true" &&
                      params.row.finpunch_status === "true"
                    ) {
                      return "partial-comp-bg";
                    } else {
                      return "Mui-even";
                    }
                  } else {
                    if (params.row.priority === "true") {
                      return "secon-bg";
                    } else if (
                      params.row.tcutting_status === "true" &&
                      params.row.finpunch_status === "true"
                    ) {
                      return "partial-comp-bg";
                    } else {
                      return "Mui-odd";
                    }
                  }
                }}
                sx={{
                  "& .MuiDataGrid-columnHeader": {
                    backgroundColor: "#943612",
                    color: "white",
                  },
                  ".MuiDataGrid-row.Mui-odd": {
                    backgroundColor: "#FFE1D6",
                  },
                  ".MuiDataGrid-row.Mui-even": {
                    backgroundColor: "#F2F2F2",
                  },
                  ".MuiDataGrid-row:not(.MuiDataGrid-row--dynamicHeight)>.MuiDataGrid-cell":
                  {
                    overflow: "visible !important",
                    whiteSpace: "break-spaces",
                    padding: 0,
                    display: "flex",
                    justifyContent: "center",
                    fontSize: "0.75rem",
                  },
                  ".MuiDataGrid-columnHeaderTitleContainer": {
                    display: "flex",
                    justifyContent: "center",
                    fontSize: "0.75rem",
                  },
                  "& .MuiDataGrid-columnHeader, .MuiDataGrid-cell": {
                    border: ".5px solid white",
                  },
                  "& .MuiInputBase-input": {
                    fontSize: "0.74rem",
                    padding: "16.5px 1px",
                  },
                }}
                processRowUpdate={processRowUpdate}
                onProcessRowUpdateError={(error) => {
                  console.error("Error updating row:", error);
                }}
                rowHeight={75}
                columns={updatedColumns}
                isCellEditable={(params) =>
                  params.row.orderNo !== "addOrderButton"
                }
                rows={flattenedRows}
                editMode="cell"
                unstable_rowSpanning={true}
              />
            </div>
          )}
        </CardContent>
      </Card>
      <Dialog
        open={confirmDeleteOrder}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseStatus}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Do you want to delete the order?"}</DialogTitle>
        <DialogActions>
          <Button onClick={() => setconfirmDeleteOrder(false)}>No</Button>
          <Button onClick={() => deleteOrder()}>Yes</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openCommentDialog}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setOpenCommentDialog(false)}
        key={Math.random(1, 100)}
      >
        <CommentBoxModal
          content={selComment}
          retContent={(e) => {
            handleEPComments(selectedRowId, e);
            setOpenCommentDialog(false);
          }}
        />
      </Dialog>
      <Dialog
        fullWidth={true}
        maxWidth={"lg"}
        open={openOrderView}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setOpenOrderView(false)}
        key={Math.random(1, 100)}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          View Order Details
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseModal}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
          id="order-view-close-btn"
        >
          <CloseIcon />
        </IconButton>
        <OrderViewModal orderId={selectedRowId} key={Math.random(1, 100)} />
      </Dialog>
      <Dialog
        open={openStatusCnf}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseStatus}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>
          {"Do you want to mark the status complete of the order?"}
        </DialogTitle>
        <DialogActions>
          <Button onClick={() => handleCloseStatus("no")}>No</Button>
          <Button onClick={() => handleCloseStatus("yes")}>Yes</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openImgDialog}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseImg}
        aria-describedby="alert-dialog-slide-description"
        fullWidth
        maxWidth="lg"
        style={{ padding: "5px" }}
      >
        <Stack>
          {/* <>
						{imageBase64.ep_photo?.length > 0 ? (
							<DialogTitle>End Plate Images</DialogTitle>
						) : (
							""
						)}
						{
							<ImageList cols={1} rowHeight={500}>
								{imageBase64.ep_photo?.map((item, index) => (
									<ImageListItem key={"epphoto" + index}>
										<img
											src={item}
											srcSet={item}
											alt={"Assembly"}
											loading="lazy"
										/>
									</ImageListItem>
								))}
							</ImageList>
						}
					</> */}
          <>
            {imageBase64.assembly_Photo?.length > 0 ? (
              <DialogTitle>Assembly Images</DialogTitle>
            ) : (
              ""
            )}

            {
              <ImageList cols={1}>
                {imageBase64.assembly_Photo?.map((item, index) => (
                  <ImageListItem key={"assembly" + index}>
                    <img
                      src={imageURL + "/uploads/" + item["drawing_base64"]}
                      srcSet={imageURL + "/uploads/" + item["drawing_base64"]}
                      alt={"Assembly"}
                      loading="lazy"
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            }
          </>
          {/* <>
						{imageBase64.brazing_Photo?.length > 0 ? (
							<DialogTitle>Brazing Images</DialogTitle>
						) : (
							""
						)}

						{
							<ImageList cols={1} >
								{imageBase64.brazing_Photo?.map((item, index) => (
									<ImageListItem key={"brazing" + index}>
										<img
											src={item}
											srcSet={item}
											alt={"Assembly"}
											loading="lazy"
										/>
									</ImageListItem>
								))}
							</ImageList>
						}
					</> */}
        </Stack>
        <DialogActions>
          <Button onClick={() => handleCloseImg("yes")}>Close</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={confirmOk}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setConfirmOk(false)}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Do you want to complete?"}</DialogTitle>
        <DialogActions>
          <Button onClick={() => onConfirmAction && onConfirmAction("yes")}>
            Yes
          </Button>
          <Button onClick={() => onConfirmAction && onConfirmAction("no")}>
            No
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={confirmInput}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setConfirmInput(false)}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Enter the values"}</DialogTitle>
        <DialogActions>
          <Input
            name="customerName"
            placeholder="Customer Name"
            value={customerName}
            onChange={(e) => {
              setCustomerName(e.target.value);
            }}
            required
          />
          <Input
            name="size"
            placeholder="Size"
            value={size}
            onChange={(e) => {
              setSize(e.target.value);
            }}
            required
          />
          <Button
            onClick={() => {
              if (customerName && size) {
                confirmInputAction &&
                  confirmInputAction("confirm", { customerName, size });
              } else {
                alert("Both fields are required.");
              }
            }}
          >
            Yes
          </Button>
          <Button
            onClick={() => {
              confirmInputAction &&
                confirmInputAction("cancel", { customerName, size });
            }}
          >
            No
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
