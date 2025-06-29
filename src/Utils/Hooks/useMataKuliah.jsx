import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllMataKuliah,
  storeMataKuliah,
  updateMataKuliah,
  deleteMataKuliah,
} from "@/Utils/Apis/MataKuliahApi";
import { showSuccessToast, showErrorToast } from "@/Utils/ToastHelpers";

export const useGetAllMataKuliah = () => {
  return useQuery({
    queryKey: ["matakuliah_all"],
    queryFn: () => getAllMataKuliah(),
    select: (res) => res.data ?? [],
  });
};

export const useGetMataKuliahPaginated = (queryParams) => {
  return useQuery({
    queryKey: ["matakuliah", queryParams],
    queryFn: () => getAllMataKuliah(queryParams),
    select: (res) => ({
      data: res.data ?? [],
      total: parseInt(res.headers["x-total-count"] ?? "0", 10),
    }),
    keepPreviousData: true,
  });
};

export const useStoreMataKuliah = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: storeMataKuliah,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["matakuliah"] });
      showSuccessToast("Mata Kuliah berhasil ditambahkan!");
    },
    onError: (err) =>
      showErrorToast(
        err.response?.data?.message || "Gagal menambahkan Mata Kuliah."
      ),
  });
};

export const useUpdateMataKuliah = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateMataKuliah(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["matakuliah"] });
      showSuccessToast("Mata Kuliah berhasil diperbarui!");
    },
    onError: (err) =>
      showErrorToast(
        err.response?.data?.message || "Gagal memperbarui Mata Kuliah."
      ),
  });
};

export const useDeleteMataKuliah = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteMataKuliah(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["matakuliah"] });
      showSuccessToast("Mata Kuliah berhasil dihapus!");
    },
    onError: (err) =>
      showErrorToast(
        err.response?.data?.message || "Gagal menghapus Mata Kuliah."
      ),
  });
};
