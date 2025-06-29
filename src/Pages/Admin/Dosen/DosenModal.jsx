// GANTI SELURUH ISI FILE INI

import React, { useState, useEffect } from "react";
import Button from "@/Components/Button";
import Form from "@/Components/Form";
import Input from "@/Components/Input";
import Label from "@/Components/Label";

const DosenModal = ({ isOpen, onClose, onSubmit, dosen, isLoading }) => {
  // --- PERBAIKAN: Tambahkan state untuk SKS ---
  const getInitialForm = () => ({
    nidn: "",
    nama: "",
    max_sks: 12, // Default SKS maksimal untuk dosen
    sks_mengajar: 0,
  });

  const [form, setForm] = useState(getInitialForm());

  useEffect(() => {
    if (isOpen) {
      if (dosen) {
        // Jika edit, isi form dengan data dosen yang ada
        setForm({
          nidn: dosen.nidn,
          nama: dosen.nama,
          max_sks: dosen.max_sks || 12,
          sks_mengajar: dosen.sks_mengajar || 0,
        });
      } else {
        // Jika tambah, reset ke state awal
        setForm(getInitialForm());
      }
    }
  }, [dosen, isOpen]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    // Ubah nilai menjadi angka jika tipe inputnya number
    const val = type === "number" ? parseInt(value, 10) : value;
    setForm((prev) => ({ ...prev, [name]: val }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nidn.trim() || !form.nama.trim()) {
      alert("NIDN dan Nama tidak boleh kosong!");
      return;
    }
    onSubmit(form);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.5)] z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">
            {dosen ? "Edit Dosen" : "Tambah Dosen"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>
        <Form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <Label htmlFor="nidn">NIDN</Label>
            <Input
              name="nidn"
              id="nidn"
              value={form.nidn}
              onChange={handleChange}
              readOnly={!!dosen}
              required
              className={!!dosen ? "bg-gray-100 cursor-not-allowed" : ""}
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
              <Label htmlFor="sks_mengajar">SKS Mengajar</Label>
              <Input
                type="number"
                name="sks_mengajar"
                id="sks_mengajar"
                value={form.sks_mengajar}
                onChange={handleChange}
                required
                readOnly={dosen ? false : true}
                className={!dosen ? "bg-gray-100 cursor-not-allowed" : ""}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? "Menyimpan..."
                : dosen
                ? "Simpan Perubahan"
                : "Simpan"}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default DosenModal;
