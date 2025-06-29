
import React, { useState, useMemo } from "react";
import Card from "@/Components/Card";
import Heading from "@/Components/Heading";
import UserTable from "./UserTable";
import UserEditModal from "./UserEditModal";
import { useGetUsersPaginated, useUpdateUserRole } from "@/Utils/Hooks/useUsers";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";
import { confirmSaveChanges } from "@/Utils/SwalHelpers";
import { useDebounce } from "use-debounce";
import Button from "@/Components/Button"; 

const UserManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const { user: adminUser } = useAuthStateContext();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);

  const queryParams = useMemo(() => ({
    _page: page, _limit: limit, _sort: sortBy, _order: sortOrder, q: debouncedSearch,
  }), [page, limit, sortBy, sortOrder, debouncedSearch]);

  const { data: result = { data: [], total: 0 }, isLoading } = useGetUsersPaginated(queryParams);
  const { data: users = [], total: totalCount = 0 } = result;
  const totalPages = Math.ceil(totalCount / limit);

  const { mutate: updateUserRole, isLoading: isUpdating } = useUpdateUserRole();

  const openEditModal = (userToEdit) => { setSelectedUser(userToEdit); setIsModalOpen(true); };
  const closeModal = () => { setSelectedUser(null); setIsModalOpen(false); };
  
  const handleSubmitModal = (formData) => {
    confirmSaveChanges(() => {
      updateUserRole({ id: selectedUser.id, data: { ...selectedUser, role: formData.role } }, {
        onSuccess: () => closeModal(),
      });
    });
  };
  
  if (!adminUser) return <p>Loading...</p>;

  return (
    <Card>
      <Heading as="h2" className="mb-4 text-left">Manajemen Pengguna</Heading>
      
      <div className="flex flex-wrap gap-2 mb-4 items-center">
        <input type="text" placeholder="Cari nama atau email..." className="border px-3 py-1.5 rounded-md flex-grow" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
        <select value={sortBy} onChange={(e) => { setSortBy(e.target.value); setPage(1); }} className="border px-3 py-1.5 rounded-md bg-white">
          <option value="name">Sort by Nama</option>
          <option value="email">Sort by Email</option>
          <option value="role">Sort by Role</option>
        </select>
      </div>

      <UserTable
        users={users}
        openEditModal={openEditModal}
        permissions={adminUser.permission}
        isLoading={isLoading}
        disabled={isUpdating}
      />

      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-gray-600">Halaman {page} dari {totalPages} (Total: {totalCount} data)</p>
        <div className="flex gap-2">
          <Button onClick={() => setPage(p => p - 1)} disabled={page === 1 || isLoading} variant="secondary">Prev</Button>
          <Button onClick={() => setPage(p => p + 1)} disabled={page >= totalPages || isLoading} variant="secondary">Next</Button>
        </div>
      </div>
      
      <UserEditModal isOpen={isModalOpen} onClose={closeModal} onSubmit={handleSubmitModal} user={selectedUser} isLoading={isUpdating} />
    </Card>
  );
};

export default UserManagement;