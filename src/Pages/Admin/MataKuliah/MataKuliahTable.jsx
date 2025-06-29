import React from "react";
import Button from "@/Components/Button";

const MataKuliahTable = ({
  matakuliah,
  openEditModal,
  onDelete,
  disabled,
  permissions = [],
  isLoading,
}) => {
  return (
    <table className="w-full text-sm text-gray-700 mt-4">
      <thead className="bg-blue-600 text-white">
        <tr>
          <th className="py-2 px-4 text-left">Kode MK</th>
          <th className="py-2 px-4 text-left">Nama Mata Kuliah</th>
          <th className="py-2 px-4 text-center">SKS</th>
          <th className="py-2 px-4 text-center">Aksi</th>
        </tr>
      </thead>
      <tbody>
        {isLoading ? (
          <tr>
            <td colSpan="4" className="text-center py-4 text-gray-500">
              Memuat data...
            </td>
          </tr>
        ) : matakuliah.length > 0 ? (
          matakuliah.map((mk, index) => (
            <tr
              key={mk.id}
              className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}
            >
              <td className="py-2 px-4">{mk.kode_mk}</td>
              <td className="py-2 px-4">{mk.nama}</td>
              <td className="py-2 px-4 text-center">{mk.sks}</td>
              <td className="py-2 px-4 text-center space-x-2">
                {permissions.includes("matakuliah.update") && (
                  <Button
                    size="sm"
                    variant="warning"
                    onClick={() => openEditModal(mk)}
                    disabled={disabled}
                  >
                    Edit
                  </Button>
                )}
                {permissions.includes("matakuliah.delete") && (
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => onDelete(mk)}
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
            <td colSpan="4" className="text-center py-4 text-gray-500">
              Tidak ada data ditemukan.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default MataKuliahTable;
