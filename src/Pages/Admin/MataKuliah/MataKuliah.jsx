import React, { useState, useMemo } from "react";
import Card from "@/Components/Card";
import Heading from "@/Components/Heading";
import Button from "@/Components/Button";
import MataKuliahTable from "./MataKuliahTable";
import MataKuliahModal from "./MataKuliahModal";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";
import { confirmDelete, confirmSaveChanges } from "@/Utils/SwalHelpers";
import {
  useGetMataKuliahPaginated,
  useStoreMataKuliah,
  useUpdateMataKuliah,
  useDeleteMataKuliah,
} from "@/Utils/Hooks/useMataKuliah";
import { useDebounce } from "use-debounce";

const MataKuliah = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMk, setSelectedMk] = useState(null);
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
    useGetMataKuliahPaginated(queryParams);
  const { data: matakuliah = [], total: totalCount = 0 } = result;
  const totalPages = Math.ceil(totalCount / limit);

  const { mutate: storeMataKuliah, isLoading: isStoring } =
    useStoreMataKuliah();
  const { mutate: updateMataKuliah, isLoading: isUpdating } =
    useUpdateMataKuliah();
  const { mutate: deleteMataKuliah, isLoading: isDeleting } =
    useDeleteMataKuliah();
  const isMutating = isStoring || isUpdating || isDeleting;

  const openAddModal = () => {
    setSelectedMk(null);
    setIsModalOpen(true);
  };
  const openEditModal = (mk) => {
    setSelectedMk(mk);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setSelectedMk(null);
    setIsModalOpen(false);
  };

  const handleSubmitModal = (formData) => {
    const dataToSubmit = { ...formData, sks: parseInt(formData.sks, 10) };
    if (selectedMk) {
      confirmSaveChanges(() => {
        updateMataKuliah(
          { id: selectedMk.id, data: { ...selectedMk, ...dataToSubmit } },
          {
            onSuccess: () => closeModal(),
          }
        );
      });
    } else {
      storeMataKuliah(dataToSubmit, { onSuccess: () => closeModal() });
    }
  };

  const handleDeleteTrigger = (mkItem) => {
    confirmDelete(`mata kuliah ${mkItem.nama}`, () =>
      deleteMataKuliah(mkItem.id)
    );
  };

  if (!user) return <p>Loading...</p>;

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <Heading as="h2" className="mb-0 text-left">
          Daftar Mata Kuliah
        </Heading>
        {user.permission.includes("matakuliah.create") && (
          <Button onClick={openAddModal} disabled={isMutating}>
            + Tambah Mata Kuliah
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-4 items-center">
        <input
          type="text"
          placeholder="Cari nama atau kode MK..."
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
          <option value="kode_mk">Sort by Kode</option>
          <option value="sks">Sort by SKS</option>
        </select>
      </div>

      <MataKuliahTable
        matakuliah={matakuliah}
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
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 1}
            variant="secondary"
          >
            Prev
          </Button>
          <Button
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= totalPages}
            variant="secondary"
          >
            Next
          </Button>
        </div>
      </div>

      <MataKuliahModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleSubmitModal}
        matakuliah={selectedMk}
        isLoading={isMutating}
      />
    </Card>
  );
};

export default MataKuliah;
