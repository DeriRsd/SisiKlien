import React, { useState, useMemo } from "react";
import Card from "@/Components/Card";
import Heading from "@/Components/Heading";
import Button from "@/Components/Button";
import DosenTable from "./DosenTable";
import DosenModal from "./DosenModal";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";
import { confirmDelete, confirmSaveChanges } from "@/Utils/SwalHelpers";
import {
  useGetDosenPaginated,
  useStoreDosen,
  useUpdateDosen,
  useDeleteDosen,
} from "@/Utils/Hooks/useDosen";
import { useDebounce } from "use-debounce";

const Dosen = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDosen, setSelectedDosen] = useState(null);
  const { user } = useAuthStateContext();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [sortBy, setSortBy] = useState("nama");
  const [sortOrder, setSortOrder] = useState("asc");
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);

  const queryParams = useMemo(
    () => ({
      _page: page,
      _limit: limit,
      _sort: sortBy,
      _order: sortOrder,
      q: debouncedSearch,
    }),
    [page, limit, sortBy, sortOrder, debouncedSearch]
  );

  const { data: result = { data: [], total: 0 }, isLoading } =
    useGetDosenPaginated(queryParams);
  const { data: dosen = [], total: totalCount = 0 } = result;
  const totalPages = Math.ceil(totalCount / limit);

  const { mutate: storeDosen, isLoading: isStoring } = useStoreDosen();
  const { mutate: updateDosen, isLoading: isUpdating } = useUpdateDosen();
  const { mutate: deleteDosen, isLoading: isDeleting } = useDeleteDosen();
  const isMutating = isStoring || isUpdating || isDeleting;

  const openAddModal = () => {
    setSelectedDosen(null);
    setIsModalOpen(true);
  };
  const openEditModal = (d) => {
    setSelectedDosen(d);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setSelectedDosen(null);
    setIsModalOpen(false);
  };

  // --- PERBAIKAN: Logika submit sekarang menangani data SKS ---
  const handleSubmitModal = (formData) => {
    // Pastikan SKS adalah angka
    const dataToSubmit = {
      ...formData,
      max_sks: parseInt(formData.max_sks, 10) || 12,
      sks_mengajar: parseInt(formData.sks_mengajar, 10) || 0,
    };

    if (selectedDosen) {
      confirmSaveChanges(() => {
        updateDosen(
          { id: selectedDosen.id, data: { ...selectedDosen, ...dataToSubmit } },
          {
            onSuccess: () => closeModal(),
          }
        );
      });
    } else {
      storeDosen(dataToSubmit, { onSuccess: () => closeModal() });
    }
  };

  const handleDeleteTrigger = (dosenItem) => {
    confirmDelete(`dosen ${dosenItem.nama}`, () => deleteDosen(dosenItem.id));
  };

  const handlePrevPage = () => setPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () =>
    setPage((prev) => Math.min(prev + 1, totalPages));

  if (!user) return <p>Loading...</p>;

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <Heading as="h2" className="mb-0 text-left">
          Daftar Dosen
        </Heading>
        {user.permission.includes("dosen.create") && (
          <Button onClick={openAddModal} disabled={isMutating}>
            + Tambah Dosen
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-4 items-center">
        <input
          type="text"
          placeholder="Cari nama atau NIDN..."
          className="border px-3 py-1.5 rounded-md flex-grow"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        <select
          value={sortBy}
          onChange={(e) => {
            setSortBy(e.target.value);
            setPage(1);
          }}
          className="border px-3 py-1.5 rounded-md bg-white"
        >
          <option value="nama">Sort by Nama</option>
          <option value="nidn">Sort by NIDN</option>
        </select>
        <select
          value={sortOrder}
          onChange={(e) => {
            setSortOrder(e.target.value);
            setPage(1);
          }}
          className="border px-3 py-1.5 rounded-md bg-white"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      <DosenTable
        dosen={dosen}
        openEditModal={openEditModal}
        onDelete={handleDeleteTrigger}
        disabled={isMutating}
        permissions={user.permission}
        isLoading={isLoading}
      />

      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-gray-600">
          Halaman {page} dari {totalPages} (Total: {totalCount} data)
        </p>
        <div className="flex gap-2">
          <Button
            onClick={handlePrevPage}
            disabled={page === 1 || isLoading}
            variant="secondary"
          >
            Prev
          </Button>
          <Button
            onClick={handleNextPage}
            disabled={page >= totalPages || isLoading}
            variant="secondary"
          >
            Next
          </Button>
        </div>
      </div>

      <DosenModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleSubmitModal}
        dosen={selectedDosen}
        isLoading={isMutating}
      />
    </Card>
  );
};

export default Dosen;
