import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllDosen,
  storeDosen,
  updateDosen,
  deleteDosen,
} from "@/Utils/Apis/DosenApi";
import { showSuccessToast, showErrorToast } from "@/Utils/ToastHelpers";

export const useGetAllDosen = () => {
  return useQuery({
    queryKey: ["dosen_all"],
    queryFn: () => getAllDosen(),
    select: (res) => res.data ?? [],
  });
};

export const useGetDosenPaginated = (queryParams) => {
  return useQuery({
    queryKey: ["dosen", queryParams],
    queryFn: () => getAllDosen(queryParams),
    select: (res) => ({
      data: res.data ?? [],
      total: parseInt(res.headers["x-total-count"] ?? "0", 10),
    }),
    keepPreviousData: true,
  });
};

export const useStoreDosen = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: storeDosen,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dosen"] });
      showSuccessToast("Dosen berhasil ditambahkan!");
    },
    onError: (err) =>
      showErrorToast(err.response?.data?.message || "Gagal menambahkan dosen."),
  });
};

export const useUpdateDosen = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateDosen(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dosen"] });
      showSuccessToast("Dosen berhasil diperbarui!");
    },
    onError: (err) =>
      showErrorToast(err.response?.data?.message || "Gagal memperbarui dosen."),
  });
};

export const useDeleteDosen = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteDosen(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dosen"] });
      showSuccessToast("Dosen berhasil dihapus!");
    },
    onError: (err) =>
      showErrorToast(err.response?.data?.message || "Gagal menghapus dosen."),
  });
};
