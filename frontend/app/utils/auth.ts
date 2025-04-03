import { jwtDecode } from "jwt-decode";

export const getToken = (): string | null => {
  return localStorage.getItem("token");
};

export const getUserFromToken = () => {
  const token = getToken();
  if (!token) return null;

  try {
    const decoded = jwtDecode<{ name?: string; email?: string }>(token);
    console.log("Decoded Token:", decoded); 

    return {
      name: decoded.name ?? "Guest", 
      email: decoded.email ?? "No email",
    };
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};
