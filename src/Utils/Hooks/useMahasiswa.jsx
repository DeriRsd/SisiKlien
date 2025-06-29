import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllMahasiswa,
  storeMahasiswa,
  updateMahasiswa,
  deleteMahasiswa,
} from "@/Utils/Apis/MahasiswaApi";
import { showSuccessToast, showErrorToast } from "@/Utils/ToastHelpers";

export const useGetAllMahasiswa = () => {
  return useQuery({
    queryKey: ["mahasiswa_all"],
    queryFn: () => getAllMahasiswa(),
    select: (res) => res.data ?? [],
  });
};

export const useGetMahasiswaPaginated = (queryParams) => {
  return useQuery({
    queryKey: ["mahasiswa", queryParams],
    queryFn: () => getAllMahasiswa(queryParams),

    select: (res) => ({
      data: res.data ?? [],
      total: parseInt(res.headers["x-total-count"] ?? "0", 10),
    }),

    keepPreviousData: true,
  });
};

export const useStoreMahasiswa = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: storeMahasiswa,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mahasiswa"] });
      showSuccessToast("Mahasiswa berhasil ditambahkan!");
    },
    onError: (err) =>
      showErrorToast(
        err.response?.data?.message || "Gagal menambahkan mahasiswa."
      ),
  });
};

export const useUpdateMahasiswa = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateMahasiswa(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mahasiswa"] });
      showSuccessToast("Mahasiswa berhasil diperbarui!");
    },
    onError: (err) =>
      showErrorToast(
        err.response?.data?.message || "Gagal memperbarui mahasiswa."
      ),
  });
};

export const useDeleteMahasiswa = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteMahasiswa(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mahasiswa"] });
      showSuccessToast("Mahasiswa berhasil dihapus!");
    },
    onError: (err) =>
      showErrorToast(
        err.response?.data?.message || "Gagal menghapus mahasiswa."
      ),
  });
};
