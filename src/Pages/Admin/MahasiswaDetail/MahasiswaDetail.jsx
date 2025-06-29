// src/Pages/Admin/MahasiswaDetail/MahasiswaDetail.jsx (atau path yang sesuai)
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Card from "@/Components/Card";
import Heading from "@/Components/Heading";
import Button from "@/Components/Button";
// PERUBAHAN: Mengimpor fungsi API
import {
  getAllMahasiswa as apiGetAllMahasiswa,
  // Jika ada getMahasiswaByNim atau getMahasiswaById (jika ID bisa NIM) akan lebih baik
  // Untuk saat ini, kita gunakan getAllMahasiswa dan filter.
} from "@/Utils/Apis/MahasiswaApi";
import { showErrorToast } from "@/Utils/ToastHelpers"; // Untuk menampilkan error

const MahasiswaDetail = () => {
  const { nim } = useParams(); // nim dari URL
  const navigate = useNavigate();
  const [mahasiswa, setMahasiswa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // State untuk pesan error

  useEffect(() => {
    const fetchMahasiswaDetail = async () => {
      setLoading(true);
      setError(null); // Reset error setiap kali fetch
      try {
        // PERUBAHAN: Menggunakan API untuk mengambil data.
        // Idealnya, ada endpoint API seperti GET /api/mahasiswa/nim/{nim_value}
        // atau GET /api/mahasiswa/{identifier} yang bisa menerima NIM.
        // Untuk saat ini, kita ambil semua data dan filter di sisi client.
        // Ini kurang efisien untuk dataset besar.
        const response = await apiGetAllMahasiswa(); // Mengambil semua mahasiswa

        // Struktur respons di Mahasiswa.jsx adalah res.data yang merupakan array
        const allMahasiswa = response.data;
        const foundMahasiswa = allMahasiswa.find((m) => m.nim === nim);

        if (foundMahasiswa) {
          // Data 'status' dari API (jika boolean) akan langsung digunakan.
          // Tidak perlu konversi ke string seperti di halaman daftar (Mahasiswa.jsx)
          // kecuali jika Anda ingin konsisten, tetapi untuk display boolean lebih baik.
          setMahasiswa(foundMahasiswa);
        } else {
          const notFoundError = `Mahasiswa dengan NIM "${nim}" tidak ditemukan.`;
          setError(notFoundError);
          setMahasiswa(null);
        }
      } catch (err) {
        console.error("Error fetching mahasiswa detail:", err);
        const errorMessage =
          err.response?.data?.message || "Gagal memuat data mahasiswa.";
        setError(errorMessage);
        showErrorToast(errorMessage); // Tampilkan toast error
        setMahasiswa(null);
      } finally {
        setLoading(false);
      }
    };

    if (nim) { // Hanya fetch jika ada NIM
      fetchMahasiswaDetail();
    } else {
      setLoading(false);
      setError("NIM tidak valid atau tidak tersedia.");
    }
  }, [nim]); // Re-fetch jika parameter 'nim' berubah

  if (loading) {
    return (
      <Card>
        <p className="text-center py-10">Loading data mahasiswa...</p>
      </Card>
    );
  }

  if (error && !mahasiswa) {
    // Menampilkan pesan error jika terjadi dan tidak ada data mahasiswa
    return (
      <Card>
        <Heading as="h2" className="text-red-600 !mb-2">
          Terjadi Kesalahan
        </Heading>
        <p className="mb-4 text-gray-700">{error}</p>
        <Button onClick={() => navigate("/admin/mahasiswa")}>
          Kembali ke Daftar Mahasiswa
        </Button>
      </Card>
    );
  }

  if (!mahasiswa) {
    // Kondisi fallback jika mahasiswa tidak ditemukan (seharusnya sudah ditangani oleh error state)
    return (
      <Card>
        <Heading as="h2" className="!mb-2">Mahasiswa Tidak Ditemukan</Heading>
        <p className="mb-4">
          Mahasiswa dengan NIM "{nim}" tidak dapat ditemukan.
        </p>
        <Button onClick={() => navigate("/admin/mahasiswa")}>
          Kembali ke Daftar Mahasiswa
        </Button>
      </Card>
    );
  }

  // PERUBAHAN: Menampilkan data dari state 'mahasiswa' yang diambil dari API
  return (
    <Card>
      <Heading as="h2" className="mb-6 text-xl font-semibold">
        Detail Mahasiswa
      </Heading>
      <div className="space-y-3 p-4 border border-gray-200 rounded-lg shadow-sm bg-white">
        <div className="flex justify-between py-2 border-b border-gray-100">
          <strong className="text-gray-600">NIM:</strong>
          <span className="text-gray-800">{mahasiswa.nim}</span>
        </div>
        <div className="flex justify-between py-2 border-b border-gray-100">
          <strong className="text-gray-600">Nama:</strong>
          <span className="text-gray-800">{mahasiswa.nama}</span>
        </div>
        {/* Menampilkan field lain jika tersedia, contoh: status */}
        {/* Status dari API yang baru diambil adalah boolean, jadi bisa dicek langsung */}
        <div className="flex justify-between py-2">
          <strong className="text-gray-600">Status:</strong>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              mahasiswa.status // Cek boolean langsung
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {mahasiswa.status ? "Aktif" : "Tidak Aktif"}
          </span>
        </div>
        {/* Tambahkan field lain sesuai kebutuhan, contoh: */}
        {/* 
        <div className="flex justify-between py-2 border-b border-gray-100">
          <strong className="text-gray-600">Email:</strong>
          <span className="text-gray-800">{mahasiswa.email || "-"}</span>
        </div>
        <div className="flex justify-between py-2 border-b border-gray-100">
          <strong className="text-gray-600">Program Studi:</strong>
          <span className="text-gray-800">{mahasiswa.prodi || "-"}</span>
        </div>
        */}
      </div>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button
          onClick={() => navigate(-1)} // Kembali ke halaman sebelumnya
          variant="secondary"
        >
          Kembali
        </Button>
        <Button onClick={() => navigate("/admin/mahasiswa")}>
          Lihat Semua Mahasiswa
        </Button>
        {/* Tombol Edit bisa ditambahkan di sini jika diperlukan */}
        {/* <Button
          variant="warning"
          onClick={() => navigate(`/admin/mahasiswa/edit/${mahasiswa.nim}`)} // Atau menggunakan ID
        >
          Edit Mahasiswa
        </Button> */}
      </div>
    </Card>
  );
};

export default MahasiswaDetail;