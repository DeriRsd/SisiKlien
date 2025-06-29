import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllKelas,
  createKelas,
  updateKelas,
  deleteKelas,
} from "@/Utils/Apis/KelasApi";
import { updateDosen } from "@/Utils/Apis/DosenApi";
import { updateMahasiswa } from "@/Utils/Apis/MahasiswaApi";
import { showSuccessToast, showErrorToast } from "@/Utils/ToastHelpers";

export const useGetAllKelas = () => {
  return useQuery({
    queryKey: ["kelas"],
    queryFn: getAllKelas,
    select: (res) => res.data,
  });
};

const invalidateAll = (queryClient) => {
  queryClient.invalidateQueries({ queryKey: ["kelas"] });
  queryClient.invalidateQueries({ queryKey: ["dosen"] });
  queryClient.invalidateQueries({ queryKey: ["mahasiswa"] });
  queryClient.invalidateQueries({ queryKey: ["dosen_all"] });
  queryClient.invalidateQueries({ queryKey: ["mahasiswa_all"] });
};

// --- LOGIKA TRANSAKSIONAL BARU YANG LEBIH ANDAL ---
export const useCreateKelas = () => {
  const queryClient = useQueryClient();
  return useMutation({
    // 1. Fungsi mutasi utama HANYA membuat kelas.
    mutationFn: (variables) => createKelas(variables.formData),

    // 2. Jika SUKSES, baru lakukan semua update SKS di sini.
    onSuccess: async (data, variables) => {
      const { formData, dosen, mahasiswaList, matakuliah } = variables;

      const updatePromises = [];
      updatePromises.push(
        updateDosen(dosen.id, {
          ...dosen,
          sks_mengajar: dosen.sks_mengajar + matakuliah.sks,
        })
      );
      formData.mahasiswaIds.forEach((mhsId) => {
        const mahasiswa = mahasiswaList.find((m) => m.id === mhsId);
        updatePromises.push(
          updateMahasiswa(mahasiswa.id, {
            ...mahasiswa,
            sks_diambil: mahasiswa.sks_diambil + matakuliah.sks,
          })
        );
      });

      try {
        await Promise.all(updatePromises);
        invalidateAll(queryClient);
        showSuccessToast("Kelas berhasil dibuat dan SKS diperbarui!");
      } catch (err) {
        showErrorToast("Kelas dibuat, tapi gagal update SKS.");
      }
    },
    onError: () => showErrorToast("Gagal membuat kelas."),
  });
};

export const useUpdateKelas = () => {
  // ... (Logika update bisa mengikuti pola yang sama jika diperlukan)
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      formData,
      selectedKelas,
      dosenList,
      mahasiswaList,
    }) => {
      const sksKelas = selectedKelas.matakuliah.sks;
      const updatePromises = [];
      const dosenLama = dosenList.find((d) => d.id === selectedKelas.dosenId);
      const dosenBaru = dosenList.find((d) => d.id === formData.dosenId);
      if (dosenLama.id !== dosenBaru.id) {
        updatePromises.push(
          updateDosen(dosenLama.id, {
            ...dosenLama,
            sks_mengajar: Math.max(0, dosenLama.sks_mengajar - sksKelas),
          })
        );
        updatePromises.push(
          updateDosen(dosenBaru.id, {
            ...dosenBaru,
            sks_mengajar: dosenBaru.sks_mengajar + sksKelas,
          })
        );
      }
      const mhsLamaIds = selectedKelas.mahasiswaIds;
      const mhsBaruIds = formData.mahasiswaIds;
      mhsLamaIds
        .filter((id) => !mhsBaruIds.includes(id))
        .forEach((mhsId) => {
          const mhs = mahasiswaList.find((m) => m.id === mhsId);
          updatePromises.push(
            updateMahasiswa(mhs.id, {
              ...mhs,
              sks_diambil: Math.max(0, mhs.sks_diambil - sksKelas),
            })
          );
        });
      mhsBaruIds
        .filter((id) => !mhsLamaIds.includes(id))
        .forEach((mhsId) => {
          const mhs = mahasiswaList.find((m) => m.id === mhsId);
          updatePromises.push(
            updateMahasiswa(mhs.id, {
              ...mhs,
              sks_diambil: mhs.sks_diambil + sksKelas,
            })
          );
        });
      await Promise.all(updatePromises);
      return updateKelas(selectedKelas.id, { ...selectedKelas, ...formData });
    },
    onSuccess: () => {
      invalidateAll(queryClient);
      showSuccessToast("Kelas berhasil diperbarui!");
    },
    onError: () => showErrorToast("Gagal memperbarui kelas."),
  });
};
export const useDeleteKelas = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      kelasToDelete,
      dosenList,
      mahasiswaList,
      matakuliahList,
    }) => {
      const matakuliah = matakuliahList.find(
        (mk) => mk.id === kelasToDelete.matakuliahId
      );
      const dosen = dosenList.find((d) => d.id === kelasToDelete.dosenId);
      const updatePromises = [];
      if (dosen && matakuliah) {
        updatePromises.push(
          updateDosen(dosen.id, {
            ...dosen,
            sks_mengajar: Math.max(0, dosen.sks_mengajar - matakuliah.sks),
          })
        );
      }
      kelasToDelete.mahasiswaIds.forEach((mhsId) => {
        const mahasiswa = mahasiswaList.find((m) => m.id === mhsId);
        if (mahasiswa && matakuliah) {
          updatePromises.push(
            updateMahasiswa(mahasiswa.id, {
              ...mahasiswa,
              sks_diambil: Math.max(0, mahasiswa.sks_diambil - matakuliah.sks),
            })
          );
        }
      });
      await Promise.all(updatePromises);

      return deleteKelas(kelasToDelete.id);
    },
    onSuccess: () => {
      invalidateAll(queryClient);
      showSuccessToast("Kelas berhasil dihapus!");
    },
    onError: () => showErrorToast("Gagal menghapus kelas."),
  });
};
