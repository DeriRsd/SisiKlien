import React from "react";
import Button from "@/Components/Button";

const UserTable = ({
  users,
  openEditModal,
  permissions = [],
  isLoading,
  disabled,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-700">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="py-3 px-6">Nama</th>
            <th className="py-3 px-6">Email</th>
            <th className="py-3 px-6">Role</th>
            <th className="py-3 px-6 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan="4" className="text-center py-4 text-gray-500">
                Memuat data...
              </td>
            </tr>
          ) : users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id} className="bg-white border-b hover:bg-gray-50">
                <td className="py-4 px-6">{user.name}</td>
                <td className="py-4 px-6">{user.email}</td>
                <td className="py-4 px-6 capitalize">{user.role}</td>
                <td className="py-4 px-6 text-center">
                  {permissions.includes("users.update") && (
                    <Button
                      size="sm"
                      variant="warning"
                      onClick={() => openEditModal(user)}
                      disabled={disabled}
                    >
                      Edit Role
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
    </div>
  );
};

export default UserTable;
