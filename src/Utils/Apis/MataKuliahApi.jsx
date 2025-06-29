import axios from "@/Utils/AxiosInstance";
export const getAllMataKuliah = (params = {}) =>
  axios.get("/matakuliah", { params });
export const storeMataKuliah = (data) => axios.post("/matakuliah", data);
export const updateMataKuliah = (id, data) =>
  axios.put(`/matakuliah/${id}`, data);
export const deleteMataKuliah = (id) => axios.delete(`/matakuliah/${id}`);
