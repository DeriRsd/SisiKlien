// GANTI SELURUH ISI FILE INI

import React, { useState, useEffect } from "react";
import Button from "@/Components/Button";
import Form from "@/Components/Form";
import Input from "@/Components/Input";
import Label from "@/Components/Label";

const MahasiswaModal = ({
  isModalOpen,
  onClose,
  onSubmit,
  selectedMahasiswa,
  isLoading,
}) => {
  // --- PERBAIKAN: Tambahkan state untuk SKS ---
  const getInitialForm = () => ({
    nim: "",
    nama: "",
    status: "true",
    max_sks: 24, // Default SKS maksimal
    sks_diambil: 0, // Default SKS diambil
  });

  const [form, setForm] = useState(getInitialForm());

  useEffect(() => {
    if (isModalOpen) {
      if (selectedMahasiswa) {
        // Jika edit, isi form dengan data yang ada, termasuk SKS
        setForm({
          nim: selectedMahasiswa.nim,
          nama: selectedMahasiswa.nama,
          status: String(selectedMahasiswa.status),
          max_sks: selectedMahasiswa.max_sks || 24,
          sks_diambil: selectedMahasiswa.sks_diambil || 0,
        });
      } else {
        // Jika tambah, reset ke state awal
        setForm(getInitialForm());
      }
    }
  }, [selectedMahasiswa, isModalOpen]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    // Ubah nilai menjadi number jika tipe inputnya number
    const val = type === "number" ? parseInt(value, 10) : value;
    setForm((prevForm) => ({ ...prevForm, [name]: val }));
  };

  const internalHandleSubmit = (e) => {
    e.preventDefault();
    if (!form.nim.trim() || !form.nama.trim()) {
      alert("NIM dan Nama tidak boleh kosong!");
      return;
    }
    onSubmit(form);
  };

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.5)] z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">
            {selectedMahasiswa ? "Edit Mahasiswa" : "Tambah Mahasiswa"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <Form onSubmit={internalHandleSubmit} className="p-4 space-y-4">
          <div>
            <Label htmlFor="nim">NIM</Label>
            <Input
              name="nim"
              id="nim"
              value={form.nim}
              onChange={handleChange}
              readOnly={!!selectedMahasiswa}
              required
              className={
                !!selectedMahasiswa ? "bg-gray-100 cursor-not-allowed" : ""
              }
            />
          </div>
          <div>
            <Label htmlFor="nama">Nama</Label>
            <Input
              name="nama"
              id="nama"
              value={form.nama}
              onChange={handleChange}
              required
            />
          </div>
          {/* --- PERBAIKAN: Tambahkan input untuk SKS --- */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="max_sks">Max SKS</Label>
              <Input
                type="number"
                name="max_sks"
                id="max_sks"
                value={form.max_sks}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="sks_diambil">SKS Diambil</Label>
              <Input
                type="number"
                name="sks_diambil"
                id="sks_diambil"
                value={form.sks_diambil}
                onChange={handleChange}
                required
                readOnly={selectedMahasiswa ? false : true}
                className={
                  !selectedMahasiswa ? "bg-gray-100 cursor-not-allowed" : ""
                }
              />
            </div>
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <select
              name="status"
              id="status"
              value={form.status}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 mt-1 border rounded-lg bg-white"
            >
              <option value="true">Aktif</option>
              <option value="false">Tidak Aktif</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? "Menyimpan..."
                : selectedMahasiswa
                ? "Simpan Perubahan"
                : "Simpan"}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default MahasiswaModal;
