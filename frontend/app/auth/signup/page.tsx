
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import API from "@/app/utils/api"; // Ensure correct import

export default function Signup() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState(""); // ✅ Success message state
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Sending data:", form); // Debugging log

    try {
      const res = await API.post("/auth/signup", form);
      console.log("Response:", res.data); // Debugging log
      localStorage.setItem("token", res.data.token);
      router.push("/");
      setError("");
      setMessage("✅ Credentials created. Now login!");
      setForm({ username: "", email: "", password: "" });
    } catch (err: any) {
      console.error("Signup error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow-lg" style={{ width: "400px" }}>
        <h2 className="text-center text-primary mb-4">Signup</h2>
        {error && <p className="text-danger text-center">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              type="text"
              name="username"
              placeholder="Enter your name"
              className="form-control"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className="form-control"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              className="form-control"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Signup
          </button>
        </form>
      </div>
    </div>
  );
}
