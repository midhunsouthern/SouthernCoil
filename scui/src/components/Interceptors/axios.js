import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { useNavigate } from 'react-router-dom';


const useAxiosInterceptor = (axiosInstance) => {
    const navigate = useNavigate();
    const handleAxiosResponse = (response) => {
        try {
           let res_data;
          if (typeof response.data === "string") {
             const jsonObjects = response.data
               .split("}{")
               .map((str, index, array) => {
                 if (index === 0) {
                   return `${str}}`;
                 } else if (index === array.length - 1) {
                   return `{${str}`;
                 } else {
                   return `{${str}}`;
                 }
               });
             res_data = jsonObjects.map((jsonStr) => JSON.parse(jsonStr));
           } else {
             res_data = [response.data];
           }
           if (res_data[0].status_code === 401) {
             localStorage.removeItem("authId");
             localStorage.removeItem("accessModuleList");
             navigate("/login");
           }
         } catch (error) {
           console.log("e", error);
         }
         return response;
       };
    axiosInstance.interceptors.response.use(handleAxiosResponse, (error) => {
     return Promise.reject(error);
    });
};
  export default useAxiosInterceptor;
  
  
  
  
  
  
  
  
  
  