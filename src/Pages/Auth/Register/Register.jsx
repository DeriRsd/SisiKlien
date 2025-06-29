import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "@/Utils/Apis/UserApi";
import { showSuccessToast, showErrorToast } from "@/Utils/ToastHelpers";
import Input from "@/Components/Input";
import Label from "@/Components/Label";
import Button from "@/Components/Button";
import Card from "@/Components/Card";
import Heading from "@/Components/Heading";
import Form from "@/Components/Form";
const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const newUser = {
        ...form,
        role: "user",
        permission: ["dashboard.page", "mahasiswa.page", "mahasiswa.read"],
      };
      await register(newUser);
      showSuccessToast("Registrasi berhasil! Silakan login.");
      navigate("/");
    } catch (error) {
      showErrorToast(error.response?.data?.message || "Registrasi gagal.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Card className="max-w-md">
      <Heading as="h2">Registrasi</Heading>
      <Form onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="name">Nama Lengkap</Label>
          <Input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Mendaftar..." : "Daftar"}
        </Button>
      </Form>
      <p className="text-sm text-center text-gray-600 mt-4">
        Sudah punya akun?{" "}
        <Link to="/" className="text-blue-500 hover:underline">
          Login
        </Link>
      </p>
    </Card>
  );
};
export default Register;
