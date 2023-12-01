import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Button } from "@mui/material";
import { toast } from 'react-toastify';
import {  getBrazingDetail, setOrderSplitNew, setAddBrazingQuantity } from "../../constant/url";
import { AccessContext } from '../../constant/accessContext';


export default function OrderSplit (prop) {
    const access = useContext(AccessContext).authID;
    const orderId = prop.orderId;
    const splitId = prop.splitId;

    const [parentSeriesList, setParentSeriesList] = useState([]);
    const [childSriesList, setChildSeriesList] = useState([]);
    
    const handleContentGet =(orderId)=>{
        var bodyFormData = new FormData();
        bodyFormData.append('orderId', orderId);
        bodyFormData.append('splitId', splitId);
        bodyFormData.append('authId', access);
        axios({
          method: "post",
          url: getBrazingDetail ,
          data: bodyFormData,
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then(function (response) {
          //handle success
          const res_data = response.data;
          if(res_data.status_code === 200){
            setParentSeriesList(res_data.data);
            setChildSeriesList([]);
            toast(res_data.status_msg);
          }else if(res_data.status_code === 202){
            toast(res_data.status_msg);
        }else {
            toast(res_data.status_msg);
          }
        })
        .catch(function (response) {
          //handle error
          console.log(response);
        });
    }

    const handelSaveContent =(paramOrder,paramSplit,) => {
    var bodyFormData = new FormData();
    bodyFormData.append('orderId', paramOrder);
    bodyFormData.append('splitId', paramSplit);
    bodyFormData.append('parentData', JSON.stringify(parentSeriesList));
    bodyFormData.append('childData', JSON.stringify(childSriesList));
    bodyFormData.append('authId', access);
    axios({
      method: "post",
      url: setOrderSplitNew ,
      data: bodyFormData,
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then(function (response) {
      //handle success
      const res_data = response.data;
      if(res_data.status_code === 200){
        toast(res_data.status_msg);
        prop.isUpdated(true);
      }else if(res_data.status_code === 202){
        
    }else {
        toast(res_data.status_msg);
      }
    })
    .catch(function (response) {
      //handle error
      console.log(response);
    });
    }

    const handleParentToChild = (id)=>{
      const idx = parentSeriesList.findIndex((item) => item.id === id );
      const cidx = childSriesList.findIndex((item) => item.id === id );

      let childSeries = [];
      let parentSeries = parentSeriesList;

      if(idx !== -1 && cidx === -1){
        childSeries = [...childSriesList,parentSeriesList[idx]];
        parentSeries.splice(idx, 1);
      }  
      setChildSeriesList(childSeries);
      setParentSeriesList(parentSeries);
      
    }

    const handleChildToParent = (id) =>{
      const idx = childSriesList.findIndex((item) => item.id === id );
      const pidx = parentSeriesList.findIndex((item) => item.id === id );

      let childSeries = childSriesList;
      let parentSeries = parentSeriesList;

      if(idx !== -1 && pidx === -1){ 
        parentSeries = [...parentSeriesList, childSriesList[idx]];
        childSeries.splice(idx, 1);
      }

      setChildSeriesList(childSeries);
      setParentSeriesList(parentSeries);
    }

    const ParentSeriesComponent =() =>{
      return(
      parentSeriesList?.map(
        (item,index) => {
            return (<div className="col-6 p-2" key={index}>
              <Button  variant="contained" 
              key={'parentSeries' + Math.random()} onClick={()=>handleParentToChild(item.id)}>{item.series_ref}</Button>
            </div>)
        }
      ))
    }

    const ChildSeriesComponent =() =>{
      return(
        childSriesList?.map(
          (item, index) => {
              return (<div className="col p-2" key={index}>
                <Button variant="contained" key={'childSeries' + Math.random()} onClick={()=>handleChildToParent(item.id)}>{item.series_ref}</Button>
              </div>)
          }
        )
      )
    }

    useEffect(() => {
        handleContentGet(orderId,splitId);
      },[]);

    return(
        <div className="col">
            <h3 className="text-center">Split Order {orderId+splitId}</h3>
            <p className="text-center">Select the Quantity that you what to transfer before spliting</p>
            <div className="row">
              <div className="col border ">
                  <p>Parent Order Series</p>
                  <div className="row">
                    {
                     <ParentSeriesComponent />
                    }
                  </div>
              </div>
              <div className="col border">
                  <p>Child Order Series</p>
                  <div className="row">
                  {
                    <ChildSeriesComponent />
                  }
                  </div>
              </div>
            </div>
            <div>
              <Button onClick={() => handelSaveContent(orderId,splitId)} className="secon-bg text-white mt-2" variant="contained">Save</Button>
            </div>
        </div>
    )
}