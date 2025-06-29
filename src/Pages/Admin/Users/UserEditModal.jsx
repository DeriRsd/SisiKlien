import React, { useState, useEffect } from "react";
import Button from "@/Components/Button";
import Form from "@/Components/Form";
import Label from "@/Components/Label";

const UserEditModal = ({ isOpen, onClose, onSubmit, user }) => {
  const [form, setForm] = useState({ role: "" });

  useEffect(() => {
    if (user) {
      setForm({ role: user.role });
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.5)] z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">
            Edit Role untuk {user?.name}
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
            <Label htmlFor="email" className="font-normal text-gray-500">
              Email
            </Label>
            <p className="font-semibold">{user?.email}</p>
          </div>
          <div>
            <Label htmlFor="role">Role</Label>
            <select
              name="role"
              id="role"
              value={form.role}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 bg-white"
            >
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>
          <div className="flex justify-end space-x-3 pt-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit">Simpan Perubahan</Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default UserEditModal;
