import React, { useState, useEffect } from "react";
import Button from "@/Components/Button";
import Form from "@/Components/Form";
import Label from "@/Components/Label";
import Input from "@/Components/Input";
const KelasModal = ({
  isOpen,
  onClose,
  onSubmit,
  dosenList,
  mahasiswaList,
  matakuliahList,
  isEditMode,
  initialData,
}) => {
  const getInitialForm = () => ({
    nama_kelas: "",
    matakuliahId: "",
    dosenId: "",
    mahasiswaIds: [],
  });
  const [form, setForm] = useState(getInitialForm());
  const [error, setError] = useState("");
  useEffect(() => {
    if (isOpen) {
      if (isEditMode && initialData) {
        setForm({
          nama_kelas: initialData.nama_kelas,
          matakuliahId: initialData.matakuliahId,
          dosenId: initialData.dosenId,
          mahasiswaIds: initialData.mahasiswaIds,
        });
      } else {
        setForm(getInitialForm());
      }
      setError("");
    }
  }, [isOpen, isEditMode, initialData]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleMahasiswaChange = (e) => {
    const selectedIds = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setForm((prev) => ({ ...prev, mahasiswaIds: selectedIds }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    const matakuliah = matakuliahList.find((mk) => mk.id === form.matakuliahId);
    if (!matakuliah) return setError("Mata kuliah harus dipilih.");

    const dosen = dosenList.find((d) => d.id === form.dosenId);
    if (!dosen) return setError("Dosen harus dipilih.");

    let sisaSksDosen = dosen.max_sks - dosen.sks_mengajar;
    if (isEditMode && dosen.id === initialData.dosenId) {
      sisaSksDosen += matakuliah.sks;
    }
    if (matakuliah.sks > sisaSksDosen) {
      return setError(
        `Dosen melebihi SKS maksimal. Sisa saat ini: ${
          dosen.max_sks - dosen.sks_mengajar
        } SKS.`
      );
    }

    for (const mhsId of form.mahasiswaIds) {
      if (isEditMode && initialData.mahasiswaIds.includes(mhsId)) continue;

      const mahasiswa = mahasiswaList.find((m) => m.id === mhsId);
      if (mahasiswa.sks_diambil + matakuliah.sks > mahasiswa.max_sks) {
        return setError(
          `Mahasiswa ${mahasiswa.nama} melebihi SKS. Sisa: ${
            mahasiswa.max_sks - mahasiswa.sks_diambil
          } SKS.`
        );
      }
    }

    onSubmit(form);
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.5)] z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">
            {isEditMode ? "Edit Kelas" : "Buat Kelas Baru"}
          </h2>
          <button onClick={onClose} className="text-gray-500 text-2xl">
            ×
          </button>
        </div>
        <Form onSubmit={handleSubmit} className="p-4 space-y-4">
          {error && (
            <p className="text-red-500 text-sm text-center mb-2">{error}</p>
          )}
          <div>
            <Label htmlFor="nama_kelas">Nama Kelas</Label>
            <Input
              name="nama_kelas"
              id="nama_kelas"
              value={form.nama_kelas}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="matakuliahId">Mata Kuliah</Label>
            {isEditMode ? (
              <p className="w-full p-2 border rounded bg-gray-100">
                {initialData?.matakuliah?.nama || "Loading..."} (
                {initialData?.matakuliah?.sks || 0} SKS)
              </p>
            ) : (
              <select
                name="matakuliahId"
                id="matakuliahId"
                value={form.matakuliahId}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-white"
                required
              >
                <option value="" disabled>
                  Pilih Mata Kuliah
                </option>
                {matakuliahList.map((mk) => (
                  <option key={mk.id} value={mk.id}>
                    {mk.nama} ({mk.sks} SKS)
                  </option>
                ))}
              </select>
            )}
          </div>
          <div>
            <Label htmlFor="dosenId">Dosen</Label>
            <select
              name="dosenId"
              id="dosenId"
              value={form.dosenId}
              onChange={handleChange}
              className="w-full p-2 border rounded bg-white"
              required
            >
              <option value="" disabled>
                Pilih Dosen
              </option>
              {dosenList.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.nama} (Sisa SKS: {d.max_sks - d.sks_mengajar})
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="mahasiswaIds">Pilih Mahasiswa</Label>
            <p className="text-xs text-gray-500">
              Gunakan Ctrl/Cmd + Klik untuk memilih lebih dari satu.
            </p>
            <select
              name="mahasiswaIds"
              id="mahasiswaIds"
              multiple
              value={form.mahasiswaIds}
              onChange={handleMahasiswaChange}
              className="w-full p-2 border rounded h-40"
              required
            >
              {mahasiswaList.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nama} (SKS: {m.sks_diambil}/{m.max_sks})
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end space-x-3 pt-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit">
              {isEditMode ? "Simpan Perubahan" : "Buat Kelas"}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};
export default KelasModal;
