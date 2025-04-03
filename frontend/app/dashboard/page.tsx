
"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
    } else {
      setIsAuthenticated(true);
    }
  }, []);

  if (!isAuthenticated) return <p>Loading...</p>;

  return (
    <div className="container mt-4">
      <h1>Dashboard</h1>
      {/* <button
        className="btn btn-danger"
        onClick={() => {
          localStorage.removeItem("token");
          router.push("/auth/login");
        }}
      >
        Logout
      </button> */}
    </div>
  );
}
