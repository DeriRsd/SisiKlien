import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Card from "@/Components/Card";
import Heading from "@/Components/Heading";
import Button from "@/Components/Button";
import { getKelasById } from "@/Utils/Apis/KelasApi";
import { getAllMahasiswa } from "@/Utils/Apis/MahasiswaApi";
import { getAllDosen } from "@/Utils/Apis/DosenApi";
import { getAllMataKuliah } from "@/Utils/Apis/MataKuliahApi";
import { showErrorToast } from "@/Utils/ToastHelpers";

const KelasDetail = () => {
  const { id } = useParams();
  const [kelas, setKelas] = useState(null);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [kelasRes, mahasiswaRes, dosenRes, matakuliahRes] =
          await Promise.all([
            getKelasById(id),
            getAllMahasiswa(),
            getAllDosen(),
            getAllMataKuliah(),
          ]);

        const kelasData = kelasRes.data;
        const allMahasiswa = mahasiswaRes.data;
        const allDosen = dosenRes.data;
        const allMatakuliah = matakuliahRes.data;

        const finalKelasData = {
          ...kelasData,
          dosen: allDosen.find((d) => d.id === kelasData.dosenId),
          matakuliah: allMatakuliah.find(
            (mk) => mk.id === kelasData.matakuliahId
          ),
        };

        setKelas(finalKelasData);

        if (finalKelasData.mahasiswaIds) {
          const enrolled = allMahasiswa.filter((mhs) =>
            finalKelasData.mahasiswaIds.includes(mhs.id)
          );
          setEnrolledStudents(enrolled);
        }
      } catch (error) {
        showErrorToast("Gagal memuat detail kelas.");
        console.error("Error fetching class details:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (isLoading)
    return (
      <Card>
        <p className="text-center py-10">Loading...</p>
      </Card>
    );
  if (!kelas)
    return (
      <Card>
        <p className="text-center py-10">Kelas tidak ditemukan.</p>
      </Card>
    );

  return (
    <Card>
      <Heading as="h2">{kelas.nama_kelas}</Heading>
      <div className="mb-6 p-4 border rounded-lg space-y-2 bg-gray-50">
        <p>
          <strong>Mata Kuliah:</strong>{" "}
          {kelas.matakuliah?.nama || "Tidak Ditemukan"} (
          {kelas.matakuliah?.sks || 0} SKS)
        </p>
        <p>
          <strong>Dosen:</strong> {kelas.dosen?.nama || "Tidak Ditemukan"}
        </p>
      </div>

      <Heading as="h3" className="text-xl mb-2">
        Daftar Mahasiswa Terdaftar ({enrolledStudents.length})
      </Heading>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4">NIM</th>
              <th className="py-2 px-4">Nama</th>
              <th className="py-2 px-4">Total SKS Diambil</th>
            </tr>
          </thead>
          <tbody>
            {enrolledStudents.map((mhs) => (
              <tr key={mhs.id} className="border-b">
                <td className="py-2 px-4">{mhs.nim}</td>
                <td className="py-2 px-4">{mhs.nama}</td>
                <td className="py-2 px-4">
                  {mhs.sks_diambil} / {mhs.max_sks}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6">
        <Link to="/admin/kelas">
          <Button variant="secondary">Kembali ke Daftar Kelas</Button>
        </Link>
      </div>
    </Card>
  );
};

export default KelasDetail;
