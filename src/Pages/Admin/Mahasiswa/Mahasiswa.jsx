import React, { useState, useMemo } from "react";
import Card from "@/Components/Card";
import Heading from "@/Components/Heading";
import Button from "@/Components/Button";
import MahasiswaTable from "./MahasiswaTable";
import MahasiswaModal from "./MahasiswaModal";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";
import { confirmDelete, confirmSaveChanges } from "@/Utils/SwalHelpers";
import { showErrorToast } from "@/Utils/ToastHelpers";
import {
  useGetMahasiswaPaginated,
  useStoreMahasiswa,
  useUpdateMahasiswa,
  useDeleteMahasiswa,
} from "@/Utils/Hooks/useMahasiswa";
import { useDebounce } from "use-debounce";

const Mahasiswa = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMahasiswa, setSelectedMahasiswa] = useState(null);
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
    useGetMahasiswaPaginated(queryParams);
  const { data: mahasiswa = [], total: totalCount = 0 } = result;

  const totalPages = Math.ceil(totalCount / limit);

  const { mutate: storeMahasiswa, isLoading: isStoring } = useStoreMahasiswa();
  const { mutate: updateMahasiswa, isLoading: isUpdating } =
    useUpdateMahasiswa();
  const { mutate: deleteMahasiswa, isLoading: isDeleting } =
    useDeleteMahasiswa();
  const isMutating = isStoring || isUpdating || isDeleting;

  const openAddModal = () => {
    setSelectedMahasiswa(null);
    setIsModalOpen(true);
  };
  const openEditModal = (mhs) => {
    setSelectedMahasiswa(mhs);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setSelectedMahasiswa(null);
    setIsModalOpen(false);
  };

  // --- PERBAIKAN: Logika submit sekarang menangani data SKS ---
  const handleSubmitModal = (formData) => {
    // Pastikan SKS adalah angka
    const dataToSubmit = {
      ...formData,
      status: formData.status === "true",
      max_sks: parseInt(formData.max_sks, 10) || 24,
      sks_diambil: parseInt(formData.sks_diambil, 10) || 0,
    };

    if (selectedMahasiswa) {
      confirmSaveChanges(() => {
        updateMahasiswa(
          {
            id: selectedMahasiswa.id,
            data: { ...selectedMahasiswa, ...dataToSubmit },
          },
          {
            onSuccess: () => closeModal(),
          }
        );
      });
    } else {
      const nimExists = result.data.some((mhs) => mhs.nim === formData.nim);
      if (nimExists) {
        showErrorToast("NIM sudah terdaftar!");
        return;
      }
      storeMahasiswa(dataToSubmit, {
        onSuccess: () => closeModal(),
      });
    }
  };

  const handleDeleteTrigger = (mahasiswaItem) => {
    confirmDelete(`mahasiswa ${mahasiswaItem.nama}`, () => {
      deleteMahasiswa(mahasiswaItem.id);
    });
  };

  const handlePrevPage = () => setPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () =>
    setPage((prev) => Math.min(prev + 1, totalPages));

  if (!user) return <p className="text-center py-10">Loading...</p>;

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <Heading as="h2" className="mb-0 text-left">
          Daftar Mahasiswa
        </Heading>
        {user.permission.includes("mahasiswa.create") && (
          <Button onClick={openAddModal} disabled={isMutating}>
            + Tambah Mahasiswa
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-4 items-center">
        <input
          type="text"
          placeholder="Cari nama atau NIM..."
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
          <option value="nim">Sort by NIM</option>
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
        <select
          value={limit}
          onChange={(e) => {
            setLimit(Number(e.target.value));
            setPage(1);
          }}
          className="border px-3 py-1.5 rounded-md bg-white"
        >
          <option value={5}>5 per halaman</option>
          <option value={10}>10 per halaman</option>
          <option value={20}>20 per halaman</option>
        </select>
      </div>

      <MahasiswaTable
        mahasiswa={mahasiswa}
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

      <MahasiswaModal
        isModalOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleSubmitModal}
        selectedMahasiswa={selectedMahasiswa}
        isLoading={isMutating}
      />
    </Card>
  );
};

export default Mahasiswa;
