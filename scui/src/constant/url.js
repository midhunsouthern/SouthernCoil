export const baseURL = "http://localhost:8080/scoil/index.php/";
export const baseURL_noIndex = "http://localhost:8080/scoil/";
// export const baseURL = "https://scui.southerncoil.com/backend/index.php/";
// export const baseURL_noIndex = "https://scui.southerncoil.com/backend/";
export const loginURL = baseURL + "login/login_acc";
export const getAccessTypeURL = baseURL + "main/access_type_list";
export const getProfileDataURL = baseURL + "main/getProfileData";
export const setProfileDataURL = baseURL + "main/setProfileData";

export const getCustomersDataByID = baseURL + "main/getCustomersDataByID";
export const getCustomersDataAll = baseURL + "main/getCustomersDataAll";
export const getCustomersDataAll_dd = baseURL + "main/getCustomersDataAll_dd";
export const setCustomersData = baseURL + "main/setCustomersData";
export const delCustomersData = baseURL + "main/delCustomersData";

export const setOrderNew = baseURL + "main/setOrderNew";
export const getOrderAll = baseURL + "main/getOrderAll";
export const getOrderAllLakVal = baseURL + "main/getOrderAll_lkpval";
export const getOrderDataByID = baseURL + "main/getOrderDataByID";
export const setOrderDelete = baseURL + "main/setOrderDelete";
export const setOrderGeneric = baseURL + "main/setOrderGeneric";
export const setOrderImages = baseURL + "main/setOrderImages";
export const getOrderHistory = baseURL + "main/getOrderHistory";
export const getOrderHistory_dd = baseURL + "main/getOrderHistory_dd";
export const getOrderAll_dd = baseURL + "main/getOrderAll_dd";
export const getLatestOrder = baseURL + "main/getLatestOrder";
export const setOrderSplitNew = baseURL + "main/setOrderSplitNew";
export const setAddBrazingQuantity = baseURL + "main/setAddBrazingQuantity";
export const setDeleteBrazingQuantity =
	baseURL + "main/setDeleteBrazingQuantity";
export const getOrderBrazingLeak = baseURL + "main/getOrderBrazingLeak";
export const getImagesOnly = baseURL + "main/getImagesOnly";
export const allData_excel = baseURL + "main/allData_excel";
//save order temp
export const getSaveOrderGeneric = baseURL + "main/getSaveOrderGeneric";
export const deleteSaveOrderGeneric = baseURL + "main/deleteSaveOrderGeneric";
export const getSavedOrderDataByID = baseURL + "main/getSavedOrderDataByID";

export const getModuleList = baseURL + "main/getModuleList";
export const getAccessNameList = baseURL + "main/getAccessNameList";
export const setAccessModuleList = baseURL + "main/setAccessModuleList";
export const getExistingAccessModuleList =
	baseURL + "main/getExistingAccessModuleList";
export const setNewProfileData = baseURL + "main/setNewProfileData";

export const getUsersData = baseURL + "main/getUsersData";
export const setLookupData = baseURL + "main/setLookupData";
export const getLookupData = baseURL + "main/getLookupData";
export const delLookupData = baseURL + "main/deleteLookupData";

export const setBrazingDetails = baseURL + "main/setBrazingDetails";
export const getBrazingDetail = baseURL + "main/getBrazingDetail";

export const getPendingCompletedSQ = baseURL + "main/getPendingCompletedSQ";

/**Dispatch Scheduler*/
export const ordersToBeDispatched = baseURL + "main/getOrdersToBeDispatched";
export const getSchedulerOrders = baseURL + "main/getSchedulerOrders";
export const updateSchedulerHoliday = baseURL + "main/updateSchedulerHoliday";
export const updateSchedulerOrderDate =
	baseURL + "main/updateSchedulerOrderDate";
export const updateSchedulerCommitmentStatus =
	baseURL + "main/updateSchedulerCommitmentStatus";
export const dashboardGraphData = baseURL + "main/dashboardGraphData";

/**image url */
export const imageURL = baseURL_noIndex;
export const getActiveOrderIds = baseURL + "main/getActiveOrders";
