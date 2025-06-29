import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllUsers, updateUser } from "@/Utils/Apis/UserApi";
import { showSuccessToast, showErrorToast } from "@/Utils/ToastHelpers";

export const useGetUsersPaginated = (queryParams) => {
  return useQuery({
    queryKey: ["users", queryParams],
    queryFn: () => getAllUsers(queryParams),
    select: (res) => ({
      data: res.data ?? [],
      total: parseInt(res.headers["x-total-count"] ?? "0", 10),
    }),
    keepPreviousData: true,
  });
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      showSuccessToast("Role pengguna berhasil diperbarui!");
    },
    onError: (err) => showErrorToast(err.response?.data?.message || "Gagal memperbarui role."),
  });
};