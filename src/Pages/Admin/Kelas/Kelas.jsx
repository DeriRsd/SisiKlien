import React, { useState, useMemo } from "react";
import Card from "@/Components/Card";
import Heading from "@/Components/Heading";
import Button from "@/Components/Button";
import KelasTable from "./KelasTable";
import KelasModal from "./KelasModal";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";
import { confirmDelete, confirmSaveChanges } from "@/Utils/SwalHelpers";

import { useGetAllDosen } from "@/Utils/Hooks/useDosen";
import { useGetAllMahasiswa } from "@/Utils/Hooks/useMahasiswa";
import { useGetAllMataKuliah } from "@/Utils/Hooks/useMataKuliah";
import {
  useGetAllKelas,
  useCreateKelas,
  useUpdateKelas,
  useDeleteKelas,
} from "@/Utils/Hooks/useKelas";

const Kelas = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedKelas, setSelectedKelas] = useState(null);
  const { user } = useAuthStateContext();

  const { data: kelas = [], isLoading: isLoadingKelas } = useGetAllKelas();
  const { data: dosenList = [], isLoading: isLoadingDosen } = useGetAllDosen();
  const { data: mahasiswaList = [], isLoading: isLoadingMahasiswa } =
    useGetAllMahasiswa();
  const { data: matakuliahList = [], isLoading: isLoadingMatakuliah } =
    useGetAllMataKuliah();

  const { mutate: createKelas, isLoading: isCreating } = useCreateKelas();
  const { mutate: updateKelas, isLoading: isUpdating } = useUpdateKelas();
  const { mutate: deleteKelas, isLoading: isDeleting } = useDeleteKelas();

  const isLoading =
    isLoadingKelas ||
    isLoadingDosen ||
    isLoadingMahasiswa ||
    isLoadingMatakuliah;
  const isMutating = isCreating || isUpdating || isDeleting;

  const handleSubmit = (formData) => {
    if (isEditMode) {
      confirmSaveChanges(() => {
        updateKelas(
          { formData, selectedKelas, dosenList, mahasiswaList },
          {
            onSuccess: () => closeModal(),
          }
        );
      });
    } else {
      const matakuliah = matakuliahList.find(
        (mk) => mk.id === formData.matakuliahId
      );
      const dosen = dosenList.find((d) => d.id === formData.dosenId);
      // Panggil mutasi dengan satu objek yang berisi semua data yang dibutuhkan
      createKelas(
        { formData, dosen, mahasiswaList, matakuliah },
        {
          onSuccess: () => closeModal(),
        }
      );
    }
  };

  const handleDeleteTrigger = (kelasItem) => {
    confirmDelete(`kelas ${kelasItem.nama_kelas}`, () => {
      deleteKelas({
        kelasToDelete: kelasItem,
        dosenList,
        mahasiswaList,
        matakuliahList,
      });
    });
  };

  const openAddModal = () => {
    setIsEditMode(false);
    setSelectedKelas(null);
    setIsModalOpen(true);
  };
  const openEditModal = (kelasToEdit) => {
    setIsEditMode(true);
    setSelectedKelas(kelasToEdit);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedKelas(null);
    setIsEditMode(false);
  };

  if (!user) return <p>Loading...</p>;

  const expandedKelas = useMemo(() => {
    if (!dosenList.length || !matakuliahList.length) return [];
    return kelas.map((k) => ({
      ...k,
      dosen: dosenList.find((d) => d.id === k.dosenId),
      matakuliah: matakuliahList.find((mk) => mk.id === k.matakuliahId),
    }));
  }, [kelas, dosenList, matakuliahList]);

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <Heading as="h2" className="mb-0 text-left">
          Pengelolaan Kelas
        </Heading>
        {user.permission.includes("kelas.create") && (
          <Button onClick={openAddModal} disabled={isMutating}>
            + Buat Kelas Baru
          </Button>
        )}
      </div>
      {isLoading ? (
        <p className="text-center py-4">Loading Data...</p>
      ) : (
        <KelasTable
          kelas={expandedKelas}
          onDelete={handleDeleteTrigger}
          onEdit={openEditModal}
          permissions={user.permission}
          disabled={isMutating}
        />
      )}
      <KelasModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        dosenList={dosenList}
        mahasiswaList={mahasiswaList}
        matakuliahList={matakuliahList}
        isEditMode={isEditMode}
        initialData={selectedKelas}
        isLoading={isMutating}
      />
    </Card>
  );
};

export default Kelas;
