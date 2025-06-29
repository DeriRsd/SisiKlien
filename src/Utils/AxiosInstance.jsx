import axios from "axios";

const AxiosInstance = axios.create({
  // Pastikan menggunakan https dan URL yang benar
  baseURL: "https://my-json-server.typicode.com/DeriRsd/SisiKlien",
  headers: {
    "Content-Type": "application/json",
  },
});

export default AxiosInstance;
