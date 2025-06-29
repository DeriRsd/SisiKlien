import React from "react";
import Button from "@/Components/Button";

const DosenTable = ({
  dosen,
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
          <th className="py-2 px-4 text-left">NIDN</th>
          <th className="py-2 px-4 text-left">Nama</th>
          <th className="py-2 px-4 text-left">SKS Mengajar</th>
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
        ) : dosen.length > 0 ? (
          dosen.map((d, index) => (
            <tr
              key={d.id}
              className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}
            >
              <td className="py-2 px-4">{d.nidn}</td>
              <td className="py-2 px-4">{d.nama}</td>
              <td className="py-2 px-4">
                {d.sks_mengajar || 0} / {d.max_sks || 12}
              </td>
              <td className="py-2 px-4 text-center space-x-2">
                {permissions.includes("dosen.update") && (
                  <Button
                    size="sm"
                    variant="warning"
                    onClick={() => openEditModal(d)}
                    disabled={disabled}
                  >
                    Edit
                  </Button>
                )}
                {permissions.includes("dosen.delete") && (
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => onDelete(d)}
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

export default DosenTable;
