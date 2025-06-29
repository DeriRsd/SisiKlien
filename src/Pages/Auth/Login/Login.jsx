import React, { useState } from "react";
import { useNavigate, Navigate, Link } from "react-router-dom"; 
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";
import { login } from "@/Utils/Apis/UserApi";
import { showSuccessToast, showErrorToast } from "@/Utils/ToastHelpers";
import Input from "@/Components/Input";
import Label from "@/Components/Label";
import Button from "@/Components/Button";
import Card from "@/Components/Card";
import Heading from "@/Components/Heading";
import Form from "@/Components/Form";

const Login = () => {
  const navigate = useNavigate();
  const { isAuthenticated, setUser } = useAuthStateContext();
  const [form, setForm] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const loggedInUser = await login(form.email, form.password);
      setUser(loggedInUser);
      showSuccessToast("Login berhasil!");
      navigate("/admin/dashboard");
    } catch (err) {
      showErrorToast(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" />;
  }

  return (
    <Card className="max-w-md">
      <Heading as="h2">Login</Heading>
      <Form onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            name="email"
            placeholder="Masukkan email"
            required
            value={form.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            name="password"
            placeholder="Masukkan password"
            required
            value={form.password}
            onChange={handleChange}
          />
        </div>
        <div className="flex justify-between items-center">
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" />
            <span className="text-sm text-gray-600">Ingat saya</span>
          </label>
          <Link to="#" className="text-sm text-blue-500 hover:underline">
            Lupa password?
          </Link>
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Loading..." : "Login"}
        </Button>
      </Form>
      <p className="text-sm text-center text-gray-600 mt-4">
        Belum punya akun?{" "}
        <Link to="/register" className="text-blue-500 hover:underline">
          Daftar
        </Link>
      </p>
    </Card>
  );
};

export default Login;
