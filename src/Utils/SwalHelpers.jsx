import Swal from "sweetalert2";

export const confirmAction = ({
  title,
  text,
  confirmButtonText = "Ya, Lanjutkan!",
  cancelButtonText = "Batal",
  icon = "warning",
  onConfirm,
  onCancel,
}) => {
  Swal.fire({
    title: title,
    text: text,
    icon: icon,
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: confirmButtonText,
    cancelButtonText: cancelButtonText,
  }).then((result) => {
    if (result.isConfirmed) {
      if (onConfirm) onConfirm();
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      if (onCancel) onCancel();
    }
  });
};

export const confirmLogout = (onConfirmLogout) => {
  confirmAction({
    title: "Konfirmasi Logout",
    text: "Apakah Anda yakin ingin keluar?",
    confirmButtonText: "Ya, Logout",
    icon: "question",
    onConfirm: onConfirmLogout,
  });
};

export const confirmDelete = (itemName, onItemDelete) => {
  confirmAction({
    title: "Konfirmasi Hapus",
    text: `Apakah Anda yakin ingin menghapus ${itemName}? Tindakan ini tidak dapat dibatalkan.`,
    confirmButtonText: "Ya, Hapus",
    icon: "warning",
    onConfirm: onItemDelete,
  });
};

export const confirmSaveChanges = (onConfirmSave) => {
  confirmAction({
    title: "Konfirmasi Perubahan",
    text: "Apakah Anda yakin ingin menyimpan perubahan ini?",
    confirmButtonText: "Ya, Simpan",
    icon: "question",
    onConfirm: onConfirmSave,
  });
};
