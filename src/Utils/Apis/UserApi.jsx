// GANTI SELURUH ISI FILE INI

import axios from "@/Utils/AxiosInstance";

export const register = (userData) => {
  return axios.post("/users", userData);
};

// --- PERBAIKAN UTAMA PADA FUNGSI LOGIN ---
export const login = async (email, password) => {
  try {
    // 1. Ambil SEMUA pengguna dari server
    const res = await axios.get(`/users`);
    const allUsers = res.data;

    // 2. Cari pengguna yang cocok secara manual di sisi klien
    const foundUser = allUsers.find(
      (user) => user.email === email && user.password === password
    );

    // 3. Jika ditemukan, kembalikan datanya. Jika tidak, lempar error.
    if (foundUser) {
      return foundUser;
    } else {
      throw new Error("Email atau password salah!");
    }
  } catch (error) {
    // Tangkap error dari axios atau lempar error yang sudah dibuat
    throw new Error(error.response?.data?.message || error.message);
  }
};

// Fungsi lain tetap sama
export const getAllUsers = (params = {}) => {
  return axios.get("/users", { params });
};

export const updateUser = (id, userData) => {
  return axios.put(`/users/${id}`, userData);
};
