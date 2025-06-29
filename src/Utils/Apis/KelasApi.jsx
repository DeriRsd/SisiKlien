import axios from "@/Utils/AxiosInstance";

export const getAllKelas = () => {
  return axios.get("/kelas?_expand=dosen&_expand=matakuliah");
};

export const getKelasById = (id) => {
  return axios.get(`/kelas/${id}?_expand=dosen&_expand=matakuliah`);
};

export const createKelas = (kelasData) => {
  return axios.post("/kelas", kelasData);
};

export const updateKelas = (id, kelasData) => {
  return axios.put(`/kelas/${id}`, kelasData);
};

export const deleteKelas = (id) => {
  return axios.delete(`/kelas/${id}`);
};
