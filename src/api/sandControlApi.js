import axios from "axios";

const API_URL1 = "https://sandcontrollerbackend.onrender.com/api/sand-control/add";
const API_URL2 = "https://sandcontrollerbackend.onrender.com/api/sand-control/records";

export const getSandControlData = async () => {
  const response = await axios.get(API_URL2);
  console.log(response)
  return response.data;
};

export const addSandControlRecord = async (record) => {
  try {
    await axios.post(API_URL1, record);
    console.log("Data Saved!")
  } catch (error) {
    console.log(error)
  }
};
