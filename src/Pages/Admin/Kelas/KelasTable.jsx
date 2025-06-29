import React from "react";
import Button from "@/Components/Button";
import { useNavigate } from "react-router-dom";

const KelasTable = ({ kelas, onDelete, onEdit, permissions = [] }) => {
  const navigate = useNavigate();
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-700">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="py-3 px-6">Nama Kelas</th>
            <th className="py-3 px-6">Mata Kuliah</th>
            <th className="py-3 px-6">Dosen</th>
            <th className="py-3 px-6">Jml Mahasiswa</th>
            <th className="py-3 px-6 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {kelas.map((k) => (
            <tr key={k.id} className="bg-white border-b hover:bg-gray-50">
              <td className="py-4 px-6 font-medium">{k.nama_kelas}</td>
              <td className="py-4 px-6">
                {k.matakuliah?.nama || "N/A"} ({k.matakuliah?.sks || 0} SKS)
              </td>
              <td className="py-4 px-6">{k.dosen?.nama || "N/A"}</td>
              <td className="py-4 px-6">{k.mahasiswaIds?.length || 0}</td>
              <td className="py-4 px-6 text-center space-x-2">
                <Button
                  size="sm"
                  onClick={() => navigate(`/admin/kelas/${k.id}`)}
                >
                  Detail
                </Button>
                {permissions.includes("kelas.update") && (
                  <Button size="sm" variant="warning" onClick={() => onEdit(k)}>
                    Edit
                  </Button>
                )}
                {permissions.includes("kelas.delete") && (
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => onDelete(k)}
                  >
                    Hapus
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default KelasTable;
