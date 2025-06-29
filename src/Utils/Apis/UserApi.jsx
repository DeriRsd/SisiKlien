import axios from "@/Utils/AxiosInstance";

export const register = (userData) => {
  return axios.post("/users", userData);
};

export const login = async (email, password) => {
  try {
    const res = await axios.get(`/users?email=${email}&password=${password}`);
    const users = res.data;
    if (users.length > 0) {
      return users[0];
    } else {
      throw new Error("Email atau password salah!");
    }
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

export const getAllUsers = (params = {}) => axios.get("/users", { params });

export const updateUser = (id, userData) => {
  return axios.put(`/users/${id}`, userData);
};
