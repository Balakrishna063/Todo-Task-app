"use client";
import { useRouter } from "next/navigation";
import Login from "./auth/login/page";

export default function Dashboard() {
  const router = useRouter();

  return (
    <>
      <div className="container mt-5 text-center">
        <h1>Welcome to the Dashboard</h1>
        <p>Please login or signup to continue.</p>
      </div>
      {/* <Login /> */}
    </>
  );
}
