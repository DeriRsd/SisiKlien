import axios from "@/Utils/AxiosInstance";

export const getAllDosen = (params = {}) => axios.get("/dosen", { params });

export const storeDosen = (data) => axios.post("/dosen", data);
export const updateDosen = (id, data) => axios.put(`/dosen/${id}`, data);
export const deleteDosen = (id) => axios.delete(`/dosen/${id}`);
