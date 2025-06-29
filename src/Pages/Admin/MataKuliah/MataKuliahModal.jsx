import React, { useState, useEffect } from "react";
import Button from "@/Components/Button";
import Form from "@/Components/Form";
import Input from "@/Components/Input";
import Label from "@/Components/Label";

const MataKuliahModal = ({ isOpen, onClose, onSubmit, matakuliah }) => {
  const [form, setForm] = useState({ kode_mk: "", nama: "", sks: "" });

  useEffect(() => {
    if (isOpen) {
      if (matakuliah) {
        setForm({
          kode_mk: matakuliah.kode_mk,
          nama: matakuliah.nama,
          sks: matakuliah.sks,
        });
      } else {
        setForm({ kode_mk: "", nama: "", sks: "" });
      }
    }
  }, [matakuliah, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.kode_mk.trim() || !form.nama.trim()) {
      alert("Kode MK dan Nama tidak boleh kosong!");
      return;
    }
    if (
      form.sks.toString().trim() === "" ||
      isNaN(form.sks) ||
      Number(form.sks) < 0
    ) {
      alert("SKS harus diisi dengan angka yang valid!");
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
            {matakuliah ? "Edit" : "Tambah"} Mata Kuliah
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
            <Label htmlFor="kode_mk">Kode MK</Label>
            <Input
              type="text"
              name="kode_mk"
              value={form.kode_mk}
              onChange={handleChange}
              readOnly={!!matakuliah}
              placeholder="Masukkan Kode MK"
              required
              className={!!matakuliah ? "bg-gray-100 cursor-not-allowed" : ""}
            />
          </div>
          <div>
            <Label htmlFor="nama">Nama Mata Kuliah</Label>
            <Input
              type="text"
              name="nama"
              value={form.nama}
              onChange={handleChange}
              placeholder="Masukkan Nama Mata Kuliah"
              required
            />
          </div>
          <div>
            <Label htmlFor="sks">SKS</Label>
            <Input
              type="number"
              name="sks"
              value={form.sks}
              onChange={handleChange}
              placeholder="Jumlah SKS"
              required
            />
          </div>
          <div className="flex justify-end space-x-3 pt-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit">
              {matakuliah ? "Simpan Perubahan" : "Simpan"}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default MataKuliahModal;
