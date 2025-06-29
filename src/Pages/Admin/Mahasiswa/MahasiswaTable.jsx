import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/Components/Button";

const MahasiswaTable = ({
  mahasiswa,
  openEditModal,
  onDelete,
  disabled,
  permissions = [],
  isLoading,
}) => {
  const navigate = useNavigate();

  const handleDeleteClick = (mhs) => {
    onDelete(mhs);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-gray-700">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="py-2 px-4 text-left">NIM</th>
            <th className="py-2 px-4 text-left">Nama</th>
            <th className="py-2 px-4 text-left">SKS Diambil</th>
            <th className="py-2 px-4 text-left">Status</th>
            <th className="py-2 px-4 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan="5" className="text-center py-4 text-gray-500">
                Memuat data...
              </td>
            </tr>
          ) : mahasiswa.length > 0 ? (
            mahasiswa.map((mhs, index) => (
              <tr
                key={mhs.id || mhs.nim}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}
              >
                <td className="py-2 px-4">{mhs.nim}</td>
                <td className="py-2 px-4">{mhs.nama}</td>
                <td className="py-2 px-4">
                  {mhs.sks_diambil || 0} / {mhs.max_sks || 24}
                </td>
                <td className="py-2 px-4">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      String(mhs.status) === "true"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {String(mhs.status) === "true" ? "Aktif" : "Tidak Aktif"}
                  </span>
                </td>
                <td className="py-2 px-4 text-center space-x-1 md:space-x-2">
                  <Button
                    size="sm"
                    onClick={() => navigate(`/admin/mahasiswa/${mhs.nim}`)}
                    disabled={disabled}
                  >
                    Detail
                  </Button>
                  {permissions.includes("mahasiswa.update") && (
                    <Button
                      size="sm"
                      variant="warning"
                      onClick={() => openEditModal(mhs)}
                      disabled={disabled}
                    >
                      Edit
                    </Button>
                  )}
                  {permissions.includes("mahasiswa.delete") && (
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDeleteClick(mhs)}
                      disabled={disabled}
                    >
                      Hapus
                    </Button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center py-4 text-gray-500">
                Tidak ada data ditemukan.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MahasiswaTable;
