// src/pages/AuthCallback.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const email = params.get("email");
    const name = params.get("name");
    const picture = params.get("picture");

    if (token && email && name && picture) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify({ email, name, picture }));
      navigate("/"); // vuelve al editor
    }
  }, [navigate]);

  return <p className="p-4">Iniciando sesión...</p>;
}
