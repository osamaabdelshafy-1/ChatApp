import axios from "axios";

//make the configuration of axios that fetch data from server .
export const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:3000/api/v1"
      : "api", //this is in production , you can also  add  the website domain .
        withCredentials:true  //send cookies with request . 
    });
