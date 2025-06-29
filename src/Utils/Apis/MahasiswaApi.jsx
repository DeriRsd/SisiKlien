import axios from "@/Utils/AxiosInstance";

export const getAllMahasiswa = (params = {}) => {
  return axios.get("/mahasiswa", { params });
};

export const storeMahasiswa = (data) => {
  return axios.post("/mahasiswa", data);
};

export const updateMahasiswa = (id, data) => {
  return axios.put(`/mahasiswa/${id}`, data);
};

export const deleteMahasiswa = (id) => {
  return axios.delete(`/mahasiswa/${id}`);
};