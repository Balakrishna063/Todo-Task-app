// "use client";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import axios from "axios";

// export default function Login() {
//   const [form, setForm] = useState({ email: "", password: "" });
//   const [error, setError] = useState("");
//   const router = useRouter();
//   const [user, setUser] = useState(() => {
//     const storedUser = localStorage.getItem("user");
//     return storedUser ? JSON.parse(storedUser) : { username: "Guest" };
//   });

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault(); // Prevents page reload

//     try {
//       const response = await axios.post(
//         "http://localhost:5000/api/auth/login",
//         { email: form.email,
//           password: form.password,
//          }
//       );

//       if (response.status === 200) {
//         console.log("✅ API Response:", response.data); // Debugging

//         if (!response.data.token) {
//           throw new Error("No token received!");
//         }

//         localStorage.setItem("token", response.data.token);
//         localStorage.setItem("user", JSON.stringify(response.data.user));

//         setUser(response.data.user); 
//         router.push("/todo"); // Redirect to To-Do page
//       }
//     } catch (err: any) {
//       console.error("❌ Login Error:", err.response?.data || err.message);
//       setError(
//         err.response?.data?.message ||
//           "Login failed! Please check your credentials."
//       );
//     }
//   };

//   const handleGoogleLogin = () => {
//     window.location.href = "http://localhost:5000/auth/google";
//   };

//   return (
//     <div className="container d-flex justify-content-center align-items-center vh-100">
//       <div className="card p-4 shadow-lg" style={{ width: "400px" }}>
//         <h2 className="text-center text-primary mb-4">Login</h2>
//         {error && <p className="alert alert-danger">{error}</p>}

//         <form onSubmit={handleLogin}>
//           <div className="mb-3">
//             <label className="form-label">Email</label>
//             <input
//               type="email"
//               name="email"
//               placeholder="Email"
//               className="form-control"
//               value={form.email}
//               onChange={(e) => setForm({ ...form, email: e.target.value })}
//               required
//             />
//           </div>
//           <div className="mb-3">
//             <label className="form-label">Password</label>
//             <input
//               type="password"
//               name="password"
//               placeholder="Password"
//               className="form-control"
//               value={form.password}
//               onChange={(e) => setForm({ ...form, password: e.target.value })}
//               required
//             />
//           </div>
//           <button type="submit" className="btn btn-primary w-100">
//             Login
//           </button>
//           <button
//             type="button"
//             onClick={handleGoogleLogin}
//             className="btn btn-danger w-100 mt-2"
//           >
//             Login with Google
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }


// "use client";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import axios from "axios";

// export default function Login() {
//   const [form, setForm] = useState({ email: "", password: "" });
//   const [error, setError] = useState("");
//   const router = useRouter();
//   const [user, setUser] = useState(() => {
//     const storedUser = localStorage.getItem("user");
//     return storedUser ? JSON.parse(storedUser) : { username: "Guest" };
//   });

  

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault(); // Prevents page reload

//     try {
//       const response = await axios.post(
//         "http://localhost:5000/api/auth/login",
//         { email: form.email, password: form.password }
//       );

//       if (response.status === 200) {
//         console.log("✅ API Response:", response.data); // Debugging

//         if (!response.data.token) {
//           throw new Error("No token received!");
//         }

//         // Ensure the response data contains the user object
//         const { token, user } = response.data;

//         // Update localStorage with user data and token
//         localStorage.setItem("token", token);
//         localStorage.setItem("user", JSON.stringify(user));

//         // Update the state with the logged-in user data
//         setUser(user);

//         // Redirect to To-Do page
//         router.push("/todo");
//       }
//     } catch (err: any) {
//       console.error("❌ Login Error:", err.response?.data || err.message);
//       setError(
//         err.response?.data?.message ||
//           "Login failed! Please check your credentials."
//       );
//     }
//   };

//   const handleGoogleLogin = () => {
//     window.location.href = "http://localhost:5000/auth/google";
//   };

//   return (
//     <div className="container d-flex justify-content-center align-items-center vh-100">
//       <div className="card p-4 shadow-lg" style={{ width: "400px" }}>
//         <h2 className="text-center text-primary mb-4">Login</h2>
//         {error && <p className="alert alert-danger">{error}</p>}

//         <form onSubmit={handleLogin}>
//           <div className="mb-3">
//             <label className="form-label">Email</label>
//             <input
//               type="email"
//               name="email"
//               placeholder="Email"
//               className="form-control"
//               value={form.email}
//               onChange={(e) => setForm({ ...form, email: e.target.value })}
//               required
//             />
//           </div>
//           <div className="mb-3">
//             <label className="form-label">Password</label>
//             <input
//               type="password"
//               name="password"
//               placeholder="Password"
//               className="form-control"
//               value={form.password}
//               onChange={(e) => setForm({ ...form, password: e.target.value })}
//               required
//             />
//           </div>
//           <button type="submit" className="btn btn-primary w-100">
//             Login
//           </button>
//           <button
//             type="button"
//             onClick={handleGoogleLogin}
//             className="btn btn-danger w-100 mt-2"
//           >
//             Login with Google
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [user, setUser] = useState<{ username: string }>({ username: "Guest" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email: form.email, password: form.password }
      );

      if (response.status === 200) {
        const { token, user } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
        console.log("user data",user);
        router.push("/todo");
      }
    } catch (err: any) {
      console.error("❌ Login Error:", err.response?.data || err.message);
      setError(
        err.response?.data?.message ||
          "Login failed! Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    
    window.location.href = "http://localhost:5000/auth/google";
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow-lg" style={{ width: "400px" }}>
        <h2 className="text-center text-primary mb-4">Login</h2>
        {error && <p className="alert alert-danger">{error}</p>}

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="form-control"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="form-control"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="btn btn-danger w-100 mt-2"
          >
            Login with Google
          </button>
        </form>
      </div>
    </div>
  );
}
