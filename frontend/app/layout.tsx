"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    // router.push("/auth/login");
    router.push("/");

  };

  return (
    <html lang="en">
      <head>
        <title>To-Do Task App</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <nav className="navbar navbar-light bg-light">
          <div className="container">
            <h1 className="navbar-brand">To-Do Task App</h1>
            {isAuthenticated ? (
              <button className="btn btn-danger" onClick={handleLogout}>
                Logout
              </button>
            ) : (
              <div>
                <Link href="/auth/login" className="btn btn-primary mx-2">
                  Login
                </Link>
                <Link href="/auth/signup" className="btn btn-secondary">
                  Signup
                </Link>
                <button className="btn btn-danger mx-2" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </nav>
        <main className="container mt-4">{children}</main>
      </body>
    </html>
  );
}
