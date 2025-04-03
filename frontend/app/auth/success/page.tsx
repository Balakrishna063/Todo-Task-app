// "use client";

// import { useEffect } from "react";
// import { useRouter, useSearchParams } from "next/navigation";

// const GoogleAuthSuccess = () => {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   useEffect(() => {
//     const token = searchParams.get("token");

//     if (token) {
//       localStorage.setItem("authToken", token); // ✅ Store Token
//       router.push("/dashboard"); // ✅ Redirect to Dashboard
//     } else {
//       router.push("/auth/login"); // ✅ Redirect to Login if No Token
//     }
//   }, [searchParams, router]);

//   return <p>Logging in...</p>;
// };

// export default GoogleAuthSuccess;



"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthSuccess() {
  const router = useRouter();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      localStorage.setItem("authToken", token);

      // ✅ Decode JWT token to get user info
      const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
      // console.log("🔑 Decoded Token Payload:", payload);

      // ✅ Store user info in localStorage
      localStorage.setItem("user", JSON.stringify(payload));

      router.push("/todo");
    } else {
      router.push("/auth/login");
    }
  }, []);

  return <p>Logging in...</p>;
}
